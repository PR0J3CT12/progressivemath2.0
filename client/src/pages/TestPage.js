import React, {useEffect, useState} from 'react'
import {route, route_tmp} from "../index";
import httpClient from "../components/httpClient";
import {TableComponent} from "../components/TableComponent";
import {ManaWaitersComponent} from "../components/ManaWaitersComponent";
import {AdminProfileComponent} from "../components/AdminProfileComponent";

export const TestPage = () => {
    return (
        <div className='TestPage'>
            <div style={{padding: '10px', display: 'flex', width: '80vw', justifyContent: 'space-between', margin: '0 auto', marginTop: '20px', background: 'green'}}>
                <div style={{display: 'flex', flexDirection: 'column'}}><div className='block' style={{width: '200px', background: 'orange'}}>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                </div></div>
                <div style={{display: 'flex', flexDirection: 'column'}}><div className='block' style={{width: '800px', background: 'orange'}}>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                    <p>123</p>
                </div></div>
            </div>
        </div>
    )
}
