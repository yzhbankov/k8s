FROM node:alpine

WORKDIR /k8s

COPY . .

RUN yarn install --frozen-lockfile

ENV NODE_ENV production

EXPOSE 3000:3000

CMD ["npm", "start"]
