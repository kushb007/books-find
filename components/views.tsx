'use client'

import { useMediaQuery } from 'react-responsive';
import {useState, useEffect} from "react";

export function Views(){
    // client side rendering
    const [isClient, setIsClient] = useState(false)
    const isTablet = useMediaQuery({ minWidth: 768 })
    const isDesktop = useMediaQuery({ minWidth: 1024 })
    useEffect(() => {
        setIsClient(true)
    }, [])
    if(!isClient){
        return null
    }

    //mobile, tablet, and desktop views
    if(!isTablet){
        return(
            <div>
                <h1>Mobile</h1>
            </div>
        )
    }
    if(!isDesktop){
        return(
            <div>
                <h1>Tablet</h1>
            </div>
        )
    }
    return(
        <div>
            <h1>Desktop</h1>
        </div>
    )
}