const express = require('express');
const login = require('middlewares/login');

const router = express.Router();

router.post('/', function(req, res) {
  console.log('here');
});

module.exports = {
  addRouter(app) {
    app.use('/api/v1/contests', login, router);
  },
};
