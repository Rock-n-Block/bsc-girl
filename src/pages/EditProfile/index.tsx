import React from 'react';
import { Link } from 'react-router-dom';

import ArrowLeftBlack from '../../assets/img/icons/arrow-left-black.svg';
import ArrowLeftRed from '../../assets/img/icons/arrow-left-red.svg';
import { EditProfileForm } from '../../forms';

import './EditProfile.scss';

const EditProfilePage: React.FC = () => {
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
        <EditProfileForm />
      </div>
    </div>
  );
};

export default EditProfilePage;
