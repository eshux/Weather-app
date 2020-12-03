import React, { FC } from 'react';
import style from './Forecast.module.scss';

type Props = {
  temp: number;
  icon: string;
  description: string;
  date: string;
  className?: string;
};

const Forecast: FC<Props> = ({ temp, icon, description, date, className }) => {
  return (
    <>
      {className ? (
        <div className={style.next}>
          <h3>{date}</h3>
          <img src={icon} alt="" />
          <h1>{temp}°C</h1>
          <span>{description}</span>
        </div>
      ) : (
        <div className={style.wrapper}>
          <div>
            <h5 className={style.date}>{date}</h5>
            <span className={style.temp}>{temp}°C</span>
            <img src={icon} alt="" />
          </div>
          <span>{description}</span>
        </div>
      )}
    </>
  );
};

export default Forecast;
