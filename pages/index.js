import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const weatherDescriptionMap = {
  Clear: '晴れ',
  Clouds: '曇り',
  Rain: '雨',
  brokenclouds: '部分的に曇り'
}

const Weather = ({ weatherData }) => {
  const { name, main, weather } = weatherData
  const kelvinToCelsius = kelvin => {
    return (kelvin - 273.15).toFixed(2)
  }
  return (
    <div>
      <h2>現在の{name}の天気</h2>
      <p>気温: {kelvinToCelsius(main.temp)} °C</p>
      <p>
        天気:{' '}
        {weatherDescriptionMap[weather[0].description] ||
          weather[0].description}
      </p>
    </div>
  )
}

const App = () => {
  const [city, setCity] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weatherData, setWeatherData] = useState(null)
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)

  const getWeatherData = async () => {
    try {
      const openWeatherMapApiKey = '0ce155c6773cadbcb306f8991144c4b0'
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherMapApiKey}&dt=${selectedDate.getTime() /
        1000}`
      const response = await axios.get(apiUrl)
      setWeatherData(response.data)
      setError(null)
    } catch (error) {
      console.error('OpenWeatherMap APIからのデータの取得エラー:', error)
      setWeatherData(null)
      setError('エラー')
    }
  }

  const fetchEvents = async () => {
    try {
      const startOfMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      )
      const endOfMonth = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      )

      const calendarId =
        'c_3d0b72a09abcdc6c2d823f38db43a2bd5ce5319f9646dff2750a1283eb0edc7d@group.calendar.google.com'
      const apiKey = 'AIzaSyBzB5rFMq3AEJuQMFlM2cjS3n908R1cv04'
      const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${startOfMonth.toISOString()}&timeMax=${endOfMonth.toISOString()}`

      const response = await axios.get(apiUrl)
      setEvents(response.data.items)
    } catch (error) {
      console.error('GoogleカレンダーAPIからのデータの取得エラー:', error)
      setError('エラー')
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [selectedDate])

  const handleDateChange = date => {
    setSelectedDate(date)
  }

  return (
    <div>
      <h1>天気・月間予定</h1>
      <div>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat='MM/dd/yyyy'
        />
        <input
          type='text'
          placeholder='都市名を入力'
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <button onClick={getWeatherData}>現在の天気</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherData && <Weather weatherData={weatherData} />}
      <h2>自分の予定</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.summary}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
