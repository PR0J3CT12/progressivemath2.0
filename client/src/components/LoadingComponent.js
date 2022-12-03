import React from 'react'
import { ReactComponent as Logo } from '../svgs/logo_blue.svg';


export const LoadingComponent = () => {
    return (
        <div className='LoadingComponent'>
            <div className='loadingHolder rotating'><Logo /></div>
        </div>
    )
}
