import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {
  Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink,
} from 'reactstrap';
import PropTypes from 'prop-types';

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

class Header extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  render() {
    const path = this.props.location.pathname;
    const isClassroomRegex = /^\/classroom/;
    const isClassroom = isClassroomRegex.exec(path)?true:false;
    const classId = path.split('/')[2];
    const {username} = this.props.user;

    const tools = (
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle nav caret>
          Tools
        </DropdownToggle>
        <DropdownMenu>
          <LinkContainer to={`/classroom/${classId}/whoSolvedIt`}>
            <DropdownItem>Who Solved It?</DropdownItem>
          </LinkContainer>
        </DropdownMenu>
      </Dropdown>
    );

    return (
      <div>
        <h1 className='text-center'> CPPS </h1>
        <Nav tabs>
          <NavItem>
            <NavLink href='/'>
              <i className='fa fa-home mr-1'></i>
              Home
            </NavLink>
          </NavItem>

          <NavItem>
            <LinkContainer to='/coach'>
              <NavLink>Dashboard</NavLink>
            </LinkContainer>
          </NavItem>

          {isClassroom?
            <NavItem>
              <LinkContainer to={`/classroom/${classId}`}>
                <NavLink>Classroom</NavLink>
              </LinkContainer>
            </NavItem>:
            <span></span>
          }

          {/* Tools */}
          {isClassroom ? tools: <span></span>}

          <span className="ml-auto"></span>
          <NavItem>
            <NavLink href='/admin/dashboard'>
              <i className='fa fa-dashboard mr-1'></i>
              Admin
            </NavLink>
          </NavItem>
          <NavItem>
            <LinkContainer to={`/users/profile/${username}`}>
              <NavLink>
                <i className='fa fa-user mr-1'></i>
                Profile
              </NavLink>
            </LinkContainer>
          </NavItem>
          <NavItem>
            <NavLink href='/user/logout'>
              <i className='fa fa-sign-out mr-1'></i>
              Logout
            </NavLink>
          </NavItem>
        </Nav>
      </div>
    );
  }
}

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
