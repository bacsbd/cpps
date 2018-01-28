const express = require('express');
const router = express.Router();
const {isAdmin} = require('middlewares/userGroup');
const User = require('mongoose').model('User');

router.get('/users/username-userId/:username', getUserIdFromUsername );
router.get('/users/:username', getUser );

module.exports = {
  addRouter(app) {
    app.use('/api/v1', isAdmin, router);
  },
};

async function getUserIdFromUsername(req, res, next) {
  try{
    const {username} = req.params;
    if (!username) {
      const err = new Error(`Query 'username' must be provided`);
      err.status = 400;
      throw err;
    }
    const user = await User.findOne({username}, {_id: 1});
    if (!user) {
      const err = new Error(`Username ${username} not found`);
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

async function getUser(req, res, next) {
  try {
    const {username} = req.params;
    const {select} = req.query;

    console.log(select);

    const user = await User.findOne({username}).select(select).exec();

    if (!user) {
      const err = new Error('No such user');
      err.status = 400;
      throw err;
    }

    return res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (err) {
    return next(err);
  }
}
