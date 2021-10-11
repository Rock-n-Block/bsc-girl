import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import BigNumber from 'bignumber.js/bignumber';
import { FieldArray, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';

import DefaultImg from '../../../assets/img/card-default.png';
import ArrowGradient from '../../../assets/img/icons/arrow-gradient.svg';
import { CreateModal, InputNumber, TokenCard, UploaderButton } from '../../../components';
import { ratesApi } from '../../../services/api';
import { useMst } from '../../../store/store';
import { clogData } from '../../../utils/logger';
import { validateField } from '../../../utils/validate';

interface IProperties {
  size: string | number;
  amount: string | number;
}

interface IRate {
  rate: string;
  symbol: string;
  image: string;
}

export interface ICreateForm {
  img: any;
  preview: string;
  price: number | string;
  currency: string;
  selling: boolean;
  format: string;
  tokenName: string;
  tokenDescription: string;
  tokenRoyalties: number | string;
  numberOfCopies: number | string;
  tokenProperties: IProperties[];
  isSingle?: boolean;
}

const { TextArea } = Input;

const CreateComponent: React.FC<FormikProps<ICreateForm> & ICreateForm> = observer(
  ({ setFieldValue, values, touched, errors, handleBlur, handleChange, isSingle = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isActive, setActive] = useState(values.selling);
    const [rate, setRate] = useState(1);
    const [bscRate, setBscRate] = useState([] as IRate[]);
    const { modals, user } = useMst();
    const serviceFee = 3;

    const onSubmit = () => {
      modals.createModal.open();
      setModalOpen(true);
    };

    const handleChooseCurrency = (currency: string) => {
      values.currency = currency;
      let result;
      if (currency === 'BNB') {
        result = 2;
      } else if (currency === 'BSCGIRLMOON') {
        result = 0;
      } else result = 1;
      setRate(result);
    };

    const handleChangeProperty = (e: any, index: any, type: any) => {
      const localProperties = [...values.tokenProperties];

      if (type === 'size') {
        localProperties[index].size = e.target.value;
      }
      if (type === 'amount') {
        localProperties[index].amount = e.target.value;
      }
      if (
        localProperties[localProperties.length - 1].size &&
        localProperties[localProperties.length - 1].amount
      ) {
        localProperties.push({
          size: '',
          amount: '',
        });
      }
      setFieldValue('tokenProperties', localProperties);
      handleChange(e);
    };

    useEffect(() => {
      ratesApi
        .getRates()
        .then(({ data }) => {
          setBscRate(data);
        })
        .catch((error) => {
          clogData('getRates Error:', error);
        });
    }, []);

    return (
      <>
        <Form name="create-form" className="create-collectible__main">
          <div className="create-form">
            <div className="create-form__title">Upload file</div>
            <Form.Item
              id="img"
              validateStatus={validateField('img', touched, errors)}
              help={!touched.img ? false : errors.img}
            >
              <UploaderButton
                values={values}
                className="create-form__upload"
                setFormat={(value: string) => setFieldValue('format', value)}
              />
            </Form.Item>
            <div className="create-form__enter-price">
              <Form.Item
                id="enter-price"
                validateStatus={validateField('price', touched, errors)}
                help={!touched.price ? false : errors.price}
                label={
                  <span className="create-form__enter-price__title">
                    Enter price and currency for one piece
                  </span>
                }
              >
                <div className="gradient">
                  <div className="create-form__enter-price__input">
                    {isActive ? (
                      <InputNumber
                        id="price"
                        value={values.price}
                        placeholder="10"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        positiveOnly
                      />
                    ) : (
                      ''
                    )}
                    <div className="gradient-box">
                      <div
                        className="choose-currency"
                        role="button"
                        tabIndex={0}
                        onKeyPress={() => {}}
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        <div className="currency">{values.currency}</div>
                        <img
                          className={isOpen ? 'arrow-up' : ''}
                          src={ArrowGradient}
                          alt="arrow gradient"
                        />
                        {isOpen ? (
                          <div className="gradient-box__select">
                            <div className="choose-currency__items">
                              <div
                                className="choose-currency__items__item"
                                role="button"
                                tabIndex={0}
                                onKeyPress={() => {}}
                                onClick={() => handleChooseCurrency('BSCGIRL')}
                              >
                                BSCGIRL
                              </div>
                              <div
                                className="choose-currency__items__item"
                                role="button"
                                tabIndex={0}
                                onKeyPress={() => {}}
                                onClick={() => handleChooseCurrency('BSCGIRLMOON')}
                              >
                                BSCGIRLMOON
                              </div>
                              <div
                                className="choose-currency__items__item"
                                role="button"
                                tabIndex={0}
                                onKeyPress={() => {}}
                                onClick={() => handleChooseCurrency('BNB')}
                              >
                                BNB
                              </div>
                            </div>
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Form.Item>
              <div className="fee">Service fee {serviceFee}%</div>
              <div className="result">
                <div className="result__receive">You will receive</div>
                <div className="result__value">
                  {new BigNumber(+values.price)
                    .multipliedBy(new BigNumber(100 - serviceFee))
                    .dividedBy(100)
                    .toFixed(5) === '0.00000'
                    ? '0'
                    : new BigNumber(+values.price)
                        .multipliedBy(new BigNumber(100 - serviceFee))
                        .dividedBy(100)
                        .toFixed()}{' '}
                  {values.currency}
                </div>
                {bscRate && bscRate.length ? (
                  <div className="result__usd">
                    $
                    {new BigNumber(+values.price)
                      .multipliedBy(new BigNumber(100 - serviceFee))
                      .dividedBy(100)
                      .multipliedBy(bscRate[rate].rate)
                      .toFixed(2)}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <Form.Item id="putOnSale">
              <div className="create-form__item">
                <span>Put on sale </span>
                <div
                  className={`create-form__item__switcher ${values.selling ? 'active' : ''}`}
                  role="button"
                  tabIndex={0}
                  onKeyPress={() => {}}
                  onClick={() => {
                    values.selling = !values.selling;
                    setActive(!isActive);
                  }}
                >
                  <div className={`switch-dot ${values.selling ? 'on' : 'off'}`} />
                </div>
              </div>
            </Form.Item>
            <div className="create-form__fields">
              <Form.Item
                id="tokenName"
                className="field"
                validateStatus={validateField('tokenName', touched, errors)}
                help={!touched.tokenName ? false : errors.tokenName}
                label={<span className="field__title">Name</span>}
              >
                <div className="field__input">
                  <Input
                    id="tokenName"
                    placeholder='e. g. "Redeemable T-Shirt with logo"'
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </Form.Item>
              <Form.Item
                id="tokenDescription"
                className="field"
                validateStatus={validateField('tokenDescription', touched, errors)}
                help={!touched.tokenDescription ? false : errors.tokenDescription}
                label={<span className="field__title">Description</span>}
              >
                <div className="field__input textarea">
                  <TextArea
                    id="tokenDescription"
                    rows={2}
                    placeholder='e. g. "After purchasing you’ll be able to get the real T-Shirt"'
                    onChange={(e: any) => setFieldValue('tokenDescription', e.target.value)}
                    onBlur={handleBlur}
                  />
                </div>
              </Form.Item>
              <div className="create-form__fields__group">
                <Form.Item
                  id="tokenRoyalties"
                  className="field"
                  validateStatus={validateField('tokenRoyalties', touched, errors)}
                  help={!touched.tokenRoyalties ? false : errors.tokenRoyalties}
                  label={<span className="field__title">Royalties</span>}
                >
                  <div className="field__input">
                    <InputNumber
                      id="tokenRoyalties"
                      placeholder="10"
                      value={values.tokenRoyalties}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      positiveOnly
                      integer
                      max={99}
                    />
                    <div className="unit">%</div>
                  </div>
                  <div className="field__description">Suggested: 10%, 20%, 30%</div>
                </Form.Item>
                {!isSingle ? (
                  <Form.Item
                    id="numberOfCopies"
                    className="field"
                    validateStatus={validateField('numberOfCopies', touched, errors)}
                    help={!touched.numberOfCopies ? false : errors.numberOfCopies}
                    label={<span className="field__title">Number of copies</span>}
                  >
                    <div className="field__input">
                      <InputNumber
                        id="numberOfCopies"
                        placeholder="e. g. 10"
                        value={values.numberOfCopies}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        positiveOnly
                        integer
                      />
                    </div>
                    <div className="field__description">Amount of tokens</div>
                  </Form.Item>
                ) : (
                  React.Fragment
                )}
              </div>
              <>
                <FieldArray
                  name="tokenProperties"
                  render={() => {
                    return values.tokenProperties?.map((item, index) => (
                      <div
                        key={`tokenProperties[${index + 1}]`}
                        className="create-form__fields__properties"
                      >
                        <Form.Item
                          id={`tokenProperties[${index}].size`}
                          className="field"
                          validateStatus={validateField(`tokenProperties`, touched, errors)}
                          label={<span className="field__title">Properties</span>}
                          help={(() => {
                            return errors.tokenProperties &&
                              errors.tokenProperties[index] &&
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              // eslint-disable-next-line no-param-reassign
                              errors.tokenProperties[index].size
                              ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                // eslint-disable-next-line no-param-reassign
                                errors.tokenProperties[index].size
                              : false;
                          })()}
                        >
                          <div className="field__input">
                            <Input
                              id={`tokenProperties[${index}].size`}
                              placeholder="e. g. Size"
                              onChange={(e) => handleChangeProperty(e, index, 'size')}
                              onBlur={handleBlur}
                            />
                          </div>
                        </Form.Item>
                        <Form.Item
                          id={`tokenProperties[${index}].amount`}
                          className="field"
                          validateStatus={validateField(`tokenProperties`, touched, errors)}
                          label={<span className="input__label text-bold" />}
                          help={(() => {
                            return errors.tokenProperties &&
                              errors.tokenProperties[index] &&
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              // eslint-disable-next-line no-param-reassign
                              errors.tokenProperties[index].amount
                              ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                // eslint-disable-next-line no-param-reassign
                                errors.tokenProperties[index].amount
                              : false;
                          })()}
                        >
                          <div className="field__input">
                            <Input
                              id={`tokenProperties[${index}].amount`}
                              placeholder="e. g. M"
                              onChange={(e) => handleChangeProperty(e, index, 'amount')}
                              onBlur={handleBlur}
                            />
                          </div>
                        </Form.Item>
                      </div>
                    ));
                  }}
                />
              </>
              <button type="button" onClick={onSubmit} className="gradient-button btn">
                Create item
              </button>
            </div>
          </div>
          <div className="preview">
            <div className="preview__title">Preview</div>
            <div className="preview__card">
              <TokenCard
                disableLinks
                owners={[
                  {
                    name: user.name,
                    avatar: user.avatar,
                  },
                ]}
                img={values.preview || DefaultImg}
                name={values.tokenName}
                price={values.price}
                format={values.format}
                currency={values.currency}
                total_supply={isSingle ? 1 : +values.numberOfCopies}
                is_liked={false}
                available={+values.numberOfCopies}
                id=""
                onSale={values.selling}
              />
            </div>
          </div>
          {isModalOpen ? <CreateModal isSingle={isSingle} values={values} /> : ''}
        </Form>
      </>
    );
  },
);

export default CreateComponent;
