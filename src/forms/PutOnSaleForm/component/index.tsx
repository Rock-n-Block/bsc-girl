import React, { useState } from 'react';
import { Form } from 'antd';
import { FormikProps } from 'formik';
import { observer } from 'mobx-react';

import ArrowGradient from '../../../assets/img/icons/arrow-gradient.svg';
import CloseImg from '../../../assets/img/icons/close-icon.svg';
import { InputNumber } from '../../../components';
import { ratesApi } from '../../../services/api';
import { useMst } from '../../../store/store';
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
    const { modals } = useMst();
    const [currency, setCurrency] = useState('BSCGIRL');
    const [isCheckoutOpen, setCheckout] = useState<boolean>(false);
    const onSubmit = () => {
      handleSubmit();
    };
    const onCancel = () => {
      modals.fixedPrice.close();
    };
    const getUsd = (): any => {
      let result = 0;
      ratesApi
        .getRates()
        .then((data: any) => {
          data.forEach((item: any) => {
            if (item.symbol === currency.toLowerCase()) result = +values.price * item.rate;
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
          className="put-on-sale-form-item"
          initialValue={values.price}
          label={<span className="label">Enter price</span>}
          validateStatus={validateField('price', touched, errors)}
          help={!touched.price ? '' : errors.price}
        >
          <div className="gradient-button">
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
              <div className="checkout">
                <div className="checkout_text">{currency}</div>
                <div
                  className="checkout_arrow"
                  role="button"
                  tabIndex={0}
                  onClick={() => setCheckout(!isCheckoutOpen)}
                  onKeyPress={() => {}}
                >
                  <img
                    className={isCheckoutOpen ? 'checkout_arrow_up' : ''}
                    src={ArrowGradient}
                    alt="gradient arrow"
                  />
                </div>
              </div>
            </div>
            <div className={isCheckoutOpen ? 'open' : 'close'}>
              <div
                className="open_item"
                role="button"
                tabIndex={0}
                onClick={() => setCurrency('BSCGIRLMOON')}
                onKeyPress={() => setCheckout(false)}
              >
                BSCGIRLMOON
              </div>
              <div
                className="open_item"
                role="button"
                tabIndex={0}
                onClick={() => setCurrency('BNB')}
                onKeyPress={() => setCheckout(false)}
              >
                BNB
              </div>
            </div>
          </div>
        </Form.Item>
        <section className="put-on-sale-form__fee">
          <p>
            Service fee <span className="text-pink-l">2.5%</span>
          </p>
          <p className="put-on-sale-form__fee__result">
            You will receive
            <span className="text-pink-l">
              {values.price} {values.currency}
            </span>
            {`$${getUsd()}`}
          </p>
        </section>
        <div className="put-on-sale-form__submit">
          <button type="button" onClick={onSubmit} className="put-on-sale-form__submit-btn">
            Put on sale
          </button>
          <button type="button" onClick={onCancel} className="put-on-sale-form__close">
            <img src={CloseImg} alt="close" />
          </button>
        </div>
      </Form>
    );
  },
);

export default PutOnSaleComponent;
