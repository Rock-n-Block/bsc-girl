import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';

import Bag from '../../../assets/img/icons/bag.svg';
import CheckMarkWhite from '../../../assets/img/icons/check-mark-white.svg';
import Loader from '../../../assets/img/icons/loader.svg';
import Pencil from '../../../assets/img/icons/pencil.svg';
import { storeApi } from '../../../services/api';
import { useMst } from '../../../store/store';
import { clog, clogData } from '../../../utils/logger';
import { validateForm } from '../../../utils/validate';
import CreateComponent, { ICreateForm } from '../component';

interface CreateProps {
  isSingle: boolean;
  walletConnector: any;
  bscRate: number;
}

const CreateForm: React.FC<CreateProps> = observer(({ isSingle, walletConnector, bscRate }) => {
  const history = useHistory();
  const [isModalOpen, setModalOpen] = useState(false);
  let step = 'approve';
  const [approveStatus, setApproveStatus] = useState({ text: 'In progress...', img: Loader });
  const [uploadStatus, setUploadStatus] = useState({ text: 'Start now', img: Pencil });
  const [signStatus, setSignStatus] = useState({ text: 'Start now', img: Bag });
  const { user } = useMst();

  const closeModal = () => {
    setModalOpen(false);
  };

  const goToNextStep = () => {
    if (step === 'approve') {
      setApproveStatus({ text: 'Done', img: CheckMarkWhite });
      setUploadStatus({ text: 'In progress...', img: Loader });
      step = 'upload';
    } else if (step === 'upload') {
      setUploadStatus({ text: 'Done', img: CheckMarkWhite });
      setSignStatus({ text: 'In progress...', img: Loader });
      step = 'sign';
    } else {
      setSignStatus({ text: 'Done', img: CheckMarkWhite });
      setTimeout(() => {
        closeModal();
      }, 500);
    }
  };

  const FormWithFormik = withFormik<any, ICreateForm>({
    enableReinitialize: true,
    mapPropsToValues: () => ({
      img: '',
      preview: '',
      price: '',
      currency: 'BSCGIRL',
      tokenName: '',
      tokenDescription: '',
      tokenRoyalties: '',
      numberOfCopies: '',
      tokenProperties: [
        {
          size: '',
          amount: '',
        },
      ],
      bscRate: bscRate || 0,
      closeModal,
      isModalOpen,
      // eslint-disable-next-line object-shorthand
      approveStatus: approveStatus,
      // eslint-disable-next-line object-shorthand
      uploadStatus: uploadStatus,
      // eslint-disable-next-line object-shorthand
      signStatus: signStatus,
    }),
    validate: (values) => {
      const notRequired: string[] = ['tokenDescription', 'preview'];
      if (isSingle) {
        notRequired.push('numberOfCopies');
      }

      return validateForm({ values, notRequired });
    },

    handleSubmit: (values) => {
      setModalOpen(true);
      const formData = new FormData();
      formData.append('media', values.img);
      formData.append('format', 'gif');
      formData.append('name', values.tokenName);
      formData.append('total_supply', isSingle ? '1' : values.numberOfCopies.toString());
      formData.append('description', values.tokenDescription);
      formData.append('price', values.price.toString());
      formData.append('creator_royalty', values.tokenRoyalties.toString());
      formData.append('standart', isSingle ? 'ERC721' : 'ERC1155');
      formData.append('currency', values.currency);
      formData.append('collection', '2');
      formData.append('selling', 'true');

      if (values.tokenProperties[0].size) {
        const details: any = {};
        values.tokenProperties.forEach((item) => {
          if (item.size) {
            details[item.size] = item.amount;
          }
        });

        formData.append('details', details);
      }
      goToNextStep();

      const collectionData = new FormData();
      collectionData.append('name', 'multipleTokensCollection');
      collectionData.append('avatar', values.img);
      collectionData.append('symbol', 'bscgirl');
      collectionData.append('standart', 'ERC1155');
      collectionData.append('creator', localStorage.bsc_token);

      // storeApi
      //   .createCollection(collectionData)
      //   .then(({ data }) => {
      //     walletConnector
      //       .sendTransaction(user.address, data)
      //       .then((res: any) => {
      //         collectionData.append('tx_hash', res.transactionHash);
      //
      //         storeApi
      //           .saveCollection(collectionData)
      //           .then(() => {
      //             clog('Congrats you created your own NFT collection! It will be added soon.');
      //           })
      //           .catch((err: any) => {
      //             // modals.info.setMsg('An error occurred while creating the collection', 'error');
      //             clogData('saveCollection error:', err);
      //           });
      //       })
      //       .catch((err: any) => {
      //         clogData('sendTransaction error:', err);
      //       });
      //   })
      //   .catch((err: any) => {
      //     clogData('createCollection error:', err);
      //   });

      storeApi
        .createToken(formData)
        .then(({ data }) => {
          goToNextStep();
          clogData('data', data.initial_tx);
          walletConnector
            .sendTransaction(user.address, data.initial_tx)
            .then(() => {
              history.push(`/token/${data.id}`);
              clog('Congrats you create your own NFT!');
              goToNextStep();
            })
            .catch((err: any) => {
              clog('Something went wrong');
              clogData('err', err);
            });
        })
        .catch((error) => {
          clogData('formData price:', formData.get('price'));
          clogData('createToken error:', error);
        });
    },

    displayName: 'CreateForm',
  })(CreateComponent);

  return <FormWithFormik isSingle={isSingle} />;
});

export default CreateForm;
