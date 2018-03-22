import React, {Component} from 'react';
import {Table, Button} from 'reactstrap';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Loadable from 'react-loading-overlay';

export class ViewClassroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalRanklist: false,
      modalLoading: false,
      loadingMessage: '',
      ranklist: [],
      studentUsernames: [],
    };

    this.showSolveCount = this.showSolveCount.bind(this);
    this.toggleModalRanklist = this.toggleModalRanklist.bind(this);
  }

  toggleModalRanklist() {
    this.setState({
      modalRanklist: !this.state.modalRanklist,
    });
  }

  async showSolveCount(classId) {
    const {problemListId} = this.props.match.params;
    const {handleError} = this.props;

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
      handleError(err);
    } finally {
      this.setState({
        modalLoading: false,
      });
    }
  }

  displayRankList() {
    const {ranklist, studentUsernames} = this.state;

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

  render() {
    const {classrooms} = this.props;
    return (
      <div className="text-center">
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
            {classrooms.map((c, index)=>{
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
        {this.displayRankList()}
      </div>
    );
  }
}
