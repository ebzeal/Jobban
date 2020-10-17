import React, { Component } from 'react';
import {loadCompany} from './requests'

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
      </div>
    );
  }
}
