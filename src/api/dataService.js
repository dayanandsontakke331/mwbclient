import axios from 'axios'

const httpPost = async (path, body, headers) => {
  console.log("process.env.REACT_APP_API_BASE_URL", process.env.REACT_APP_API_BASE_URL)
  return await axios
    .post(process.env.REACT_APP_API_BASE_URL + path, body)
    .then(async response => {
      if (response.data.data) {
        return { data: response.data.data, error: null }
      } else {
        return { data: null, error: response.data.errormsg }
      }
    })
    .catch(err => {
      return { data: null, error: err.message }
    })
}

const httpGet = async (path, headers) => {
  return axios
    .get(path)
    .then(async response => {
      return { data: response.data, error: null }
    })
    .catch(e => {
      return { data: null, error: e.message }
    })
}

export { httpPost, httpGet }
