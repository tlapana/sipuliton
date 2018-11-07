 cd landing
 call npm install
 cd ..
 cd profile
 call npm install
 cd ..
 cd getApi
 call npm install
 cd ..
 
 @REM docker-network sipuliton
 sam local start-api --docker-network sipuliton
