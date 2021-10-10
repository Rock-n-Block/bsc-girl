import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Upload } from 'antd';
import { useFormikContext } from 'formik';
import { observer } from 'mobx-react';

import Close from '../../assets/img/icons/close-icon.svg';
import Img from '../../assets/img/icons/img-icon.svg';
import { useMst } from '../../store/store';
import { clogData } from '../../utils/logger';

const { Dragger } = Upload;

interface IUploader {
  // eslint-disable-next-line react/require-default-props
  type?: 'area' | 'button';
  // eslint-disable-next-line react/require-default-props
  setFormat?: (file: any) => void;
  // eslint-disable-next-line react/require-default-props
  handleUpload?: (file: any) => void;
  // eslint-disable-next-line react/require-default-props
  className?: string;
  // eslint-disable-next-line react/require-default-props
  isLoading?: boolean;
  // eslint-disable-next-line react/require-default-props
  values?: any;
}

const UploaderButton: React.FC<IUploader> = observer(({
  type = 'area',
  isLoading = false,
  className,
  values,
  handleUpload,
  setFormat,
}) => {
  const [url, setUrl] = useState<any>();
  const { modals, user } = useMst();
  const location = useLocation();
  const formik = useFormikContext();

  const handleClear = () => {
    formik.setFieldValue('img', '');
    formik.setFieldValue('preview', '');
    setUrl('');
  };

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (type === 'area') formik.setFieldValue('preview', reader.result);
      callback(reader.result);
      clogData('preview:', formik.getFieldProps('preview'));
    });
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: any) => {
    const isValidType =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp' ||
      file.type === 'image/gif' ||
      (type === 'area' && file.type === 'audio/mpeg') ||
      (type === 'area' && file.type === 'video/mp4');
    if (!isValidType) {
      if (type === 'area') {
        modals.info.setMsg('You can only upload JPG, PNG, WEBP, GIF, MP3 or MP4 file!', 'error');
      } else modals.info.setMsg('You can only upload JPG, PNG, WEBP or GIF file!', 'error');
    }
    const isLt2M = file.size / 1024 / 1024 <= 30;
    if (!isLt2M) {
      modals.info.setMsg('Image must be smaller than 30MB!', 'error');
    }
    return isValidType && isLt2M;
  };

  const handleChange = ({ file }: any) => {
    const isValidType =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webp' ||
      file.type === 'image/gif' ||
      (type === 'area' && file.type === 'audio/mpeg') ||
      (type === 'area' && file.type === 'video/mp4');
    if (!isValidType) {
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 30;
    if (!isLt2M) {
      return;
    }
    if (type === 'area' && setFormat) setFormat(file.type.slice(0, file.type.indexOf('/')));
    if (handleUpload) {
      handleUpload(file.originFileObj);
    } else formik.setFieldValue('img', file.originFileObj);
    getBase64(file.originFileObj, (prop: string) => setUrl(prop));
  };

  return (
    <div className={`${className || ''} uploader`}>
      {type === 'area' ? (
        <>
          <Dragger
            beforeUpload={beforeUpload}
            onChange={handleChange}
            multiple={false}
            showUploadList={false}
          >
            <div
              className="create-form__upload__clear"
              onClick={handleClear}
              onKeyDown={() => {}}
              role="button"
              tabIndex={0}
            >
              <img src={Close} alt="close" />
            </div>
            {values.img ? (
              <>
                {values.format === 'image' ? (
                  <img src={url} alt="token preview" className="uploader__img" />
                ) : (
                  ''
                )}
                {values.format === 'video' ? (
                  <video controls className="uploader__img">
                    <source src={url} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                    <track kind="captions" />
                  </video>
                ) : (
                  ''
                )}
                {values.format === 'audio' ? (
                  <audio controls className="uploader__img">
                    <source src={url} />
                    <track kind="captions" />
                  </audio>
                ) : (
                  ''
                )}
              </>
            ) : (
              <p>PNG, GIF, WEBP, MP3, MP4. Max 30mb.</p>
            )}
          </Dragger>
        </>
      ) : (
        ''
      )}
      {type === 'button' ? (
        <Upload
          beforeUpload={beforeUpload}
          onChange={handleChange}
          multiple={false}
          showUploadList={false}
        >
          {location.pathname === `/profile/${user.id}` ? (
            <button type="button" className="gradient-button">
              Edit cover photo
              <img src={Img} alt="img icon" />
            </button>
          ) : (
            <button className="upload__btn" type="button">
              {isLoading ? 'In progress...' : 'Upload'}
            </button>
          )}
        </Upload>
      ) : (
        ''
      )}
    </div>
  );
});

export default UploaderButton;
