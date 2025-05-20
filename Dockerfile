FROM oven/bun:alpine as base
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build

FROM oven/bun:alpine as runner
WORKDIR /app
COPY --from=base /app ./
EXPOSE 3333
CMD ["bun", "run", "start"]