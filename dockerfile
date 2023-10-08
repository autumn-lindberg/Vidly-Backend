# use node alpine image to run container
FROM node:14.16.0-alpine3.13

# create a user with minimal permissions to run container
# if user is already created, command does nothing
RUN addgroup app && adduser -S -G app app
USER app

# set pwd in container to be /app
WORKDIR /app

# only copy package and package-lock (faster)
#
COPY package*.json ./
# update dependencies (cached if nothing is changed)
RUN npm install
#
#
COPY . .

# expose port 3001 to use
EXPOSE 3001 

# run node index to start backend 
CMD ["node", "index.js"]