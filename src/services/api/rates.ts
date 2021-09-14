import axios from '../../core/axios';

export default {
  getRates: (): Promise<any> => axios.get('/rates/'),
};
