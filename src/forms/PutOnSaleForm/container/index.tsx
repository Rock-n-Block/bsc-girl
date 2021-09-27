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
  handleApproveNft: (currency: string) => {};
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
      setFieldValue('isLoading', true);
      try {
        handleApproveNft(values.currency);
      } catch (err) {
        setFieldValue('isLoading', false);
        return;
      }
      storeApi
        .putOnSale(tokenId, +values.price)
        .then(({ data }) => {
          handleSetTokenData(data);
          clog('Congratulations');
          closeModal();
        })
        .catch((err) => {
          // modals.info.setMsg('Something went wrong', 'error');
          clogData('put on sale ', err);
        })
        .finally(() => {
          setFieldValue('isLoading', false);
          // modals.putOnSale.close();
        });
    },
    displayName: 'PutOnSale',
  })(PutOnSaleComponent);
  return <FormWithFormik />;
};

export default observer(PutOnSaleForm);
