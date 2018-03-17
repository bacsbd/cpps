import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Table, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, Input, Label, FormGroup,
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
    Row, Col, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import Loadable from 'react-loading-overlay';
import {error as errorNotification} from 'react-notification-system-redux';

class ProblemList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalAddList: false,
      modalLoading: false,
      listTitle: '',
    };

    this.getRows = this.getRows.bind(this);
    this.toggleModalAddList = this.toggleModalAddList.bind(this);
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
      modalLoading: true,
    });

    try {
      const data = {
        title: this.state.listTitle,
      };
      let resp = await fetch('/api/v1/problemlists', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 201) throw resp;

      const newList = resp.data;
      this.props.addListToState(newList);
      this.setState({
        modalAddList: false,
      });
    } catch (err) {
      if (err.status) {
        this.props.showNotification(errorNotification({
          title: 'Error',
          message: err.message,
          autoDismiss: 500,
        }));
      }
    } finally {
      this.setState({
        modalLoading: false,
      });
    }
  }

  toggleModalAddList() {
    this.setState({
      modalAddList: !this.state.modalAddList,
    });
  }

  getRows() {
    const problemLists = this.props.problemLists;
    const rows = problemLists.map((problemList, ind) => {
      const {_id, title} = problemList;
      return (
        <tr key={_id}>
          <td>{ind+1}</td>
          <td><Link to={`/problemList/${_id}`}>{title}</Link></td>
        </tr>
      );
    });
    return rows;
  }

  modalViewAddList() {
    return (
       <Modal isOpen={this.state.modalAddList} toggle={this.toggleModalAddList}>
         <Loadable active={this.state.modalLoading}
         spinner={true}
         text={this.state.loadingMessage || 'Please wait a moment...'}>
           <ModalHeader toggle={this.toggleModalAddList}>Add Problem List</ModalHeader>
           <ModalBody>
             <Form onSubmit={this.handleSubmit}>
               <FormGroup>
                 <Label>List Title</Label>
                 <Input type="text" name="listTitle" onChange={this.handleInputChange}/>
               </FormGroup>
             </Form>
           </ModalBody>
           <ModalFooter>
             <Button color="primary" onClick={this.handleSubmit}>Create List</Button>{' '}
             <Button color="secondary" onClick={this.toggleModalAddList}>Cancel</Button>
           </ModalFooter>
       </Loadable>
       </Modal>
   );
  }

  settingsList() {
    return (
      <UncontrolledDropdown>
       <DropdownToggle className='fa fa-lg fa-cog' color='light'></DropdownToggle>
       <DropdownMenu>
         <DropdownItem>
          <div
              className='btn btn-primary btn-block'
              onClick={this.toggleModalAddList}
            > Add List </div>
        </DropdownItem>
       </DropdownMenu>
     </UncontrolledDropdown>
   );
  }


  render() {
    const problemListTable = (
      <Table >
        <thead>
          <tr>
            <th>#</th>
            <th>List Name</th>
          </tr>
        </thead>
        <tbody>
          { this.getRows() }
        </tbody>
      </Table>
    );

    return (
      <div>
        {this.modalViewAddList()}
        <Row>
          <Col>
            <h1>Problem Lists</h1>
          </Col>
          <Col className='text-right'>
            {this.settingsList()}
          </Col>
        </Row>

        <Row>
          <Col>
            {problemListTable}
          </Col>
        </Row>
      </div>
    );
  }
}

/** PropTypes */
ProblemList.propTypes = {
  problemLists: PropTypes.array.isRequired,
};

export default ProblemList;
