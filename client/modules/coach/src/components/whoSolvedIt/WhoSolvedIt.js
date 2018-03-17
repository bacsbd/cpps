import React, {Component} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {
  Form, Button, Input, Label, FormGroup, Table,
} from 'reactstrap';
import qs from 'qs';
import PropTypes from 'prop-types';

export class WhoSolvedIt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawProblemList: '',
      problemList: [],
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

    const {classId} = this.props.match.params;

    if (!this.state.rawProblemList) {
      return alert('Problem List cannot be empty');
    }

    let problemList = this.state.rawProblemList;

    problemList = problemList.split('\n').filter((x)=> x);
    problemList = problemList.map((line)=>{
      const tokens = line.split(',').map((x)=>x.trim());
      const resp = {};
      if (tokens.length !== 2) {
        resp.error = 'Too few tokens';
      } else {
        resp.ojname = tokens[0];
        resp.problemId = tokens[1];
      }
      return resp;
    });

    const data = {
      problemList,
      classId,
    };
    const query = qs.stringify(data);

    try {
      let resp = await fetch(`/api/v1/users/stats/whoSolvedIt?${query}`, {
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if ( resp.status !== 200 ) {
        throw resp;
      }
      problemList = resp.data;
      this.setState({problemList});
      return;
    } catch (err) {
      console.log(err);
      if (err.status) alert(err.message);
    }
  }

  render() {
    const problemList = this.state.problemList;

    const problemListTable = (
      <div>
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>OJ Name</th>
              <th>Problem Id</th>
              <th>Solve Count</th>
              <th>Solved By</th>
            </tr>
          </thead>
          <tbody>
            { problemList.map((p, ind)=>{
              return (
                <tr key={ind}>
                  <td>{ind}</td>
                  <td>{p.ojname}</td>
                  <td>{p.problemId}</td>
                  <td>{p.solveCount}</td>
                  <td>{p.solvedBy.join(',')}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );


    return (
      <div>
        <h1 className='text-center'> Who Solved It?</h1>

        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label>Problem List</Label>
            <Input
              type='textarea'
              name='rawProblemList'
              onChange={ this.handleInputChange }
              placeholder='oj id, problem id&#x0a;uva, 100'
              value={this.state.rawProblemList}
            />
          </FormGroup>
          <Button color='primary' type='submit'>Find Out</Button>
          <LinkContainer to='/coach'>
            <Button className='ml-1'> Cancel</Button>
          </LinkContainer>
        </Form>
        <br/>
        {problemList.length? problemListTable: <div></div>}
      </div>
    );
  }
}

WhoSolvedIt.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      classId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
