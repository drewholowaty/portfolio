# Documentation

## Development Environment

Follow the steps in order to get your development environment up and running


### 1. Relevant Software

Install the following software on your machine. 

- Docker
- Node.js

### 2. Install Packages

1. In the **frontend** directory, run `npm install` 
2. In the **server** directory run `npm install`

### 3. Run Docker, frontend, and server

- Docker: 
    - In the parent directory, run `docker-compose up -d`
    - To shut down container, run `docker-compose down` in the parent directory
    - If you want to run everything in a docker container, uncomment the lines in the docker-compose.yaml file

- Frontend: npm run dev
- Server: npm run dev

### 4. Use App

1. Navigate to localhost:5173/auth 
2. Get onetime code by running in terminal: docker logs `vue_expressjs_login_sequence-server-1`

## Solution Diagrams and Information 

### Middleware

The diagram below shows the relationships between the directories and files in the **server** directory.

                            app.js ◄─────────────┐       
                              ▲                  │       
                              │                  │       
                              │                  │       
     ┌──────────┐          ┌──┴───┐              │       
     │vue.js app◄──────────┤routes│         db_objects.js
     └──────────┘          └──▲───┘              │       
                              │                  │       
                              │                  │       
                              │                  │       
                          ┌───┴──────┐           │       
                          │middleware│◄──────────┘       
                          └──────────┘                   

The skeleton code below shows how an API endpoint should be written for this application. 

  /*                           <br />
  \* /endpoint/name <br />
  \*<br />
  \* Middleware: <br />
  \* <br />
  \* auth_functions.verify_token <br />
  \* middleware.function <br />
  \* middleware.function1 <br />
  \*<br />
  \* Request Body: <br />
  \* {<br />
  \* &emsp; key: value,<br />
  \* &emsp; key1: value1,<br />
  \* }<br />
  \*<br />
  \* Response Body:<br />
  \* {<br />
  \* &emsp; key: value,<br />
  \* &emsp; key1: value1,<br />
  \* }<br />
  \*/<br />
  app.post("/endpoint/name", <br />
     &emsp; (req, res, next) => {<br />
         &emsp;  &emsp; //code to validate input<br />
     &emsp; },<br />
     &emsp; auth_functions.verify_token, middleware.function, middleware.function1, <br />
     &emsp; (req, res) => {<br />
       &emsp; &emsp;  res.send({ message: "Successful request!" });<br />
    &emsp; }<br />
  ); <br />


Authentication System Request Diagram <br /> <br />

