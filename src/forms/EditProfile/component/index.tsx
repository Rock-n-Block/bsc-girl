import React from 'react';
import { Form, Input } from 'antd';
import { FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';

import DefaultAvatar from '../../../assets/img/icons/avatar-default-logo.svg';
import { UploaderButton } from '../../../components';
import { userApi } from '../../../services/api';
import { useMst } from '../../../store/store';
import { validateField } from '../../../utils/validate';

export interface IProfile {
  displayName?: string;
  customUrl?: string;
  bio?: string;
  twitter?: string;
  instagram?: string;
  email?: string;
  site?: string;
  img?: any;
  preview?: string;
  url?: string;
  isLoading: boolean;
}

const ProfileComponent: React.FC<FormikProps<IProfile>> = observer(
  ({ touched, errors, handleChange, handleBlur, values, handleSubmit }) => {
    const { modals, user } = useMst();

    const onSubmit = () => {
      handleSubmit();
    };

    const handleVerify = () => {
      const verifyData = new FormData();
      verifyData.append('url', values.url ? values.url : '');
      verifyData.append('address', user.address);
      verifyData.append('role', 'creator');
      verifyData.append('bio', values.bio ? values.bio : '');
      verifyData.append('twitter', values.twitter ? values.twitter : '');
      verifyData.append('media', values.img);
      verifyData.append('instagram', values.instagram ? values.instagram : '');
      verifyData.append('website', values.site ? values.site : '');
      verifyData.append('email', values.email ? values.email : '');

      userApi
        .verifyMe(verifyData)
        .then(() => {
          modals.info.setMsg(
            'Congrats you have successfully submitted a verification request',
            'success',
          );
        })
        .catch((err: any) => {
          if (err.message === 'Request failed with status code 400') {
            modals.info.setMsg('Your verification already in progress', 'error');
          } else {
            modals.error.setErr(err.message);
          }
        });
    };

    return (
      <Form className="edit-profile__main">
        <div className="edit-profile__main__form">
          <Form.Item
            name="displayName"
            className="form-item"
            initialValue={values.displayName}
            validateStatus={validateField('username', touched, errors)}
            help={!touched.displayName ? false : errors.displayName}
            label={<span className="form-item__title">Display name</span>}
          >
            <div className="form-item__input">
              <Input
                id="displayName"
                value={values.displayName}
                placeholder="Enter your display name"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="customUrl"
            className="form-item"
            initialValue={values.customUrl}
            validateStatus={validateField('customUrl', touched, errors)}
            help={!touched.customUrl ? false : errors.customUrl}
            label={<span className="form-item__title">Custom URL</span>}
          >
            <div className="form-item__input">
              <Input
                id="customUrl"
                value={values.customUrl}
                placeholder="Enter your custom URL"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="bio"
            className="form-item"
            initialValue={values.bio}
            validateStatus={validateField('bio', touched, errors)}
            help={!touched.bio ? false : errors.bio}
            label={<span className="form-item__title">Bio</span>}
          >
            <div className="form-item__input">
              <Input
                id="bio"
                value={values.bio}
                placeholder="Tell about yourself in a few words"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="twitter"
            className="form-item"
            initialValue={values.twitter}
            validateStatus={validateField('twitter', touched, errors)}
            help={!touched.twitter ? false : errors.twitter}
            label={<span className="form-item__title">Twitter Username</span>}
          >
            <div className="form-item__input">
              <Input
                id="twitter"
                value={values.twitter}
                placeholder="@"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <a href={`https://twitter.com/${values.twitter}`} target="_blank" rel="noreferrer">
                Link
              </a>
            </div>
            <div className="form-item__description">
              Link your Twitter account in order to get the verification badge
            </div>
          </Form.Item>
          <Form.Item
            name="email"
            className="form-item"
            initialValue={values.email}
            validateStatus={validateField('email', touched, errors)}
            help={!touched.email ? false : errors.email}
            label={<span className="form-item__title">Email Username</span>}
          >
            <div className="form-item__input">
              <Input
                id="email"
                value={values.email}
                placeholder="mailto:"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="form-item__description">
              Link your email in order to get the verification badge
            </div>
          </Form.Item>
          <Form.Item
            name="instagram"
            className="form-item"
            initialValue={values.instagram}
            validateStatus={validateField('instagram', touched, errors)}
            help={!touched.instagram ? false : errors.instagram}
            label={<span className="form-item__title">Instagram Username</span>}
          >
            <div className="form-item__input">
              <Input
                id="instagram"
                value={values.instagram}
                placeholder="@"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <a
                href={`https://www.instagram.com/${values.instagram}`}
                target="_blank"
                rel="noreferrer"
              >
                Link
              </a>
            </div>
            <div className="form-item__description">
              Link your Instagram account in order to get the verification badge
            </div>
          </Form.Item>
          <Form.Item
            name="site"
            className="form-item"
            initialValue={values.site}
            validateStatus={validateField('site', touched, errors)}
            help={!touched.site ? false : errors.site}
            label={<span className="form-item__title">Personal site or portfolio</span>}
          >
            <div className="form-item__input">
              <Input
                id="site"
                value={values.site}
                placeholder="https://"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <a href={`https://${values.site}`} target="_blank" rel="noreferrer">
                Link
              </a>
            </div>
            <div className="form-item__description">
              Link your personal site in order to get the verification badge
            </div>
          </Form.Item>
          <Form.Item label={<span className="form-item__title">Favorite url address</span>}>
            <div className="form-item__input">
              <Input
                id="url"
                value={values.url}
                placeholder="https://"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <a href={`https://${values.url}`} target="_blank" rel="noreferrer">
                Link
              </a>
            </div>
            <div className="form-item__description">
              Link any favorite url address in order to get the verification badge
            </div>
          </Form.Item>
          {user.is_verificated ? (
            ''
          ) : (
            <button type="button" className="gradient-button" onClick={handleVerify}>
              <div className="verify">
                <span className="gradient-text">Request verification</span>
              </div>
            </button>
          )}
          <button type="button" className="gradient-button" onClick={onSubmit}>
            Update profile
          </button>
        </div>
        <div className="edit-profile__main__upload">
          <img src={values.preview || DefaultAvatar} alt="preview avatar" />
          <Form.Item
            name="img"
            className="upload"
            validateStatus={validateField('img', touched, errors)}
            help={!touched.img ? false : errors.img}
          >
            <div className="upload__title">Profile photo</div>
            <div className="upload__text">
              We recommend an image of at least 400x400. Gifs work too.
            </div>
            <UploaderButton type="button" />
          </Form.Item>
        </div>
      </Form>
    );
  },
);

export default ProfileComponent;
