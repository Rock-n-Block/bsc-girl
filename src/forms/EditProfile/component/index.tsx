import React from 'react';
import { Form, Input } from 'antd';
import { FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';

import DefaultAvatar from '../../../assets/img/icons/avatar-default-logo.svg';
import { UploaderButton } from '../../../components';
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
    const onSubmit = () => {
      handleSubmit();
    };

    // const handleChange = (e: any) => {
    //   if (e.target.id === 'customUrl') {
    //     values.customUrl = e.target.value.match(/[A-Z0-9_]/);
    //   }
    // };

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
            <div className={`form-item__input ${errors.customUrl ? 'form-item__red' : ''}`}>
              <Input
                id="customUrl"
                value={values.customUrl}
                placeholder="site.com/{your_custom_url}"
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
          </Form.Item>
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
