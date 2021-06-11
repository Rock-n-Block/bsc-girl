import React from 'react';

import './style.scss';
import {
  formatNumberWithSpace,
  formatNumberWithSpaceBack,
  formatNumberWithDots,
  setToStorage,
  getFromStorage,
} from '../../utils';

const Input = React.memo((props) => {
  let {
    name = '',
    type = 'text',
    disabled = false,
    error = false,
    label,
    labelInner,
    placeholder = '',
    styleCustom = {},
    big = false,
    medium = false,
    focused = false,
    value = '',
    formatNumber = false,
    dynamicFontSize = false,
    onChange = (v) => {},
    onFocus = (v) => {},
  } = props;

  const [newPlaceholder, setNewPlaceholder] = React.useState(placeholder);

  // setToStorage(`input-${name}`,value);
  // if (formatNumber) value = formatNumberWithDots(value);

  const handleChange = (e) => {
    let value = e.target.value;
    // console.log('Input',value)
    // if (formatNumber) value = getFromStorage(`input-${name}`);
    // console.log('Input',value)
    onChange(value);
  };

  const handleFocus = (e) => {
    setNewPlaceholder('');
    onFocus(e);
  };

  const handleBlur = (e) => setNewPlaceholder(placeholder);

  const isError = error ? 'error' : '';
  const classNameInput = big
    ? `input-big ${isError}`
    : medium
    ? `input-medium ${isError}`
    : `input ${isError}`;

  return (
    <div className={`input-container ${error ? 'error' : ''}`}>
      {label && (
        <label
          htmlFor="input"
          className={big ? 'input-label-big' : 'input-label'}>
          {label}
        </label>
      )}
      <div className={`input-container-inner`}>
        <div className={`input-container-input`}>
          <input
            id="input"
            disabled={disabled}
            ref={(r) => r && focused && r.focus()}
            className={classNameInput}
            style={{ ...styleCustom }}
            type={type}
            placeholder={newPlaceholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        {labelInner && <div className="input-label-inner">{labelInner}</div>}
      </div>
    </div>
  );
});

export default Input;
