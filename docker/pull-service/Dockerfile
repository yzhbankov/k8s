FROM node

WORKDIR /k8s

COPY . .

RUN npm install zeromq@6.0.0-beta.6
RUN yarn install --frozen-lockfile

ENV NODE_ENV production

EXPOSE 3000:3000
EXPOSE 7001:7001

CMD ["npm", "run", "start:pull-service"]
