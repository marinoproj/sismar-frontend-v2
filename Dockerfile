# stage1 - build Angular app first
FROM node:20.18-slim as build

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY ./package.json /app/
COPY ./pnpm-lock.yaml /app/

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . /app

RUN pnpm exec ng build --configuration=production --project=sismar-frontend-v2

# stage 2 - build the final image and copy the angular build files
FROM nginx:1.22-alpine

COPY --from=build /app/dist/sismar-frontend-v2/browser /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
