# Run SQL database in docker
docker run --name forumdb -p 3306:3306 -e MYSQL_ROOT_PASSWORD=secretpw -d mysql

# Run Server
ts-node index.ts

