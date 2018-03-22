import React, {Component} from 'react';
import {Table} from 'reactstrap';

export class ProblemListClassroom extends Component {
  render() {
    const {problemLists} = this.props;
    if (problemLists.length == 0) return null;

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
                    <span className="btn-link pointer">
                      {`${x.createdBy.username} - ${x.title}`}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
