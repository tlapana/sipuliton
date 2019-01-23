 for /f "tokens=*" %%G in ('dir /b /a:d') do cd %%G & call npm install & cd..
 
 @REM docker-network sipuliton
 sam local start-api --docker-network sipuliton
