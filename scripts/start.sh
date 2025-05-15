#!/bin/bash

cd ../backend
docker compose down
docker-compose up --build -d 

# await database
# sleep 5
# docker-compose exec server node test.js

docker-compose exec server node sync.js

echo "Server started"