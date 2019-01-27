# Reset test data
cd services/postgres
python3 populate_parser.py

# Docker setup/reset
docker network create sipuliton
docker rm -f sipuliton_postgres_1
docker-compose up --build -d
docker network connect sipuliton sipuliton_postgres_1

