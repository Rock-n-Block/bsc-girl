import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ArrowLeftBlack from '../../assets/img/icons/arrow-left-black.svg';
import ArrowLeftRed from '../../assets/img/icons/arrow-left-red.svg';
import { CreateForm } from '../../forms';
import { ratesApi } from '../../services/api';
import { useWalletConnectService } from '../../services/connectwallet';
import { clogData } from '../../utils/logger';

import './CreateCollectible.scss';

type TypeCreateProps = {
  isSingle: boolean;
};

const CreateCollectiblePage: React.FC<TypeCreateProps> = ({ isSingle }) => {
  const walletConnector = useWalletConnectService();
  const [bscRate, setBscRate] = useState({});

  useEffect(() => {
    ratesApi
      .getRates()
      .then(({ data }) => {
        setBscRate(data);
      })
      .catch((error) => {
        clogData('getRates Error:', error);
      });
  }, []);

  return (
    <div className="container">
      <div className="create-collectible">
        <div className="create-collectible__title">
          <Link to="/create">
            <img src={ArrowLeftRed} alt="arrow left soft-red" className="link-red" />
            <img src={ArrowLeftBlack} alt="arrow left black" className="link-black" />
          </Link>
          Create&nbsp;
          <div className="red">{isSingle ? 'single' : 'multiple'}</div>
          &nbsp;collectible
        </div>
        <CreateForm
          isSingle={isSingle}
          walletConnector={walletConnector.connectorService}
          bscRate={bscRate}
        />
      </div>
    </div>
  );
};

export default CreateCollectiblePage;
