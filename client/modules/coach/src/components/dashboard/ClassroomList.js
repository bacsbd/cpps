import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Table} from 'reactstrap';
import PropTypes from 'prop-types';

class ClasroomList extends Component {
  constructor(props) {
    super(props);

    this.getRows = this.getRows.bind(this);
  }

  getRows() {
    const classrooms = this.props.classrooms;
    const rows = classrooms.map((classroom, ind) => {
      const {_id, name} = classroom;
      return (
        <tr key={_id}>
          <td>{ind+1}</td>
          <td><Link to={`/classroom/${_id}`}>{name}</Link></td>
        </tr>
      );
    });
    return rows;
  }

  render() {
    return (
      <Table >
        <thead>
          <tr>
            <th>#</th>
            <th>Classroom</th>
          </tr>
        </thead>
        <tbody>
          { this.getRows() }
        </tbody>
      </Table>
    );
  }
}

/** PropTypes */
ClasroomList.propTypes = {
  classrooms: PropTypes.array.isRequired,
};

export default ClasroomList;
