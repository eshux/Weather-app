import React, { FC } from 'react';
import style from './SearchBox.module.scss';

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  placeholder: string;
  btnText: string;
};

const SearchBox:FC<Props> = ({ value, onChange, onClick, placeholder, btnText }) => {
  return (
    <>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={style.input}
      />
      <button type="button" onClick={onClick} className={style.button}>
        {btnText}
      </button>
    </>
  );
};

export default SearchBox;
