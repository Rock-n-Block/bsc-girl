import React from 'react';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';

import { validateForm } from '../../../utils/validate';
import CreateComponent, { ICreateForm } from '../component';

interface CreateProps {
  isSingle: boolean;
}

const CreateForm: React.FC<CreateProps> = observer(({ isSingle }) => {
  const FormWithFormik = withFormik<any, ICreateForm>({
    handleSubmit(): void {},
    enableReinitialize: true,
    mapPropsToValues: () => ({
      img: '',
      preview: '',
      price: '',
      format: '',
      currency: 'BSCGIRL',
      tokenName: '',
      selling: false,
      tokenDescription: '',
      tokenRoyalties: '',
      numberOfCopies: '',
      tokenProperties: [
        {
          size: '',
          amount: '',
        },
      ],
    }),
    validate: (values) => {
      const notRequired: string[] = ['tokenDescription', 'preview', 'price'];
      if (isSingle) {
        notRequired.push('numberOfCopies');
      }

      return validateForm({ values, notRequired });
    },

    displayName: 'CreateForm',
  })(CreateComponent);

  return <FormWithFormik isSingle={isSingle} />;
});

export default CreateForm;
