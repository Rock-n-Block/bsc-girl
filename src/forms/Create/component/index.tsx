import React from 'react';
import { Form, Input } from 'antd';
import BigNumber from 'bignumber.js/bignumber';
import { FieldArray, FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';

import DefaultImg from '../../../assets/img/card-default.png';
import { CreateModal, InputNumber, TokenCard, UploaderButton } from '../../../components';
import { useMst } from '../../../store/store';
import { validateField } from '../../../utils/validate';

interface IProperties {
  size: string | number;
  amount: string | number;
}

export interface ICreateForm {
  img: any;
  preview: string;
  price: number | string;
  tokenName: string;
  tokenDescription: string;
  tokenRoyalties: number | string;
  numberOfCopies: number | string;
  tokenProperties: IProperties[];
  isSingle?: boolean;
  bscRate?: number;
  isModalOpen: boolean;
  approveStatus: { text: string; img: string };
  uploadStatus: { text: string; img: string };
  signStatus: { text: string; img: string };
  closeModal: () => void;
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
    const { user } = useMst();
    const serviceFee = 2.5;
    const onSubmit = () => {
      handleSubmit();
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
    return (
      <Form name="create-form" className="create-collectible__main">
        <div className="create-form">
          <div className="create-form__title">Upload file</div>
          <Form.Item
            name="img"
            className="create-form__upload"
            validateStatus={validateField('img', touched, errors)}
            help={!touched.img ? false : errors.img}
          >
            <UploaderButton />
          </Form.Item>
          <div className="create-form__enter-price">
            <Form.Item
              name="enter-price"
              validateStatus={validateField('instantSalePriceEth', touched, errors)}
              help={!touched.price ? false : errors.price}
              label={
                <span className="create-form__enter-price__title">Enter price for one piece</span>
              }
            >
              <div className="gradient">
                <div className="create-form__enter-price__input">
                  <InputNumber
                    id="price"
                    value={values.price}
                    placeholder="10"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    positiveOnly
                  />
                  <div className="currency">BSCGIRL</div>
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
                BSCGIRL
              </div>
              {values.bscRate ? (
                <div className="result__usd">
                  $
                  {new BigNumber(+values.price)
                    .multipliedBy(new BigNumber(100 - serviceFee))
                    .dividedBy(100)
                    .multipliedBy(values.bscRate)
                    .toFixed(2)}
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
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
            <div className="create-form__fields__group">
              <FieldArray
                name="tokenProperties"
                render={() => {
                  return values.tokenProperties?.map((item, index) => (
                    <>
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
                    </>
                  ));
                }}
              />
            </div>
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
                  img: user.avatar,
                },
              ]}
              img={values.preview || DefaultImg}
              title={values.tokenName}
              price={values.price}
              numberOfCopies={isSingle ? 1 : +values.numberOfCopies}
            />
          </div>
        </div>
        <CreateModal
          isOpen={values.isModalOpen}
          closeModal={values.closeModal}
          approveStatus={values.approveStatus}
          uploadStatus={values.uploadStatus}
          signStatus={values.signStatus}
        />
      </Form>
    );
  },
);

export default CreateComponent;
