import React, {Component} from 'react';
import Loadable from 'react-loading-overlay';
import PropTypes from 'prop-types';
import {Form, Input, FormGroup, Row, Col} from 'reactstrap';

export class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingState: false,
      loadingMessage: '',
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
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

    this.setState({
      loadingState: true,
    });

    const {handleError, user, notifySuccess} = this.props;
    const {currentPassword, newPassword, repeatPassword} = this.state;
    const {username} = user;
    try {
      if (newPassword !== repeatPassword) {
        throw new Error('Repeat Password did not match with New Password');
      }

      let resp = await fetch(`/api/v1/users/${username}/change-password`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({currentPassword, newPassword, repeatPassword}),
        credentials: 'same-origin',
      });
      resp = await resp.json();

      if (resp.status !== 201) throw resp;
      notifySuccess('Password Changed Successfully');
    } catch (err) {
      handleError(err);
    } finally {
      this.setState({
        loadingState: false,
        currentPassword: '',
        newPassword: '',
        repeatPassword: '',
      });
    }
  }

  render() {
    const {changeView} = this.props;
    return (
      <Loadable active={this.state.loadingState} spinner={true}
      text={this.state.loadingMessage || 'Please wait a moment...'}>
        <div>
          <h4>Change Password</h4>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Input name="currentPassword" type="password" placeholder="Current Password" value={this.state.currentPassword} onChange={this.handleInputChange}/>
            </FormGroup>
            <FormGroup>
              <Input name="newPassword" type="password" placeholder="New Password" value={this.state.newPassword} onChange={this.handleInputChange}/>
            </FormGroup>
            <FormGroup>
              <Input name="repeatPassword" type="password" placeholder="Repeat Password" value={this.state.repeatPassword} onChange={this.handleInputChange}/>
            </FormGroup>
            <Row>
              <Col>
                <Input type="submit" className="btn-primary" value="Change Password"/>
              </Col>
              <Col>
                <Input type="button" className="btn-secondary" value="Cancel" onClick={()=>changeView('normal')}/>
              </Col>
            </Row>
          </Form>
        </div>
      </Loadable>
    );
  }
}

ChangePassword.propTypes = {
  showNotification: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
};
