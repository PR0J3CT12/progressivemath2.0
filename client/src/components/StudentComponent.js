import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from "./httpClient"
import {route} from "../index";


export const StudentComponent = () => {
    const [name, setName] = useState('')
    const [user, setUser] = useState(null)
    const [students, setStudents] = useState(null)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState(null)
    const [response, setResponse] = useState(null)

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

    if (students === null) {
        return (
            <div> Loading... </div>
        )
    } else if (students['state'] === 'success') {
        return (
            <div className="StudentComponent">
                <form className="student_form" onSubmit={handleSubmit}>
                    <input className="" type="text" required value={name} onChange={handleNameChange}
                           placeholder="Фамилия Имя"/>
                    <input className="" type="submit" onClick={postStudent} disabled={(!name)} value="Создать"/>
                </form>
                {response &&
                    <div className='student_form_message'>{response["data"]["message"]}</div>
                }
                {error &&
                    <div className='student_form_error'>Введены неверные данные</div>
                }
                <div className="">
                    {students["details"]["students"].map(student =>
                        <a target="_blank" rel="noopener noreferrer" key={student.id}>
                            <div className="student">
                                {student["name"]} {student["login"]} {student["password"]}
                                <button className="delete_student" onClick={() => deleteStudent(student["id"])}>X
                                </button>
                            </div>
                        </a>
                    )}
                </div>
                <button className="delete_students" onClick={() => deleteAllStudents()}>Удалить всех учеников</button>
            </div>
        )
    } else {
        return (
            <div> Something went wrong </div>
        )
    }
}