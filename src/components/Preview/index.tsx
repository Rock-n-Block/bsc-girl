import React from 'react';

import './Preview.scss';

import Image from '../../assets/img/art-main-image.png';
import ArrowLeft from '../../assets/img/icons/arrow-left.svg';
import ArrowRight from '../../assets/img/icons/arrow-right.svg';

type TypePreviewProps = {
  users: Array<{ name: string, img: any }>
}

const Preview: React.FC<TypePreviewProps> = ({users}) => {
  return (
    <div className="preview">
      <div className="preview__img">
        <img src={Image} alt="preview art"/>
      </div>
      <div className="preview__content">
        <h2 className="preview__content__title">Featured Art</h2>
        <div className="preview__content__users">
          {users.map(user => (
            <div key={user.name} className={`preview__content__users__${user.name}`}>
              <img src={user.img} alt={user.name}/>
            </div>
          ))}
        </div>
        <h3 className="preview__content__second-title">Il mio Barocco</h3>
        <div className="preview__content__text">
          Baroque is a work belonging to Micromegalic Inscriptions series, one of the most articulated projects by
          Matteo Mauro. A personal reading of the Baroque style that, through a fine work of...
        </div>
        <div className="preview__content__buttons">
          <button type="button" className="gradient-button">
            Buy for 0.5 BSCGIRL
          </button>
          <div className="preview__content__buttons__text">1 of 3</div>
        </div>
        <div className="preview__buttons">
          <div className="preview__buttons__button">
            <img src={ArrowLeft} alt="arrow left"/>
          </div>
          <div className="preview__buttons__button">
            <img src={ArrowRight} alt="arrow right"/>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Preview;
