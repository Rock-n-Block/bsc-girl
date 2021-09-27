import React, { useState } from 'react';
import { Form } from 'antd';
import { FormikProps } from 'formik';
import { observer } from 'mobx-react';

import ArrowGradient from '../../../assets/img/icons/arrow-gradient.svg';
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
    const [isCheckoutOpen, setCheckout] = useState<boolean>(false);

    const onSubmit = () => {
      handleSubmit();
    };

    const getUsd = (): any => {
      let result = 0;
      ratesApi
        .getRates()
        .then((data: any) => {
          data.forEach((item: any) => {
            if (item.symbol === values.currency.toLowerCase()) result = +values.price * item.rate;
          });
          return result;
        })
        .catch((err: any) => {
          clogData('getRates error:', err);
        });
    };
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
              <div className="gradient-button">
                <div
                  className="checkout"
                  role="button"
                  tabIndex={0}
                  onClick={() => setCheckout(!isCheckoutOpen)}
                  onKeyPress={() => {}}
                >
                  <div className="checkout__text">{values.currency}</div>
                  <div className="checkout__arrow">
                    <img
                      className={isCheckoutOpen ? 'checkout__arrow__up' : ''}
                      src={ArrowGradient}
                      alt="gradient arrow"
                    />
                  </div>
                  <div className={isCheckoutOpen ? 'open' : 'close'}>
                    <div
                      className="open__item"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        values.currency = 'BSCGIRLMOON';
                      }}
                      onKeyPress={() => setCheckout(false)}
                    >
                      BSCGIRLMOON
                    </div>
                    <div
                      className="open__item"
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        values.currency = 'BSCGIRL';
                      }}
                      onKeyPress={() => setCheckout(false)}
                    >
                      BSCGIRL
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form.Item>
        <section className="put-on-sale-form__fee">
          <p>Service fee 3%</p>
          <p className="put-on-sale-form__fee__result">
            You will receive&nbsp;
            <span className="red">
              {values.price}&nbsp;{values.currency}&nbsp;
            </span>
            {`$${getUsd() || '0'}`}
          </p>
        </section>
        <div className="put-on-sale-form__submit">
          <button type="button" onClick={onSubmit} className="put-on-sale-form__submit-btn">
            Put on sale
          </button>
        </div>
      </Form>
    );
  },
);

export default PutOnSaleComponent;
