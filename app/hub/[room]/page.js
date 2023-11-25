"use client"
import Room from '@/components/Room';
import styles from './page.module.css'
import { useEffect, useState } from 'react';
import { getRandomURL } from '@/util/controller';
import { useRouter } from 'next/navigation';

export default function Rooms() {
    const [urlRecommand, setUrlRecommand] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const router = useRouter();

    function handleSearchSubmit(e){
        e.preventDefault();
        const newUrl = encodeURI(e.target.url.value);
        router.push(`/hub/${newUrl}`);
    }

    useEffect(() => {
        getRandomURL().then(data=>{
            let url = decodeURIComponent(data.query.url);
            setUrlRecommand(url);
        });
    }, []);

    function handleSearchClick(){
        let newUrl;
        if(!searchUrl && !urlRecommand) return;
        if(!searchUrl)
            newUrl = encodeURI(urlRecommand);
        else
            newUrl = encodeURI(searchUrl);
        router.push(`/hub/${newUrl}`);
    }

    function handleUrlChange(e){
        setSearchUrl(e.target.value);
    }

    return (
        <div>
            <Room />
            <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
                <input name='url' type="text" className={styles.searchInput} onChange={handleUrlChange}
                    placeholder={urlRecommand?urlRecommand:'방 탐색'}
                    autoComplete='off'
                    />
                <div className={styles.searchButtonWrapper} onClick={handleSearchClick}>
                    <img src="/images/right.svg" className={styles.searchButton}
                        width="28px" height="28px"/>
                </div>
            </form>
        </div>
    )
}
