const db = require('./db');

const Query = {
  company:(root, {id}) => db.companies.get(id),
  job:(root, args) => db.jobs.get(args.id),
  jobs: ()=> db.jobs.list()
};

const Mutation = {
  createJob: (root, {title, description, companyId}) => {
    return db.jobs.create({title, description, companyId});
  }
}

const Job = {
  company: (job) => db.companies.get(job.companyId)
}

const Company = {
  jobs:(company) => db.jobs.list().filter(job=>job.companyId === company.id)
}

module.exports = {Query, Mutation, Job, Company};
