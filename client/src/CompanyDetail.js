import React, { Component } from 'react';
import { JobList } from './JobList';
import {loadCompany} from './requests';

export class CompanyDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {company: null};
  }

  async componentDidMount() {
    const {companyId} = this.props.match.params;
    const company = await loadCompany(companyId);
    // console.log("CompanyDetail -> componentDidMount -> company", company)
    this.setState({company})
  }

  render() {
    const {company} = this.state;
    // console.log("CompanyDetail -> render -> company2", company)
    return (
      <div>
        <h1 className="title">{company?.name}</h1>
        <div className="box">{company?.description}</div>
        <h5 className="title is-5">Jobs at {company?.name}</h5>
       {company?.jobs?.length > 0 ? <JobList jobs={company?.jobs} /> : null}
      </div>
    );
  }
}
