const express = require('express');
const Gate = require('mongoose').model('Gate');
const User = require('mongoose').model('User');

const router = express.Router();

router.get('/recent', getRecent);
router.get('/sync-problems', syncProblems);

module.exports = {
  addRouter(app) {
    app.use('/gateway', router);
  },
};

function getRecent(req, res, next) {
  /** Responsible for showing recent problem list to user*/

  Gate
    .find({type: 'problem'})
    .select('createdAt createdBy title platform pid parentId')
    .sort({createdAt: -1})
    .limit(25)
    .exec(function(err, problems) {
      if (err) {
        return next(err);
      }
      return res.render('gateway/recent', {problems});
    });
}

async function usersThatSolved(ojname, problemId) {
  try {
    const userList = await User.find({
      ojStats: {
        $elemMatch: {
          ojname,
          solveList: problemId,
        },
      },
    }, {username: 1}).exec();
    console.log(userList.map((x)=> x.username));
    return userList.map((x)=> x.username);
  } catch (err) {
    throw err;
  }
}

function syncProblems(req, res) {
  usersThatSolved('uva', '100');
}
