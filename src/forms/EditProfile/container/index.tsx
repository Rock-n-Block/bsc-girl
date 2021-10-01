import React from 'react';
import { useHistory } from 'react-router-dom';
import { withFormik } from 'formik';
import { observer } from 'mobx-react';

import { userApi } from '../../../services/api';
import { useMst } from '../../../store/store';
import { clog, clogData } from '../../../utils/logger';
import { validateForm } from '../../../utils/validate';
import ProfileComponent, { IProfile } from '../component';

const EditProfile: React.FC = observer(() => {
  const { modals, user } = useMst();
  const history = useHistory();

  const props: IProfile = {
    displayName: user.display_name || '',
    customUrl: user.custom_url || '',
    bio: user.bio || '',
    twitter: user.twitter || '',
    instagram: user.instagram || '',
    email: user.email || '',
    site: user.site || '',
    img: '',
    preview: user.avatar || '',
    isLoading: false,
  };
  const FormWithFormik = withFormik<any, IProfile>({
    enableReinitialize: true,
    mapPropsToValues: () => props,
    validate: (values) => {
      return validateForm({
        values,
        notRequired: [
          'displayName',
          'customUrl',
          'bio',
          'twitter',
          'instagram',
          'email',
          'img',
          'preview',
          'site',
        ],
      });
    },

    handleSubmit: (values, { setFieldValue }) => {
      setFieldValue('isLoading', true);
      const formData = new FormData();
      formData.append('avatar', values.img);
      formData.append('display_name', values.displayName ? values.displayName : '');
      formData.append('bio', values.bio ? values.bio : '');
      formData.append('custom_url', values.customUrl ? values.customUrl : '');
      formData.append('twitter', values.twitter ? values.twitter : '');
      formData.append('instagram', values.instagram ? values.instagram : '');
      formData.append('email', values.email ? values.email : '');
      formData.append('site', values.site ? values.site : '');

      userApi
        .update(formData)
        .then(({ data }) => {
          user.update(data);
          modals.info.setMsg('Congrats you successfully changed your profile', 'success');

          const verifyData = new FormData();
          verifyData.append('url', values.customUrl ? values.customUrl : '');
          verifyData.append('address', user.address);
          verifyData.append('role', 'creator');
          verifyData.append('bio', values.bio ? values.bio : '');
          verifyData.append('twitter', values.twitter ? values.twitter : '');
          verifyData.append('media', values.img);
          verifyData.append('instagram', values.instagram ? values.instagram : '');
          verifyData.append('website', values.site ? values.site : '');
          verifyData.append('email', values.email ? values.email : '');

          userApi
            .verifyMe(verifyData)
            .then(() => {
              modals.info.setMsg(
                'Congrats you have successfully submitted a verification request',
                'success',
              );
            })
            .catch((err: any) => {
              if (err.message === 'Request failed with status code 400') {
                clog(`Your verification already in progress`);
              } else {
                clogData('error', err.message);
              }
              clog(err.message);
            })
            .finally(() => {
              setTimeout(() => window.location.reload(), 1000);
            });
        })
        .catch((err) => {
          modals.error.setErr('Something went wrong');
          clog(err);
        })
        .finally(() => {
          setFieldValue('isLoading', false);
          history.push(`/profile/${user.id}`);
        });
    },

    displayName: 'IProfile',
  })(ProfileComponent);
  return <FormWithFormik />;
});

export default EditProfile;
