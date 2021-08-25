import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Coins from '../../assets/img/icons/coins-icon.svg';
import Edit from '../../assets/img/icons/edit-icon.svg';
import Exit from '../../assets/img/icons/exit-icon.svg';
import Img from '../../assets/img/icons/img-icon.svg';
import More from '../../assets/img/icons/profile-icon-more.svg';
import Share from '../../assets/img/icons/profile-icon-share.svg';
import FacebookLogo from '../../assets/img/icons/profile-logo-fb.svg';
import InstLogo from '../../assets/img/icons/profile-logo-inst.svg';
import TwitterLogo from '../../assets/img/icons/profile-logo-tw.svg';
import { CollectionCard, TokenCard } from '../../components';
import { cards, collections, profileInfo, users } from '../../data';

import './Profile.scss';

type TypeLink = {
  name: string;
  href: string;
  img: string;
};

const links: TypeLink[] = [
  {
    name: 'twitter',
    href: profileInfo.twitterLink,
    img: TwitterLogo,
  },
  {
    name: 'instagram',
    href: profileInfo.instLink,
    img: InstLogo,
  },
  {
    name: 'facebook',
    href: profileInfo.facebookLink,
    img: FacebookLogo,
  },
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('On sale');

  const getContent = (): JSX.Element => {
    if (activeTab === 'On sale' && cards.length > 0)
      return (
        <div className="profile__content__items">
          {cards.map((card) => (
            <TokenCard users={users} img={card.img} title={card.title} price={card.price} />
          ))}
        </div>
      );
    if (activeTab === 'Collectible' && collections.length > 0)
      return (
        <div className="profile__content__items">
          {collections.map((collection) => (
            <CollectionCard
              images={collection.images}
              avatar={collection.avatar}
              name={collection.name}
            />
          ))}
        </div>
      );
    return (
      <div className="profile__content__empty">
        <div className="text">No items found</div>
        <div className="advice">Come back soon! Or try browse</div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="profile">
        <div className="profile__top">
          <div className="bg-img">
            <img src={profileInfo.coverImg} alt="cover" />
          </div>
          <img src={profileInfo.avatar} alt="avatar" className="avatar" />
          <div className="btns">
            <button className="gradient-button" type="button">
              Edit cover photo
              <img src={Img} alt="img icon" />
            </button>
            <button className="gradient-button" type="button">
              <Link to="edit-profile">
                Edit profile
                <img src={Edit} alt="edit icon" />
              </Link>
            </button>
            <button className="gradient-button exit" type="button">
              <img src={Exit} alt="exit icon" />
            </button>
          </div>
        </div>
        <div className="profile__info">
          <div className="profile__info__name">
            {profileInfo.name}
          </div>
          <div className="profile__info__bio">{profileInfo.bio}</div>
          <div className="gradient-button">
            <div className="id">
              {profileInfo.id}
              <img src={Coins} alt="coins" />
            </div>
          </div>
          <div className="profile__info__links">
            {links.map((link) => (
              <a className="link" href={link.href}>
                <img src={link.img} alt={`${link.name} link`} />
              </a>
            ))}
            <div className="link">
              <img src={Share} alt="share" />
            </div>
            <div className="link">
              <img src={More} alt="more" />
            </div>
          </div>
        </div>
        <div className="profile__navbar">
          <div
            className={`profile__navbar__tab ${activeTab === 'On sale' ? 'active' : undefined}`}
            role="button"
            tabIndex={0}
            onClick={() => setActiveTab('On sale')}
            onKeyPress={() => {}}
          >
            On sale
          </div>
          <div
            className={`profile__navbar__tab ${activeTab === 'Collectible' ? 'active' : undefined}`}
            role="button"
            tabIndex={0}
            onClick={() => setActiveTab('Collectible')}
            onKeyPress={() => {}}
          >
            Collectible
          </div>
          <div
            className={`profile__navbar__tab ${activeTab === 'Created' ? 'active' : undefined}`}
            role="button"
            tabIndex={0}
            onClick={() => setActiveTab('Created')}
            onKeyPress={() => {}}
          >
            Created
          </div>
        </div>
        <div className="profile__content">
          <div className="scroll">{getContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
