import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import httpClient from "../components/httpClient"
import {ReactComponent as Logo} from "../svgs/logo_white100x100.svg";
import {ReactComponent as VK} from "../svgs/vk.svg";
import {route, route_tmp} from "../index";


export const LoginPage = () => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [error, setError] = useState(false)
    const [response, setResponse] = useState(null)

    const redirect = async (response) => {
        console.log(response)
        if (response["data"]["details"]["permissions"] === 1) {
            window.location.href = `/admin`
        } else {
            window.location.href = `/profile/${response["data"]["details"]["id"]}`
        }
    }

    const logInUser = async () => {
        try {
            const res = await httpClient.post(`${route}/api/login`, {
                login: login,
                password: password
            }).then(res => redirect(res))
                .catch(function (e) {
                    if (e.status !== 200) {
                        setError(true)
                        setLogin('')
                        setPassword('')
                }
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
            <div></div>
        )
    } else if (user["state"] === "error") {
        document.body.style.overflow = "hidden"
        return (
                <div className="LoginPage background-wrap">
                    <div className='loginHolder'>
                        <div className='loginInnerHolder'>
                            <div className='loginLogo'>
                                <Logo />
                            </div>
                            <div className='loginText'>
                                Курсы прогрессивной математики
                            </div>
                        </div>
                        <div className='loginBlock'>
                            <form className="loginForm" onSubmit={handleSubmit}>
                                <div className='firstRow'>
                                    <input className="login" type="text" required value={login} onChange={handleLoginChange} placeholder="Логин"/>
                                    <input className="password" type="password" required value={password} onChange={handlePasswordChange} placeholder="Пароль"/>
                                </div>
                                <div className='secondRow'>
                                    {error &&
                                        <div className='loginError'>Неверный логин или пароль</div>
                                    }
                                    <input className="loginButton" type="submit" onClick={logInUser} disabled={(!password) || (!login)} value="Войти"/>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="bubble x1"></div>
                    <div className="bubble x2"></div>
                    <div className="bubble x3"></div>
                    <div className="bubble x4"></div>
                    <div className="bubble x5"></div>
                    <div className="bubble x6"></div>
                    <div className="bubble x7"></div>
                    <div className="bubble x8"></div>
                    <div className="bubble x9"></div>
                    <div className="bubble x10"></div>
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
