FROM --platform=arm64 node:20

WORKDIR /app

COPY package*.json ./

COPY .env ./
COPY ./config/serviceAccount.json ./config/serviceAccount.json

RUN npm install

COPY . .

CMD [ "npm", "start" ]