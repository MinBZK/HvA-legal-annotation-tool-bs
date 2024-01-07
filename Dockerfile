FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --production
ENV port 5050
EXPOSE 5050
CMD ["node", "build", "-b localhost"]