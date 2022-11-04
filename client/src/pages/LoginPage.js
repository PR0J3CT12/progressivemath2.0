import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import httpClient from "../components/httpClient"
import {ReactComponent as Logo} from "../logo.svg";
import {route, route_tmp} from "../index";


export const LoginPage = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)
    const [response, setResponse] = useState(null)

    const logInUser = async () => {
        try {
            const res = await httpClient.post(`${route}/api/login`, {
                login: login,
                password: password
            }).catch(function (e) {
                if (e.status !== 200) {
                    setError(true)
                    setLogin('')
                    setPassword('')
                }
                console.log(e.toJSON());
            })
            setLogin('')
            setPassword('')
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetch(`${route}/api/@me`, {
            credentials: 'include'}).then(
            res => res.json()
        ).then(
            res => {
                setUser(res)
            }
        )
    }, [])

    const onLoginChange = (inputValue) => {
        setLogin(inputValue)
    }

    const handleLoginChange = (e) => {
        onLoginChange(e.target.value)
    }

    const onPasswordChange = (inputValue) => {
        setPassword(inputValue)
    }

    const handlePasswordChange = (e) => {
        onPasswordChange(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    const navigate = useNavigate()
    if (user === null) {
        return (
            <div> Loading... </div>
        )
    } else if (user["state"] === "error") {
        return (
            <div className="LoginPage">
                <form className="login_form" onSubmit={handleSubmit}>
                    <input className="" type="text" required value={login} onChange={handleLoginChange} placeholder="Логин"/>
                    <input className="" type="password" required value={password} onChange={handlePasswordChange} placeholder="Пароль"/>
                    <input className="" type="submit" onClick={logInUser} disabled={(!password) || (!login)} value="Войти"/>
                </form>
                {error &&
                    <div className='registration_error'>Неверный логин или пароль</div>
                }
            </div>
        )
    } else {
        console.log(user)
        if (user["details"]["is_admin"] === true) {
            window.location.href = `/admin`
        } else {
            window.location.href = `/profile/${user["details"]["id"]}`
        }
        return (
            <div />
        )
    }
}
