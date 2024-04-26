FROM docker.io/oven/bun:latest

WORKDIR /app
COPY package.json .
RUN bun install --production
COPY . .

CMD ["bun", "start"]