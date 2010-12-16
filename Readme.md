       __                             _ __              _
      / /__________ _____  __________(_) /_  ___  _____(_)____ _____
     / __/ ___/ __ `/ __ \/ ___/ ___/ / __ \/ _ \/ ___/ // __ `/ __ \
    / /_/ /  / /_/ / / / (__  |__  ) / /_/ /  __/ /  / // /_/ / / / /
    \__/_/   \__,_/_/ /_/____/____/_/_.___/\___/_/  /_/ \__,_/_/ /_/

# Transsiberian

Transsiberian is a boilerplate to build nodejs applications in under 5 minutes.

## Features

Transsiberian is really opinionated but it includes all you need to start a nodejs applications with [Express](https://github.com/visionmedia/express) and MongoDB

  * MongoDB models using [Mongolia](https://github.com/masylum/mongolia)
  * Basic user creation and authentification
  * Translations with [express-dialect](https://github.com/masylum/express-dialect) _on port 3001 by default_
  * CSS useful mixins, reset, and basic styles
  * Basic helpers
  * Flash messages
  * Mailer

## Dependencies

Copy and paste:

    npm install mongodb
    npm install connect-auth
    npm install express
    npm install express-dialect
    npm install log4js
    npm install mail
    npm install mongolia

## TODO (coming soon!)

I'm working to add some of these features:

  * Publish to npm so its easy to install and mantain
  * Web sockets with [Socket.IO-node](https://github.com/LearnBoost/Socket.IO-node)
  * File uploader
  * Asset manager
