"use client"
import { getRandomURL } from "@/util/controller";
import Loader from "@/util/loader";
import { useRouter } from "next/navigation";
import { useEffect } from "react"

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        getRandomURL().then(data=>{
            let url = data.query.url;
            router.push(`/hub/${url}`);
        }).catch(err=>{
            console.log(err);
            router.push(`/hub/0`);
        }); 
    }, []);
    return (
        <div>
            <Loader />
        </div>
    )
}

