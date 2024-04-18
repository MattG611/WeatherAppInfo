import React, { useState, useEffect } from 'react';
import { Container, Row, Card, Button, Alert } from 'react-bootstrap';

const WeatherAppInfo = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const savedCities = JSON.parse(localStorage.getItem('cities')) || [];
    setCities(savedCities);
  }, []);

  const API_KEY = 'c32b22e57feb3e254e5f973bb0726be7';
  const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
      if (!response.ok) {
        throw new Error('City not found! Please enter a valid city name :)');
      }
      const data = await response.json();
      setWeatherData(data);
      setError(null);
      updateCities(data);
    } catch (error) {
      setError(error.message);
      setWeatherData(null);
    }
  };

  const updateCities = (data) => {
    const updatedCities = [...cities, data];
    setCities(updatedCities);
    localStorage.setItem('cities', JSON.stringify(updatedCities));
  };

  const handleSearch = () => {
    if (city !== '') {
      fetchWeatherData();
    }
  };

  const handleRemoveCard = (index) => {
    const updatedCities = cities.filter((_, i) => i !== index);
    setCities(updatedCities);
    localStorage.setItem('cities', JSON.stringify(updatedCities));
  };

  const handleChangeCity = (e) => {
    setCity(e.target.value);
  };

  return (
    <Container>
      <h1 className="mt-4 mb-4" style={{ textAlign: 'center', color: '#ffc0cb' }}>Weather App Information</h1>
      <div className="mb-4" style={{ textAlign: 'center' }}>
        <input
          type="text"
          value={city}
          onChange={handleChangeCity}
          placeholder="Enter city name"
          className="mr-2"
          style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ffc0cb' }}
        />
        <Button variant="primary" onClick={handleSearch} style={{ color: 'pink', border: '1px solid #ffc0cb'}}>
          Search
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row style={{ display: 'flex', justifyContent: 'center' }}>
        {cities.map((cityData, index) => (
          <Card key={index} style={{ width: '18rem', margin: '10px', border: '1px solid #ffc0cb', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
            <Card.Body>
              <Card.Title style={{ color: 'pink' }}>{cityData.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted" style={{ color: 'pink' }}>Temperature: {cityData.main.temp} °C</Card.Subtitle>
              <Card.Text style={{ color: 'pink' }}>Weather: {cityData.weather[0].description}</Card.Text>
              <Card.Text style={{ color: 'pink' }}>Wind Speed: {cityData.wind.speed} m/s</Card.Text>
              <Card.Text style={{ color: 'pink' }}>Humidity: {cityData.main.humidity} %</Card.Text>
              <Button variant="danger" onClick={() => handleRemoveCard(index)}>Remove</Button>
            </Card.Body>
          </Card>
        ))}
      </Row>
    </Container>
  );
};

export default WeatherAppInfo;
