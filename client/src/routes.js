import React from 'react'
import {Routes, Route, Navigate} from "react-router-dom"
import {MainPage} from "./pages/MainPage"
import {LoginPage} from "./pages/LoginPage";
import {TestPage} from "./pages/TestPage";
import {LogoutPage} from "./pages/LogoutPage";
import {AdminPage} from "./pages/AdminPage";
import {StudentPage} from "./pages/StudentPage";
import {AdminSettingsPage} from "./pages/AdminSettingsPage";

export const useRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/test' element={<TestPage />} />
            <Route path='/logout' element={<LogoutPage />} />
            <Route path='/admin' element={<AdminPage />} />
            <Route path='/admin/settings' element={<AdminSettingsPage />} />
            <Route path='/profile/:sid' element={<StudentPage />} />
        </Routes>
    )
}