import React from 'react';

import Logo from '../../assets/img/icons/logo.svg';
import LogoFB from '../../assets/img/icons/logo-fb.svg';
import LogoTW from '../../assets/img/icons/logo-tw.svg';
import LogoInst from '../../assets/img/icons/logo-inst.svg';
import LogoDS from '../../assets/img/icons/logo-ds.svg';
import LogoYoutube from '../../assets/img/icons/logo-youtube.svg';

import './Footer.scss';

const Footer: React.FC = () => (
  <footer>
    <div className="container">
      <div className="footer">
        <a href="/">
          <img src={Logo} alt="bsc-girl logo" />
        </a>
        <div className="footer__nav">
          <div className="footer__nav__items">
            <div className="footer__nav__items__item">
              <div className="title">BSCGIRL</div>
              <div className="links">
                <a href="/explore">Explore</a>
                <a href="/my-items">My Items</a>
                <a href="/following">Following</a>
              </div>
            </div>
            <div className="footer__nav__items__item">
              <div className="title">Community</div>
              <div className="links">
                <a href="/create">Create</a>
                <a href="/how">How it works</a>
                <a href="/support">Support</a>
              </div>
            </div>
          </div>
          <div className="footer__nav__contacts">
            <a href="https://www.facebook.com/">
              <img src={LogoFB} alt="logo Facebook" />
            </a>
            <a href="https://twitter.com/">
              <img src={LogoTW} alt="logo Twitter" />
            </a>
            <a href="https://www.instagram.com/">
              <img src={LogoInst} alt="logo Instagram" />
            </a>
            <a href="https://discord.com/">
              <img src={LogoDS} alt="logo Discord" />
            </a>
            <a href="https://www.youtube.com/">
              <img src={LogoYoutube} alt="logo Youtube" />
            </a>
          </div>
        </div>
        <div className="copyright">
          Copyright © 2021 BSCGIRL. LLC. All rights reserved
        </div>
      </div>
    </div>
    <div className="gradient-footer" />
  </footer>
);

export default Footer;
