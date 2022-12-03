import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from "./httpClient"
import {route} from "../index";
import Select from 'react-select';
import { ReactComponent as Reload } from '../svgs/reload.svg';
import {ReactComponent as DeadLogo} from "../svgs/logo_dead.svg";
import {ReactComponent as Trash} from "../svgs/trash-can.svg";
import {ReactComponent as Save} from "../svgs/save.svg";


export const WorkComponent = () => {
    const [name, setName] = useState('')
    const [theme, setTheme] = useState('')
    const [grades, setGrades] = useState('')
    const [themes, setThemes] = useState(null)
    const [changes, setChanges] = useState({})
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
        fetch(`${route}/api/work/get-all/theme-sorted`, {
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

    const handleCellInputChange = (e) => {
        const {id, value} = e.target
        let tmp_list_changes
        tmp_list_changes = changes
        tmp_list_changes[id] = value
        setChanges(tmp_list_changes)
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
            const res = await httpClient.get(`${route}/api/work/get-all/theme-sorted`, {
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

    const postChanges = async () => {
        try {
            let error_cell = document.getElementsByClassName('errorCell')
            if (error_cell.length !== 0) {
                error_cell[0].classList.remove("errorCell")
            }
            let formatted_changes = []
            for (let change in changes) {
                let key = change
                let spl_info = key.split('_')
                formatted_changes.push({"work_id": spl_info[1], "cell_number": spl_info[2], "value": changes[key]})
            }
            console.log(formatted_changes)
            await httpClient.post(`${route}/api/work/grade/update`, {
                changes: formatted_changes,
            }).then(res => setResponse(res))
        } catch (e) {
            if (e.response.status !== 200) {
                let error_cell = document.getElementById(e.response.data["details"]["cell_name"])
                error_cell.classList.add("errorCell")
                setChanges({})
            }
        }
    }

    const handleInputChange = (e) => {
        const {id, value} = e.target
        let tmp_list_changes
        tmp_list_changes = changes
        tmp_list_changes[id] = value
        setChanges(tmp_list_changes)
    }

    if (works === null) {
        return (
            <div />
        )
    } else if (works['state'] === 'success') {
        return (
            <div className="WorkComponent">
                <div className='adminSettingsLabel'>
                    <div className='labelText'>Работы</div>
                    <form className="elementsForm" onSubmit={handleSubmit}>
                        <input className="field" type="text" required value={name} onChange={handleNameChange} placeholder="Название"/>
                        <Select className={'worksSelect'} noOptionsMessage={() => <div className='deadLogoHolderSmall'><DeadLogo /></div>} classNamePrefix={'works-select'} defaultValue={theme} options={themesTypes} onChange={onThemeChange} placeholder="Тема" />
                        <input className="field" type="text" required value={grades} onChange={handleGradesChange} placeholder="Оценки"/>
                        <div className='mixButtons'>
                            <input className="button" type="submit" onClick={postWork} disabled={(!name) || (!theme) || (!grades)} value="Создать"/>
                            <a className='reloadButton'><Reload /></a>
                            <a className='saveButton' onClick={postChanges}><Save /></a>
                        </div>
                    </form>
                </div>
                {/*{response &&
                    <div className='student_form_message'>{response["data"]["message"]}</div>
                }
                {error &&
                    <div className='work_form_error'>Введены неверные данные</div>
                }*/}
                <div className="elementsList">
                    {works["details"]["themes"].map((theme_, index1) =>
                        <div key={index1}>
                            <div className='worksThemeName'>{theme_[0]}</div>
                            {theme_[1].map((work_, index2) =>
                                <div className="work" key={index2}>
                                    <div className='elementButtons'>
                                        <div className='elementName'>{work_["name"]} <i className='elementType'>{work_["type_text"]}</i></div>
                                        <a className="deleteElement" onClick={() => deleteWork(work_["id"])}><Trash /></a>
                                    </div>
                                    <div className='gradesHolder'>
                                        {work_["grades"].map((grade, index3) =>
                                            <div key={index3} className='gradeCell'><input defaultValue={grade} id={`grade-cell_${work_.id}_${index3}`} onChange={handleCellInputChange} className='' /></div>
                                        )}
                                        {/*<div className='gradeCell'><input placeholder='+' id={`grade-cell_${work_.id}_new`} onChange={handleCellInputChange} className='' /></div>*/}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <button className="button deleteAllButton" onClick={() => deleteAllWorks()}>Удалить все темы</button>
            </div>
        )
    } else {
        return (
            <div> Something went wrong </div>
        )
    }
}
