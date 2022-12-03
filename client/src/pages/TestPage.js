import React, {useEffect, useState} from 'react'
import {route, route_tmp} from "../index";
import httpClient from "../components/httpClient";
import {TableComponent} from "../components/TableComponent";
import {ManaWaitersComponent} from "../components/ManaWaitersComponent";
import {AdminProfileComponent} from "../components/AdminProfileComponent";
import {LoadingComponent} from "../components/LoadingComponent";

export const TestPage = () => {
    return (
        <div className='TestPage'>
            <LoadingComponent />
        </div>
    )
}
