const express = require('express');
const login = require('middlewares/login');

const router = express.Router();

router.post('/contests', function(req, res) {

});

module.exports = {
  addRouter(app) {
    app.use('/api/v1', login, router);
  },
};
