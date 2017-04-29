/**
  Path: /gateway/doneStat
  Contains logic to handle adding/removing problems from done list of user
*/
const express = require('express');
const Gate = require('mongoose').model('Gate');

const router = express.Router();

router.get('/add-done-list/:ID', addDoneList);
router.get('/remove-done-list/:ID', removeDoneList);

module.exports = {
  addRouter(app) {
    app.use('/gateway/doneStat', router);
  }
};

/*******************************************
Implementation
*******************************************/

function addDoneList(req, res, next) {
  const ID = req.params.ID;
  const redirect = req.query.redirect || '000000000000000000000000';
  const userId = req.session.userId;

  if (!req.session.login) {
    req.flash('error', 'Login required');
    return res.redirect(`/gateway/get-children/${redirect}`);
  }

  Gate.update({
    _id: ID
  }, {
    $addToSet: {
      doneList: userId
    }
  }, function(err) {
    if (err) return next(err);

    return res.redirect(`/gateway/get-children/${redirect}`);
  });
}

function removeDoneList(req, res, next) {
  const ID = req.params.ID;
  const redirect = req.query.redirect || '000000000000000000000000';
  const userId = req.session.userId;

  if (!req.session.login) {
    req.flash('error', 'Login required');
    return res.redirect(`/gateway/get-children/${redirect}`);
  }

  Gate.update({
    _id: ID
  }, {
    $pull: {
      doneList: userId
    }
  }, function(err) {
    if (err) return next(err);

    return res.redirect(`/gateway/get-children/${redirect}`);
  });
}
