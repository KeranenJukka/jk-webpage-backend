FROM node:18-alpine as build
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM node:18-alpine as app
WORKDIR /app
COPY --from=build /app/build /app/src
COPY --from=build /app/package.json .
RUN npm i
CMD ["node", "src/app.js"]