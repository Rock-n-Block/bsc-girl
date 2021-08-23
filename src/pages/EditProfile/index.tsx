import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import ArrowLeftBlack from '../../assets/img/icons/arrow-left-black.svg';
import ArrowLeftRed from '../../assets/img/icons/arrow-left-red.svg';
import Avatar from '../../assets/img/profile-avatar.png';

import './EditProfile.scss';

const EditProfilePage: React.FC = () => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [bio, setBio] = useState('');
  const [twitter, setTwitter] = useState('');
  const [site, setSite] = useState('');
  // const [photo, setPhoto] = useState('');

  const form = [
    {
      title: 'Display name',
      placeholder: 'Enter your display name',
      value: name,
      link: false,
      description: '',
      handleChange: (e: any) => setName(e.target.value),
    },
    {
      title: 'Custom URL',
      placeholder: 'site.com/ Enter your custom URL',
      value: url,
      link: false,
      description: '',
      handleChange: (e: any) => setUrl(e.target.value),
    },
    {
      title: 'Bio',
      placeholder: 'Tell about yourself in a few words',
      value: bio,
      link: false,
      description: '',
      handleChange: (e: any) => setBio(e.target.value),
    },
    {
      title: 'Twitter Username',
      placeholder: '@',
      value: twitter,
      link: true,
      description: 'Link your Twitter account in order to get the verification badge',
      handleChange: (e: any) => setTwitter(e.target.value),
    },
    {
      title: 'Personal site or portfolio',
      placeholder: 'http://',
      value: site,
      link: false,
      description: '',
      handleChange: (e: any) => setSite(e.target.value),
    },
  ];

  return (
    <div className="container">
      <div className="edit-profile">
        <div className="edit-profile__header">
          <div className="edit-profile__header__title">
            <Link to="/profile">
              <img src={ArrowLeftRed} alt="arrow left soft-red" className="link-red" />
              <img src={ArrowLeftBlack} alt="arrow left black" className="link-black" />
            </Link>
            Edit profile
          </div>
          <div className="edit-profile__header__description">
            You can set preferred display name, create your branded profile URL and manage other
            personal settings
          </div>
        </div>
        <div className="edit-profile__main">
          <div className="edit-profile__main__form">
            {form.map((item) => (
              <div className="form-item">
                <div className="form-item__title">{item.title}</div>
                <div className="form-item__input">
                  <input
                    type="text"
                    placeholder={item.placeholder}
                    value={item.value}
                    onChange={item.handleChange}
                  />
                  {item.link ? <a href={item.value}>Link</a> : null}
                </div>
                {item.description ? (
                  <div className="form-item__description">{item.description}</div>
                ) : null}
              </div>
            ))}
            <button
              type="button"
              className="gradient-button"
              onSubmit={() => {
                console.log(
                  'Name:',
                  name,
                  'URL:',
                  url,
                  'Bio:',
                  bio,
                  'Twitter:',
                  twitter,
                  'Site:',
                  site,
                );
              }}
            >
              Update profile
            </button>
          </div>
          <div className="edit-profile__main__upload">
            <img src={Avatar} alt="avatar" />
            <div className="upload">
              <div className="upload__title">Profile photo</div>
              <div className="upload__text">
                We recommend an image of at least 400x400. Gifs work too.
              </div>
              <button type="button" className="upload__btn">
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
