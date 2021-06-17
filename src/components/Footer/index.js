import React from 'react';

import './style.scss';

import TwImg from '../../assets/icons/social/twitter-circle.svg';
import TgImg from '../../assets/icons/social/telegram-circle.svg';
import RubicImg from '../../assets/icons/rubic.svg';

const Footer = React.memo(() => {
  return (
    <footer className="footer">
      <div className="footer__socials">
        <a href="https://mobile.twitter.com/BSC_Girl" target="_blank">
          <img src={TwImg} alt="twitter" />
        </a>
        <a href="https://t.co/6bYLaonxAH" target="_blank">
          <img src={TgImg} alt="telegram" />
        </a>
      </div>
      <div className="footer-copyright">
        © 2021 bscgirl. All rights reserved
      </div>
      <div className="footer__powered">
        <span>Powered by</span>
        <img src={RubicImg} alt="rubic" />
      </div>
    </footer>
  );
});

export default Footer;
