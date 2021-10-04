import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';

import LogoTW from '../../assets/img/icons/logo-tw.svg';
import LogoYoutube from '../../assets/img/icons/logo-youtube.svg';
import Logo from '../../assets/img/icons/logo.svg';
import { useMst } from '../../store/store';

import './Footer.scss';

const Footer: React.FC = observer(() => {
  const history = useHistory();
  const { user } = useMst();

  return (
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
                  <a href="#explore" onClick={() => history.push('/')}>
                    Explore
                  </a>
                  {user.address ? (
                    <a href="#my-items" onClick={() => history.push('/')}>
                      My Items
                    </a>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="footer__nav__items__item">
                <div className="title">Community</div>
                <div className="links">
                  <Link to="/create">Create</Link>
                  <a href="https://bridge.bscgirl.com/">Bridge</a>
                </div>
              </div>
            </div>
            <div className="footer__nav__contacts">
              <a href="https://twitter.com/BSC_Girl">
                <img src={LogoTW} alt="logo Twitter" />
              </a>
              <a href="https://youtube.com/user/Belew101">
                <img src={LogoYoutube} alt="logo Youtube" />
              </a>
            </div>
          </div>
          <div className="copyright">Copyright © 2021 BSCGIRL. LLC. All rights reserved</div>
        </div>
      </div>
      <div className="gradient-footer" />
    </footer>
  );
});

export default Footer;
