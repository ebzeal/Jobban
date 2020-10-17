const db = require('./db');

const Query = {
  company:(root, {id}) => db.companies.get(id),
  job:(root, args) => db.jobs.get(args.id),
  jobs: ()=> db.jobs.list()
};

const Job = {
  company: (job) => db.companies.get(job.companyId)
}

module.exports = {Query, Job};
