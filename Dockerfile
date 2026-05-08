FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock* ./

RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; else npm ci; fi

COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate

EXPOSE 1818

CMD ["npm", "run", "start"]

