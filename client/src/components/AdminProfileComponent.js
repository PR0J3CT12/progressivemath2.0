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



export const AdminProfileComponent = (user) => {
    const [rotating, setRotating] = useState(false)
    const link = document.location.pathname
    let state
    if (link.includes('settings')) {
        state = 1
    } else {
        state = 0
    }

    const changeState = () => {
        if (rotating) {
            setRotating(false)
        } else {
            setRotating(true)
        }
    }

    if (user['user'] === null) {
        return (
            <div> Loading... </div>
        )
    } else if (user['user']['details']['is_admin'] === true) {
        return (
            <div className='AdminProfileComponent row_1 block adminProfile'>
                <a className={'logoHolder' + (rotating?' rotating':'')} onClick={changeState}><Logo /></a>
                <div className='infoHolder'>
                    <div className='textHolder'>
                        <p>Добро пожаловать, <b>{user['user']['details']['name']}</b>!</p>
                    </div>
                    <div className='buttonsHolder'>
                        <a className={(state === 0) ? 'adminSettingsButton' : 'tablesButton'} href={(state === 0) ? '/admin/settings': '/admin'}>{(state === 0) ? (<Settings />): (<Tables />)}</a>
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
