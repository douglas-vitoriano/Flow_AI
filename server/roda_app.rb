require "net/http"
require "json"

if File.exist?(File.join(Dir.pwd, ".env"))
  require "dotenv"
  Dotenv.load
end

class RodaApp < Roda
  plugin :bridgetown_server
  plugin :json

  route do |r|

    r.on "api" do
      r.post "chat" do
        api_key = ENV["GEMINI_API_KEY"]

        unless api_key && !api_key.strip.empty?
          response.status = 500
          next({ error: "GEMINI_API_KEY não configurada." }.to_json)
        end

        request.body.rewind
        body = JSON.parse(request.body.read) rescue {}

        system_text = body["system"].to_s[0, 8000]
        conv        = Array(body["messages"]).last(20)

        contents = conv.map do |msg|
          role = msg["role"] == "assistant" ? "model" : "user"
          { role: role, parts: [{ text: msg["content"].to_s }] }
        end

        payload = {
          system_instruction: { parts: [{ text: system_text }] },
          contents:           contents,
          generationConfig:   { maxOutputTokens: 800 }
        }

        model = "gemini-2.0-flash"
        uri   = URI("https://generativelanguage.googleapis.com/v1beta/models/#{model}:generateContent?key=#{api_key}")
        http  = Net::HTTP.new(uri.host, uri.port)
        http.use_ssl      = true
        http.open_timeout = 10
        http.read_timeout = 60

        req = Net::HTTP::Post.new("#{uri.path}?#{uri.query}")
        req["Content-Type"] = "application/json"
        req.body = payload.to_json

        begin
          res    = http.request(req)
          parsed = JSON.parse(res.body)

          response["Content-Type"] = "application/json"

          if res.code == "200"
            text = parsed.dig("candidates", 0, "content", "parts", 0, "text") || ""
            { reply: text }.to_json
          else
            response.status = res.code.to_i
            { error: parsed.dig("error", "message") || "Erro #{res.code}" }.to_json
          end

        rescue Net::OpenTimeout, Net::ReadTimeout
          response.status = 504
          { error: "Timeout. Tente novamente." }.to_json
        rescue => e
          response.status = 502
          { error: "Erro interno: #{e.message}" }.to_json
        end
      end
    end

    r.bridgetown
  end
end
