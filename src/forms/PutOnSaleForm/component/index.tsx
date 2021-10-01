import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import BigNumber from 'bignumber.js/bignumber';
import { FormikProps } from 'formik';
import { observer } from 'mobx-react';

import { InputNumber } from '../../../components';
import { ratesApi } from '../../../services/api';
import { clogData } from '../../../utils/logger';
import { validateField } from '../../../utils/validate';

export interface IPutOnSale {
  price: string;
  currency: string;
  totalSupply: number;
  isLoading: boolean;
}

const PutOnSaleComponent: React.FC<FormikProps<IPutOnSale>> = observer(
  ({ handleChange, handleBlur, values, handleSubmit, touched, errors }) => {
    const [rate, setRate] = useState(0);

    const onSubmit = () => {
      handleSubmit();
    };

    useEffect(() => {
      let result = 0;
      ratesApi
        .getRates()
        .then(({ data }) => {
          if (values.currency === 'BSCGIRLMOON') result = data[0].rate;
          else if (values.currency === 'BSCGIRL') result = data[1].rate;
          else result = data[2].rate;
          setRate(result);
        })
        .catch((err: any) => {
          clogData('getRates error:', err);
        });
    }, [values.currency]);

    return (
      <Form name="put-on-sale" className="put-on-sale-form" layout="vertical">
        <Form.Item
          name="price"
          initialValue={values.price}
          label={<span className="label">Enter price</span>}
          validateStatus={validateField('price', touched, errors)}
          help={!touched.price ? '' : errors.price}
        >
          <div className="gradient-box">
            <div className="put-on-sale-form__item">
              <InputNumber
                id="price"
                value={values.price}
                className="input"
                size="large"
                placeholder="10"
                onChange={handleChange}
                onBlur={handleBlur}
                positiveOnly
              />
              <div className="checkout__text">{values.currency}</div>
            </div>
          </div>
        </Form.Item>
        <section className="put-on-sale-form__fee">
          <p>Service fee 3%</p>
          <p className="put-on-sale-form__fee__result">
            You will receive&nbsp;
            <span className="red">
              {new BigNumber(values.price)
                .times(100 - 3)
                .dividedBy(100)
                .toString(10) ?? 0}
              &nbsp;{values.currency}
              &nbsp;
            </span>
            {`$${
              new BigNumber(values.price)
                .times(100 - 3)
                .dividedBy(100)
                .times(rate)
                .toFixed(2) ?? 0
            }`}
          </p>
        </section>
        <div className="put-on-sale-form__submit">
          <button type="button" onClick={onSubmit} className="put-on-sale-form__submit-btn">
            {values.isLoading ? 'In process...' : 'Put on sale'}
          </button>
        </div>
      </Form>
    );
  },
);

export default PutOnSaleComponent;
