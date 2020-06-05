import axios from 'axios';
import YOUR_IP_ADDRESS from '../../constants'

const api = axios.create({
    baseURL:YOUR_IP_ADDRESS
})

export default api;