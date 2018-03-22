import React, {Component} from 'react';
import {Table, Button} from 'reactstrap';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Loadable from 'react-loading-overlay';

export class WhoSolvedIt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalLoading: false,
      loadingMessage: '',
      ranklist: [],
      studentUsernames: [],
    };

    this.showSolveCount = this.showSolveCount.bind(this);
  }

  async showSolveCount(classId, problemListId) {
    const {handleError} = this.props;

    this.setState({
      modalLoading: true,
      loadingMessage: 'Building Ranklist...',
    });

    if (!classId || !problemListId) return;

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

  async componentWillReceiveProps(nextProps) {
    if (nextProps.classId === this.props.classId && nextProps.problemListId === this.props.problemListId) return;
    await this.showSolveCount(nextProps.classId, nextProps.problemListId);
  }

  async componentDidMount() {
    const {classId, problemListId} = this.props;
    await this.showSolveCount(classId, problemListId);
  }

  render() {
    const {ranklist, studentUsernames} = this.state;
    const {toggleModalRanklist, modalRanklist} = this.props;

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
       <Modal isOpen={modalRanklist} toggle={toggleModalRanklist}
         className='modal-lg'
         >
         <Loadable active={this.state.modalLoading}
         spinner={true}
         text={this.state.loadingMessage || 'Please wait a moment...'}>
           <ModalHeader toggle={toggleModalRanklist}>Ranklist</ModalHeader>
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
                       {ranklist.map((p, index)=>{
                         if (p.solvedBy.findIndex((x)=>x === student.username) !== -1 ) {
                           return <td
                            key={`${index}+${student.username}+${p.platform}+${p.problemId}`}
                            className="text-success"><i className="fa fa-check"/></td>;
                         } else {
                           return <td key={`${index}+${student.username}+${p.platform}+${p.problemId}`}></td>;
                         }
                       })}
                     </tr>
                   );
                 })}
               </tbody>
             </Table>
           </ModalBody>
           <ModalFooter>
             <Button color="secondary" onClick={toggleModalRanklist}>Cancel</Button>
           </ModalFooter>
       </Loadable>
       </Modal>
   );
  }
}
