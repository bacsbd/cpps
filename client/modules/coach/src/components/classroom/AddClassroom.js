import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {
  Form,
  Button,
  Input,
  Label,
  FormGroup,
} from 'reactstrap';

import {asyncUsernameToUserId} from 'components/utility';

class AddClassroom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      students: '',
      fireRedirect: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    let students = this.state.students;

    students = students.split(',').map((x)=> x.trim());
    students = await Promise.all(students.map(async (username) => {
      try {
        return await asyncUsernameToUserId(username);
      } catch (err) {
        console.log(`Some problem occured due to ${username}`);
        return '';
      }
    }));
    students = students.filter((x)=>x);

    let data = {
      name: this.state.name,
      students,
    };
    try {
      let resp = await fetch('/api/v1/classrooms', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if ( resp.status !== 201 ) {
        throw resp;
      }
      this.setState({fireRedirect: true});
      return;
    } catch (err) {
      console.log(err);
      if (err.status) alert(err.message);
    }
  }

  render() {
    return (
      <div>
        <h1> Add Classroom </h1>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>{'Add Class'}</Label>
            <Input
              name='name'
              placeholder={'Classroom Name'}
              onChange={ this.handleInputChange }
            />
            <Label>{'Add Students ID'}</Label>
            <Input
              name='students'
              placeholder={'Student IDs'}
              onChange={ this.handleInputChange }
            />
          </FormGroup>
          <Button color='primary' type='submit'>Save</Button>
          <LinkContainer to='/coach'>
            <Button className='ml-1'> Cancel</Button>
          </LinkContainer>
        </Form>

        {this.state.fireRedirect && (<Redirect to={'/coach'}/>)}
      </div>
    );
  }
}

export default AddClassroom;
