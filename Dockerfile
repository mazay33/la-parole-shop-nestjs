FROM node:20 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm build

FROM node:20

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD [ "node", "dist/main" ]
