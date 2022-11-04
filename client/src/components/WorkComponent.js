import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from "./httpClient"
import {route} from "../index";
import Select from 'react-select';


export const WorkComponent = () => {
    const [name, setName] = useState('')
    const [theme, setTheme] = useState('')
    const [grades, setGrades] = useState('')
    const [themes, setThemes] = useState(null)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState(null)
    const [response, setResponse] = useState(null)
    const [works, setWorks] = useState(null)

    useEffect(() => {
        fetch(`${route}/api/theme/get-all`, {
            credentials: 'include'
        }).then(
            res => res.json()
        ).then(
            res => {
                setThemes(res)
            }
        )
    }, [])

    useEffect(() => {
        fetch(`${route}/api/work/get-all`, {
            credentials: 'include'}).then(
            res => res.json()
        ).then(
            res => {
                setWorks(res)
            }
        )
    }, [])

    let themesTypes = []
    if (themes) {
        for (let i = 0; i < themes['details']['themes'].length; i++) {
            let type = themes['details']['themes'][i]['type']
            let value = themes['details']['themes'][i]['id']
            let label
            if (type === 0) {
                label = themes['details']['themes'][i]['name'] + ' | домашняя работа'
            } else if (type === 1) {
                label = themes['details']['themes'][i]['name'] + ' | классная работа'
            } else if (type === 2) {
                label = themes['details']['themes'][i]['name'] + ' | блиц'
            } else if (type === 3) {
                label = themes['details']['themes'][i]['name'] + ' | экзамен письменный'
            } else if (type === 4) {
                label = themes['details']['themes'][i]['name'] + ' | экзамен устный'
            } else {
                label = themes['details']['themes'][i]['name'] + ' | вне статистики'
            }
            themesTypes.push({value: value, label: label})
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setName('')
        setTheme('')
        setGrades('')
    }

    const onNameChange = (inputValue) => {
        setName(inputValue)
    }

    const handleNameChange = (e) => {
        onNameChange(e.target.value)
    }

    const onThemeChange = (inputValue) => {
        setTheme(inputValue)
    }

    const handleThemeChange = (e) => {
        onThemeChange(e.target.value)
    }

    const onGradesChange = (inputValue) => {
        setGrades(inputValue)
    }

    const handleGradesChange = (e) => {
        onGradesChange(e.target.value)
    }

    const postWork = async () => {
        try {
            const res = await httpClient.post(`${route}/api/work/create`, {
                name: name,
                theme_id: theme['value'],
                grades: grades
            }).then(res => setResponse(res)).then(fetchWorks)
                .catch(function (e) {
                    if (e.status !== 200) {
                        setError(true)
                        setName('')
                    setTheme('')
                    setGrades('')
                    }
                    console.log(e.toJSON());
                  });
        } catch (e) {
            console.log(e)
        }
    }

    const fetchWorks = async () => {
        try {
            const res = await httpClient.get(`${route}/api/work/get-all`, {
            }).then(res => setWorks(res["data"])).then(res => setResponse(res))
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

    const deleteWork = async (id_) => {
        try {
            const res = await httpClient.post(`${route}/api/work/delete`, {
                id: id_
            }).then(res => setResponse(res)).then(fetchWorks)
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

    const deleteAllWorks = async () => {
        try {
            const res = await httpClient.delete(`${route}/api/work/delete-all`).then(res => setResponse(res)).then(fetchWorks)
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

    if (works === null) {
        return (
            <div> Loading... </div>
        )
    } else if (works['state'] === 'success') {
        return (
            <div className="WorkComponent">
                <form className="work_form" onSubmit={handleSubmit}>
                    <input className="" type="text" required value={name} onChange={handleNameChange} placeholder="Название"/>
                    <Select defaultValue={theme} options={themesTypes} onChange={onThemeChange} placeholder="Тема" />
                    <input className="" type="text" required value={grades} onChange={handleGradesChange} placeholder="Оценки"/>
                    <input className="" type="submit" onClick={postWork} disabled={(!name) || (!theme) || (!grades)} value="Создать"/>
                </form>
                {response &&
                    <div className='student_form_message'>{response["data"]["message"]}</div>
                }
                {error &&
                    <div className='work_form_error'>Введены неверные данные</div>
                }
                <div className="">
                    {works["details"]["works"].map(work =>
                        <a target="_blank" rel="noopener noreferrer" key={work.id}>
                            <div className="work">
                                {work["name"]} {work["type_text"]} {work["grades"].map((grade, index) => <button key={index} disabled>{grade}</button>)}
                                <button className="delete_work" onClick={() => deleteWork(work["id"])}>X</button>
                            </div>
                        </a>
                    )}
                </div>
                <button className="delete_works" onClick={() => deleteAllWorks()}>Удалить все темы</button>
            </div>
        )
    } else {
        return (
            <div> Something went wrong </div>
        )
    }
}
