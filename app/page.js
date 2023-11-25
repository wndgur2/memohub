"use client"
import { getRandomURL } from "@/util/controller";
import { useEffect } from "react"

export default function Home() {
    useEffect(() => {
        window.location.href = '/hub/' + encodeURI(getRandomURL());
    }, []);
    return (
        <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <h1>404</h1>
        </div>
    )
}

