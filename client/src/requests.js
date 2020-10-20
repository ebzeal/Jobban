import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
import gql from 'graphql-tag';
import {getAccessToken, isLoggedIn} from './auth';

const endpointURL = 'http://localhost:9000/graphql';

const client = new ApolloClient({
  link: new HttpLink({uri: endpointURL}),
  cache: new InMemoryCache()
})


async function graphQLRequest(query, variables={}) {
  // try {
    const request = {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({ query, variables })
    };
    if(isLoggedIn()) request.headers['authorization'] = 'Bearer ' + getAccessToken();
  const response = await fetch(endpointURL, request);
  const responseBody = await response.json();
  if(responseBody.errors){
    const message = responseBody.errors.map(error=>error.message).join('\n')
    throw new Error(message)
  }
  return responseBody.data   
// } catch (error) {
//     console.log("graphQLRequest -> error", error)
//     throw new Error(error)
// }
}

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
  const {data} = await client.query({query})
      return data.jobs
}

export async function loadJob(id) {
  const query = gql`
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
  const {data} = await client.query({query, variables: {id}})
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
    }
  }`
  const {data} = await client.mutate({mutation, variables: {input}})
  return data.job
}
