Typescript Postgres Node Express Todo JWT

This repository contains a basic implementation of a RESTful API for managing users and todos. It is built using TypeScript, Node.js, Express.js, PostgreSQL, and JSON Web Tokens (JWT) for authentication.

Features

User registration and authentication (login with JWT).

CRUD operations for todos associated with users.

Secure API endpoints with JWT-based authentication.

Tech Stack

Node.js: JavaScript runtime for building server-side applications.

Express.js: Web framework for building RESTful APIs.

TypeScript: Static typing for JavaScript.

PostgreSQL: Relational database for storing users and todos.

Prisma: ORM for interacting with the database.

JWT (JSON Web Tokens): Authentication mechanism.

Bcrypt: Password hashing for secure storage.

Prerequisites

Node.js (>= 14.x)

PostgreSQL (>= 12.x)

npm (comes with Node.js)

Setup Instructions

1. Clone the Repository

$ git clone https://github.com/pkundu307/typescript_postgress_node_express_todo_jwt.git
$ cd typescript_postgress_node_express_todo_jwt

2. Install Dependencies

$ npm install

3. Set Up Environment Variables

Create a .env file in the root directory and add the following variables:

DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
JWT_SECRET=<your_secret_key>

Replace <username>, <password>, and <database_name> with your PostgreSQL credentials and database name. Replace <your_secret_key> with a secret key for JWT.

4. Apply Database Migrations

Ensure your PostgreSQL database is running, then run:

$ npx prisma migrate dev

This will create the required tables (User and Todo) in your database.

5. Start the Server

$ npm run dev

The server will start on http://localhost:5000.

API Endpoints

Authentication

1. Register a User

POST /users

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}

2. Login

POST /login

{
  "email": "john.doe@example.com",
  "password": "password123"
}

Response:

{
  "message": "Login successful",
  "token": "<JWT Token>"
}

Todos

1. Create a Todo

POST /api/todos
Headers:

Authorization: Bearer <JWT Token>

Body:

{
  "title": "Learn TypeScript"
}

2. Get All Todos for a User

GET /users/:id/todos
Headers:

Authorization: Bearer <JWT Token>

3. Update a Todo

PUT /todos/:id
Headers:

Authorization: Bearer <JWT Token>

Body:

{
  "title": "Learn Prisma",
  "completed": true
}

4. Delete a Todo

DELETE /todos/:id
Headers:

Authorization: Bearer <JWT Token>

Database Schema

User Table

Column

Type

Constraints

id

Integer

Primary Key

name

String

Not Null

email

String

Unique, Not Null

password

String

Not Null

createdAt

DateTime

Default (now)

Todo Table

Column

Type

Constraints

id

Integer

Primary Key

title

String

Not Null

completed

Boolean

Default (false)

userId

Integer

Foreign Key (User)

createdAt

DateTime

Default (now)

Scripts

npm run dev: Run the development server with hot reload.

npm run build: Compile the TypeScript code.

npm start: Run the compiled JavaScript code.

License

This project is licensed under the MIT License.

Feel free to contribute or raise issues in the repository! Happy coding!
