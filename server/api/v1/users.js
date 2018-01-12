const express = require('express');
const router = express.Router();
const {isRoot} = require('middlewares/userGroup');



module.exports = {
  addRouter(app) {
    app.use('/api/v1', router);
  },
};
