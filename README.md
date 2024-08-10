
# Restaurant Management System
## Run the app without docker

```bash
$ npm i
$ cp .env.sample .env # set your variable in env
$ npm run seed:dev
$ npm run start
# you can use postman file in repo to test app
```
## Run the app with docker

```bash
$ docker-compose up --build
$ docker-compose exec restaurant_app npm run seed
# you can use postman file in repo to test app
```
## Built with
* [unified-errors-handler](https://github.com/AhmedAdelFahim/unified-errors-handler) (my own package to handle errors you can check it)
* nestjs
* mongoDB
* redis

