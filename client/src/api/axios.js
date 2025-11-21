import axios from 'axios'

console.log("BASE URL:", import.meta.env.VITE_BASE_URL);

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
})

export default instance