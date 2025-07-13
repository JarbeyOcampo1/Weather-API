import { useState } from 'react';
import './App.css';

function App() {
  
  //Estados para almacenar los datos
  const [ciudad, setCiudad] = useState('');
  const [clima, setClima] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  //funcion para obtner el clima
  const obtenerClima = async (event) => {
    //evitar que se vuelva a recargar la pagina
    event.preventDefault();
    
    // Validar que no esté vacío
    if (!ciudad.trim()) {
      setError('Por favor ingresa una ciudad');
      return;
    }

    //limpia los errores y marca si ya esta cargado
    setCargando(true);
    setError(null);
    
    //try catch para el manejo de errores 
    try {

      //llave de la API OpenWeatherMap
      const Api= '1d626871f566257183edd1dc017d684a';

       // Realiza la petición a la API con la ciudad ingresada
      const respuesta = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${ciudad.trim()}&appid=${Api}&units=metric&lang=es`
      );

      //Si la respuestas es diferente a ok , se muestra el error
      if (!respuesta.ok) {
        throw new Error('Ciudad no encontrada. Prueba con otro nombre.');
      }
      
      //convierte la respuesta en un objeto
      const datos = await respuesta.json();

      //muestra los datos en el estado
      setClima(datos);
    } catch (error) {
      //en caso de error muestra el error y limpia el estado
      setClima(null);
      setError(error.message);
    } finally {
      //desmarca el estado de cargando
      setCargando(false);
    }
  };

  return (
    <div className='clima-container'>
      {/*Titulo del componente*/}
      <h1 className='clima-h1 title'>Consulta el Clima</h1>
      {/*Formulario con el ingreso de datos y el envio de los datos*/}
      <form onSubmit={obtenerClima}>
        <input  className='clima-input' type="text" placeholder="Ej: Madrid, Bogotá, Buenos Aires" value={ciudad} onChange={(e) => setCiudad(e.target.value)}/>
        <button className='clima-button' type="submit" disabled={cargando}> {cargando ? 'Buscando...' : 'Buscar'} </button>
      </form>
      {/*Muestra un mensaje de error si hay alguno*/}
      {error && <p className="clima-error">{error}</p>}
      {/*Muestra el clima de una ciudad si se ha encontrado*/}
      {clima && (
        <div className="resultado-clima">
          <h3 className='clima-h3'>Clima en {clima.name}</h3>
          <p className='clima-p'>🌡️ Temperatura: {Math.round(clima.main.temp)} °C</p>
          <p className='clima-p'>💧 Humedad: {clima.main.humidity} %</p>
          <p className='clima-p'>🌥️ Condición: {clima.weather[0].description}</p>
          <p className='clima-p'>🌬️ Viento: {clima.wind?.speed} m/s</p>
          <p className='clima-p'>☁️ Nubes: {clima.clouds?.all} %</p>
        </div>
      )}
    </div>
  );
}

export default App;