import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'flexboxgrid';
import moment from 'moment';
import lookup from 'country-code-lookup';
import style from './App.module.scss';
import SearchBox from './components/SearchBox/SearchBox';
import Header from './components/Header/Header';
import Forecast from './components/Forecast/Forecast';

type WeatherData = {
  name: string;
  timezone: number;
  main: {
    temp: number;
    feels_like: number;
  };
  sys: {
    country: string;
  };
  weather: [
    {
      icon: string;
      main: string;
      description: string;
    }
  ];
};

type NextDays = {
  main: {
    temp: number;
  };
  dt: number;
  weather: {
    icon: string;
    description: string;
    main: string;
  }[];
}[];

const imgData = [
  {
    type: ['Drizzle', 'Rain'],
    img: 171,
  },
  {
    type: ['Thunderstorm', 'Tornado'],
    img: 1019,
  },
  {
    type: ['Clear'],
    img: 327,
  },
  {
    type: ['Snow'],
    img: 559,
  },
  {
    type: ['Clouds'],
    img: 350,
  },
  {
    type: ['Mist', 'Smoke', 'Fog', 'Ash'],
    img: 472,
  },
];

const rigaTime = moment().format('HH:mm');
const rigaDate = moment().format('LL');

const App = () => {
  const [currentWeatherData, setCurrentWeatherData] = useState<WeatherData>();
  const [timezone, setTimezone] = useState<number>(0);
  const [inputValue, setInputValue] = useState('');
  const [cityData, setCityData] = useState('Riga');
  const [counter, setCounter] = useState(0);
  const [time, setTime] = useState(rigaTime);
  const [date, setDate] = useState(rigaDate);
  const [nextDays, setNextDays] = useState<NextDays>([]);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/find?q=${cityData}&units=metric&appid=0099190512b15b203f7f3a981660c38d`
      )
      .then((response) => {
        setCurrentWeatherData(response.data.list[0]);
      });

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityData}&lang=en&appid=0099190512b15b203f7f3a981660c38d&units=metric`
      )
      .then((response) => {
        // @ts-ignore
        const days = response.data.list.filter((it) => {
          if (it.dt_txt.split(' ').includes('15:00:00')) {
            return it;
          }
          return '';
        });
        setNextDays(days);
        setTimezone(response.data.city.timezone);
      })
      .catch((error) => {
        alert('Something went wrong, please try again');
      });
  }, [cityData]);


  useEffect(() => {
    const timer = setTimeout(() => {
      if (timezone >= 0 || timezone <= 0) {
        const myTimeUTC = Number(moment().format('x'));
        const myTimezoneOffset = Number(moment().format('ZZ')) * 36000;
        const currentTime = myTimeUTC - myTimezoneOffset + timezone * 1000;
        setTime(moment(currentTime).format('HH:mm'));
        setDate(moment(currentTime).format('LL'));
      }
      setCounter(counter + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [counter, cityData, timezone]);

  let imgNumber = 1019;

  if (!currentWeatherData) {
    return <h1>Loading...</h1>;
  }

  imgData.forEach((it) => {
    if (it.type.includes(currentWeatherData.weather[0].main)) {
      imgNumber = it.img;
    }
  });

  return (
    <section
      className={style.app}
      style={{
        background: `url(https://picsum.photos/id/${imgNumber}/2000/1000) no-repeat fixed center`,
      }}
    >
      <div className="container container-fluid ">
        <div className="row between-xs">
          <div className="col-xs-12">
            <Header
              time={time}
              date={date}
              city={currentWeatherData.name}
              country={
                lookup.byIso(`${currentWeatherData.sys.country}`).country
              }
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <SearchBox
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onClick={() => setCityData(inputValue)}
              btnText="Search"
              placeholder="Enter a city name.."
            />
            <Forecast
              temp={currentWeatherData.main.temp}
              icon={`http://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}.png`}
              description={currentWeatherData.weather[0].description}
              date="now:"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <div className={style.dayWrapper}>
              {nextDays &&
                nextDays.map((it) => {
                  return (
                    <Forecast
                      key={it.dt}
                      className='nextDays'
                      icon={`http://openweathermap.org/img/wn/${it.weather[0].icon}.png`}
                      date={moment(it.dt * 1000).format('ddd')}
                      temp={it.main.temp}
                      description={it.weather[0].description}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;
