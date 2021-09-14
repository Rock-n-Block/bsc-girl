import React from 'react';
import { useHistory } from 'react-router-dom';
import { withFormik } from 'formik';
import { observer } from 'mobx-react';

import { userApi } from '../../../services/api';
import { useMst } from '../../../store/store';
import { clog } from '../../../utils/logger';
import { validateForm } from '../../../utils/validate';
import ProfileComponent, { IProfile } from '../component';

const EditProfile: React.FC = observer(() => {
  const { user } = useMst();
  const history = useHistory();

  const props: IProfile = {
    displayName: user.name || '',
    customUrl: user.custom_url || '',
    bio: user.bio || '',
    twitter: user.twitter || '',
    instagram: user.instagram || '',
    facebook: user.facebook || '',
    site: user.site || '',
    img: '',
    preview: `https://${user.avatar}` || '',
    isLoading: false,
  };
  const FormWithFormik = withFormik<any, IProfile>({
    enableReinitialize: true,
    mapPropsToValues: () => props,
    validate: (values) => {
      return validateForm({
        values,
        notRequired: ['displayName', 'customUrl', 'bio', 'twitter', 'instagram', 'img', 'preview'],
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
      formData.append('facebook', values.facebook ? values.facebook : '');

      userApi
        .update(formData)
        .then(({ data }) => {
          user.update(data);
          clog('Congrats you successfully changed your profile');
        })
        .catch((err) => {
          clog('Something went wrong');
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
