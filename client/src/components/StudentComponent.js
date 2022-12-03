import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from "./httpClient"
import {route} from "../index";
import { ReactComponent as Copy } from '../svgs/copy.svg';
import { ReactComponent as Trash } from '../svgs/trash-can.svg';
import { ReactComponent as Info } from '../svgs/info.svg';
import { ReactComponent as Reload } from '../svgs/reload.svg';


export const StudentComponent = () => {
    const [name, setName] = useState('')
    const [user, setUser] = useState(null)
    const [students, setStudents] = useState(null)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState(null)
    const [response, setResponse] = useState(null)
    const [copied, setCopied] = useState(-1)

    useEffect(() => {
        fetch(`${route}/api/student/get-all`, {
            credentials: 'include'}).then(
            res => res.json()
        ).then(
            res => {
                setStudents(res)
            }
        )
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await httpClient.get(`${route}/api/student/get-all`, {
            }).then(res => setStudents(res["data"])).then(res => setResponse(res))
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

    const deleteStudent = async (id_) => {
        try {
            const res = await httpClient.post(`${route}/api/student/delete`, {
                id: id_
            }).then(res => setResponse(res)).then(fetchUsers)
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

    const deleteAllStudents = async () => {
        try {
            const res = await httpClient.delete(`${route}/api/student/delete-all`).then(res => setResponse(res)).then(fetchUsers)
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

    const handleSubmit = (e) => {
        e.preventDefault()
        setName('')
    }

    const onNameChange = (inputValue) => {
        setName(inputValue)
    }

    const handleNameChange = (e) => {
        onNameChange(e.target.value)
    }

    const postStudent = async () => {
        try {
            await httpClient.post(`${route}/api/student/create`, {
                name: name
            }).then(res => setResponse(res)).then(fetchUsers)
                .catch(function (e) {
                    if (e.status !== 200) {
                        setError(true)
                        setName('')
                    }
                    console.log(e.toJSON());
                  });
        } catch (e) {
            console.log(e)
        }
    }

    const setCopiedFunction = (i, login, password) => {
        setCopied(i)
        navigator.clipboard.writeText(`Логин: ${login}\nПароль: ${password}`)
    }

    if (students === null) {
        return (
            <div />
        )
    } else if (students['state'] === 'success') {
        return (
            <div className="StudentComponent">
                <div className='adminSettingsLabel'>
                    <div className='labelText'>Ученики</div>
                    <form className="studentForm" onSubmit={handleSubmit}>
                        <input className="field" type="text" required value={name} onChange={handleNameChange}
                               placeholder="Фамилия Имя"/>
                        <div className='mixButtons'>
                            {/*<a className='createButton' type="submit" disabled={(!name)}><Reload /></a>*/}
                            <input className="button" type="submit" onClick={postStudent} disabled={(!name)} value="Создать"/>
                            <a className='reloadButton' onClick={() => fetchUsers()}><Reload /></a>
                        </div>
                    </form>
                </div>
                {response &&
                    <div className='student_form_message'>{response["data"]["message"]}</div>
                }
                {error &&
                    <div className='student_form_error'>Введены неверные данные</div>
                }
                <div className="itemsContainer">
                    {students["details"]["students"].map((student, index) =>
                        <div key={index}>
                            <div className="student">
                                {student["name"]}
                            </div>
                            <div className='elementButtons'>
                                <a className="infoElement" href={`/profile/${student["id"]}`}><Info /></a>
                                <a className={`copyStudent ${copied === index ? 'copyStudentActive' : ''}`} onClick={() => setCopiedFunction(index, student["login"], student["password"])}><Copy /></a>
                                <a className="deleteElement" onClick={() => deleteStudent(student["id"])}><Trash /></a>
                            </div>
                        </div>
                    )}
                </div>
                <button className="button deleteAllButton" onClick={() => deleteAllStudents()}>Удалить всех учеников</button>
            </div>
        )
    } else {
        return (
            <div> Something went wrong </div>
        )
    }
}