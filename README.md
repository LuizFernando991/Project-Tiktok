# Project-Tiktok

## Backend


first open the backend folder and:

1 - Fill the .env file with the following variables (you can copy and paste .env.example and rename to .env):
```dotenv
  PORT=3000
  DATABASE_URL="postgresql://root:root@localhost:5432/mydb?schema=discord"
  REFRESH_TOKEN_SECRET="mysecret"
  ACCESS_TOKEN_SECRET="mysecret"
  FRONT_URL="http://localhost:5173"
```
2 - Run the command ```npm install``` to install the dependencies

3 - Run the command ```npx prisma generate``` to update db collections

4 - Run the command ```npx prisma migrate dev``` to update seeds on db

5 - Run the command ```npm run start:dev``` to run local server

ps: I used postgresSQL to this project


## Frontend

first open the frontend folder and: 

1 - Fill the .env file with the following variables (you can copy and paste .env.example and rename to .env):
```dotenv
  VITE_GRAPHQL_URL="http://localhost:3000/graphql"
  VITE_PUBLIC_FOLDER_URL="http://localhost:3000/"
```

2 - Run the command ```npm install``` to install the dependencies

3 - Run the command ```npm run dev``` to run a local server
