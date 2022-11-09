FROM node:18-alpine

ENV APP_HOME=/app
ENV NODE_ENV=production
ENV APP_HOME=/app

# create the appropriate directories
RUN mkdir $APP_HOME

# set work directory
WORKDIR $APP_HOME

COPY package*.json $APP_HOME
RUN npm install --only=production

# copy project
COPY . $APP_HOME

# create the app user
RUN addgroup -S app && adduser -S app -G app

# chown all the files to the app user
RUN chown -R app:app $APP_HOME

# change to the app user
USER app

CMD ["node", "./src/gcp.mjs"]
