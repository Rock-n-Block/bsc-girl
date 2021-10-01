import { applySnapshot, getSnapshot, types } from 'mobx-state-tree';

const CheckAvailability = types
  .model({
    isAvailable: types.optional(types.boolean, true),
    user: types.model({
      name: types.optional(types.string, ''),
      avatar: types.optional(types.string, ''),
      id: types.optional(types.number, 0),
    }),
    amount: types.optional(types.number, 0),
  })
  .views((self) => ({
    get getIsOpen() {
      return !!(self.user.name && self.user.id && self.amount);
    },
  }))
  .actions((self) => {
    let initialState = {};
    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      close: () => {
        applySnapshot(self, initialState);
      },
      open: (data: any) => {
        applySnapshot(self, data);
      },
    };
  });

const MultiBuyModal = types
  .model({
    isOpen: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    open() {
      self.isOpen = true;
    },
    close() {
      self.isOpen = false;
    },
  }));

const CheckoutModal = types
  .model({
    token: types.model({
      name: types.optional(types.string, ''),
      available: types.optional(types.number, 0),
    }),
    collectionName: types.optional(types.string, ''),
    sellerId: types.optional(types.string, ''),
  })
  .views((self) => ({
    get getIsOpen() {
      return !!(self.token.name && self.token.available && self.collectionName && self.sellerId);
    },
  }))
  .actions((self) => {
    let initialState = {};
    return {
      afterCreate: () => {
        initialState = getSnapshot(self);
      },
      close: () => {
        applySnapshot(self, initialState);
      },
      open: (data: any) => {
        applySnapshot(self, data);
      },
    };
  });

const PutOnSaleModal = types
  .model({
    isOpen: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    open() {
      self.isOpen = true;
    },
    close() {
      self.isOpen = false;
    },
  }));

const FixedPriceModal = types
  .model({
    isOpen: types.optional(types.boolean, false),
    fee: types.optional(types.number, 0),
    totalSupply: types.optional(types.number, 1),
  })
  .actions((self) => ({
    open() {
      self.isOpen = true;
    },
    close() {
      self.isOpen = false;
    },
    setProps(fee: number, totalSupply: number) {
      self.fee = fee;
      self.totalSupply = totalSupply;
    },
  }));

const CreateModal = types
  .model({
    isOpen: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    open() {
      self.isOpen = true;
    },
    close() {
      self.isOpen = false;
    },
  }));

// const VerifyModal = types
//   .model({
//     isOpen: types.boolean,
//   })
//   .actions((self) => ({
//     open() {
//       self.isOpen = true;
//     },
//     close() {
//       self.isOpen = false;
//     },
//   }));

const ErrorModal = types
  .model({
    errMsg: types.optional(types.string, ''),
  })
  .actions((self) => ({
    setErr(err: string) {
      self.errMsg = err;
    },
    close() {
      self.errMsg = '';
    },
  }));

const InfoModal = types
  .model({
    msg: types.optional(types.string, ''),
    type: types.optional(types.string, ''),
  })
  .actions((self) => ({
    setMsg(msg: string, type: 'success' | 'error') {
      self.msg = msg;
      self.type = type;
    },
    close() {
      self.msg = '';
      self.type = '';
    },
  }));

export const Modals = types
  .model({
    error: ErrorModal,
    info: InfoModal,
    putOnSale: PutOnSaleModal,
    fixedPrice: FixedPriceModal,
    checkout: CheckoutModal,
    multibuy: MultiBuyModal,
    checkAvailability: CheckAvailability,
    createModal: CreateModal,
  })
  .actions((self) => ({
    closeAll() {
      self.putOnSale.close();
      self.fixedPrice.close();
      self.checkout.close();
      self.multibuy.close();
      self.checkAvailability.close();
      self.createModal.close();
    },
  }));