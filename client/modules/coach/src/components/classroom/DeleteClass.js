import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import PropTypes from 'prop-types';
import {Form, Button, Input, Label, FormGroup} from 'reactstrap';

class DeleteClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      fireRedirect: false,
      fireSuccess: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state === undefined) {
      this.setState({fireRedirect: true});
    }
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

    if (!this.state.name) {
      return alert('Name cannot be empty');
    }

    if (this.state.name !== this.props.location.state.name) {
      alert('Class name did not match');
      return;
    }
    const api = `/api/v1/classrooms/${this.props.match.params.classId}`;
    try {
      let resp = await fetch( api, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) throw resp;
      this.setState({
        fireSuccess: true,
      });
      return;
    } catch (err) {
      if (err.status) alert(err.message);
      console.log(err);
      return;
    }
  }

  render() {
    return (
      <div>
        <h1> Delete Class </h1>
        <h2> Are you sure? </h2>
        <p> Enter name of your classroom to confirm. </p>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>Classroom Name</Label>
            <Input
              name='name'
              placeholder='Name of Classroom'
              onChange={ this.handleInputChange }
            />
          </FormGroup>
          <Button color='danger' type='submit'>Delete</Button>
          <LinkContainer to={`/classroom/${this.props.match.params.classId}`}>
            <Button className='ml-1'> Cancel</Button>
          </LinkContainer>
        </Form>

        {this.state.fireRedirect &&
          (<Redirect to={`/classroom/${this.props.match.params.classId}`}/>)}
        {this.state.fireSuccess && (<Redirect to='/coach'/>)}
      </div>
    );
  }
}

DeleteClass.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      classId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default DeleteClass;
