import axios from '../../core/axios';

export default {
  createToken: (data: any): Promise<any> => axios.post('store/create_token/', data),
  createCollection: (data: any): Promise<any> => axios.post('store/create_collection/', data),
  saveToken: (data: any): Promise<any> => axios.post('store/save_token/', data),
  saveCollection: (data: any): Promise<any> => axios.post('store/save_collection/', data),
  getExplore: (page: number, filter: string, sort: string): Promise<any> =>
    axios.get(`store/hot/${page}/?sort=${sort}${filter !== 'all' ? `&tag=${filter}` : ''}`),
  getTags: (): Promise<any> => axios.get(`store/tags/`),
  getCollections: (): Promise<any> => axios.get('store/hot_collections/'),
  getHotBids: (): Promise<any> => axios.get('store/hot_bids/'),
  getCollectionById: (id: number | string, page: number): Promise<any> =>
    axios.get(`store/collection/${id}/${page}/`),
  getToken: (id: number | string): Promise<any> => axios.get(`store/${id}/`),
  buyToken: (
    id: number | string,
    amount: number,
    tokenAddress: string,
    sellerId?: number,
  ): Promise<any> => {
    const data: any = {
      id,
      erc20Address: tokenAddress,
      tokenAmount: amount,
    };
    if (sellerId) {
      data.sellerId = sellerId;
    }
    return axios.post(`/store/buy/${localStorage.dds_token}/`, data);
  },
  getLiked: (address: string, page: number): Promise<any> =>
    axios.get(`store/liked/${address}/${page}/`),
  getCreated: (address: string, page: number): Promise<any> =>
    axios.get(`store/created/${address}/${page}/`),
  getCollectibles: (address: string, page: number): Promise<any> =>
    axios.get(`store/owned/${address}/${page}/`),
  getUserCollections: (address: string, page: number): Promise<any> =>
    axios.get(`store/collections/${address}/${page}/`),
  getSearchResults: (data: { text: string; page: number }, query: string): Promise<any> =>
    axios.post(
      `store/search/${query === 'items' ? '' : '?type='}${query === 'items' ? '' : query}`,
      {
        text: data.text,
        page: data.page,
      },
    ),
  setCollectionCover: (file: Blob, id: string): Promise<any> => {
    const data = new FormData();
    data.append('id', id);
    data.append('auth_token', localStorage.bsc_token);
    data.append('cover', file);
    return axios.post('/store/set_cover/', data);
  },
  createBid: (id: string | number, amount: string, quantity: string): Promise<any> =>
    axios.post('/store/bids/make_bid/', {
      auth_token: localStorage.dds_token,
      token_id: id,
      amount: +amount,
      quantity: +quantity,
    }),
  verificateBet: (id: number): Promise<any> => axios.get(`/store/verificate_bet/${id}/`),
  endAuction: (id: number): Promise<any> =>
    axios.post(`/store/end_auction/${id}/`, {
      token: localStorage.dds_token,
    }),
  putOnSale: (
    tokenId: number,
    price?: number | null,
    minimalBid?: number | null,
    remove?: boolean,
  ): Promise<any> => {
    const data: any = {
      AuthToken: localStorage.dds_token,
      selling: !remove,
      currency: 'ETH',
      price: null,
      minimal_bid: null,
    };
    if (price) {
      data.price = price;
    }
    if (minimalBid) {
      data.minimal_bid = minimalBid;
    }

    return axios.patch(`/store/${tokenId}/`, data);
  },
  reportPage: (page: string, reportMessage: string, token: string): Promise<any> =>
    axios.post('/store/report/', { page, reportMessage, token }),
  support: (email: string, message: string, token: string): Promise<any> =>
    axios.post('/store/support/', { email, message, token }),
};
