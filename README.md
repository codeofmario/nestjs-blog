# NestJS REST Architecture Example with JWT Authentication

## TECH STACK
- Typescript
- NestJS
- Posgresql
- Redis
- Minio/S3


## START PROJECT
### run docker compose
```console
sudo docker-compose up -d
```

### install project dependencies
```console
npm install
```

### create environment variables file
rename **.env.example** file  into **.env**

### build project
```console
npm run build
```

### run migrations
```console
npm run migration:run
```

### create seeds [optional]
```console
npm run db:seed
```

### run server
```console
npm run start
```

Visit the [Swagger docs](http://localhost:8000/api/docs)
