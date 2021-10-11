import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import BigNumber from 'bignumber.js/bignumber';
import { FieldArray, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';

import DefaultImg from '../../../assets/img/card-default.png';
import ArrowGradient from '../../../assets/img/icons/arrow-gradient.svg';
import { CreateModal, InputNumber, TokenCard, UploaderButton } from '../../../components';
import { ratesApi, storeApi } from '../../../services/api';
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
  tags: string[];
  isSingle?: boolean;
  approveStatus: { text: string; img: string };
  uploadStatus: { text: string; img: string };
  signStatus: { text: string; img: string };
}

const { TextArea } = Input;

const CreateComponent: React.FC<FormikProps<ICreateForm> & ICreateForm> = observer(
  ({
    setFieldValue,
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isSingle,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setActive] = useState(values.selling);
    const [rate, setRate] = useState(1);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTags, setCurrentTags] = useState<string[]>([]);
    const [bscRate, setBscRate] = useState([] as IRate[]);
    const [url, setUrl] = useState('');
    const { user } = useMst();
    const serviceFee = 3;

    clogData('format', values.format);
    clogData('currentTags:', currentTags);

    const editTags = (item: string) => {
      if (values.tags.includes(item)) {
        const idx = values.tags.indexOf(item);
        values.tags.splice(idx, 1);
      } else {
        values.tags.push(item);
      }
      clogData('tags:', values.tags);
      return setCurrentTags(values.tags);
    };

    const onSubmit = () => {
      handleSubmit();
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

    const getTags = useCallback(async () => {
      const { data } = await storeApi.getTags();
      setTags(data.tags);
    }, []);

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

    useEffect(() => {
      getTags();
    }, [getTags]);

    return (
      <Form name="create-form" className="create-collectible__main">
        <div className="create-form">
          <div className="create-form__title">Upload file</div>
          <Form.Item
            name="img"
            validateStatus={validateField('img', touched, errors)}
            help={!touched.img ? false : errors.img}
          >
            <UploaderButton
              values={values}
              className="create-form__upload"
              setFormat={(value: string) => setFieldValue('format', value)}
              setUrl={setUrl}
              url={url}
            />
          </Form.Item>
          <div className="create-form__enter-price">
            <Form.Item
              name="enter-price"
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
          <Form.Item name="putOnSale">
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
              name="tokenName"
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
              name="tokenDescription"
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
                name="tokenRoyalties"
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
                  name="numberOfCopies"
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
            <Form.Item
              name="tags"
              className="field"
              label={<span className="field__title">Tags</span>}
            >
              <div className="create-form__tags">
                {tags && tags.length
                  ? tags.map((tag: string) => (
                      <button
                        key={tag}
                        type="button"
                        className={`create-form__tags__item ${
                          values.tags.includes(tag) ? 'red' : ''
                        }`}
                        onClick={() => editTags(tag)}
                      >
                        {tag}
                      </button>
                    ))
                  : ''}
              </div>
            </Form.Item>
            <>
              <FieldArray
                name="tokenProperties"
                render={() => {
                  return values.tokenProperties?.map((item, index) => (
                    <div
                      key={`tokenProperties[${index + 1}]`}
                      className="create-form__fields__group"
                    >
                      <Form.Item
                        name={`tokenProperties[${index}].size`}
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
                        name={`tokenProperties[${index}].amount`}
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
              img={url || DefaultImg}
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
        <CreateModal
          approveStatus={values.approveStatus}
          uploadStatus={values.uploadStatus}
          signStatus={values.signStatus}
        />
      </Form>
    );
  },
);

export default CreateComponent;
