# book
FCC Manage a Book Trading Club

# deploy instructions
add procfile in the server folser pointing to the dist directory, 
set the index file in server/src to read static files from build folder
make a project in heroku and set the env files
git init in the server folder
connect to the heroku app heroku git:remote -a {the app}
npm run build in both server and client directories
copy the build file from client to server
git add, commit, and push heroku master
