<script>
import { onMount } from "svelte";
let info;


  let fakeApiLink = "http://localhost:3011/data";
  
  const get = async (url)=>{
    let res = await fetch(url);
    if(!res.ok){
      throw new Error(`Error: '${res.status}`);
    }
    let data = await res.json();
    return data;
  }
  onMount(async ()=>{
  get(fakeApiLink)
  .then(res=>{
    info = res.name;
    console.log(res);
  })
  .catch(err=>{console.log(err)});

  });

</script>

{#if info}
  <h1>{info}</h1>
{/if}

<!-- backend codes:
const express = require('express');
    var http = require('https');
    var cors = require('cors');
    const app = express();
    bodyParser = require('body-parser')
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());

    app.get('/',(req,res)=>{
        res.sendFile(__dirname+'/index.html');
        }
    );
    app.get('/data',(req,res)=>{
        res.send({name:"sultan",age:23});
        }
    );

    app.post('/', (req, res) => {
        let city = req.body.city;
        const appid = "eca3e85d739a2706e48286ace306f97d";
        const api = "https://api.openweathermap.org/data/2.5/weather"
        let link = `${api}?q=${city}&appid=${appid}`;
        let data = '';
        http.get(link, (response) => {
            response.on('data', (data) => {
                let weatherDadta = JSON.parse(data);
                console.log(weatherDadta.weather[0].description);
                console.log(weatherDadta.main.feels_like);
                let weatherId = weatherDadta.weather[0].id;
                let weatherIcon = weatherDadta.weather[0].icon;
                let iconSrc = `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`            
                res.write(`<h1>Weather in ${city.toLocaleUpperCase()}</h1>`);
                res.write(`<h2>Temperature: <span style='color:red'>${weatherDadta.main.temp}</span> Deg F</h2>`);
                res.write(`<img src=${iconSrc}>`);
                // res.write(data);
                res.send();
            })
        });
    }
    );

    app.listen(3011, () => {
        console.log('server is running on http://localhost:3011');
    }
); -->
