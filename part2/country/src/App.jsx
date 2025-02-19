import { useEffect, useState } from 'react'
import axios from 'axios'

const ShowWeather = ({capital}) => {
  const api_key = import.meta.env.VITE_API_KEY;

  let data = [
    {'days':[
      {'temp': 'waiting'},
      {'wind': 'waiting'}
    ]},
    {'timezone': 'waiting'}
  ]

  useEffect(() => {
    axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${capital}/2025-2-15T19:00:00?key=${api_key}&include=days`)
    .then(
      response => {data = response.data
      console.log(data)
      }
    )
  }, [])
  return(
    <>
      {data.days && data.days.length > 0 ? (
      <>
        <p>Temperature: {data.days[0].temp}</p>
        <p>Timezone: {data.timezone}</p>
        <p>Wind: {data.days[0].windspeed} m/s</p>
      </>
    ) : (
      <p>Loading...</p>
    )}
    </>
  )
}

const ShowOneCountry = ({country, tag}) => {
  

  if(tag == 0)
    return(
      <></>
    )
  else
    return(
      <div>
          <h1>{country.name.common}</h1>
          <p>Capital {country.capital}</p>
          <p>Area {country.area}</p>
          <h2>Languages</h2>
          {Object.values(country.languages).map(language =>{
            return(
              <p key={language}>{language}</p>
            )
          })}
          <img src={country.flags['png']} alt="描述"  style={{ width: '100px' }} />
          <h2>Weather in {country.capital}</h2>
          <ShowWeather capital={country.capital} />
      </div>
    )
}

const ShowCountry = ({search, allcountries}) => {
  const regex = new RegExp(search, 'i');
  const countries_filter = allcountries.filter(country => country.name.common.match(regex))
  const [tags, setTags] = useState([]);

  // 使用 useEffect 来更新 tags
  useEffect(() => {
    setTags(Array(countries_filter.length).fill(0)); // 初始化状态数组
  }, [countries_filter.length]); // 依赖于 countries_filter.length


  const handleToggleTag = (index) => {
    const newTags = [...tags];
    newTags[index] = newTags[index] === 0 ? 1 : 0; // 切换状态
    setTags(newTags);
  };

  if(countries_filter.length > 10)
    return(
      <div>Too many matches, specify another filter</div>
    )
  else if(countries_filter.length == 1)
    return(
      <ShowOneCountry country={countries_filter[0]} tag={1} />
    )
  else
    return(
      <div>
        {countries_filter.map((country, index) => {
          return(
          <div key={country.name.official}>
            <p style={{ display: 'inline', margin: 0 }}>{country.name.common}</p> <button onClick={()=>handleToggleTag(index)}>Show</button>
            <ShowOneCountry country={country} tag={tags[index]} />
          </div>
        )})}
      </div>
    )
}

function App() {
  const [search, setSearch] = useState('')
  const [allcountries, setAllCountries] = useState([])

  const HandleSearch = (event) => {
    setSearch(event.target.value)  
  }

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
    .then(
      response => setAllCountries(response.data)
    )
  }, [])

  return (
    <>
      <div>
        find countries<input value={search} onChange={HandleSearch} ></input>
      </div>
      <ShowCountry search={search} allcountries={allcountries} />
    </>
  )
}

export default App
