import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Coins from '../../assets/img/icons/coins-icon.svg';
import Edit from '../../assets/img/icons/edit-icon.svg';
import Exit from '../../assets/img/icons/exit-icon.svg';
import More from '../../assets/img/icons/profile-icon-more.svg';
import Share from '../../assets/img/icons/profile-icon-share.svg';
import FacebookLogo from '../../assets/img/icons/profile-logo-fb.svg';
import InstLogo from '../../assets/img/icons/profile-logo-inst.svg';
import TwitterLogo from '../../assets/img/icons/profile-logo-tw.svg';
import {
  ProfileCollectibles,
  ProfileCreated,
  ProfileLiked,
  UploaderButton,
} from '../../components';
import { storeApi, userApi } from '../../services/api';
import { ConnectWalletService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
import { clog, clogData } from '../../utils/logger';

import './Profile.scss';

type TypeLink = {
  name: string;
  href: string;
  img: string;
};

interface INewUser {
  id: number | string | null;
  address: string;
  displayName: string | null;
  avatar: string | null;
  bio: string | null;
  customUrl: string | null;
  twitter: string | null;
  instagram: string | null;
  facebook: string | null;
  site: string | null;
  cover: string | null;
  follows: any[];
  followsCount: number | null;
  followers: any[];
  followersCount: number | null;
  isVerificated: boolean;
}

const ProfilePage: React.FC = observer(() => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<INewUser>();

  const [collectibles, setCollectibles] = useState<any>({});

  const { user } = useMst();
  const walletConnector = new ConnectWalletService();

  const { userId } = useParams<{ userId: string | undefined }>();
  const history = useHistory();
  const params = new URLSearchParams(useLocation().search);
  const [activeTab, setActiveTab] = useState(params.get('tab') ?? 'my-collection');

  const self = user.id === (userId ?? '0');

  const links: TypeLink[] = [
    {
      name: 'twitter',
      href: user.twitter ? `https://twitter.com/${currentUser?.twitter}` : '',
      img: TwitterLogo,
    },
    {
      name: 'instagram',
      href: user.instagram ? `https://www.instagram.com/${currentUser?.instagram}` : '',
      img: InstLogo,
    },
    {
      name: 'facebook',
      href: currentUser?.facebook || '',
      img: FacebookLogo,
    },
  ];

  const loadUser = useCallback(() => {
    userApi
      .getUser({ id: userId ?? '0' })
      .then(({ data }) => {
        setCurrentUser({
          id: data.id,
          address: data.address,
          displayName: data.display_name,
          avatar: data.avatar,
          bio: data.bio,
          customUrl: data.custom_url,
          twitter: data.twitter,
          instagram: data.instagram,
          facebook: data.facebook,
          site: data.site,
          cover: data.cover,
          follows: data.follows,
          followsCount: data.follows_count,
          followers: data.followers,
          followersCount: data.followers_count,
          isVerificated: data.is_verificated,
        });
      })
      .catch((err) => {
        clogData(err, 'get user');
      });
  }, [userId]);

  const loadCollectibles = useCallback(
    (page = 1) => {
      if (currentUser?.address) {
        storeApi
          .getCollectibles(currentUser?.address ?? '', page)
          .then(({ data }) => {
            setCollectibles({ tokens: [...data], length: data.length });
          })
          .catch((err: any) => {
            clogData(err, 'get tokens');
          });
      }
    },
    [currentUser],
  );

  useEffect(() => {
    if (!self) {
      loadUser();
    } else {
      setCurrentUser({
        id: user.id,
        address: user.address,
        displayName: user.display_name,
        avatar: user.avatar,
        bio: user.bio,
        customUrl: user.custom_url,
        twitter: user.twitter,
        instagram: user.instagram,
        facebook: user.facebook,
        site: user.site,
        cover: user.cover,
        follows: user.follows,
        followsCount: user.follows_count,
        followers: user.followers,
        followersCount: user.followers_count,
        isVerificated: user.is_verificated,
      });
    }
  }, [self, loadUser, user]);

  const onHandleExit = () => {
    walletConnector.disconnect();
    user.disconnect();
  };

  const handleUploadCover = (file: any) => {
    setIsLoading(true);
    userApi
      .setUserCover(file)
      .then(({ data }) => {
        setIsLoading(false);
        user.setCover(data);
        clog('Congrats you changed the cover!');
        setCurrentUser((prevState: any) => {
          return {
            ...prevState,
            cover: data,
          };
        });
      })
      .catch((err) => {
        clogData('set cover error', err);
      });
  };
  useEffect(() => {
    const urlParams = new URLSearchParams();
    if (activeTab) {
      urlParams.append('tab', activeTab);
    } else {
      urlParams.delete('tab');
    }
    history.push({ search: urlParams.toString() });
  }, [activeTab, history]);
  useEffect(() => {
    loadCollectibles();
  }, [loadCollectibles]);

  const getShortAddress = () => {
    const addr = currentUser?.address || '';
    return `${addr.slice(0, 15)}...${addr.slice(addr.length - 4)}`;
  };

  return (
    <div className="container">
      {userId !== 'null' ? (
        <div className="profile">
          <div className="profile__top">
            <div className="bg-img">
              {currentUser?.cover ? <img src={currentUser?.cover} alt="cover" /> : ''}
            </div>
            <div className="avatar">
              {currentUser?.avatar ? <img src={currentUser?.avatar} alt="avatar" /> : ''}
            </div>
            {self ? (
              <div className="btns">
                <UploaderButton
                  type="button"
                  handleUpload={handleUploadCover}
                  isLoading={isLoading}
                />
                <button className="gradient-button" type="button">
                  <Link to="edit-profile">
                    Edit profile
                    <img src={Edit} alt="edit icon" />
                  </Link>
                </button>
                <button className="gradient-button exit" type="button" onClick={onHandleExit}>
                  <img src={Exit} alt="exit icon" />
                </button>
              </div>
            ) : (
              React.Fragment
            )}
          </div>
          <div className="profile__info">
            <div className="profile__info__name">{currentUser?.displayName || 'UserName'}</div>
            <div className="profile__info__bio">{currentUser?.bio || 'No biography info'}</div>
            <div className="gradient-button">
              <div className="id">
                {currentUser?.address ? getShortAddress() : ''}
                <img src={Coins} alt="coins" />
              </div>
            </div>
            <div className="profile__info__links">
              {links.map((link) => {
                if (link.href)
                  return (
                    <a className="link" href={link.href} target="_blank" rel="noreferrer">
                      <img src={link.img} alt={`${link.name} link`} />
                    </a>
                  );
                return '';
              })}
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
              className={`profile__navbar__tab ${
                activeTab === 'my-collection' ? 'active' : undefined
              }`}
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab('my-collection')}
              onKeyPress={() => {}}
            >
              My collection
            </div>
            <div
              className={`profile__navbar__tab ${activeTab === 'liked' ? 'active' : undefined}`}
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab('liked')}
              onKeyPress={() => {}}
            >
              Liked
            </div>
            <div
              className={`profile__navbar__tab ${activeTab === 'created' ? 'active' : undefined}`}
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab('created')}
              onKeyPress={() => {}}
            >
              Created
            </div>
          </div>
          {activeTab === 'my-collection' ? <ProfileCollectibles cards={collectibles} /> : ''}
          {activeTab === 'liked' ? <ProfileLiked address={currentUser?.address ?? ''} /> : ''}
          {activeTab === 'created' ? <ProfileCreated address={currentUser?.address ?? ''} /> : ''}
        </div>
      ) : (
        <div className="profile__info">
          <div className="profile__info__name">No user found</div>
          <div className="profile__info__bio">Please connect your wallet.</div>
          <Link to="/connect">
            <div className="gradient-button">
              <div className="id">Connect wallet</div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
});

export default ProfilePage;
