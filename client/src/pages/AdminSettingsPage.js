import React, {useEffect, useState} from 'react'
import {route} from "../index";
import {StudentComponent} from "../components/StudentComponent";
import {ThemeComponent} from "../components/ThemeComponent";
import {WorkComponent} from "../components/WorkComponent";
import {AdminProfileComponent} from "../components/AdminProfileComponent";
import {ManaWaitersComponent} from "../components/ManaWaitersComponent";
import {TableComponent} from "../components/TableComponent";

export const AdminSettingsPage = () => {
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
            <div>
                <div className="AdminPage">
                    <h1>Панель администратора</h1>
                    <div className='adminContainer'>
                        <AdminProfileComponent user={user}/>
                        <div className='row_2 adminSettingsRow'>
                            <div className='block yScroll'>
                                <StudentComponent />
                            </div>
                            <div className='block yScroll'>
                                <ThemeComponent />
                            </div>
                            <div className='block yScroll'>
                                <WorkComponent />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer">Created by @nickrotay. 2022.</div>
            </div>
        )
    } else {
        window.location.href = '/login'
        return (
            <div />
        )
    }
}
