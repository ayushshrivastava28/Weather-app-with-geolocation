import React from "react";
import img from './pin.png'

const Form = props => (
    <form style={{ padding: "5px", opacity: 0.8 }} onSubmit={props.getWeather} >
        <button disabled><img style={{ height: "15px", marginTop: '10%' }} src={img} /></button>
        <input style={{ height: "20px" }} type="text" name="city" placeholder="City..." />
        <button style={{ height: "25px" }}>Get Weather</button>
    </form>
);

export default Form;