import React, {useEffect, useState} from 'react'
import {route} from "../index";
import {StudentComponent} from "../components/StudentComponent";
import {ThemeComponent} from "../components/ThemeComponent";
import {WorkComponent} from "../components/WorkComponent";

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
            <div className="AdminSettingsPage">
                <p>Student:</p>
                <StudentComponent />
                <p>Theme:</p>
                <ThemeComponent />
                <p>Work:</p>
                <WorkComponent />
            </div>
        )
    } else {
        window.location.href = '/login'
        return (
            <div />
        )
    }
}
