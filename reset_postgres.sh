
# Docker setup/reset
docker network create sipuliton
docker rm -f sipulitonpostgres_postgres_1
docker-compose up --build -d
docker network connect sipuliton sipulitonpostgres_postgres_1

