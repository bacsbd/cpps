import React, {Component} from 'react';
// import {LinkContainer} from 'react-router-bootstrap';
import {Row, Col, Table, Button} from 'reactstrap';
import {PropTypes} from 'prop-types';
import Spinner from 'react-spinkit';
import Loadable from 'react-loading-overlay';
import {success} from 'react-notification-system-redux';

export class OJSolve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showInputForOj: '',
    };
    this.unsetOjUsername = this.unsetOjUsername.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  async updateSolveCount() {
    const {displayUser, handleError} = this.props;
    const username = displayUser.username;

    try {
      this.setState({
        loading: true,
      });
      let resp = await fetch(`/api/v1/users/${username}/sync-solve-count`, {
        method: 'PUT',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 202) throw resp;
    } catch (err) {
      handleError(err);
    } finally {
      this.setState({
        loading: false,
      });
      this.props.showNotification(success({
        title: 'Request Receieved',
        message: 'Please wait while we process your request',
        position: 'tr',
        autoDismiss: 5,
      }));
    }
  }

  async unsetOjUsername(username, ojname) {
    const {updateOjStats, handleError} = this.props;

    this.setState({
      loading: true,
    });

    try {
      let resp = await fetch(`/api/v1/users/${username}/unset-oj-username/${ojname}`, {
        method: 'PUT',
        credentials: 'same-origin',
      });

      resp = await resp.json();
      if ( resp.status !== 201 ) throw resp;

      updateOjStats(resp.data);
    } catch (err) {
      handleError(err)
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  async setUsername(ojname) {
    const {displayUser, updateOjStats, handleError} = this.props;
    const {username} = displayUser;

    this.setState({
      loading: true,
    });

    const userId = this.state.ojusername;
    try {
      let resp = await fetch(`/api/v1/users/${username}/set-oj-username/${ojname}/${userId}`, {
        method: 'PUT',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if ( resp.status !== 201) throw resp;
      updateOjStats(resp.data);
    } catch (err) {
      handleError(err);
    } finally {
      this.setState({
        loading: false,
      });
    }
  }

  ojUsernameField(oj, index) {
    const {displayUser, owner} = this.props;
    const {username} = displayUser;
    const {showInputForOj} = this.state;

    const displayOjUsername = (
      <span>
        {oj.userIds[0]}
        {owner? <i
          className="fa fa-times text-danger ml-1 pointer"
          onClick={()=>this.unsetOjUsername(username, oj.ojname)}
        />: ''}
      </span>
    );

    const inputForm = (
      <div>
        <input type='text' name='ojusername' onChange={this.handleInputChange}/>
        <Button color='primary ml-1' onClick={()=>this.setUsername(oj.ojname)}>
          Set
        </Button>
      </div>
    );

    const setUsername = (
      <div>
        { owner
          ? (<div>
              {showInputForOj === oj.ojname
                ? inputForm
                : <span
                  className="btn-link pointer"
                  onClick={()=>this.setState({showInputForOj: oj.ojname})}
                  >
                    Set Username
                  </span>
              }
            </div>)
          : <span>Not Set</span>
      }
    </div>
  );
    return oj.userIds[0]? displayOjUsername: setUsername;
  }

  render() {
    const {displayUser} = this.props;
    const ojStats = displayUser.ojStats;
    const ojSolve = ojStats? (
      <Table>
        <thead>
          <tr>
            <th>Index</th>
            <th>OJ</th>
            <th>UID</th>
            <th>Solve</th>
          </tr>
        </thead>
        <tbody>
          {displayUser.ojStats.map((oj, index)=>{
            return (
              <tr key={oj._id}>
                <td>{index}</td>
                <td>{oj.ojname}</td>
                <td>{this.ojUsernameField(oj, index)}</td>
                <td>{oj.solveCount}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    ): (
      <span>Loading</span>
    );

    const totalSolve = ojStats?
      ojStats
        .map((oj)=>oj.solveCount?oj.solveCount:0)
        .reduce((total, current)=>{
          return total+current;
        }, 0):
      0;

    return (
      <Loadable active={this.state.loading}
      spinner={true}
      text='Please wait a moment...'>
        <Row>
          <Col xs="2"></Col>
          <Col xs="8">
            <h4>Solve Count: {totalSolve}</h4>
          </Col>
          <Col xs="2">
            {
              this.state.loading?
              <Spinner name="circle"/>:
              <i className="fa fa-refresh btn" title="Sync All OJ"
                onClick={()=>this.updateSolveCount()}/>
            }
          </Col>
        </Row>
        {ojSolve}
      </Loadable>
    );
  }
}

OJSolve.propTypes = {
  displayUser: PropTypes.shape(),
  updateOjStats: PropTypes.func.isRequired,
  owner: PropTypes.bool.isRequired,
};
