import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from "./httpClient"
import {route} from "../index";
import Select from 'react-select';


export const ThemeComponent = () => {
    const [name, setName] = useState('')
    const [type, setType] = useState(null)
    const [error, setError] = useState(false)
    const [response, setResponse] = useState(null)
    const [themes, setThemes] = useState(null)

    const themesTypes = [
        {value: 0, label: 'Домашняя работа'},
        {value: 1, label: 'Классная работа'},
        {value: 2, label: 'Блиц'},
        {value: 3, label: 'Экзамен письменный'},
        {value: 4, label: 'Экзамен устный'},
        {value: 5, label: 'Не учитывать в статистике'}
    ]

    useEffect(() => {
        fetch(`${route}/api/theme/get-all`, {
            credentials: 'include'}).then(
            res => res.json()
        ).then(
            res => {
                setThemes(res)
            }
        )
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        setName('')
        setType(null)
        setError(null)
    }

    const onNameChange = (inputValue) => {
        setName(inputValue)
    }

    const handleNameChange = (e) => {
        onNameChange(e.target.value)
    }

    const onTypeChange = (inputValue) => {
        setType(inputValue)
    }

    const handleTypeChange = (e) => {
        onTypeChange(e.target.value)
    }

    const postTheme = async () => {
        try {
            const res = await httpClient.post(`${route}/api/theme/create`, {
                name: name,
                type: type['value']
            }).then(res => setResponse(res)).then(fetchThemes)
                .catch(function (e) {
                    if (e.status !== 200) {
                        setError(true)
                            setName('')
                    setType(null)
                    }
                    console.log(e.toJSON());
                  });
        } catch (e) {
            console.log(e)
        }
    }

    const fetchThemes = async () => {
        try {
            const res = await httpClient.get(`${route}/api/theme/get-all`, {
            }).then(res => setThemes(res["data"])).then(res => setResponse(res))
                .catch(function (e) {
                    if (e.status !== 200) {
                        setError(true)
                    }
                    console.log(e.toJSON());
                  });
        } catch (e) {
            console.log(e)
        }
    }

    const deleteTheme = async (id_) => {
        try {
            const res = await httpClient.post(`${route}/api/theme/delete`, {
                id: id_
            }).then(res => setResponse(res)).then(fetchThemes)
                .catch(function (e) {
                    if (e.status !== 200) {
                        setError(true)
                    }
                    console.log(e.toJSON());
                  });
        } catch (e) {
            console.log(e)
        }
    }

    const deleteAllThemes = async () => {
        try {
            const res = await httpClient.delete(`${route}/api/theme/delete-all`).then(res => setResponse(res)).then(fetchThemes)
                .catch(function (e) {
                    if (e.status !== 200) {
                        setError(true)
                    }
                    console.log(e.toJSON());
                  });
        } catch (e) {
            console.log(e)
        }
    }

    if (themes === null) {
        return (
            <div> Loading... </div>
        )
    } else if (themes['state'] === 'success') {
        return (
            <div className="ThemeComponent">
                <form className="theme_form" onSubmit={handleSubmit}>
                    <input className="" type="text" required value={name} onChange={handleNameChange}
                           placeholder="Название"/>
                    <Select defaultValue={type} options={themesTypes} onChange={onTypeChange} placeholder="Тип"/>
                    <input className="" type="submit" onClick={postTheme} disabled={(!name) || (!type)}
                           value="Создать"/>
                </form>
                {response &&
                    <div className='student_form_message'>{response["data"]["message"]}</div>
                }
                {error &&
                    <div className='theme_form_error'>Введены неверные данные</div>
                }
                <div className="">
                    {themes["details"]["themes"].map(theme =>
                        <a target="_blank" rel="noopener noreferrer" key={theme.id}>
                            <div className="theme">
                                {theme["name"]} {theme["type_text"]}
                                <button className="delete_theme" onClick={() => deleteTheme(theme["id"])}>X</button>
                            </div>
                        </a>
                    )}
                </div>
                <button className="delete_themes" onClick={() => deleteAllThemes()}>Удалить все темы</button>
            </div>
        )
    } else {
        return (
            <div> Something went wrong </div>
        )
    }
}