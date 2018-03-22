import React, {Component} from 'react';
import {Table} from 'reactstrap';
import {WhoSolvedIt} from 'components/problemList/WhoSolvedIt';

export class ProblemListClassroom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      problemListId: '',
      modalRanklist: false,
    };

    this.toggleModalRanklist = this.toggleModalRanklist.bind(this);
  }

  toggleModalRanklist() {
    this.setState({
      modalRanklist: !this.state.modalRanklist,
    });
  }
  render() {
    const {problemLists} = this.props;
    if (problemLists.length === 0) return null;

    return (
      <div>
        <h1>Problem Lists</h1>
        <Table className="text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>List Name</th>
            </tr>
          </thead>
          <tbody>
            {problemLists.map((x, index)=>{
              return (
                <tr key={x._id}>
                  <td>{index + 1}</td>
                  <td>
                    <span className="btn-link pointer" onClick={()=>this.setState({
                      problemListId: x._id,
                      modalRanklist: true,
                    })}>
                      {`${x.createdBy.username} - ${x.title}`}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        <WhoSolvedIt
          {...this.props}
          classId={this.props.match.params.classId}
          problemListId={this.state.problemListId}
          modalRanklist={this.state.modalRanklist}
          toggleModalRanklist={this.toggleModalRanklist}
        />
      </div>
    );
  }
}
