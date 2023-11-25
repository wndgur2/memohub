"use client"
import Room from '@/components/Room';
import styles from './page.module.css'
import { useEffect, useState } from 'react';
import { getRandomURL } from '@/util/controller';

export default function Rooms() {
    const [urlRecommand, setUrlRecommand] = useState('');
    const [searchUrl, setSearchUrl] = useState('');

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

    function handleSearchClick(){
        let newUrl;
        if(!searchUrl)
            newUrl = encodeURI(urlRecommand);
        else
            newUrl = encodeURI(searchUrl);
        window.location.href = `/hub/${newUrl}`;
    }

    function handleUrlChange(e){
        setSearchUrl(e.target.value);
    }

    return (
        <div>
            <Room />
            <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
                <input name='url' type="text" className={styles.searchInput} onChange={handleUrlChange}
                    placeholder={urlRecommand?urlRecommand:'방 탐색'}/>
                <div className={styles.searchButtonWrapper} onClick={handleSearchClick}>
                    <img src="/images/right.svg" className={styles.searchButton}
                        width="32px" height="32px"/>
                </div>
            </form>
        </div>
    )
}
