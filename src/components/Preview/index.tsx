import React from 'react';

import './Preview.scss';

import Image from '../../assets/img/art-main-image.png';

const Preview: React.FC = () => {
  return (
    <div className="preview">
      <div className="preview__img">
        <img src={Image} alt="preview art" />
      </div>
      <div className="preview__content">
        <div className="preview__content__title">Featured Art</div>
        <div className="preview__content__users">

        </div>
      </div>
    </div>
  )
};

export default Preview;
