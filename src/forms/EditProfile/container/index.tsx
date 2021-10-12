import React from 'react';
import { useHistory } from 'react-router-dom';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';

import { userApi } from '../../../services/api';
import { useMst } from '../../../store/store';
import { clogData } from '../../../utils/logger';
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
        notRequired: ['bio', 'twitter', 'instagram', 'img', 'preview', 'site'],
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
          history.push(`/profile/${user.id}`);
        })
        .catch((err: any) => {
          modals.info.setMsg(
            `${Object.keys(err.response.data)[0]}: ${Object.values(err.response.data)[0]}`,
            'error',
          );
          clogData('err:', err.response.data);
        })
        .finally(() => {
          setFieldValue('isLoading', false);
        });
    },

    displayName: 'IProfile',
  })(ProfileComponent);
  return <FormWithFormik />;
});

export default EditProfile;
