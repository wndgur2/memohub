"use client"
import Room from '@/components/Room';
import styles from './page.module.css'
import { useEffect, useState } from 'react';
import { getRandomURL } from '@/util/controller';

export default function Rooms() {
    const [urlRecommand, setUrlRecommand] = useState('');

    function handleSearchSubmit(e){
        e.preventDefault();
        const newUrl = encodeURI(e.target.url.value);
        window.location.href = `/hub/${newUrl}`;
    }

    useEffect(() => {
        getRandomURL().then(data=>{
            // decode url string to string
            let url = decodeURIComponent(data.query.url);
            setUrlRecommand(url);
        });
    }, []);

    return (
        <div>
            <Room />
            <form onSubmit={handleSearchSubmit}>
                <input name='url' type="text" className={styles.search}
                    placeholder={urlRecommand?urlRecommand:'방 탐색'}/>
            </form>
        </div>
    )
}
