import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import {getAccessToken, isLoggedIn} from './auth';

const endpointURL = 'http://localhost:9000/graphql';

const authLink = new ApolloLink((operation, forward)=> {
    if(isLoggedIn()) {
    operation.setContext({
      headers: {
        'authorization': 'Bearer ' + getAccessToken()
      }
    })
  }
    return forward(operation);
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({uri: endpointURL})]),
  cache: new InMemoryCache()
});


export async function loadJobs() {
  const query= gql`
      {
        jobs {
          id
          title
          company {
            id
            name
          }
        }
      }
      `
  const {data} = await client.query({query, fetchPolicy:"no-cache"})
      return data.jobs
}

const jobQuery = gql`
    query Jobquery($id: ID!) {
      job(id:$id){
        id
        title
        company {
          id
          name
        }
        description
      }
    }
    `

export async function loadJob(id) {
  const {data} = await client.query({query:jobQuery, variables: {id}})
  return data.job
}

export async function loadCompany(id) {
  const query =  gql` query Companyquery($id: ID!) {
    company(id:$id){
        id
        name
        description
        jobs {
          id
          title
        }
    }
  }`
  const {data} = await client.query({query, variables:{id}});
  return data.company
}

export async function createJob(input) {
  const mutation =  gql`mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input){
      id
        title
        company {
          id
          name
        }
        description
    }
  }`
  const {data} = await client.mutate({
    mutation,
    variables: {input},
    update: (cache, mutationResult) => {
    console.log("createJob -> mutationResult", mutationResult);
      cache.writeQuery({
        query: jobQuery, 
        variables:{id: mutationResult.data.job.id},
        data: mutationResult.data
      })
    }
})
  return data.job
}
