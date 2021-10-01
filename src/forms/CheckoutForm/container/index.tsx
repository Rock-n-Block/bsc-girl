import React from 'react';
import { withFormik } from 'formik';
import { observer } from 'mobx-react';

import { validateForm } from '../../../utils/validate';
import Checkout, { ICheckout } from '../component';

interface CheckoutFormProps {
  available: number;
  handleBuy: (quantity: number) => {};
  isLoading: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ available, handleBuy, isLoading }) => {
  const FormWithFormik = withFormik<any, ICheckout>({
    enableReinitialize: true,
    mapPropsToValues: () => {
      return {
        quantity: 1,
        available: available || 0,
      };
    },
    validate: (values) => {
      return validateForm({ values, notRequired: [] });
    },
    handleSubmit: (values) => {
      handleBuy(values.quantity);
    },
    displayName: 'Checkout',
  })(Checkout);
  return <FormWithFormik isLoading={isLoading} />;
};

export default observer(CheckoutForm);
