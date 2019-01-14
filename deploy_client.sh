sh ./configure_client_to_deployment.sh
cd ./client
npm run build
aws s3 cp build/ s3://sipuliton-storage --recursive
