import axios from '../../core/axios';

interface ILogin {
  address: string;
  signedMsg: string;
  msg: string;
}

export default {
  login: (data: ILogin): Promise<any> =>
    axios.post('account/metamask_login/', {
      address: data.address,
      signed_msg: data.signedMsg,
      msg: data.msg,
    }),
  getMsg: (): Promise<any> => axios.get('account/get_metamask_message/'),
  getSingleCollections: (address?: string): Promise<any> =>
    axios.get(`account/self/${address}/collections/`),
  getMe: (): Promise<any> => axios.get(`account/self/`),
  update: (data: any): Promise<any> => axios.patch(`account/self/`, data),
  follow: (data: { id: number | undefined }): Promise<any> =>
    axios.post(`account/self/follow/`, data),
  like: (data: { id: number | undefined }): Promise<any> => axios.post(`account/self/like/`, data),
  verifyMe: (data: any): Promise<any> => axios.post('/account/verification/', data),
  setUserCover: (file: Blob): Promise<any> => {
    const data = new FormData();
    data.append('auth_token', localStorage.bsc_token);
    data.append('cover', file);
    return axios.post('/account/set_user_cover/', data);
  },
  getRandomCover: (): Promise<any> => axios.get('/account/get_random_cover/'),
  unfollow: (data: { id: number | undefined }): Promise<any> =>
    axios.post(`account/self/unfollow/`, data),
  getUser: (data: { id: string }): Promise<any> => axios.get(`account/${data.id}/`),
  getFollowing: (address: string, page: number): Promise<any> =>
    axios.get(`account/following/${address}/${page}/`),
  getFollowers: (address: string, page: number): Promise<any> =>
    axios.get(`account/followers/${address}/${page}/`),
};
