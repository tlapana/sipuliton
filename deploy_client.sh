sh ./configure_client_to_deployment.sh
cd ./client
npm run build
aws s3 cp build/ s3://www.sipuliton.fi --recursive
cd ../
sed -i -e 's+https://ttv1izfbf7.execute-api.eu-central-1.amazonaws.com/Prod+http://localhost:3000+g' ./client/src/config.js
