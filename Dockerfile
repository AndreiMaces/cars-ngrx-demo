# Presupunem că ai rulat deja local: npm run build
# Arhivează proiectul INCLUDÂND folderul dist/

FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY server ./server
COPY db.json ./
COPY dist ./dist

RUN test -d dist/cars-ngrx/browser || (echo "Lipsește dist/. Rulează local: npm run build" && exit 1)

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server/index.js"]
