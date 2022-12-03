import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from "./httpClient"
import {route} from "../index";
import Select from 'react-select';
import {ReactComponent as Trash} from "../svgs/trash-can.svg";
import {ReactComponent as DeadLogo} from "../svgs/logo_dead.svg";
import { ReactComponent as Reload } from '../svgs/reload.svg';


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
            <div />
        )
    } else if (themes['state'] === 'success') {
        return (
            <div className="ThemeComponent">
                <div className='adminSettingsLabel'>
                    <div className='labelText'>Темы</div>
                    <form className="elementsForm" onSubmit={handleSubmit}>
                        <input className="field" type="text" required value={name} onChange={handleNameChange}
                               placeholder="Название"/>
                        <Select className='themesSelect' classNamePrefix={'themes-select'} noOptionsMessage={() => <div className='deadLogoHolderSmall'><DeadLogo /></div>} defaultValue={type} options={themesTypes} onChange={onTypeChange} placeholder="Тип"/>
                        <div className='mixButtons'>
                            <input className="button" type="submit" onClick={postTheme} disabled={(!name) || (!type)}
                                   value="Создать"/>
                            <a className='reloadButton'><Reload /></a>
                        </div>
                    </form>
                </div>
                {response &&
                    <div className='student_form_message'>{response["data"]["message"]}</div>
                }
                {error &&
                    <div className='theme_form_error'>Введены неверные данные</div>
                }
                <div className="elementsList">
                    {themes["details"]["themes"].map(theme => <div key={theme.id}>
                            <div className="theme elementButtons">
                                <div className='elementName'>{theme["name"]} <i className='elementType'>{theme["type_text"]}</i></div>
                                <a className="deleteElement" onClick={() => deleteTheme(theme["id"])}><Trash /></a>
                            </div>
                    </div>
                    )}
                </div>
                <button className="button deleteAllButton" onClick={() => deleteAllThemes()}>Удалить все темы</button>
            </div>
        )
    } else {
        return (
            <div> Something went wrong </div>
        )
    }
}