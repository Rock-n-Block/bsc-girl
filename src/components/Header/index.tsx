import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Burger from '../../assets/img/icons/burger.svg';
import CloseBtn from '../../assets/img/icons/close-btn.svg';
import LogoDS from '../../assets/img/icons/logo-ds.svg';
import LogoFB from '../../assets/img/icons/logo-fb.svg';
import LogoInst from '../../assets/img/icons/logo-inst.svg';
import LogoMini from '../../assets/img/icons/logo-mini.svg';
import LogoTW from '../../assets/img/icons/logo-tw.svg';
import LogoYoutube from '../../assets/img/icons/logo-youtube.svg';
import Logo from '../../assets/img/icons/logo.svg';
import SearchIcon from '../../assets/img/icons/search-icon.svg';

import './Header.scss';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header>
      <div className="container">
        <div className="header">
          <div className="main">
            <Link to="/">
              <img src={Logo} alt="bsc-girl logo" className="main__logo" />
            </Link>
            <div className="main__nav">
              <div className="main__nav__link">Explore</div>
              <div className="main__nav__link">My items</div>
            </div>
          </div>
          <div className="nav">
            <div className="search">
              <img src={SearchIcon} alt="search icon" className="search__icon" />
              <input type="text" placeholder="Search items, collections" />
            </div>
            <Link to="/profile">
              <div className="profile-link">
                <img src={LogoMini} alt="logo avatar" />
                9237.. BSCGIRL
              </div>
            </Link>
            <button type="button" className="gradient-button">
              <div className="nav__button">
                <div className="nav__button__text gradient-text">Buy BSCGIRL</div>
              </div>
            </button>
            <Link to="/create">
              <button type="button" className="gradient-button">
                Create
              </button>
            </Link>
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
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img src={Logo} alt="bsc-girl logo" className="logo" />
          </Link>
          {!isOpen ? (
            <Link to="/create" onClick={() => setIsOpen(false)}>
              <button type="button" className="nav-btn__create gradient-button">
                Create
              </button>
            </Link>
          ) : null}
          {isOpen ? (
            <div className="nav">
              <div className="nav__top">
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  <div className="profile-link">
                    <img src={LogoMini} alt="logo avatar" />
                    92373453535 BSCGIRL
                  </div>
                </Link>
                <div className="nav__top__main">
                  <div className="nav__top__main__link">Explore</div>
                  <div className="nav__top__main__link">My items</div>
                </div>
                <Link to="/create" onClick={() => setIsOpen(false)}>
                  <button type="button" className="gradient-button">
                    Create
                  </button>
                </Link>

                <button type="button" className="gradient-button" onClick={() => setIsOpen(false)}>
                  <div className="nav__button">
                    <div className="nav__button__text gradient-text">Buy BSCGIRL</div>
                  </div>
                </button>
                <div className="search">
                  <img src={SearchIcon} alt="search icon" className="search__icon" />
                  <input type="text" placeholder="Search items, collections" />
                </div>
              </div>
              <div className="nav__bottom">
                <div className="links">
                  <Link to="/create" onClick={() => setIsOpen(false)}>
                    Create
                  </Link>
                  <Link to="/how" onClick={() => setIsOpen(false)}>
                    How it works
                  </Link>
                  <Link to="/support" onClick={() => setIsOpen(false)}>
                    Support
                  </Link>
                </div>
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
};

export default Header;
