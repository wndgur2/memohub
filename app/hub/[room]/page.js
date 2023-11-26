"use client"
import Room from '@/components/Room';
import styles from './page.module.css'
import { useEffect, useState } from 'react';
import { getRandomURL } from '@/util/controller';
import { useRouter } from 'next/navigation';
import Frontground from '@/components/Frontground';
import initKakao from '@/util/kakaoShare';

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
        const currentUrl = decodeURIComponent(window.location.pathname.split('/')[2]);
        getRandomURL().then(data=>{
            let url = decodeURIComponent(data.query.url);
            setUrlRecommand(url);
        });
        initKakao(currentUrl);
    }, []);

    function handleSearchClick(){
        let newUrl;
        if(!searchUrl && !urlRecommand) {
            return;
        }
        else if(!searchUrl)
            newUrl = encodeURI(urlRecommand);
        else
            newUrl = encodeURI(searchUrl.toLowerCase());
        router.push(`/hub/${newUrl}`);
    }

    function handleUrlChange(e){
        setSearchUrl(e.target.value);
    }

    return (
        <div>
            <div className={styles.container}>
                <Room />
                <div className={styles.formWrapper}>
                    <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
                        <input name='url' type="text" className={styles.searchInput} onChange={handleUrlChange}
                            placeholder={urlRecommand}
                            autoComplete='off'
                            />
                        <div className={styles.searchButtonWrapper} onClick={handleSearchClick}>
                            <img src="/images/right.svg" className={styles.searchButton}
                                width="28px" height="28px"/>
                        </div>
                    </form>
                </div>

                <div>
                    <img id='kakaotalk-sharing-btn' className={styles.share} src="/images/shares/kakao.png" alt="카카오톡 공유 보내기 버튼" width="52px" height="52px"/>
                </div>
                
                <Frontground />
            </div>
        </div>
    )
}
