import React, { FC } from 'react';
import style from './Header.module.scss';

type Props = {
  time: string;
  date: string;
  city: string;
  country: string;
};

const Header: FC<Props> = ({ time, date, city, country }) => {
  return (
    <div className={style.header}>
      <div>
        <h1 className={style.heading}>{time}</h1>
        <h2 className={style.heading2}>{date}</h2>
      </div>
      <div className={style.place}>
        <h2 className={style.heading2}>{city}</h2>
        <h3 className={style.heading3}>{country}</h3>
      </div>
    </div>
  );
};

export default Header;
