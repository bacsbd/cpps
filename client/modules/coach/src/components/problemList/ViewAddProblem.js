import React, {Component} from 'react';
import {Form, FormGroup, Input, Label, Button} from 'reactstrap';
import {success} from 'react-notification-system-redux';

export class ViewAddProblem extends Component {

  constructor (props) {
    super(props);

    this.state = {
      ojname: '',
      problemId: '',
    }

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

    const {problemListId} = this.props.match.params;
    const {setLoadingState, addProblem, handleError} = this.props;

    setLoadingState(true, 'Adding Problem to List...');

    const {ojname, problemId} = this.state;
    if (!ojname || !problemId) return;

    try {
      let resp = await fetch(`/api/v1/problembanks/${ojname}/${problemId}`, {
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) throw resp;

      const data = resp.data;
      resp = await fetch(`/api/v1/problemlists/${problemListId}/problems`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 201) throw resp;

      this.setState({
        problemId: '',
      });
      addProblem(resp.data);

      this.props.showNotification(success({
        title: 'Success',
        message: `Problem added: ${ojname}:${problemId}`,
      }));
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingState(false);
    }
  }

  render() {
    const {ojnames} = this.props;
    const ojnamesOnly = ojnames.map((x)=>x.name);
    const ojnamesMap = {};
    ojnames.forEach((x)=>ojnamesMap[x.name] = x);

    const {changeView} = this.props;
    return (
      <div className="text-center">
        <h1>Add Problem View</h1>
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>OJ Name</Label>
            <Input type='select' name="ojname" onChange={this.handleInputChange}
                value={this.state.ojname}
              >
              <option value='' disabled> Select a OJ</option>
              {ojnamesOnly.map((x)=><option key={x} value={x}>{x}</option>)}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Problem ID {this.state.ojname
              ? `(Match Regex: "${ojnamesMap[this.state.ojname].format}")`: ''}</Label>
            <Input name="problemId" onChange={this.handleInputChange} value={this.state.problemId}
              pattern={this.state.ojname?ojnamesMap[this.state.ojname].format:''}
            />
          </FormGroup>
          <Button type="submit" color="primary">Add</Button>{ ' ' }
          <Button color="secondary" onClick={()=>changeView('normal')}>Cancel</Button>
        </Form>
      </div>
    );
  }
}
