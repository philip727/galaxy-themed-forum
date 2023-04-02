# Run SQL database in docker
```sh
docker run --name forumdb -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secretpw -d mysql
```
# Run Server
```sh
ts-node index.ts
```

