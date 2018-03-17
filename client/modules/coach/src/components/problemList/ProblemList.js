import React, {Component} from 'react';
import {Row, Col, Table} from 'reactstrap';
import {Form, FormGroup, Input, Label, Button} from 'reactstrap';
import {UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem}
  from 'reactstrap';
import {connect} from 'react-redux';
import Notifications, {error, success}
  from 'react-notification-system-redux';
import Loadable from 'react-loading-overlay';
import {Redirect} from 'react-router-dom';

class ProblemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingState: true,
      loadingMessage: 'Fetching data...',
      title: '',
      problems: [],
      view: 'normal',
      ojname: '',
      problemId: '',
      redirectDashboard: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeProblem = this.removeProblem.bind(this);
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

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const {problemListId} = this.props.match.params;

    this.setState({
      loadingState: true,
      loadingMessage: 'Adding Problem to List...',
    });
    const {ojname, problemId} = this.state;

    try {
      let resp = await fetch(`/api/v1/problembanks/${ojname}/${problemId}`, {
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) throw resp;

      const data = resp.data;
      resp = await fetch(`/api/v1/problemlists/${problemListId}/problems`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 201) throw resp;

      const newProblems = [...this.state.problems];
      if (resp.data) newProblems.push(resp.data);
      this.setState({
        problems: newProblems,
        ojname: '',
        problemId: '',
      });

      this.props.showNotification(success({
        title: 'Success',
        message: `Problem added: ${ojname}:${problemId}`,
      }));
    } catch (err) {
      this.handleError(err);
    } finally {
      this.setState({
        loadingState: false,
      });
    }
  }

  async componentWillMount() {
    const {problemListId} = this.props.match.params;
    try {
      let resp = await fetch(`/api/v1/problemlists/${problemListId}`, {
        method: 'GET',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) throw resp;
      this.setState({
        title: resp.data.title,
        problems: resp.data.problems,
      });
    } catch (err) {
      this.handleError(err);
    } finally {
      this.setState({
        loadingState: false,
      });
    }
  }

  settingsList() {
    return (
      <UncontrolledDropdown>
       <DropdownToggle className='fa fa-lg fa-cog' color='light'></DropdownToggle>
       <DropdownMenu>
         <DropdownItem>
          <div
              className='btn btn-primary btn-block'
              onClick={()=>this.setState({view: 'addProblem'})}
            > Add Problem </div>
        </DropdownItem>
        <DropdownItem>
         <div
             className='btn btn-danger btn-block'
             onClick={()=>this.deleteProblemList()}
           > Delete List </div>
       </DropdownItem>
       </DropdownMenu>
     </UncontrolledDropdown>
   );
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

  async deleteProblemList() {
    const {problemListId} = this.props.match.params;

    try {
      this.setState({
        loadingState: true,
        loadingMessage: 'Deleting the entire list...',
      });

      let resp = await fetch(`/api/v1/problemlists/${problemListId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 201) throw resp;
      this.setState({
        redirectDashboard: true,
      });
    } catch (err) {
      this.handleError(err);
    } finally {
      if (!this.state.redirectDashboard) {
        this.setState({
          loadingState: false,
        });
      }
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

  addProblemView() {
    const {ojnames} = this.props;
    const ojnamesOnly = ojnames.map((x)=>x.name);
    const ojnamesMap = {};
    ojnames.forEach((x)=>ojnamesMap[x.name] = x);
    return (
      <Col className="text-center">
        <h1>Add Problem View</h1>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>OJ Name</Label>
            <Input type='select' name="ojname" onChange={this.handleInputChange}
                value={this.state.ojname}
              >
              <option value='' disabled> Select a OJ</option>
              {ojnamesOnly.map((x)=><option key={x} value={x}>{x}</option>)}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Problem ID {this.state.ojname
              ? `(Match Regex: "${ojnamesMap[this.state.ojname].format}")`: ''}</Label>
            <Input name="problemId" onChange={this.handleInputChange} value={this.state.problemId}
              pattern={this.state.ojname?ojnamesMap[this.state.ojname].format:''}
            />
          </FormGroup>
          <Button type="submit" color="primary">Add</Button>{ ' ' }
          <Button color="secondary" onClick={()=>this.setState({view:'normal'})}>Cancel</Button>
        </Form>
      </Col>
    );
  }

  render() {
    return (
      <Loadable active={this.state.loadingState} spinner={true}
      text={this.state.loadingMessage || 'Please wait a moment...'}>
        <Notifications notifications={this.props.notifications}/>
        {this.state.redirectDashboard && (<Redirect to={'/coach'}/>)}
        <Row>
          <Col>
            <h1>Problem List: {this.state.title}</h1>
          </Col>
          <Col className='text-right'>
            {this.settingsList()}
          </Col>
        </Row>
        <Row>
          <Col>
            {this.problemListView()}
          </Col>
          {
            this.state.view === 'addProblem'? this.addProblemView(): null
          }
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
