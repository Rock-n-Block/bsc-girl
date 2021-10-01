import React from 'react';
import { Form } from 'antd';
import { FormikProps } from 'formik';

import { InputNumber } from '../../../components';
import { validateField } from '../../../utils/validate';

export interface ICheckout {
  quantity: number;
  available: number;
}

const Checkout: React.FC<FormikProps<ICheckout> | any> = ({
  handleChange,
  handleBlur,
  values,
  handleSubmit,
  touched,
  errors,
  isLoading,
}) => {
  const onSubmit = () => {
    handleSubmit();
  };
  return (
    <Form name="form-auction" className="checkout__form" layout="vertical">
      <Form.Item
        name="quantity"
        className="checkout__form__item"
        initialValue={values.quantity}
        validateStatus={validateField('quantity', touched, errors)}
        help={!touched.quantity ? '' : errors.quantity}
        label={
          <span className="checkout__form__item__label">
            Enter quantity ({values.available} available)
          </span>
        }
      >
        <div className="gradient-box">
          <div className="checkout__form__item__input">
            <InputNumber
              id="quantity"
              value={values.quantity}
              size="large"
              placeholder="1"
              onChange={handleChange}
              onBlur={handleBlur}
              integer
              positiveOnly
            />
          </div>
        </div>
      </Form.Item>
      <button
        type="button"
        disabled={values.quantity > values.available || !values.quantity}
        onClick={onSubmit}
        className="checkout__form__submit gradient-button"
      >
        {isLoading ? 'In progress...' : 'Proceed to payment'}
      </button>
    </Form>
  );
};

export default Checkout;
