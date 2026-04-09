port        ENV.fetch("PORT") { 4000 }
environment ENV.fetch("RACK_ENV") { "development" }
workers     0
threads     1, 3

preload_app!

require "bridgetown-core/rack/logger"
log_formatter do |msg|
  Bridgetown::Rack::Logger.message_with_prefix msg
end
