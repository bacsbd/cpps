import React, {Component} from 'react';
import {Row, Col, Table} from 'reactstrap';
import {Form, FormGroup, Input, Label, Button} from 'reactstrap';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
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
      classrooms: [],
      modalRanklist: false,
      modalLoading: false,
      ranklist: [],
      studentUsernames: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeProblem = this.removeProblem.bind(this);
    this.showSolveCount = this.showSolveCount.bind(this);
    this.toggleModalRanklist = this.toggleModalRanklist.bind(this);
  }

  toggleModalRanklist(){
    this.setState({
      modalRanklist: !this.state.modalRanklist,
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
    const {user} = this.props;
    try {
      let resp = await fetch(`/api/v1/problemlists/${problemListId}`, {
        method: 'GET',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) throw resp;

      const title = resp.data.title;
      const problems = resp.data.problems;

      resp = await fetch(`/api/v1/classrooms?coach=${user.userId}`, {
        credentials: 'same-origin',
      });
      resp = await resp.json();

      const classrooms = resp.data;

      this.setState({
        title,
        problems,
        classrooms,
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

  displayRankList() {
    const ranklist = this.state.ranklist;
    const studentUsernames = this.state.studentUsernames;

    const totalSolved = studentUsernames.map((s)=>{
      const solved = ranklist.filter((r)=>r.solvedBy.findIndex((x)=>x===s) !== -1).length;
      return {username: s, solved};
    });

    totalSolved.sort((a, b)=>{
      if ( b.solved - a.solved ) return b.solved - a.solved;
      if ( a.username < b.username ) return -1;
      else return 1;
    });

    return (
       <Modal isOpen={this.state.modalRanklist} toggle={this.toggleModalRanklist}
         className='modal-lg'
         >
         <Loadable active={this.state.modalLoading}
         spinner={true}
         text={this.state.loadingMessage || 'Please wait a moment...'}>
           <ModalHeader toggle={this.toggleModalRanklist}>Ranklist</ModalHeader>
           <ModalBody style={{overflowX: 'auto'}}>
             <Table>
               <thead>
                 <tr>
                   <th>#</th>
                   <th>Username</th>
                   <th>Total</th>
                   {ranklist.map((x)=>{
                     return (
                       <th key={x._id}>
                         <a href={x.link} target="_blank">
                           {`${x.platform} ${x.problemId}`}
                         </a>
                       </th>
                     );
                   })}
                 </tr>
               </thead>
               <tbody>
                 {totalSolved.map((student, index)=>{
                   return (
                     <tr key={student.username}>
                       <td>{index}</td>
                       <td>{student.username}</td>
                       <td>{student.solved}</td>
                       {ranklist.map((p)=>{
                         if (p.solvedBy.findIndex((x)=>x === student.username) !== -1 ) {
                           return <td
                            key={`${student.username}+${p.platform}+${p.problemId}`}
                            className="text-success"><i className="fa fa-check"/></td>;
                         } else {
                           return <td key={`${student.username}+${p.platform}+${p.problemId}`}></td>;
                         }
                       })}
                     </tr>
                   );
                 })}
               </tbody>
             </Table>
           </ModalBody>
           <ModalFooter>
             <Button color="secondary" onClick={this.toggleModalRanklist}>Cancel</Button>
           </ModalFooter>
       </Loadable>
       </Modal>
   );
  }

  async showSolveCount(classId) {
    const {problemListId} = this.props.match.params;

    this.setState({
      modalRanklist: true,
      modalLoading: true,
      loadingMessage: 'Building Ranklist...',
    });

    try {
      let resp = await fetch(`/api/v1/problemlists/${problemListId}/who-solved-it/classrooms/${classId}`, {
        credentials: 'same-origin',
      });
      resp = await resp.json();

      if (resp.status !== 200) throw resp;
      this.setState({
        ranklist: resp.data.ranklist,
        studentUsernames: resp.data.studentUsernames,
      });
    } catch (err) {
      this.handleError(err);
    } finally {
      this.setState({
        modalLoading: false,
      });
    }
  }

  classroomView() {
    return (
      <Col className="text-center">
        <h2>Classroom View</h2>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {this.state.classrooms.map((c, index)=>{
              return (
                <tr key={c._id}>
                  <td>{index}</td>
                  <td>{c.name}</td>
                  <td><span className="btn-link pointer"
                    onClick={()=>this.showSolveCount(c._id)}
                    >View</span></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
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
          {this.state.view === 'normal'? this.classroomView(): null}
          {this.state.view === 'addProblem'? this.addProblemView(): null}
        </Row>
        {this.displayRankList()}
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
