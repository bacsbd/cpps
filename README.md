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
4. Enter the following command to start docker containers: `docker-compose up`. This will start downloading stuff. May take a while.
5. In order to run the project, you need project specific secret values. In the project root, create a file named `secret.js` and enter the following infos:
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
6. Next simply run the command `./deploy.sh dev` to start dev server. If required, please give the deploy script run permission.
7. View the site in `localhost:3000`.
