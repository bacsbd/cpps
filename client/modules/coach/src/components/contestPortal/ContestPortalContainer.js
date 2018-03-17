import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ContestPortal from './ContestPortal.js';

class ContestPortalContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      classId: this.props.classId,
      data: [],
    };
  }

  async componentWillMount() {
    const {classId} = this.state;
    try {
      let resp = await fetch(`/api/v1/contests?classroomId=${classId}`, {
        credentials: 'same-origin',
      });
      resp = await resp.json();

      if (resp.status !== 200) throw resp;
      this.setState({
        data: resp.data,
      });
    } catch (err) {
      if (err.status) alert(err.message);
      else console.log(err);
    }
  }

  render() {
    return (
      <ContestPortal
        classId={this.state.classId}
        data={this.state.data}
        {...this.props}
      />
    );
  }
}

ContestPortalContainer.propTypes = {
  classId: PropTypes.string.isRequired,
};


export default ContestPortalContainer;
