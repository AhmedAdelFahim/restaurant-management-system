FROM node:20-alpine

WORKDIR /app/temp

COPY ./package.json /app/temp/package.json 
COPY ./package-lock.json /app/temp/package-lock.json 

RUN npm ci
COPY . /app/temp/
RUN npm run build && npm prune --production

FROM node:20-alpine as production
WORKDIR /app/dist

COPY  --from=0 /app/temp/dist /app/dist 
COPY  --from=0 /app/temp/package.json /app/dist/package.json 
COPY  --from=0 /app/temp/node_modules /app/dist/node_modules

EXPOSE 9001

CMD node src/main
