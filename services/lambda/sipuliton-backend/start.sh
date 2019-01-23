 for f in `find . -maxdepth 1 -mindepth 1 -type d`; do
   cd "$f"
   npm install
   cd ..
 done

 sam local start-api --docker-network sipuliton
