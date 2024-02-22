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


#gcr.io/crypto-planet-415008/github.com/themadbrains18/nextjs-google-cloud
#310839749430-compute@developer.gserviceaccount.com