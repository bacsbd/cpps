import React, {Component} from 'react';
import {UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem}
  from 'reactstrap';
import {Redirect} from 'react-router-dom';

export class SettingsList extends Component {
  constructor (props) {
    super(props);
    this.state = {
      redirectDashboard: false,
    };
  }

  async deleteProblemList() {
    const {problemListId} = this.props.match.params;
    const {setLoadingState, handleError} = this.props;

    try {
      setLoadingState(true, 'Deleting the entire list...');

      let resp = await fetch(`/api/v1/problemlists/${problemListId}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 201) throw resp;
      this.setState({
        redirectDashboard: true,
      });
    } catch (err) {
      handleError(err);
    } finally {
      if (!this.state.redirectDashboard) {
        setLoadingState(false);
      }
    }
  }

  render() {
    const {changeView} = this.props;
    return (
      <UncontrolledDropdown>
        {this.state.redirectDashboard && (<Redirect to={'/coach'}/>)}
       <DropdownToggle className='fa fa-lg fa-cog' color='light'></DropdownToggle>
       <DropdownMenu>
         <DropdownItem>
          <div
              className='btn btn-primary btn-block'
              onClick={()=>changeView('addProblem')}
            > Add Problem </div>
        </DropdownItem>
        <DropdownItem>
         <div
             className='btn btn-danger btn-block'
             onClick={()=>this.deleteProblemList()}
           > Delete List </div>
       </DropdownItem>
       </DropdownMenu>
     </UncontrolledDropdown>
   );
  }
}
