import React, {Component} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Redirect} from 'react-router-dom';
import {Form, FormGroup, Label, Input, Button} from 'reactstrap';
import PropTypes from 'prop-types';
import StandingsPreview from './StandingsPreview';

export class AddStandings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contestStandings: '',
      modal: false,
      rawData: '',
      fireRedirect: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
    this.addStandings = this.addStandings.bind(this);
  }

  async addStandings(standings) {
    const {classId, contestId} = this.props.match.params;
    const data = {
      classroomId: classId,
      contestId: contestId,
      standings,
    };
    try {
      const api = '/api/v1/standings';
      let resp = await fetch(api, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 201) throw resp;
      this.setState({
        fireRedirect: true,
      });
    } catch (err) {
      console.log(err);
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

  handleSubmit(event) {
    event.preventDefault();

    this.setState({
      rawData: this.state.contestStandings,
    });
    this.toggle();
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  render() {
    const {classId, contestId} = this.props.match.params;
    return (
      <div>
        <h1>Add Standings</h1>

        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>Contest Standings</Label>
            <Input
              type='textarea'
              name='contestStandings'
              onChange={ this.handleInputChange }
              placeholder='position, username'
              value={this.state.contestStandings}
            />
          </FormGroup>
          <Button color='primary' type='submit'>Preview</Button>
          <LinkContainer to={`/classroom/${classId}/contest/${contestId}`}>
            <Button className='ml-1'> Cancel</Button>
          </LinkContainer>
        </Form>

        <StandingsPreview
          modalState={this.state.modal}
          toggle={this.toggle}
          rawData={this.state.rawData}
          classId={classId}
          addStandings={this.addStandings}
        />

        {this.state.fireRedirect && (<Redirect
          to={`/classroom/${classId}/contest/${contestId}`
        }/>)}
      </div>
    );
  }
}

AddStandings.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      classId: PropTypes.string.isRequired,
      contestId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
