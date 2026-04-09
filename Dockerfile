# ── Estágio 1: Node — compila o frontend ─────────────────────
FROM node:20 AS frontend

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY esbuild.config.js ./
COPY jsconfig.json ./
COPY postcss.config.js ./
COPY config/esbuild.defaults.js ./config/
COPY frontend/ ./frontend/
COPY src/ ./src/

RUN npm run esbuild

# ── Estágio 2: Ruby — build e runtime ────────────────────────
FROM ruby:4.0.1

RUN apt-get update && apt-get install -y \
  build-essential \
  git \
  curl \
  libyaml-dev \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle config set --local without 'development test' && bundle install

COPY . .

COPY --from=frontend /app/.bridgetown-cache ./.bridgetown-cache
COPY --from=frontend /app/output/_bridgetown ./output/_bridgetown

ENV BRIDGETOWN_ENV=production
ENV RACK_ENV=production
RUN bundle exec bridgetown build

EXPOSE 4000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
