import React from 'react';
import { withFormik } from 'formik';
import { observer } from 'mobx-react';

import { storeApi } from '../../../services/api';
import { clog, clogData } from '../../../utils/logger';
import { validateForm } from '../../../utils/validate';
import PutOnSaleComponent, { IPutOnSale } from '../component';

interface SaleFixedPriceFormProps {
  totalSupply: number;
  tokenId: number;
  handleSetTokenData: (data: any) => void;
  handleApproveNft: () => {};
  closeModal: () => void;
}

const PutOnSaleForm: React.FC<SaleFixedPriceFormProps> = ({
  totalSupply,
  tokenId,
  handleSetTokenData,
  handleApproveNft,
  closeModal,
}) => {
  const FormWithFormik = withFormik<any, IPutOnSale>({
    enableReinitialize: true,
    mapPropsToValues: () => {
      return {
        price: '',
        currency: 'BSCGIRL',
        totalSupply,
        isLoading: false,
      };
    },
    validate: (values) => {
      const notRequired: string[] = [];
      return validateForm({ values, notRequired });
    },
    handleSubmit: async (values, { setFieldValue }) => {
      clogData('currency:', values.currency);
      setFieldValue('isLoading', true);
      try {
        handleApproveNft();
      } catch (err) {
        setFieldValue('isLoading', false);
        clogData('approveNft', err);
        return;
      }
      storeApi
        .putOnSale(tokenId, +values.price, values.currency)
        .then(({ data }) => {
          clogData('putOnSale response:', data);
          handleSetTokenData(data);
          clog('Congratulations');
          closeModal();
        })
        .catch((err) => {
          clogData('put on sale ', err);
        })
        .finally(() => {
          setFieldValue('isLoading', false);
        });
    },
    displayName: 'PutOnSale',
  })(PutOnSaleComponent);
  return <FormWithFormik />;
};

export default observer(PutOnSaleForm);
