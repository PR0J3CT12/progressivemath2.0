import React, {useEffect, useState} from 'react'
import {route, route_tmp} from "../index";
import httpClient from "../components/httpClient";
import { ReactComponent as DeadLogo } from '../svgs/logo_dead.svg';
import {ReactComponent as Save} from "../svgs/save.svg";
import Select from "react-select";


export const TableComponent = () => {
    const [works, setWorks] = useState(null)
    const [grades, setGrades] = useState(null)
    const [rawData, setRawData] = useState({"works": {}, "grades": {}})
    const [data, setData] = useState({"students": [], "works": []})
    const [namesCells, setNamesCells] = useState(null)
    const [filter, setFilter] = useState([])
    const [changes, setChanges] = useState({})
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)
    const [themes, setThemes] = useState(null)
    const [work, setWork] = useState('')


    useEffect(() => {
        fetch(`${route}/api/work/get-all`, {
            credentials: 'include'}).then(
            res => res.json()
        ).then(
            res => {
                setWorks(res);
                let raw = rawData
                raw["works"] = res
                setRawData(raw)
            }
        )
    }, [])

    useEffect(() => {
        let works_ = rawData["works"]
        if (Object.keys(works_).length !== 0) {
            worksOrder(rawData["works"])
        }
    }, [works])

    useEffect(() => {
        fetch(`${route}/api/theme/get-all`, {
            credentials: 'include'
        }).then(
            res => res.json()
        ).then(
            res => {
                setThemes(res);
                reformatFilters(res['details'])
            }
        )
    }, [])

    const worksOrder = (works_) => {
        if (works_["state"] === 'success') {
            let worksIDs = []
            for (let work in works_["details"]["works"]) {
                let work_id = works_["details"]["works"][work]["id"]
                worksIDs.push(work_id)
            }
            fetch(`${route}/api/grade/get-all`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"works": worksIDs}),
                        credentials: 'include'
            }).then(res => res.json())
                .then(
                    res => {
                        setGrades(res);
                        let raw = rawData
                        raw["grades"] = res
                        setRawData(raw)
                        reformatData()
                    }
                )
            }
        }

    const reformatData = () => {
        let students_tmp = []
        let grades_ = rawData["grades"]["details"]
        for (let i in Object.keys(grades_["students"])) {
            let key_ = Object.keys(grades_["students"])[i]
            let name = grades_["students"][key_]
            students_tmp.push({"id": key_, "name": name})
        }

        let works_tmp_obj = {}
        let works_ = rawData["works"]["details"]
        for (let i in works_["works"]) {
            let work = works_["works"][i]
            let name = work['name']
            let id = work['id']
            let grades = work['grades']
            works_tmp_obj[id] = {"id": id, "name": name, "max_grades": grades, "students_grades": []}
        }

        for (let i in Object.keys(grades_['students'])) {
            let student_id = Object.keys(grades_['students'])[i]
            for (let j in Object.keys(grades_["grades"][student_id])) {
                let work_id = Object.keys(grades_["grades"][student_id])[j]
                let current_student_grades = grades_["grades"][student_id][work_id]
                works_tmp_obj[work_id]["students_grades"].push([student_id, current_student_grades])
            }
        }

        let works_tmp = []
        for (let i in Object.keys(works_tmp_obj)) {
            let work_id = Object.keys(works_tmp_obj)[i]
            works_tmp.push(works_tmp_obj[work_id])
        }

        let reformattedData = {"students": students_tmp, "works": works_tmp}
        let nameCells = []
        for (let i in Object.keys(reformattedData["students"])) {
            let student_id = Object.keys(grades_["students"])[i]
            nameCells.push(
                <div className='tableRow tableBlockCell tableNameCell' key={`name_${student_id}`}>{grades_["students"][student_id]}</div>
            )
        }
        setData(reformattedData)
        setNamesCells(nameCells)
    }

    const reformatFilters = (themes__) => {
        let themesTypes = []
        let themes_ = themes__['themes']
        for (let i = 0; i < themes_.length; i++) {
            let type = themes_[i]['type']
            let value = themes_[i]['id']
            let label
            if (type === 0) {
                label = themes_[i]['name'] + ' | домашняя работа'
            } else if (type === 1) {
                label = themes_[i]['name'] + ' | классная работа'
            } else if (type === 2) {
                label = themes_[i]['name'] + ' | блиц'
            } else if (type === 3) {
                label = themes_[i]['name'] + ' | экзамен письменный'
            } else if (type === 4) {
                label = themes_[i]['name'] + ' | экзамен устный'
            } else {
                label = themes_[i]['name'] + ' | вне статистики'
            }
            themesTypes.push({value: value, label: label})
        }

        let filterOptions = []
        for (let theme in themesTypes) {
            let tmp = themesTypes[theme]
            filterOptions.push(<option key={`id_${tmp["value"]}`} value={`id_${tmp["value"]}`}>{tmp["label"]}</option>)
        }

        setFilter(filterOptions)
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
                formatted_changes.push({"student_id": spl_info[0], "work_id": spl_info[1], "cell_number": spl_info[2], "value": changes[key]})
            }
            console.log(formatted_changes)
            await httpClient.post(`${route}/api/grade/insert`, {
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

    const handleSubmit = (e) => {
        e.preventDefault()
        postChanges()
    }

    const handleInputChange = (e) => {
        const {id, value} = e.target
        let tmp_list_changes
        tmp_list_changes = changes
        tmp_list_changes[id] = value
        setChanges(tmp_list_changes)
    }

    const selectFilter = (e) => {
        setError(false)
        let data = e.target.value.split("_")
        let filter = data[0]
        let id = data[1]
        if (filter === "id") {
            getWorksIDs('theme_id', id)
        } else if (filter === "type") {
            getWorksIDs('theme_type', id)
        } else {
            getAllWorks()
        }
    }

    const getWorksIDs = (filter, param) => {
        try {
            httpClient.get(`${route}/api/work/get-ids?filter=${filter}&param=${param}`, {
            }).then(res => {getWorks(res["data"])})
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

    const getWorks = (works_list) => {
        try {
            httpClient.post(`${route}/api/work/get`, {
                works: works_list["details"]["works"]
            }).then(res => {
                setWorks(res["data"]);
                let raw = rawData
                raw["works"] = res["data"]
                setRawData(raw)
                setResponse(res["data"])
            }).catch(function (e) {
                    if (e.status !== 200) {
                        setError(true)
                    }
                    console.log(e.toJSON());
                  });
        } catch (e) {
            console.log(e)
        }
    }

    const getAllWorks = () => {
        try {
            httpClient.get(`${route}/api/work/get-all`, {
            }).then(res => {setWorks(res["data"]); setResponse(res["data"])})
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

    const onWorkChange = (inputValue) => {
        setError(false)
        let data = inputValue.value.split("_")
        let filter = data[0]
        let id = data[1]
        if (filter === "id") {
            getWorksIDs('theme_id', id)
        } else if (filter === "type") {
            getWorksIDs('theme_type', id)
        } else {
            getAllWorks()
        }
        setWork(inputValue)
    }

    const worksOptions = [
        {value: 'none', label: 'Выбрать фильтр'},
        {value: 'total_0', label: 'Все работы'},
        {value: 'type_0', label: 'Домашние работы'},
        {value: 'type_1', label: 'Классные работы'},
        {value: 'type_2', label: 'Блицы'},
        {value: 'type_3', label: 'Экзамен письменный'},
        {value: 'type_4', label: 'Экзамен устный'},
        {value: 'type_5', label: 'Вне статистики'},
    ]

    if ((works === null) || (grades === null)) {
        return (
            <div className='TableComponent'>
                <div className='adminPanelHolder'>
                    <div className='tableUpperHolder block tableScroll'>
                        <div className='tableLabel'>
                            <div className='tableLabelInnerHolder'>
                                <Select className={'worksSelect'} classNamePrefix={'works-select'} noOptionsMessage={() => <div className='deadLogoHolderSmall'><DeadLogo /></div>} defaultValue={work} options={worksOptions} onChange={onWorkChange} placeholder="Тема" />
                            </div>
                            <a onClick={postChanges} className='saveButton tableSaveButton'><Save /></a>
                        </div>
                        <div className='tableLowerHolder'>

                        </div>
                    </div>
                </div>
            </div>
        )
    } else if ((works['state'] === 'success') && (grades['state'] === 'success') && (data['students'].length !== 0)) {
        return (
            <div className='TableComponent'>
                <div className='adminPanelHolder'>
                    <div className='tableUpperHolder block tableScroll'>
                        <div className='tableLabel'>
                            <div className='tableLabelInnerHolder'>
                                <Select className={'worksSelect'} classNamePrefix={'works-select'} noOptionsMessage={() => <div className='deadLogoHolderSmall'><DeadLogo /></div>} defaultValue={work} options={worksOptions} onChange={onWorkChange} placeholder="Тема" />
                            </div>
                            <a onClick={postChanges} className='saveButton tableSaveButton'><Save /></a>
                        </div>
                        <div className='tableLowerHolder'>
                            {!(error) ? (
                                <form className='' onSubmit={handleSubmit}>
                                    <div className='tableBlock tableBlockCell'>
                                        <div className='tableCol tableFirstCol'>
                                            <div className='tableRow tableBlockCell tableEmptyCell'></div>
                                            <div className='tableRow tableBlockCell tableEmptyCell'></div>
                                            {namesCells}
                                        </div>
                                        {data['works'].map((work, index) =>
                                            <div className='tableCol' key={`1_${index}`}>
                                                <div className='tableRow tableBlockCell tableHeadCell'>{work["name"]}</div>
                                                <div className='tableRow'>
                                                    {work["max_grades"].map((grade, index2) =>
                                                        <div className='tableCell tableBlockCell tableMaxCell' key={`2_${index2}`}>{grade}</div>)}
                                                </div>
                                                {work["students_grades"].map((student, index3) =>
                                                    <div className='tableRow' key={`3_${index3}`}>
                                                        {student[1].map((student_grade, index4) =>
                                                            <div className='tableCell tableBlockCell' key={`4_${index4}`}>
                                                                <input onChange={handleInputChange} className='tableInput' defaultValue={student_grade} id={`${student[0]}_${work["id"]}_${index4}`} />
                                                            </div>)}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </form>
                            ) : (
                                <div className='deadLogoHolder'><DeadLogo /></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className='deadLogoHolder'><DeadLogo /></div>
        )
    }
}
