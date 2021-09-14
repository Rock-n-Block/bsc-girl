import React, { ChangeEvent } from 'react';
import { Input } from 'antd';
import BigNumber from 'bignumber.js/bignumber';

interface InputNumberProps {
  id: undefined | string;
  value: string | number;
  // eslint-disable-next-line react/require-default-props
  className?: string;
  // eslint-disable-next-line react/require-default-props
  suffix?: string;
  // eslint-disable-next-line react/require-default-props
  size?: 'small' | 'middle' | 'large' | undefined;
  // eslint-disable-next-line react/require-default-props
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line react/require-default-props
  onBlur?: (e: any) => void;
  // eslint-disable-next-line react/require-default-props
  integer?: boolean;
  // eslint-disable-next-line react/require-default-props
  positiveOnly?: boolean;
  // eslint-disable-next-line react/require-default-props
  max?: number;
  // eslint-disable-next-line react/require-default-props
  min?: number;
}

const InputNumber: React.FC<InputNumberProps> = ({
  integer = false,
  positiveOnly = false,
  className,
  value,
  size,
  suffix,
  id,
  onBlur,
  placeholder,
  onChange,
  max,
  min,
}) => {
  const getRegex = () => {
    if (integer) {
      return positiveOnly ? /^[+]?[1-9]\d*$/ : /^[-+]?[1-9]\d*$/;
    }
    return positiveOnly ? /^[+]?([.]\d+|\d+[.]?\d*)$/ : /^[-+]?([.]\d+|\d+[.]?\d*)$/;
  };

  const checkMin = (comparingValue: string) => {
    const arrayedComparingValue = Array.from(String(comparingValue), Number);
    const arrayedMin = Array.from(String(min), Number);
    if (new BigNumber(min ?? 0).isLessThanOrEqualTo(comparingValue)) return true;
    for (let i = 0; i < arrayedComparingValue.length; i += 1) {
      if (
        !(
          (
            new BigNumber(arrayedMin[i]).isLessThanOrEqualTo(
              new BigNumber(arrayedComparingValue[i]),
            ) || // every symbol should be more or equal to min value
            (Number.isNaN(arrayedMin[i]) && Number.isNaN(arrayedComparingValue[i])) || // '.' elements
            (arrayedComparingValue[i] !== undefined && arrayedMin[i] === undefined)
          ) // if arrayedComparingValue longer than arrayedMin
        )
      ) {
        return false;
      }
    }
    return true;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reg = getRegex();
    const inputValue = e.target.value;
    if (
      (!Number.isNaN(inputValue) && reg.test(inputValue)) ||
      (!positiveOnly && inputValue === '-')
    ) {
      if (max && min) {
        if (checkMin(inputValue) && new BigNumber(inputValue) <= new BigNumber(max)) onChange(e);
      } else if (max) {
        if (new BigNumber(inputValue) <= new BigNumber(max)) onChange(e);
      } else if (min) {
        if (checkMin(inputValue)) onChange(e);
      } else onChange(e);
      // if (max) {
      //   if (new BigNumber(inputValue) <= new BigNumber(max)) onChange(e);
      // } else onChange(e);
    }
    if (inputValue === '') onChange(e);
  };
  return (
    <Input
      id={id}
      value={value}
      className={className}
      size={size}
      suffix={suffix}
      type="text"
      placeholder={placeholder}
      onChange={(e) => handleChange(e)}
      onBlur={onBlur}
    />
  );
};
export default InputNumber;
