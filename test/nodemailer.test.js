/** A script to check if nodemailer is configured correctly or not*/

const mailer = require('forthright48/mailer').mailer;

const args = process.argv.slice(2);
if ( !args.length ) {
  console.log("Please pass email as argument");
  process.exit();
}
const email = args[0];

const emailMail = {
  to: [email],
  from: 'samiul@sparkpostbox.com',
  subject: 'Testing email subject',
  text: `Testing email text`,
  html: `Test email <b>html</b>`
};

mailer.sendMail(emailMail, function(err) {
  if (err) {
    console.log("Some error occured");
    console.log(err);
    process.exit(1);
  } else {
    console.log('email sent');
  }

});
