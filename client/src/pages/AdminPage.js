import React, {useEffect, useState} from 'react'
import {route} from "../index";
import {StudentComponent} from "../components/StudentComponent";
import {ThemeComponent} from "../components/ThemeComponent";
import {WorkComponent} from "../components/WorkComponent";
import {TableComponent} from "../components/TableComponent";
import {ManaWaitersComponent} from "../components/ManaWaitersComponent";
import {AdminProfileComponent} from "../components/AdminProfileComponent";

export const AdminPage = () => {
    const [user, setUser] = useState(null)

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
    } else if (user["details"]["id"] === 0) {
        return (
            <div className='AdminPage'>
                <h1>Панель администратора</h1>
                <div className='adminContainer'>
                    <AdminProfileComponent user={user}/>
                    <div className='row_2'>
                        <ManaWaitersComponent />
                        <TableComponent />
                    </div>
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
