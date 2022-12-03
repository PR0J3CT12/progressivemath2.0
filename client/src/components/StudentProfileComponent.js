import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from "./httpClient"
import {route} from "../index";
import { ReactComponent as Logo } from '../svgs/logo_blue100x100.svg';
import { ReactComponent as Settings } from '../svgs/settings.svg';
import { ReactComponent as GoBack } from '../svgs/go-back.svg';
import { ReactComponent as Logout } from '../svgs/logout.svg';
import { ReactComponent as LoginStats } from '../svgs/stats.svg';
import { ReactComponent as Tables } from '../svgs/table.svg';
import { ReactComponent as Rating } from '../svgs/rating.svg';
import { ReactComponent as Download } from '../svgs/download.svg';


export const StudentProfileComponent = (user) => {

    const seed = Math.floor(Math.random() * 4)
    let greetings
    if (seed === 0) {
        greetings = 'Приветствую тебя, '
    } else if (seed === 1) {
        greetings = 'Здравствуй, '
    } else if (seed === 2) {
        greetings = 'Добро пожаловать, '
    } else if (seed === 3) {
        greetings = 'Привет, '
    }

    if (user['user'] === null) {
        return (
            <div />
        )
    } else if (user['user']) {
        return (
            <div className='StudentProfileComponent row_1 block studentProfile'>
                <a className='logoHolder'><Logo /></a>
                <div className='infoHolder'>
                    <div className='textHolder'>
                        <p>{greetings}<b>{user['user']['details']['name']}</b>!</p>
                    </div>
                    <div className='buttonsHolder'>
                        <a className='ratingButton' href={'/rating'}><Rating /></a>
                        <a className='loginStatsButton' href={'/login-stats'}><LoginStats /></a>
                        <a className='downloadButton' href={'/'}><Download /></a>
                        <a className='logoutButton' href={'/logout'}><Logout /></a>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div> Something went wrong </div>
        )
    }
}
