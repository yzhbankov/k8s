FROM node

WORKDIR /k8s

COPY . .

RUN npm install zeromq@6.0.0-beta.6
RUN npm install --frozen-lockfile

ENV NODE_ENV production

EXPOSE 3001:3001
EXPOSE 7001:7001

CMD ["npm", "run", "start:zmq"]
