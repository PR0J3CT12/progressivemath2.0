import React, {useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {route} from "../index";
import {StudentProfileComponent} from "../components/StudentProfileComponent";
import {ManaWaitersComponent} from "../components/ManaWaitersComponent";
import {TableComponent} from "../components/TableComponent";

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

    document.body.style.overflow = 'auto'
    if (user === null) {
        return (
            <div />
        )
    } else if ((user["details"]["id"] === parseInt(sid)) || (user["details"]["id"] === 0)) {
        return (
            <div className="StudentPage">
                <StudentProfileComponent user={user}/>
                <div className='row_2 studentBlock'>

                </div>
            </div>
        )
    } else {
        window.location.href = '/login'
        return (
            <div />
        )
    }
}
