import React, {Component} from 'react';
import {Table} from 'reactstrap';
import {WhoSolvedIt} from './WhoSolvedIt';

export class ViewClassroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      classrooms: [],
      modalRanklist: false,
      loadingMessage: '',
      showSolveCountFor: '',
    };

    this.toggleModalRanklist = this.toggleModalRanklist.bind(this);
    this.shareWith = this.shareWith.bind(this);
    this.removeShareWith = this.removeShareWith.bind(this);
  }

  toggleModalRanklist() {
    this.setState({
      modalRanklist: !this.state.modalRanklist,
    });
  }

  async shareWith(classId) {
    const {handleError, setLoadingState, sharedWith, setSharedWith} = this.props;
    const {problemListId} = this.props.match.params;
    try {
      setLoadingState(true, 'Sharing with Classroom...');

      const data = {
        classId,
      };
      let resp = await fetch(`/api/v1/problemlists/${problemListId}/shared-with/classrooms`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 201) throw resp;
      setSharedWith([...sharedWith, classId]);
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingState(false);
    }
  }

  async removeShareWith(classId) {
    const {handleError, setLoadingState, sharedWith, setSharedWith} = this.props;
    const {problemListId} = this.props.match.params;
    try {
      setLoadingState(true, 'Removing Share Permission...');
      let resp = await fetch(`/api/v1/problemlists/${problemListId}/shared-with/classrooms/${classId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) throw resp;
      setSharedWith(sharedWith.filter((x)=>x!==classId));
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingState(false);
    }
  }

  async componentWillMount() {
    const {user, handleError, setLoadingState} = this.props;
    try {
      setLoadingState(true, 'Fetching Classrooms...');

      let resp = await fetch(`/api/v1/classrooms?coach=${user.userId}`, {
        credentials: 'same-origin',
      });
      resp = await resp.json();
      const classrooms = resp.data;

      this.setState({
        classrooms,
      });
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingState(false);
    }
  }

  render() {
    const {sharedWith} = this.props;
    const {classrooms} = this.state;
    return (
      <div className="text-center">
        <h2>Classroom View</h2>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Ranklist</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((c, index)=>{
              return (
                <tr key={c._id}>
                  <td>{index}</td>
                  <td>{c.name}</td>
                  <td><span className="btn-link pointer"
                    onClick={()=>this.setState({
                      modalRanklist: true,
                      showSolveCountFor: c._id,
                    })}
                    >View</span></td>
                  <td>
                    {
                      sharedWith.includes(c._id)
                      ? <i className="fa fa-check-square-o pointer" onClick={()=>this.removeShareWith(c._id)}/>
                      : <i className="fa fa-square-o pointer" onClick={()=>this.shareWith(c._id)}/>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <WhoSolvedIt
          {...this.props}
          classId={this.state.showSolveCountFor}
          problemListId={this.props.match.params.problemListId}
          modalRanklist={this.state.modalRanklist}
          toggleModalRanklist={this.toggleModalRanklist}
        />
      </div>
    );
  }
}
