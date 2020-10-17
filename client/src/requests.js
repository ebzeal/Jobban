const endpointURL = 'http://localhost:9000/graphql';


async function graphQLRequest(query, variables={}) {
  // try {
  const response = await fetch(endpointURL, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({ query, variables })
  });
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
