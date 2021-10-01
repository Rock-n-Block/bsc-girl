import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';

import LogoBSCGIRLMOON from '../../assets/img/bscgirlmoon-logo.png';
import Burger from '../../assets/img/icons/burger.svg';
import CloseBtn from '../../assets/img/icons/close-btn.svg';
import LogoBNB from '../../assets/img/icons/logo-bnb.svg';
import LogoDS from '../../assets/img/icons/logo-ds.svg';
import LogoFB from '../../assets/img/icons/logo-fb.svg';
import LogoInst from '../../assets/img/icons/logo-inst.svg';
import LogoMini from '../../assets/img/icons/logo-mini.svg';
import LogoTW from '../../assets/img/icons/logo-tw.svg';
import LogoYoutube from '../../assets/img/icons/logo-youtube.svg';
import SearchIcon from '../../assets/img/icons/search-icon.svg';
import LogoBSC from '../../assets/img/logo.png';
import { useMst } from '../../store/store';

import './Header.scss';

const Header: React.FC = observer(() => {
  const [isShownCurrency, setShownCurrency] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useMst();

  const location = useLocation();
  const history = useHistory();

  document.addEventListener('mousedown', (event) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (event.target?.className !== 'currency__item') setShownCurrency(false);
  });

  const handleKeyDown = (e: any) => {
    if (e.target.value) {
      history.push(`/search/?to_search=${e.target.value}`);
    }
  };

  const handleKeyDownMobile = (e: any) => {
    if (e.key === 'Enter' && e.target.value) {
      history.push(`/search/?to_search=${e.target.value}`);
      setIsOpen(false);
    }
  };

  return (
    <header>
      <div className="container">
        <div className="header">
          <div className="main">
            <Link to="/">
              <img src={LogoBSC} alt="bsc-girl logo" className="main__logo" />
            </Link>
            <div className="main__nav">
              <a href="#explore" className="main__nav__link" onClick={() => history.push('/')}>
                Explore
              </a>
              {user.address ? (
                <a href="#my-items" className="main__nav__link" onClick={() => history.push('/')}>
                  My items
                </a>
              ) : (
                ''
              )}
              <Link to="/staking" className="main__nav__link">
                Staking pool
              </Link>
            </div>
          </div>
          <div className="nav">
            {location.pathname !== ('/connect' || '/create') ? (
              <div className="search">
                <img src={SearchIcon} alt="search icon" className="search__icon" />
                <input type="text" onKeyDown={handleKeyDown} placeholder="Search items" />
              </div>
            ) : (
              ''
            )}
            {user.address ? (
              <div
                className="currency"
                role="button"
                tabIndex={0}
                onKeyPress={() => {}}
                onClick={() => setShownCurrency(!isShownCurrency)}
              >
                {!isShownCurrency ? (
                  <div className="currency__item">
                    <img src={LogoMini} alt="logo avatar" />
                    {user.balance.bscgirl}
                    &nbsp; BSCGIRL
                  </div>
                ) : (
                  <div className="show">
                    <div className="currency__item">
                      <img src={LogoBNB} alt="logo bnb" />
                      {user.balance.bnb}
                      &nbsp; BNB
                    </div>
                    <div className="currency__item">
                      <img src={LogoMini} alt="logo bscgirl" />
                      {user.balance.bscgirl}
                      &nbsp; BSCGIRL
                    </div>
                    <div className="currency__item">
                      <img src={LogoBSCGIRLMOON} alt="logo bscgirlmoon" />
                      {user.balance.bscgirlmoon}
                      &nbsp; BSCGIRLMOON
                    </div>
                  </div>
                )}
              </div>
            ) : (
              ''
            )}
            {user.address ? (
              <Link to={`/profile/${user.id}`} className="profile-link">
                {user.avatar ? <img src={user.avatar} alt="user avatar" /> : ''}
              </Link>
            ) : (
              ''
            )}
            <button type="button" className="gradient-button">
              <div className="nav__button">
                <div className="nav__button__text gradient-text">Buy BSCGIRL</div>
              </div>
            </button>
            {user.address ? (
              <Link to="/create">
                <button type="button" className="gradient-button">
                  Create
                </button>
              </Link>
            ) : (
              <Link to="/connect">
                <button type="button" className="gradient-button connect">
                  Connect wallet
                </button>
              </Link>
            )}
          </div>
        </div>
        <div className="header-mobile">
          <div className="nav-btn">
            {isOpen ? (
              <div
                className="nav-btn__close"
                role="button"
                tabIndex={0}
                onClick={() => setIsOpen(false)}
                onKeyPress={() => {}}
              >
                <img src={CloseBtn} alt="close icon" />
              </div>
            ) : (
              <div
                className="nav-btn__burger"
                role="button"
                tabIndex={0}
                onClick={() => setIsOpen(true)}
                onKeyPress={() => {}}
              >
                <img src={Burger} alt="nav burger" />
              </div>
            )}
          </div>
          <Link to="/" target="_top" onClick={() => setIsOpen(false)}>
            <img src={LogoBSC} alt="bsc-girl logo" className="logo" />
          </Link>
          {!isOpen ? (
            <Link
              to={user.address ? '/create' : '/connect'}
              target="_top"
              onClick={() => setIsOpen(false)}
            >
              <button type="button" className="nav-btn__create gradient-button">
                {user.address ? 'Create' : 'Connect'}
              </button>
            </Link>
          ) : null}
          {isOpen ? (
            <div className="nav">
              <div className="nav__top">
                <div className="currency">
                  <div className="currency__item">
                    <img src={LogoBNB} alt="logo bnb" />
                    {user.balance.bnb}&nbsp;BNB
                  </div>
                  <div className="currency__item">
                    <img src={LogoMini} alt="logo bscgirl" />
                    {user.balance.bscgirl}&nbsp;BSCGIRL
                  </div>
                  <div className="currency__item">
                    <img src={LogoBSCGIRLMOON} alt="logo bscgirlmoon" />
                    {user.balance.bscgirlmoon}&nbsp;BSCGIRLMOON
                  </div>
                </div>
                <Link to={`/profile/${user.id}`} target="_top" onClick={() => setIsOpen(false)}>
                  <div className="profile-link">
                    {user.avatar ? <img src={user.avatar} alt="user avatar" /> : ''}
                    {user.id}
                  </div>
                </Link>
                <div className="nav__top__main">
                  <a
                    href="#staking"
                    className="nav__top__main__link"
                    onClick={() => {
                      history.push('/');
                      setIsOpen(false);
                    }}
                  >
                    Explore
                  </a>
                  <a
                    href="#my-items"
                    className="nav__top__main__link"
                    onClick={() => {
                      history.push('/');
                      setIsOpen(false);
                    }}
                  >
                    My items
                  </a>
                  <Link
                    to="/staking"
                    className="nav__top__main__link"
                    onClick={() => setIsOpen(false)}
                  >
                    Staking pool
                  </Link>
                </div>
                <Link to={user.address ? '/create' : '/connect'} onClick={() => setIsOpen(false)}>
                  <button type="button" className="gradient-button">
                    {user.address ? 'Create' : 'Connect wallet'}
                  </button>
                </Link>

                <button type="button" className="gradient-button" onClick={() => setIsOpen(false)}>
                  <div className="nav__button">
                    <div className="nav__button__text gradient-text">Buy BSCGIRL</div>
                  </div>
                </button>
                <div className="search">
                  <img src={SearchIcon} alt="search icon" className="search__icon" />
                  <input type="text" placeholder="Search items" onKeyPress={handleKeyDownMobile} />
                </div>
              </div>
              <div className="nav__bottom">
                <div className="contacts">
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
                <div className="copyright">Copyright © 2021 BSCGIRL. LLC. All rights reserved</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
});

export default Header;
