import React, {Component} from 'react';
import {Row, Col, Table} from 'reactstrap';
import {connect} from 'react-redux';
import Notifications, {error}
  from 'react-notification-system-redux';
import Loadable from 'react-loading-overlay';

import {SettingsList} from './SettingsList';
import {ViewAddProblem} from './ViewAddProblem';
import {ViewClassroom} from './ViewClassroom';

class ProblemList extends Component {
  constructor(props) {
    super(props);

    const {classId} = props.match.params;
    const view = classId? 'classroom' : 'normal';

    this.state = {
      loadingState: true,
      loadingMessage: 'Fetching data...',
      title: '',
      problems: [],
      sharedWith: [],
      view: view,
      owner: false,
    };

    this.removeProblem = this.removeProblem.bind(this);

    this.changeView = this.changeView.bind(this);
    this.setLoadingState = this.setLoadingState.bind(this);
    this.addProblem = this.addProblem.bind(this);
    this.handleError = this.handleError.bind(this);
    this.setSharedWith = this.setSharedWith.bind(this);
  }

  setSharedWith(sharedWith) {
    this.setState({
      sharedWith,
    });
  }

  addProblem(newProblem) {
    this.setState({
      problems: [...this.state.problems, newProblem],
    });
  }
  setLoadingState(loadingState, loadingMessage) {
    this.setState({
      loadingState,
      loadingMessage,
    });
  }

  changeView(newView) {
    this.setState({
      view: newView,
    });
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
    const {problemListId} = this.props.match.params;
    const {user} = this.props;
    try {
      let resp = await fetch(`/api/v1/problemlists/${problemListId}`, {
        method: 'GET',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) throw resp;

      const {title, problems, sharedWith, createdBy} = resp.data;
      const owner = createdBy === user.userId;

      this.setState({
        title,
        problems,
        sharedWith,
        owner,
      });
    } catch (err) {
      this.handleError(err);
    } finally {
      this.setState({
        loadingState: false,
      });
    }
  }

  async removeProblem(id) {
    const {problemListId} = this.props.match.params;

    try {
      this.setState({
        loadingState: true,
        loadingMessage: 'Deleting Problem from List...',
      });
      let resp = await fetch(`/api/v1/problemlists/${problemListId}/problems/${id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if ( resp.status !== 201 ) throw resp;

      const newProblems = this.state.problems.filter((x)=>x._id !== id);
      this.setState({
        problems: newProblems,
      });
    } catch (err) {
      this.handleError(err);
    } finally {
      this.setState({
        loadingState: false,
      });
    }
  }

  problemListView() {
    return (
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Problem</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {this.state.problems.map((p, index)=>{
            return (
              <tr key={p._id}>
                <td>{index}</td>
                <td>
                  <a href={p.link}>
                    {`${p.platform} - ${p.problemId} ${p.title}`}
                  </a>
                </td>
                <td className="text-center text-danger">
                  <i className="fa fa-times pointer" onClick={()=>this.removeProblem(p._id)}/>
                </td>
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
        <Row>
          <Col>
            <h1>Problem List: {this.state.title}</h1>
          </Col>
          {
            this.state.owner
            ?<Col className='text-right'>
              <SettingsList
                {...this.props}
                changeView={this.changeView}
                setLoadingState={this.setLoadingState}
                handleError={this.handleError}
              />
            </Col>
            : null
          }
        </Row>
        <Row>
          <Col>
            {this.problemListView()}
          </Col>
          <Col>
            {this.state.view === 'normal'? <ViewClassroom
              {...this.props}
              handleError={this.handleError}
              setLoadingState={this.setLoadingState}
              sharedWith={this.state.sharedWith}
              setSharedWith={this.setSharedWith}
            />: null}
            {this.state.view === 'addProblem'? <ViewAddProblem
              {...this.props}
              setLoadingState={this.setLoadingState}
              addProblem={this.addProblem}
              handleError={this.handleError}
              changeView={this.changeView}
            />: null}
          </Col>
        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProblemList);
