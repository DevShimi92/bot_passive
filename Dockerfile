FROM node:latest
ENV NODE_ENV=production
WORKDIR /usr/src/bot
COPY ["package.json", "./"]
RUN npm install && npm install -g typescript
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/bot
USER node
RUN tsc
CMD ["node", "dist/main.js"]