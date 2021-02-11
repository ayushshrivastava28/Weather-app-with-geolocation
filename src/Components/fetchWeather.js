import React, { useState, useEffect } from 'react'
import Form from './Form'
import useGeolocation from './Geolocation'
import { Line } from 'react-chartjs-2';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import AppBar from '@material-ui/core/AppBar';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Carousel from 'react-elastic-carousel'
import './Card.css'
const FetchWeather = () => {
    const [temperature, setTemperature] = useState("")
    const [city, setCity] = useState("")
    const [humidity, setHumidity] = useState("")
    const [pressure, setPressure] = useState("")
    const [desc, setDesc] = useState("")
    const [error, setError] = useState("")
    const [sunrise, setSunrise] = useState("")
    const [sunset, setSunset] = useState("")
    const [weatherCondition, setWeatherCondition] = useState('')
    const location = useGeolocation()
    const [foreData, setForeData] = useState([])
    // const [dailyData, setDailyData] = useState({});
    const API_KEY = "Enter your API key";
    const classes = useStyles();
    // console.log("weather: ", weatherCondition)


    useEffect(() => {
        if (location.loaded) {
            const api = city ? `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric` : `http://api.openweathermap.org/data/2.5/weather?lat=${location.coordinates.lat}&lon=${location.coordinates.lng}&appid=${API_KEY}&units=metric`
            const forecast = city ? `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric` : `http://api.openweathermap.org/data/2.5/forecast?lat=${location.coordinates.lat}&lon=${location.coordinates.lng}&appid=${API_KEY}&units=metric`
            fetch(api).then((res) => res.json()).then((data) => {
                console.log(data)
                console.log(api)
                setCity(data.name);
                setTemperature(parseInt(data.main.temp));
                setHumidity(data.main.humidity);
                setPressure(data.main.pressure)
                setDesc(data.weather[0].description)
                setSunrise(new Date(data.sys.sunset * 1000).toLocaleTimeString().slice(0, 4))
                setSunset(new Date(data.sys.sunrise * 1000).toLocaleTimeString().slice(0, 4))
                setWeatherCondition(data.weather[0].icon)
                setError('')
            }).catch((e) => { });

            fetch(forecast).then((res) => res.json()).then((data2) => {
                console.log("data2" + JSON.stringify(data2))
                setForeData(data2.list)
                setError('')
            }).catch((e) => { console.log(e.message) });
        }
    }, [location])

    const getWeather = async (e) => {
        e.preventDefault();
        const city = e.target.elements.city.value;
        const api = city ? `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric` : `http://api.openweathermap.org/data/2.5/weather?lat=${location.coordinates.lat}&lon=${location.coordinates.lng}&appid=${API_KEY}&units=metric`
        const api_call = await fetch(api);
        const data = await api_call.json();
        console.log("data: ", data)

        //forcast data
        const forecast = city ? `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric` : `http://api.openweathermap.org/data/2.5/forecast?lat=${location.coordinates.lat}&lon=${location.coordinates.lng}&appid=${API_KEY}&units=metric`
        const forecast_api_call = await fetch(forecast)
        const forecastData = await forecast_api_call.json()
        console.log("forecast: ", forecastData)

        if (city) {
            setCity(data.name);
            setTemperature(parseInt(data.main.temp));
            setHumidity(data.main.humidity);
            setPressure(data.main.pressure)
            setDesc(data.weather[0].description)
            setSunrise(new Date(data.sys.sunset * 1000).toLocaleTimeString().slice(0, 4))
            setSunset(new Date(data.sys.sunrise * 1000).toLocaleTimeString().slice(0, 4))
            setWeatherCondition(data.weather[0].icon)
            setForeData(forecastData.list)
            setError('')
        } else {
            setCity('');
            setTemperature('');
            setHumidity('');
            setPressure('')
            setDesc('')
            setSunrise('')
            setSunset('')
            setWeatherCondition('')
            setForeData({})
            setError('Please enter the values.')
        }
    }

    console.log("data to be mapped: ", foreData)
    // console.log("indexing: ", foreData[0].main.temp)
    return (
        <div className='app-container'>
            <div className='container'>
                <AppBar position="static" color="inherit">
                    <Form getWeather={getWeather} />
                </AppBar>
                <div style={{ height: "100px" }}>
                    {foreData ? (<Carousel breakPoints={foreData} itemsToShow={4} pagination={false} showArrows={false} focusOnSelect={true}>
                        {foreData.map((key, index) => {
                            return (
                                <>
                                    <Grid key={index} container direction="row" justify="space-around" alignItems="center" className={classes.tr}>
                                        <Card style={{ height: "60px", margin: '1px', padding: "50px", margin: "1px", marginRight: "55%", backgroundColor: '#fff' }}>{parseInt(key.main.temp_min) + "° "}
                                            {parseInt(key.main.temp_max) + '°'}
                                            {key.weather.map((desc, i) => {
                                                return (
                                                    <>
                                                        <div key={i} >{<img style={{ height: "40px" }} src={`http://openweathermap.org/img/wn/${desc.icon}@2x.png`} alt="icon" />}</div>
                                                        <div key={i + 1}>{desc.main}</div>
                                                    </>
                                                )
                                            })}
                                        </Card>
                                    </Grid>



                                </>
                            )
                        })}
                    </Carousel>) : null}
                </div>

                <Card className={classes.root}>
                    <CardContent style={{ marginTop: '10%' }}>
                        <Paper className={classes.paper}>
                            <Grid item xs container direction="row" >
                                <Typography><h1>{temperature + '°'} C </h1></Typography>
                                <img src={`http://openweathermap.org/img/wn/${weatherCondition}@2x.png`} alt="icon" />
                            </Grid>
                            <Grid>
                                {foreData[0] ? (
                                    <Line
                                        data={{
                                            labels: foreData.map((data) => data.main.temp),
                                            datasets: [{
                                                data: foreData.map((data) => data.main.temp_max),
                                                borderColor: 'blue',
                                                backgroundColor: '#fff',
                                                // fill: true,
                                                // hidden: true
                                            },

                                            ],
                                        }}
                                        options={{
                                            legend: {
                                                display: false
                                            },
                                            tooltips: {
                                                enabled: false
                                            },
                                            scales: {
                                                yAxes: [{
                                                    ticks: {
                                                        display: false,
                                                        stepSize: 2

                                                    }
                                                }],
                                                xAxes: [{
                                                    ticks: {
                                                        autoSkip: true,
                                                        maxTicksLimit: 6,
                                                        stepSize: 2

                                                    }
                                                }]
                                            },

                                        }}
                                    />
                                ) : null
                                }
                            </Grid>

                            <Grid container direction="row" justify="space-around" alignItems="center">
                                <Card style={{ padding: "10px", margin: "10px", marginRight: "55%", backgroundColor: '#ced6db' }}>Pressure{" " + pressure + " hpa"}</Card>
                                <Card style={{ padding: "10px", margin: "10px", marginLeft: "55%", marginTop: '-31%', backgroundColor: '#ced6db' }}>Humidity{" " + humidity + "%"}</Card>
                            </Grid>

                        </Paper>
                        <Grid container direction="row" justify="space-around" alignItems="center">
                            <Card style={{ padding: "10px", margin: "10px", marginRight: "50%" }}>Sunrise{" " + sunrise + " "}am</Card>
                            <Card style={{ padding: "10px", margin: "10px", marginLeft: "50%", marginTop: '-18%' }}>Sunset{" " + sunset + " "}pm</Card>
                        </Grid>
                        <Typography variant="h5" component="h2">
                            {error}
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
export default FetchWeather
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        height: '100%'
    },
    paper: {

        padding: theme.spacing(4),
        direction: 'row',
        textAlign: 'center',
    },
    paperBox: {
        padding: theme.spacing(1)
    },
    tr: {
        background: "#f1f1f1",
        // width: '100%',
        '&:hover': {
            background: "#0394fc",
        },
    },
})
);
