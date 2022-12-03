import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import httpClient from "./httpClient"
import {route} from "../index";
import Select from 'react-select';
import {LoadingComponent} from "./LoadingComponent";
import {ReactComponent as Reload} from "../svgs/reload.svg";
import {ReactComponent as Mana} from "../svgs/gem.svg";


export const ManaWaitersComponent = () => {
    const [waiters, setWaiters] = useState(null)
    const [error, setError] = useState(false)
    const [message, setMessage] = useState(null)
    const [response, setResponse] = useState(null)

    useEffect(() => {
        fetch(`${route}/api/mana/get-all`, {
            credentials: 'include'
        }).then(
            res => res.json()
        ).then(
            res => {
                setWaiters(res)
            }
        )
    }, [])

    const giveMana = async (id_, mana_) => {
        try {
            const res = await httpClient.post(`${route}/api/mana/give?id=${id_}&mana=${mana_}`).then(res => setResponse(res)).then(fetchWaiters)
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

    const fetchWaiters = async () => {
        try {
            await httpClient.get(`${route}/api/mana/get-all`, {
            }).then(res => setWaiters(res["data"])).then(res => setResponse(res))
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

    let waitersList = []
    const formatWaiters = () => {
        for (let waiter in waiters["details"]["waiters"]) {
            let values_ = Object.values(waiters["details"]["waiters"][waiter])[0]
            let id_ = Object.keys(waiters["details"]["waiters"][waiter])[0]
            waitersList.push(<div key={`w${waiter}`} className="studentMana">
                | {values_["name"]} | {values_["mana"]} | <button onClick={() => giveMana(id_, values_["mana"])}>Выдать</button>
            </div>)
        }
    }

    if (waiters === null) {
        return (
            <div className="ManaWaitersComponent yScroll stackUpper">
                <div className='block waitersBlock yScroll stackLower'>
                </div>
                {error &&
                    <div className='mana_waiters_error'>Error</div>
                }
            </div>
        )
    } else if (waiters['state'] === 'success') {
        //formatWaiters()
        return (
            <div className="ManaWaitersComponent yScroll stackUpper">
                <div className='block waitersBlock yScroll stackLower'>
                    <div className='adminSettingsLabel'>
                        <div className='labelText'>Мана</div>
                        <a className='reloadButton'><Reload /></a>
                    </div>
                    {waiters["details"]["waiters"].map((waiter, index) =>
                        <a className='waiterBlockA' key={index} onClick={() => giveMana(waiter["id"], waiter["mana"])}>
                            <div className='waiterBlock'>
                                <div className='manaWaiter'>{waiter["name"]}</div>
                                <div className='manaInfo'><b className='manaAmount'>{waiter["mana"]}</b><div className='manaGem'><Mana /></div></div>
                            </div>
                        </a>
                    )}
                </div>
                {error &&
                    <div className='mana_waiters_error'>Error</div>
                }
            </div>
        )
    } else {
        return (
            <div> Something went wrong </div>
        )
    }
}
