import { applySnapshot, types } from 'mobx-state-tree';

const Follower = types.model({
  avatar: types.optional(types.string, ''),
  name: types.optional(types.string, ''),
  his_followers: types.optional(types.number, 0),
  id: types.optional(types.union(types.number, types.string, types.null), null),
});

export const Balance = types.model({
  eth: types.optional(types.string, '0'),
  bnb: types.optional(types.string, '0'),
  matic: types.optional(types.string, '0'),
});

export const User = types
  .model({
    address: types.string,
    avatar: types.optional(types.maybeNull(types.string), null),
    bio: types.optional(types.maybeNull(types.string), null),
    custom_url: types.optional(types.maybeNull(types.string), null),
    name: types.optional(types.maybeNull(types.string), null),
    followers: types.optional(types.array(Follower), []),
    followers_count: types.optional(types.maybeNull(types.number), null),
    follows: types.optional(types.array(Follower), []),
    follows_count: types.optional(types.maybeNull(types.number), null),
    id: types.optional(types.union(types.number, types.string, types.null), null),
    cover: types.optional(types.maybeNull(types.string), null),
    is_verificated: types.boolean,
    likes: types.optional(types.array(types.number), []),
    site: types.optional(types.maybeNull(types.string), null),
    twitter: types.optional(types.maybeNull(types.string), null),
    instagram: types.optional(types.maybeNull(types.string), null),
    facebook: types.optional(types.maybeNull(types.string), null),
    balance: types.optional(Balance, {}),
  })
  .views((self) => ({
    isLiked(id: number) {
      return !!self.likes.includes(id);
    },
  }))
  .actions((self) => {
    const setAddress = (addr: string) => {
      self.address = addr;
    };
    const setBalance = (value: string, currency: 'eth' | 'bnb' | 'matic') => {
      if (currency === 'eth') self.balance.eth = value;
      if (currency === 'bnb') self.balance.bnb = value;
      if (currency === 'matic') self.balance.matic = value;
    };
    const addLike = (tokenId: number) => {
      self.likes.push(tokenId);
    };
    const removeLike = (tokenId: number) => {
      self.likes.replace(self.likes.filter((like) => like !== tokenId));
    };
    const setCover = (img: string) => {
      self.cover = img;
    };
    const update = (userData: any) => {
      applySnapshot(self, userData);
    };
    const disconnect = () => {
      self.address = '';
      self.id = '';
    };

    return {
      setAddress,
      setBalance,
      setCover,
      addLike,
      removeLike,
      update,
      disconnect,
    };
  });

