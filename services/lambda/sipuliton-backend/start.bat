 cd landing
 call npm install
 cd ../search
 call npm install
 cd ../restaurant
 call npm install
 cd ../reviews
 call npm install
 cd ..
 
 @REM docker-network sipuliton
 sam local start-api --docker-network sipuliton
