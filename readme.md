In the first approach, this project consists of an api to manage content on a blog, but I can expand this in future. In this date, we have routes to authentication, and simple managing of content, like creation and deletion. All the routes will be detailed on the future, at time was build. Some of the routes are mocked on code, or commented, and you can have an idea of what i want with this code. Some parts are only in my notes, so, be sure this is not an pre-release or alpha, its only a prototype and all can change in future, including the language I use. 
One important thing: the database type defined in ormconfig.ts is postgres.
Other important thing, run npm install or yarn install to install dependancies before run.
To run, you need first some environment vars, declared in test.env file: 
DATABASE_URL
FIRSTUSEREMAIL
FIRSTUSERPASSWORD
DEVELOPMENT_PORT

to run the test suites, you also need an test database, and for this you need that vars in the test.env file, 
If you want to run the tests in development mode you can use the dev.env file, whith the same structure of test.env but this database you will use for testing only. 

After configure all things, you can run "yarn test" to run all test suites and be sure all is ok, and so, you can run "yarn typeorm migrations:run" to make the structure of the development database and after that, you could run "yarn dev:server" to start the development server

IMPORTANT, in production or long term testing, make sure the FIRSTUSEREMAIL and FIRSTUSERPASS are completely removed from environment vars, and also, be sure that fields are changed in the root user. That user is unique, and if you lost it, you cannot modify it whithout make changes in the database.