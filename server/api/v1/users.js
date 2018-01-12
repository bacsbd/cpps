const express = require('express');
const router = express.Router();
const {isAdmin} = require('middlewares/userGroup');
const login = require('middlewares/login');
const User = require('mongoose').model('User');

router.get('/users/username-userId', getUserIdFromUsername );

module.exports = {
  addRouter(app) {
    app.use('/api/v1', login, router);
  },
};

async function getUserIdFromUsername(req, res, next) {
  try{
    const {username} = req.query;
    if (!username) {
      const err = new Error(`Query 'username' must be provided`);
      err.status = 400;
      throw err;
    }
    const user = await User.findOne({username}, {_id: 1});
    if (!user) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }
    return res.status(200).json({
      status: 200,
      data: user._id,
    });
  } catch(err) {
    next(err);
  }
}
