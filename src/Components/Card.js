import React from 'react'
import './Card.css'
import Fetch from './fetchWeather'

export default function Card() {
    return (
        <div className='app-container'>
            <div className='container'>
                <Fetch />


            </div>
        </div>
    )
}