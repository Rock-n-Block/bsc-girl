import React from 'react';
import { Form, Input } from 'antd';
import { FormikProps } from 'formik';
import { observer } from 'mobx-react-lite';

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
  isLoading: boolean;
}

const ProfileComponent: React.FC<FormikProps<IProfile>> = observer(
  ({ touched, errors, handleChange, handleBlur, values, handleSubmit }) => {
    const form = [
      {
        name: 'displayName',
        title: 'Display name',
        placeholder: 'Enter your display name',
        value: values.displayName,
        link: false,
        description: '',
      },
      {
        name: 'customUrl',
        title: 'Custom URL',
        placeholder: 'site.com/ Enter your custom URL',
        value: values.customUrl,
        link: false,
        description: '',
      },
      {
        name: 'bio',
        title: 'Bio',
        placeholder: 'Tell about yourself in a few words',
        value: values.bio,
        link: false,
        description: '',
      },
      {
        name: 'twitter',
        title: 'Twitter Username',
        placeholder: '@',
        value: values.twitter,
        link: true,
        href: `https://twitter.com/${values.twitter}`,
        description: 'Link your Twitter account in order to get the verification badge',
      },
      {
        name: 'email',
        title: 'Email Username',
        placeholder: 'mailto:',
        value: values.email,
        link: false,
        href: values.email,
        description: 'Link your email in order to get the verification badge',
      },
      {
        name: 'instagram',
        title: 'Instagram Username',
        placeholder: '@',
        value: values.instagram,
        link: true,
        href: `https://www.instagram.com/${values.instagram}`,
        description: 'Link your Instagram account in order to get the verification badge',
      },
      {
        name: 'site',
        title: 'Personal site or portfolio',
        placeholder: 'https://',
        value: values.site,
        link: true,
        href: `https://${values.site}`,
        description: 'Link your personal site in order to get the verification badge',
      },
    ];

    const onSubmit = () => {
      handleSubmit();
    };
    return (
      <Form className="edit-profile__main">
        <div className="edit-profile__main__form">
          {form.map((item) => (
            <Form.Item
              name={item.name}
              key={item.name}
              className="form-item"
              initialValue={item.value}
              label={<span className="form-item__title">{item.title}</span>}
            >
              <div className="form-item__input">
                <Input
                  id={item.name}
                  value={item.value}
                  placeholder={item.placeholder}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {item.link ? (
                  <a href={item.href} target="_blank" rel="noreferrer">
                    Link
                  </a>
                ) : null}
              </div>
              {item.description ? (
                <div className="form-item__description">{item.description}</div>
              ) : null}
            </Form.Item>
          ))}
          <button type="button" className="gradient-button" onClick={() => onSubmit()}>
            Update profile
          </button>
        </div>
        <div className="edit-profile__main__upload">
          {values.preview ? <img src={values.preview} alt="preview avatar" /> : ''}
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
