FROM node:20.16.0

RUN mkdir -p /usr/src/rpg-app-backend

WORKDIR /usr/src/rpg-app-backend

COPY package.json package-lock.json /usr/src/rpg-app-backend/
RUN npm install

COPY . /usr/src/rpg-app-backend

EXPOSE 5000

CMD ["npx", "ts-node", "-r", "dotenv/config", "index.ts"]