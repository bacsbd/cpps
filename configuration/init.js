/**
 * Intiation Script
 *
 * 1. Creates a root folder if it does not exist
 * 2. Creates a notebook note if it does not exist
 * 3. Create admin
 */

const mongoose = require('mongoose');
const dburl = require('forthright48/world').secretModule.dburl;
const readline = require('readline');
const _ = require('lodash');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

mongoose.Promise = global.Promise;
const promise = mongoose.connect(dburl, {
  useMongoClient: true
});

function warning (){
  _.times(5, function(){
    console.log("***Warning*** Creating root account");
  })
}

function handleError(err){
  console.log(err);
  process.exit();
}

promise.then(function(db) {
  console.log('Successfully connected to database');

  require('../models/userModel');
  const User = mongoose.model('User');

  require('../models/gateModel')
  const Gate = mongoose.model('Gate');

  require('../models/notebookModel');
  const Notebook = mongoose.model('Notebook');

  /**
   * Create root folder if it does not exist
   */

  Gate.findOne({_id: '000000000000000000000000'}).exec()
    .then(function(root){
      if ( !root ) {
        // If root does not exist, create it
        const newRoot = new Gate({
          _id: '000000000000000000000000',
          type: 'folder',
          ancestor: [],
          ind: 0,
          title: 'Root'
        })
        return newRoot.save();
      }
      return
    })
    // Insert notebook if not present
    .then(function(){
      return Notebook.findOne({slug: 'notebook'}).exec();
    })
    .then(function(doc){
      if ( doc ) return doc;
      const newNote = new Notebook({
        title: 'Notebook',
        slug: 'notebook',
        body: '',
      })
      return newNote.save();
    })
    // Create new user
    .then( function() {
      warning();
      return new Promise(function(resolve, reject) {
        rl.question('Enter email for admin: ', function(email){
          return resolve(email);
        });
      });
    })
    .then(function(email) {
      return new Promise(function(resolve, reject) {
        rl.question('Enter password for admin: ', function(password) {
          return resolve({email, password});
        })
      });
    })
    .then(function({email, password}){
      const pass = User.createHash(password);
      const user = new User({
        email,
        password: pass,
        status: 'root',
        verified: 'true'
      });
      return user.save();
    })
    .then(function(){
      process.exit(); // All done
    }).catch(handleError)
}).catch(handleError);
