# CPPS

A portal all about competitive programming and problem solving.

You can visit the site [cpps.bacsbd.org](http://cpps.bacsbd.org) to view the project.

# Features

The site has two parts: notebook and gateway.

In notebook, you will find theoretical resources about CPPS. In gateway, you will find categorized problems with hints for practice.

# Getting Started for Developers

1. Fork the project.
2. Clone the project into your workstation.
3. Install docker and docker-compose.
4. Enter the following command to start docker containers: `./deploy.sh -t prod`
5. In order to run the project, you need project specific secret values. In the project root, create a file named `server/secret.js` and enter the following infos:
    ```
    module.exports = {
      secret: "Your-secret-key", //Used to encrypt passwords and session
      dburl: "mongodb://cpps_db_1:27017/cpps",
      mailApi: "secret-mail-api-key", //Needs to be mailgun api
      recaptcha: {
        //Get your own recaptcha site & secret key. Use localhost as domain to run in locally.
        site: "Your-own-recaptcha-site-key",
        secret: "Your-own-recaptcha-secret-key"
      }
    }
    ```
6. Next simply run the command `./deploy.sh -t dev` to start dev server. If required, please give the deploy script run permission.
7. View the site in `localhost:3000`.


# Deploy Script

A script called `deploy` is available for use. Using this script, we can control the site in following manners:

1. **Starting Production Server**: `./deploy.sh -t prod` for starting production server.
1. **Starting Dev Server**: `./deploy.sh -t dev`, which runs on port 3000.
1. **Changing port**: `./deploy -t dev -p 8000`. By default port 80 is used.
1. **MongoDB shell**: `./deploy -t mongo`
1. **MongoDB GUI**: `./deploy -t mongo-express`
