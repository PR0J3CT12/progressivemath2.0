import React, {useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {route} from "../index";

export const StudentPage = () => {
    const [user, setUser] = useState(null)
    const { sid } = useParams()

    useEffect(() => {
        fetch(`${route}/api/@me`, {
            credentials: 'include'
        }).then(
            res => res.json()
        ).then(
            res => {
                setUser(res)
            }
        )
    }, [])

    if (user === null) {
        return (
            <div> Loading... </div>
        )
    } else if ((user["details"]["id"] === parseInt(sid)) || (user["details"]["id"] === 0)) {
        return (
            <div className="StudentPage">
                student page | {sid}
            </div>
        )
    } else {
        window.location.href = '/login'
        return (
            <div />
        )
    }
}
