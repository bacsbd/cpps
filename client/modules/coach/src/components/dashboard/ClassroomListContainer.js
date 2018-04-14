import React, {Component} from 'react';
import ClassroomList from './ClassroomList';

export default class ClassroomListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classDetails: [],
    };
  }

  async componentDidMount() {
    const {handleError} = this.props;
    try {
      const api = '/api/v1/classrooms';
      let resp = await fetch(api, {
        method: 'get',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) {
        throw resp;
      }
      this.setState({
        classDetails: resp.data,
      });
      return;
    } catch (err) {
      handleError(err);
      return;
    }
  }

  render() {
    return <ClassroomList classrooms={this.state.classDetails}/>;
  }
}
