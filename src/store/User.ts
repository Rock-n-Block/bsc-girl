import { applySnapshot, flow, types } from 'mobx-state-tree';

import { userApi } from '../services/api';
import { clog } from '../utils/logger';

const Follower = types.model({
  avatar: types.optional(types.string, ''),
  name: types.optional(types.string, ''),
  his_followers: types.optional(types.number, 0),
  id: types.optional(types.union(types.number, types.string, types.null), null),
});

export const Balance = types.optional(types.string, '0');

export const User = types
  .model({
    address: types.string,
    avatar: types.optional(types.maybeNull(types.string), null),
    bio: types.optional(types.maybeNull(types.string), null),
    custom_url: types.optional(types.maybeNull(types.string), null),
    display_name: types.optional(types.maybeNull(types.string), null),
    followers: types.optional(types.array(Follower), []),
    followers_count: types.optional(types.maybeNull(types.number), null),
    follows: types.optional(types.array(Follower), []),
    follows_count: types.optional(types.maybeNull(types.number), null),
    id: types.optional(types.union(types.number, types.string, types.null), null),
    cover: types.optional(types.maybeNull(types.string), null),
    is_verificated: types.boolean,
    likes: types.optional(types.number, 0),
    site: types.optional(types.maybeNull(types.string), null),
    twitter: types.optional(types.maybeNull(types.string), null),
    instagram: types.optional(types.maybeNull(types.string), null),
    facebook: types.optional(types.maybeNull(types.string), null),
    balance: types.optional(Balance, '0'),
  })
  .views((self) => ({
    isLiked() {
      //  return !!self.likes.includes(id);
      return self.likes > 0;
    },
  }))
  .actions((self) => {
    const setAddress = (addr: string) => {
      self.address = addr;
    };
    const setBalance = (value: string, currency: string) => {
      if (currency === ('BSCGIRL' || 'BSCGIRLMOON')) self.balance = value;
    };
    const addLike = () => {
      // self.likes.push(tokenId);
      self.likes += 1;
    };
    const removeLike = () => {
      // self.likes.replace(self.likes.filter((like) => like !== tokenId));
      self.likes -= 1;
    };
    const setCover = (img: string) => {
      self.cover = img;
    };
    const update = (userData: any) => {
      applySnapshot(self, { ...userData, balance: self.balance });
    };
    const disconnect = () => {
      self.address = '';
      self.id = '';
      delete localStorage.bsc_token;
      delete localStorage.walletconnect;
    };
    const getMe = flow(function* getMe() {
      try {
        const { data } = yield userApi.getMe();

        update(data);
      } catch (err: any) {
        clog(err);
        disconnect();
      }
    });

    return {
      setAddress,
      setBalance,
      setCover,
      addLike,
      removeLike,
      update,
      getMe,
      disconnect,
    };
  });
