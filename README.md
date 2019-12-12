# Cancun API

## Available endpoints
https://www.getpostman.com/collections/feea94e47debc5cc9127

## Getting started
* Create a Stripe (https://stripe.com/) account
* Verify phone number for your account
* Enable Manual Payouts in the dashboard
* Clone this repository
* Copy `.env.sample` into `.env` file
* Provide configuration values in `.env`
* Make sure to create a database: once application starts - it will try to create needed tables
* `npm install`
* Migrate the database with `knex migrate:latest`
* `npm run dev` to launch in dev mode, or `npm run build` and `npm start` for production mode


