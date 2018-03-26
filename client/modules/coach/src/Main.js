import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';

import Dashboard from 'components/dashboard/Dashboard';

import ClassroomContainer from 'components/classroom/ClassroomContainer.js';
import AddClassroom from 'components/classroom/AddClassroom.js';
import DeleteClass from 'components/classroom/DeleteClass.js';
import {WhoSolvedIt} from 'components/whoSolvedIt/WhoSolvedIt.js';
import Leaderboard from 'components/classroom/Leaderboard';

import AddStudent from 'components/studentPortal/AddStudent.js';
import RemoveStudent from 'components/studentPortal/RemoveStudent.js';

import AddContest from 'components/contestPortal/AddContest.js';
import SingleContestContainer from
  'components/contestPortal/SingleContestContainer.js';
import {AddStandings} from 'components/contestPortal/AddStandings.js';

import UserProfileContainer from
  'components/userProfile/UserProfileContainer.js';

import ProblemList from 'components/problemList/ProblemList.js';

export default class Main extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/coach' component={Dashboard}/>
          <Route exact path='/coach/addClassroom' component={AddClassroom}/>

          <Route exact path='/classroom/:classId' component={ClassroomContainer}/>
          <Route exact path='/classroom/:classId/addStudent' component={AddStudent}/>
          <Route exact path='/classroom/:classId/removeStudent' component={RemoveStudent}/>
          <Route exact path='/classroom/:classId/deleteClass' component={DeleteClass}/>
          <Route exact path='/classroom/:classId/whoSolvedIt' component={WhoSolvedIt}/>
          <Route exact path='/classroom/:classId/leaderboard' component={Leaderboard}/>

          {/* Contest Portal */}
          <Route exact path='/classroom/:classId/contest/add-contest' component={AddContest}/>
          <Route exact path='/classroom/:classId/contest/:contestId/add-standings' component={AddStandings}/>
          <Route exact path='/classroom/:classId/contest/:contestId' component={SingleContestContainer}/>

          {/* User Portal */}
          <Route exact path='/users/profile/:username' component={UserProfileContainer}/>

          {/* Problem List Portal*/}
          <Route exact path='/problemList/:problemListId' component={ProblemList}/>
        </Switch>
      </main>
    );
  }
}
