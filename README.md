# A GraphQL Server With TypeScript

Steps to run this project:

1. Run `yarn install` command
2. Setup database settings inside `ormconfig.json` file
   ```json
   {
   "type": "postgres",
   "host": "localhost",
   "port": 5432,
   "username": "<YOUR USERNAME>",
   "password": "<YOUR PASSWORD>",
   "database": "<NAME OF DB>",
    ....other
    ....settings
   }
   ```
3. Run `yarn start`
