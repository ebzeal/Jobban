import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost';
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
  const query= `
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
      const data = await graphQLRequest(query)
      return data.jobs
}

export async function loadJob(id) {
  const query = `
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
  }`
  const data = await graphQLRequest(query, {id})
  return data.job
}

export async function loadCompany(id) {
  const query =  ` query Companyquery($id: ID!) {
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
  const data = await graphQLRequest(query, {id})
  return data.company
}

export async function createJob(input) {
  const mutation =  `mutation CreateJob($input: CreateJobInput) {
    job: createJob(input: $input){
      id
      title
      company {
        id
        name
      }
    }
  }`
  const data = await graphQLRequest(mutation, {input})
  return data.job
}
