FROM node

WORKDIR /k8s

COPY . .

RUN npm install zeromq@6.0.0-beta.6
RUN npm install --frozen-lockfile

ENV NODE_ENV production

EXPOSE 3002:3002
EXPOSE 7001:7001
EXPOSE 7002:7002

CMD ["npm", "run", "start:proxy"]
