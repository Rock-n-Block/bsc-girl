import axios from '../../core/axios';

export default {
  getActivity: (address: string, page: string | number, query: string): Promise<any> =>
    axios.post(`activity/${page}/${query === 'all' ? '' : `?type=${query}`}`, { address }),
};
