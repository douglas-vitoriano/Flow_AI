Bridgetown.configure do |config|
  config.roda do |app|
    app.plugin :bridgetown_ssr
    app.plugin :json
  end
end
