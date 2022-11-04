import React, {useEffect, useState} from 'react'
import {route} from "../index";


export const LogoutPage = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch(`${route}/api/logout`, {
            credentials: 'include'}).then(
            res => res.json()
        ).then(
            user => {
                setData(user)
            }
        )
    }, [])

    if (data) {
        window.location.href = '/login'
        return (
            <div />
        )
    } else {
        return (
            <div />
        )
    }
}