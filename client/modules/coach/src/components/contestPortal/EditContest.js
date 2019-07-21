import React, {Component} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Redirect} from 'react-router-dom';
import {Form, FormGroup, Label, Input, Button} from 'reactstrap';
import PropTypes from 'prop-types';

class EditContest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classId: this.props.match.params.classId,
      contestId: this.props.match.params.contestId,
      contestName: '',
      contestUrl: '',
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

  async handleSubmit(event) {
    event.preventDefault();
    const {contestId} = this.state;
    const data = {
      name: this.state.contestName,
      link: this.state.contestUrl,
      classroomId: this.state.classId,
    };
    try {
      const api = `/api/v1/contests/${contestId}`;
      let resp = await fetch(api, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) throw resp;
      console.log(resp.data);
      this.setState({
        fireRedirect: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const {contestId} = this.state;
    return (
      <div>
        <h1>Edit Contest: {contestId}</h1>

        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>Contest Name</Label>
            <Input
              name="contestName"
              placeholder="Contest Name"
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Contest Url</Label>
            <Input
              type="url"
              name="contestUrl"
              placeholder="Contest Url"
              onChange={this.handleInputChange}
            />
          </FormGroup>
          <Button color="primary" type="submit">
            Update
          </Button>
          <LinkContainer
            to={`/classroom/${this.state.classId}/contest/${contestId}`}
          >
            <Button className="ml-1"> Cancel</Button>
          </LinkContainer>
        </Form>

        {this.state.fireRedirect && (
          <Redirect
            to={`/classroom/${this.state.classId}/contest/${
              this.state.contestId
            }`}
          />
        )}
      </div>
    );
  }
}

EditContest.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      classId: PropTypes.string.isRequired,
      contestId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default EditContest;
