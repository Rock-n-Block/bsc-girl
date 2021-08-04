import React from 'react';

import './Header.scss';

import Logo from '../../assets/img/icons/logo.svg';
import SearchIcon from '../../assets/img/icons/search-icon.svg';

const Header: React.FC = () => {
  return (
    <header>
      <div className="container">
        <div className="main">
          <img src={Logo} alt="bsc-girl logo" className="main__logo"/>
          <div className="main__nav">
            <div className="main__nav__link">Explore</div>
            <div className="main__nav__link">My items</div>
          </div>
        </div>
        <div className="nav">
          <div className="search">
            <img src={SearchIcon} alt="search icon" className="search__icon"/>
            <input type="text" placeholder="Search items, collections"/>
          </div>
          <button type="button" className="gradient-button">
            <div className="nav__button">
              <div className="nav__button__text gradient-text">Buy BSCGIRL</div>
            </div>
          </button>
          <button type="button" className="gradient-button">
            Create
          </button>
        </div>
      </div>
    </header>
  )
};

export default Header;
