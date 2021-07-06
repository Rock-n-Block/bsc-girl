import axios from 'axios';
import config from '../../config';

export default class BackendService {

  constructor() {
    axios.defaults.baseURL = config.serverDomain();
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  getDexList = async () => {
    try {
      return axios.get('/dex/')
    } catch (e) {
      console.error(e);
    }
  }

  getDex = async () => {
    try {
      return axios.get(`/networks/`)
    } catch (e) {
      console.error(e);
    }
  }

  getGas = async ({network}) => {
    try {
      return axios.get(`/gas/${network}/`)
    } catch (e) {
      console.error(e);
    }
  }

}
