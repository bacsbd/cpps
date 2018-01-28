const express = require('express');
const {isRoot} = require('middlewares/userGroup');
const Rating = require('mongoose').model('Rating');

const router = express.Router();

router.get('/ratings', getRatings);
// router.post('/contests', insertContest);

module.exports = {
  addRouter(app) {
    app.use('/api/v1', isRoot, router);
  },
};

async function getRatings(req, res, next) {
  try {
    const {classroomId, userIds} = req.query;
    if (!classroomId || !userIds || !userIds[0]) {
      const e = new Error(
        `classroomId: ${classroomId} or userIds: ${userIds} query is missing`);
      e.status = 400;
      throw e;
    }

    const rating = await Rating.find({classroomId, userId: userIds}).exec();

    const missingIds = userIds.filter((id)=>{
      const found = rating.some((x)=> x.userId === id);
      return !found;
    });

    missingIds.forEach((id)=>{
      rating.push({
        userId: id,
        classroomId,
        currentRating: -1,
      });
    });

    return res.status(200).json({
      status: 200,
      data: rating,
    });
  } catch (err) {
    next(err);
  }
}
