FROM oven/bun:1

WORKDIR /app


COPY package.json ./
COPY bun.lockb ./


COPY prisma ./prisma/


COPY . .

RUN bun install

RUN bunx prisma generate

EXPOSE 3000

CMD ["bun", "start"]
