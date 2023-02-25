```
├── backend
│   ├── config
│   │   ├── config.js
│   │   ├── config.json
│   │   └── messages.js
│   ├── db
│   │   └── index.js
│   ├── Dockerfile
│   ├── logs
│   ├── models
│   │   └── todos
│   │       └── todo.js
│   ├── node_modules
│   ├── package.json
│   ├── package-lock.json
│   ├── routes
│   │   └── index.js
│   ├── server.js
│   └── utils
│       └── helpers
│           ├── logger.js
│           └── responses.js
├── compose.yaml
├── data
│   ├── ...
├── frontend
│   ├── Dockerfile
│   ├── node_modules
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── index.html
│   │   ├── manifest.json
│   └── src
│       ├── App.js
│       ├── App.scss
│       ├── App.test.js
│       ├── components
│       │   ├── AddTodo.js
│       │   └── TodoList.js
│       ├── custom.scss
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       └── serviceWorker.js
├── output.png
└── README.md

```
compose.yml defines `frontend`, `backend` and `db`
```
$ docker compose up -d
```
`http://localhost:3000` 


```
$ docker compose down
```

commented compose.yml

```yaml
services:
  frontend:
    build:
      context: frontend
      target: development
    ports:
      - 3000:3000
    stdin_open: true
    volumes:
      - ./frontend:/usr/src/app
      - /usr/src/app/node_modules
    restart: always
    networks:
      - react-express
    depends_on:
      - backend

  backend:
    restart: always
    build:
      context: backend
      target: development
    volumes:
      - ./backend:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      - mongo
    networks:
      - express-mongo
      - react-express
    expose: 
      - 3000
  mongo:
    restart: always
    image: mongo:4.2.0
    volumes:
      - ./data:/data/db
    networks:
      - express-mongo
    expose:
      - 27017
networks:
  react-express:
  express-mongo:

```

backend

 **nodejs** service called **server**
  __container_name__ is also __server__


mongo

built directly from dockerhub image 
__Explanation of service mongo__

- **mongodb** service called __mongo__
- Mount our current db directory to container. 
- identify mountpoint in  `Dockerfile`
- mount the host directory `/data`)  
- docker compose uses old volumes to persist storage
- depends
- In last mapping the host port to the container port.

:key: `If you wish to check your DB changes on your local machine as well. You should have installed MongoDB locally, otherwise you can't access your mongodb service of container from host machine.` 

:white_check_mark: You should check your __mongo__ version is same as used in image. You can see the version of __mongo__ image in `docker-compose `file, I used __image: mongo:4.2.0__. If your mongo db version on your machine is not same then furst you have to updated your  local __mongo__ version in order to works correctly.
FE


#### Snippet of frontend(ReactJS)`DockerFile`

You will find this `DockerFile` inside **frontend** directory. 

```bash
# Create image based on the official Node image from dockerhub
FROM node:10
#Argument that is passed from docer-compose.yaml file
ARG FRONT_END_PORT
# Create app directory
WORKDIR /usr/src/app
#Echo the argument to check passed argument loaded here correctly
RUN echo "Argument port is : $FRONT_END_PORT"
# Copy dependency definitions
COPY package.json /usr/src/app
# Install dependecies
RUN npm install
# Get all the code needed to run the app
COPY . /usr/src/app
# Expose the port the app runs in
EXPOSE ${FRONT_END_PORT}
# Serve the app
CMD ["npm", "start"]
```
##### Explanation of frontend(ReactJS) `DockerFile`

Frontend `DockerFile` is almost the same as Backend `DockerFile`.


BE

#### Snippet of backend(Node.js)`DockerFile`

You will find this `DockerFile` file in the root directory of the project.

```bash
FROM node:13.13.0-stretch-slim
#Argument that is passed from docer-compose.yaml file
ARG NODE_PORT
#Echo the argument to check passed argument loaded here correctly
RUN echo "Argument port is : $NODE_PORT"
# Create app directory
WORKDIR /usr/src/app
#COPY . .
COPY . .
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN npm install
#In my case my app binds to port NODE_PORT so you'll use the EXPOSE instruction to have it mapped by the docker daemon:
EXPOSE ${NODE_PORT}
CMD npm run dev
```

##### Explanation of backend(Node.js) `DockerFile`

- The first line tells Docker to use another Node image from the [DockerHub](https://hub.docker.com/). We’re using the official Docker image for Node.js and it’s version 10 image.

- On second line we declare argument `NODE_PORT` which we will pass it from `docker-compose`.

- On third line we log to check argument is successfully read 

- On fourth line we sets a working directory from where the app code will live inside the Docker container.

- On fifth line, we are copying/bundling our code working directory into container working directory on line three.

- On line seven, we run npm install for dependencies in container on line four.

- On Line eight, we setup the port, that Docker will expose when the container is running. In our case it is the port which we define inside `.env` file, read it from `docker-compose` then passed as a argument to the (backend)`DockerFile`.

- And in last, we tell docker to execute our app inside the container by using node to run `npm run dev. It is the command which I registered in __package.json__ in script section.
###### :clipboard: `Note: For development purpose I used __nodemon__ , If you need to deploy at production you should change CMD from __npm run dev__ to __npm start__.`
