import React from 'react';

import './style.scss';
import { ReactComponent as IconLogo } from '../../assets/images/logo.svg';
import HeaderTitle from '../../assets/images/header-title.svg';

const Header = React.memo(() => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left-group header__logo">
          <a href="/">
            <IconLogo className="header-logo" />
          </a>
        </div>
        <img src={HeaderTitle} alt="" className="header__title" />
      </div>
    </header>
  );
});

export default Header;
