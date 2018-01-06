const express = require('express');
const Classroom = require('mongoose').model('Classroom');

const router = express.Router();

router.get('/classroom', getClassroom);

module.exports = router;

/**
 *Implementation
 */

async function getClassroom(req, res, next) {
  return res.status(200).json({
    msg: 'ok',
  });
}
