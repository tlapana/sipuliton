cd ./services/lambda/sipuliton-backend
sam package --s3-bucket sipuliton-lambdas --output-template-file packaged.yaml
sam deploy  --template-file packaged.yaml --stack-name sipuliton-lambdas  --capabilities CAPABILITY_IAM
