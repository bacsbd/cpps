import React, {Component} from 'react';
import {Table} from 'reactstrap';
import {connect} from 'react-redux';
import Notifications, {error}
  from 'react-notification-system-redux';
import Loadable from 'react-loading-overlay';
import {LinkContainer} from 'react-router-bootstrap';

class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingState: true,
      loadingMessage: '',
      data: [],
    };
  }

  handleError(err) {
    if (err.status) {
      this.props.showNotification(error({
        title: 'Error',
        message: err.message,
        autoDismiss: 500,
      }));
    }
    console.error(err);
  }

  async componentWillMount() {
    const {classId} = this.props.match.params;
    try {
      let resp = await fetch(`/api/v1/classrooms/${classId}/leaderboard`, {
        method: 'GET',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) throw resp;
      this.setState({
        loadingState: false,
        data: resp.data,
      });
    } catch (err) {
      this.handleError(err);
    } finally {
      this.setState({
        loadingState: false,
      });
    }
  }

  dataTable() {
    const {data} = this.state;
    const {ojnames} = this.props;
    const ojnamesOnly = ojnames.map((x)=>x.name).filter((x)=> x !== 'vjudge');

    return (
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Total</th>
            {ojnamesOnly.map((x)=> <th key={x}> {x} </th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((u, index)=>{
            return (
              <tr key={u.username}>
                <td>{index + 1}</td>
                <td>
                  <LinkContainer to={`/users/profile/${u.username}`}>
                    <span className="btn-link pointer">
                      {u.username}
                    </span>
                  </LinkContainer>
                </td>
                <td>{u.totalSolved}</td>
                {ojnamesOnly.map((ojname)=><td key={ojname}>{u[ojname]?u[ojname]:'-'}</td>)}
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }

  render() {
    return (
      <Loadable active={this.state.loadingState} spinner={true}
      text={this.state.loadingMessage || 'Please wait a moment...'}>
        <Notifications notifications={this.props.notifications}/>

        <h1 className="text-center">Leaderboard</h1>
        {this.dataTable()}

      </Loadable>
    );
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications,
    user: state.user,
    ojnames: state.ojnames,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    showNotification(msg) {
      dispatch(msg);
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboard);
