# base image
FROM node:18.16.1

RUN mkdir /app
COPY package.json /app/
WORKDIR /app
COPY . ./

# ENV NEXT_PUBLIC_APP_URL=https://www.mydomain.com

RUN npm install
RUN npm run build
EXPOSE 4000
CMD ["npm", "run","start"]


#asia-south1-docker.pkg.dev/crypto-planet-415008/cloud-run-source-deploy/elite-exchanger/elite-exchange
#310839749430-compute@developer.gserviceaccount.com