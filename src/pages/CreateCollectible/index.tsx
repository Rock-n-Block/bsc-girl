import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import ArrowLeftBlack from '../../assets/img/icons/arrow-left-black.svg';
import ArrowLeftRed from '../../assets/img/icons/arrow-left-red.svg';
import { CreateForm } from '../../forms';
import { ratesApi } from '../../services/api';
import { ConnectWalletService } from '../../services/connectwallet';
import { clogData } from '../../utils/logger';

import './CreateCollectible.scss';

type TypeCreateCollectibleProps = {
  collectible: string;
};

const CreateCollectiblePage: React.FC<TypeCreateCollectibleProps> = ({ collectible }) => {
  const walletConnector = new ConnectWalletService();
  const [bscRate, setBscRate] = useState(1);

  ratesApi
    .getRates()
    .then(({ data }) => {
      setBscRate(data[0].rate);
    })
    .catch((error) => {
      clogData('getRates Error:', error);
    });

  return (
    <div className="container">
      <div className="create-collectible">
        <div className="create-collectible__title">
          <Link to="/create">
            <img src={ArrowLeftRed} alt="arrow left soft-red" className="link-red" />
            <img src={ArrowLeftBlack} alt="arrow left black" className="link-black" />
          </Link>
          Create&nbsp;
          <div className="red">{collectible}</div>
          &nbsp;collectible
        </div>
        <CreateForm
          isSingle={collectible === 'single'}
          walletConnector={walletConnector}
          bscRate={bscRate}
        />
      </div>
    </div>
  );
};

export default CreateCollectiblePage;
