"use client"
import { getRandomURL } from "@/util/controller";
import { useEffect } from "react"

export default function Home() {
    useEffect(() => {
        getRandomURL().then(data=>{
            let url = data.query.url;
            window.location.href = `/hub/${url}`;
        }).catch(err=>{
            console.log(err);
            window.location.href = `/hub/0`;
        });
    }, []);
    return (
        <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <h1>404</h1>
        </div>
    )
}

