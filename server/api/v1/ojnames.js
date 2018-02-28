const express = require('express');
const path = require('path');
const {rootPath} = require('world');
const ojnames = require(path.join(rootPath, 'models/ojnames.js'));

const router = express.Router();

router.get('/ojnames', getOjnames);

module.exports = {
  addRouter(app) {
    app.use('/api/v1', router);
  },
};

function getOjnames(req, res, next) {
  return res.status(200).json({
    status: 200,
    data: ojnames.data,
  });
}
