import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
   const [zip, setZip] = useState("92868");
   const [todaysWeather, setTodaysWeather] = useState({});
   const [fiveDayWeather, setFiveDayWeather] = useState({});
   const defaultInput = "Enter Zip Code...";
   const [input, setInput] = useState(defaultInput);

   const handleInput = (e) => {
      setInput(e.target.value);
   };

   const handleButton = () => {
      setZip(input);
      setInput(defaultInput);
   };

   const handleFocus = (e) => {
      e.target.select();
   };
   const handleKeypress = (e) => {
      e.key === "Enter" && handleButton();
      e.key === "Enter" && e.target.blur();
   };

   useEffect(() => {
      const stealMyKey = "68eccd36babd51af6beed5dd5a4255c8";
      const currentWeatherAPI = `http://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=imperial&appid=${stealMyKey}`;
      const fiveDayWeatherAPI = `http://api.openweathermap.org/data/2.5/forecast?zip=${zip}&units=imperial&appid=${stealMyKey}`;

      const fetchTodaysWeather = async () => {
         const result = await axios(currentWeatherAPI);
         setTodaysWeather(result.data);
      };

      const fetchFiveDayWeather = async () => {
         const result = await axios(fiveDayWeatherAPI);
         const newList = result.data.list.filter(
            (time) => time.dt_txt.slice(-8) === "12:00:00"
         );
         setFiveDayWeather({ ...result.data, list: newList });
      };

      fetchTodaysWeather();
      fetchFiveDayWeather();
   }, [zip]);

   return (
      <div className="App">
         {todaysWeather.cod && fiveDayWeather.cod ? (
            <>
               <div className="today col">
                  <div className="todayHeader row">
                     <img
                        className="todayImage"
                        alt=""
                        src={`http://openweathermap.org/img/wn/${todaysWeather.weather["0"]["icon"]}@2x.png`}
                     />
                     <h1 className="bigInfo">
                        {Math.round(todaysWeather.main.temp) + "\xB0"}
                     </h1>
                  </div>
                  <span className="info">City: {todaysWeather.name}</span>
                  <span className="info">
                     Feels Like:{" "}
                     {Math.round(todaysWeather.main.feels_like) + "\xB0"}
                  </span>
                  <span className="info">
                     Min Temp:{" "}
                     {Math.round(todaysWeather.main.temp_min) + "\xB0"}
                  </span>
                  <span className="info">
                     Max Temp:{" "}
                     {Math.round(todaysWeather.main.temp_max) + "\xB0"}
                  </span>
                  <span className="info">
                     Humidity: {todaysWeather.main.humidity + "%"}
                  </span>
                  <span className="info">
                     Wind Speed: {todaysWeather.wind.speed}
                  </span>
               </div>

               <div className="options row">
                  <input
                     value={input}
                     onChange={handleInput}
                     onFocus={handleFocus}
                     onKeyPress={handleKeypress}
                  ></input>
                  <button onClick={handleButton}>Submit</button>
               </div>

               <footer className="row">
                  {fiveDayWeather.list.map((day, i) => (
                     <div key={i} className="future col">
                        <img
                           className="futureImage"
                           alt=""
                           src={`http://openweathermap.org/img/wn/${day.weather["0"]["icon"]}@2x.png`}
                        />
                        <span>Temp: {Math.round(day.main.temp) + "\xB0"}</span>
                        <span>Date: {day.dt_txt.slice(0, 10)}</span>
                        <span>Time: {day.dt_txt.slice(-9)}</span>
                     </div>
                  ))}
               </footer>
            </>
         ) : (
            <h1>LOADING...</h1>
         )}
      </div>
   );
}

export default App;
