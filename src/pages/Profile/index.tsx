import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import Coins from '../../assets/img/icons/coins-icon.svg';
import Edit from '../../assets/img/icons/edit-icon.svg';
import Exit from '../../assets/img/icons/exit-icon.svg';
import InstLogo from '../../assets/img/icons/profile-logo-inst.svg';
import TwitterLogo from '../../assets/img/icons/profile-logo-tw.svg';
import Verified from '../../assets/img/icons/verification.svg';
import {
  ProfileCollectibles,
  ProfileCreated,
  ProfileLiked,
  UploaderButton,
} from '../../components';
import { storeApi, userApi } from '../../services/api';
import { useWalletConnectService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
import { clogData } from '../../utils/logger';

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
  site: string | null;
  cover: string | null;
  follows: any[];
  followsCount: number | null;
  followers: any[];
  followersCount: number | null;
  isVerified: boolean;
}

const ProfilePage: React.FC = observer(() => {
  const params = new URLSearchParams(useLocation().search);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingContent, setLoadingContent] = useState<boolean>(true);
  const [isShowCopied, setShowCopied] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<INewUser>();
  const [activeTab, setActiveTab] = useState(params.get('tab') ?? 'my-items');
  const [collectibles, setCollectibles] = useState<any>({});
  const { modals, user } = useMst();
  const walletConnector = useWalletConnectService();
  const { userId } = useParams<{ userId: string | undefined }>();
  const history = useHistory();
  const self = (user.id ? user.id.toString() : '') === (userId ?? '0');

  const links: TypeLink[] = [
    {
      name: 'twitter',
      href: currentUser?.twitter ? `https://twitter.com/${currentUser?.twitter}` : '',
      img: TwitterLogo,
    },
    {
      name: 'instagram',
      href: currentUser?.instagram ? `https://www.instagram.com/${currentUser?.instagram}` : '',
      img: InstLogo,
    },
  ];

  const onHandleCopyAddress = () => {
    navigator.clipboard.writeText(currentUser?.address ?? '').then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  const getShortAddress = () => {
    const addr = currentUser?.address || '';
    return `${addr.slice(0, 15)}...${addr.slice(addr.length - 4)}`;
  };

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
        modals.info.setMsg('Congrats you changed the cover!', 'success');
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
          site: data.site,
          cover: data.cover,
          follows: data.follows,
          followsCount: data.follows_count,
          followers: data.followers,
          followersCount: data.followers_count,
          isVerified: data.is_verificated,
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
            setLoadingContent(false);
          })
          .catch((err: any) => {
            clogData('get tokens', err);
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
        site: user.site,
        cover: user.cover,
        follows: user.follows,
        followsCount: user.follows_count,
        followers: user.followers,
        followersCount: user.followers_count,
        isVerified: user.is_verificated,
      });
    }
  }, [loadUser, self, user]);

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
              {currentUser?.isVerified ? (
                <img className="avatar__verified" src={Verified} alt="verified" />
              ) : (
                ''
              )}
            </div>
            {self ? (
              <div className="btns">
                <UploaderButton
                  type="button"
                  handleUpload={handleUploadCover}
                  isLoading={isLoading}
                />
                <button className="gradient-button" type="button">
                  <Link to="/edit-profile">
                    Edit profile
                    <img src={Edit} alt="edit icon" />
                  </Link>
                </button>
                <button className="gradient-button exit" type="button" onClick={onHandleExit}>
                  <img src={Exit} alt="exit icon" />
                </button>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="profile__info">
            <div className="profile__info__name">{currentUser?.displayName || 'UserName'}</div>
            <div className="profile__info__bio">{currentUser?.bio || 'No biography info'}</div>
            {isShowCopied ? (
              <div className="profile__info__copied">Address copied to clipboard</div>
            ) : (
              ''
            )}
            <button type="button" onClick={onHandleCopyAddress} className="gradient-button">
              <div className="id">
                {currentUser?.address ? getShortAddress() : ''}
                <img src={Coins} alt="coins" />
              </div>
            </button>
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
            </div>
          </div>
          <div className="profile__navbar">
            <div
              className={`profile__navbar__tab ${activeTab === 'my-items' ? 'active' : undefined}`}
              role="button"
              tabIndex={0}
              onClick={() => setActiveTab('my-items')}
              onKeyPress={() => {}}
            >
              {self ? 'My items' : 'Items'}
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
          {activeTab === 'my-items' ? (
            <ProfileCollectibles tokens={collectibles.tokens} isLoading={isLoadingContent} />
          ) : (
            ''
          )}
          {activeTab === 'liked' && currentUser?.address ? (
            <ProfileLiked address={currentUser.address ?? ''} />
          ) : (
            ''
          )}
          {activeTab === 'created' && currentUser?.address ? (
            <ProfileCreated address={currentUser.address ?? ''} />
          ) : (
            ''
          )}
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
