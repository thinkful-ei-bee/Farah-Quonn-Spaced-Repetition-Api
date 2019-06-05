# Spaced repetition API!
This App uses Express.js server and PostgreSQL database
### API Endpoints

POST /api/auth/token  -->  Authenticates users by username and password

PUT /api/auth/token  -->  Refreshes users' token

GET  /api/language/  -->  Gets language back from database

POST /api/language/guess  -->  Users guess is compared to current word, and order list of words changes

GET  /api/language/head  -->  Gets next word in the language list

POST /api/users/  -->  Registers new users to the database

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`
