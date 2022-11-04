import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from "./httpClient"
import {route} from "../index";
import { ReactComponent as Logo } from '../logo_blue.svg';


export const AdminProfileComponent = (user) => {
    if (user['user'] === null) {
        return (
            <div> Loading... </div>
        )
    } else if (user['user']['details']['is_admin'] === true) {
        return (
            <div className='AdminProfileComponent row_1 block adminProfile'>
                <div className='logoHolder'><Logo /></div>
                <div className='textHolder'><p>Добро пожаловать, <b>{user['user']['details']['name']}</b>!</p></div>
            </div>
        )
    } else {
        return (
            <div> Something went wrong </div>
        )
    }
}