```
                                                     Login                                                 
                                                                                                           
                                          Client              Server                                       
                                                                                                           
                  ┌────────────────────────────┐              ┌────────────────────────────────────────┐   
                  │ Request Body:              │              │ /api/auth/verify_user                  │   
                  │ {                          ├─────────────►│ │                                      │   
                  │    email_or_phone          │              │ │►auth_functions.generate_onetime_code │   
                  │ }                          │       ┌──────┤ │                                      │   
                  └────────────────────────────┘       │      │ └►user_functions.read_user_email_phone │   
                                                       │      │                                        │   
                                                       │      └────────────────────────────────────────┘   
                                                       │                                                   
             ┌─────────────────────────────────┐       │                                                   
             │ Response Body (200):            │       │                                                   
             │ {                               │       │                                                   
             │    user_id: <id>                │◄──────┘                                                   
             │    auth_type: <email | phone>   │
             │ }                               │                                                           
             └─────────────────────────────────┘                                                           
                                                                                                           
                                                                                                           
              ┌────────────────────────────────┐              ┌─────────────────────────────────────────┐  
              │ Request Body:                  │              │ /api/auth/login                         │  
              │ {                              │              │ │                                       │  
              │    user_id: <id>,              ├─────────────►│ │►auth_functions.verify_onetime_code    │  
              │    email_or_phone,             │              │ │                                       │  
              │    onetime_code: <code>,       │              │ └►auth_functions.generate_session_token │  
              │    remember_me: <true | false> │       ┌──────┤                                         │  
              │ }                              │       │      └─────────────────────────────────────────┘  
              └────────────────────────────────┘       │                                                   
                                                       │                                                   
              ┌────────────────────────────────┐       │                                                   
              │ Response Body:                 │       │                                                   
              │ {                              │       │                                                   
              │    message: User authenticated │       │                                                   
              │ }                              │       │                                                   
              │                                │       │                                                   
              │ Cookies Set:                   │◄──────┘                                                   
              │ {                              │                                                           
              │    user_id,                    │                                                           
              │    device_id,                  │                                                           
              │    session_token               │                                                           
              │ }                              │                                                           
              └────────────────────────────────┘                                                           
                                                                                                           
                                                                                                           
                                                                                                           
                                                   Sign Up                                                 
                                                                                                           
                                          Client              Server                                       
                                                                                                           
                  ┌────────────────────────────┐              ┌────────────────────────────────────────┐   
                  │ Request Body:              │              │ /api/auth/verify_user                  │   
                  │ {                          ├─────────────►│ │                                      │   
                  │    email_or_phone          │              │ │►auth_functions.generate_onetime_code │   
                  │ }                          │       ┌──────┤ │                                      │   
                  └────────────────────────────┘       │      │ └►user_functions.read_user_email_phone │   
                                                       │      │                                        │   
                                                       │      └────────────────────────────────────────┘   
          ┌────────────────────────────────────┐       │                                                   
          │ Response Body(404):                │       │                                                   
          │ {                                  │       │                                                   
          │    message: "User does not exist", │◄──────┘                                                   
          │    auth_type: <email | phone>      │
          │ }                                  │                                                           
          └────────────────────────────────────┘                                                           
                                                                                                           
                                                                                                           
              ┌────────────────────────────────┐              ┌─────────────────────────────────────────┐  
              │ Request Body:                  │              │ /api/auth/signup                        │  
              │ {                              ├─────────────►│ │                                       │  
              │    email: <email>,             │              │ │►auth_functions.verify_onetime_code    │  
              │    phone_number: <phone_#>,    │              │ │                                       │  
              │    name: <name>,               │       ┌──────┤ │►user_functions.create_new_user        │  
              │    onetime_code: <code>,       │       │      │ │                                       │  
              │    remember_me: <true | false>,│       │      │ └►auth_functions.generate_session_token │  
              │    preferred_zip_code          │       │      │                                         │  
              │  }                             │       │      └─────────────────────────────────────────┘  
              └────────────────────────────────┘       │                                                   
                                                       │
     ┌─────────────────────────────────────────┐       │                                                   
     │ Response Body:                          │       │                                                   
     │ {                                       │       │                                                   
     │    message: "User successfully created" │       │                                                   
     │ }                                       │       │                                                   
     │                                         │       │                                                   
     │ Cookies Set:                            │◄──────┘                                                   
     │ {                                       │                                                           
     │    user_id,                             │                                                           
     │    device_id,                           │                                                           
     │    session_token                        │                                                           
     │ }                                       │                                                           
     └─────────────────────────────────────────┘                                                           

```

### frontend

Styling 
- When styling the spaces between elements, for containers and html elements, add margin/padding information in the vue component's style sheet. For imported elements, add inline styles.  
- Prioritize spacing at the top of the element (margin-top, padding-top)
- Only use px!

## External Documentation

### frontend
- components, vue.js: https://vuejs.org/
- routing, vue router: https://router.vuejs.org/
- data store, Pinia: https://pinia.vuejs.org/ 

### server
- Node.js framework, Express.js: https://expressjs.com/
- PostgreSQL Node.js interface, node-postgres: https://node-postgres.com/
- PostgreSQL: https://www.postgresql.org/docs/15/dml-insert.html

