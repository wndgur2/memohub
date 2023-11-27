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
    const [currentUrl, setCurrentUrl] = useState('');
    const [alert, setAlert] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const currentUrl = decodeURIComponent(window.location.pathname.split('/')[2]);
        setCurrentUrl(currentUrl);
        getRandomURL().then(data => {
            let url = decodeURIComponent(data.query.url);
            setUrlRecommand(url);
        });
        initKakao(currentUrl);
    }, []);

    useEffect(()=>{
        if(!alert) return;
        setTimeout(()=>{
            setAlert(false);
        },2000);
    }, [alert]);

    function explore(e) {
        e.preventDefault();
        let newUrl;
        if (!searchUrl && !urlRecommand)
            return;
        else if (!searchUrl)
            newUrl = encodeURI(urlRecommand);
        else
            newUrl = encodeURI(searchUrl.toLowerCase());
        router.push(`/hub/${newUrl}`);
    }

    function handleUrlChange(e) {
        setSearchUrl(e.target.value);
    }
    function shareBtnHandler(e) {
        navigator.share({
            title: 'memoHub',
            text: 'myHub',
            url: window.location.href,
        });
    }
    function copyBtnHandler(e){
        navigator.clipboard.writeText(decodeURIComponent(window.location.href));
        setAlert(true);
    }

    function dropShares(e){
        const shares = document.getElementsByClassName(styles.share);
        for(let i=0; i<shares.length; i++){
            shares[i].classList.toggle(styles.drop);
        }
    }

    return (
        <div>
            <div className={styles.container}>

                <Room />
                <div className={styles.currentUrlWrapper}>
                    <p className={styles.currentUrl}>{currentUrl}</p>
                </div>

                <div className={styles.toggleShare} onClick={dropShares}>
                    <div className={styles.shareWrapper}>
                        <img src="/images/shares/share.svg" alt="공유" width="26px" height="26px" />
                    </div>
                </div>

                <div className={styles.shares}>
                    <div className={styles.shareWrapper + ' ' + styles.share}>
                        <img onClick={shareBtnHandler} src="/images/shares/share2.svg" alt="공유 보내기 버튼" width="29px" height="29px" />
                    </div>
                    <div className={styles.shareWrapper + ' ' + styles.share}>
                        <img onClick={copyBtnHandler} src="/images/shares/copy.svg" alt="공유 보내기 버튼" width="32px" height="32px" />
                    </div>
                    <div className={styles.shareWrapper + ' ' + styles.share} style={{boxShadow:"none"}}>
                        <img id='kakaotalk-sharing-btn' src="/images/shares/kakao_round.png" alt="카카오톡 공유 보내기 버튼" width="42px" height="42px" />
                    </div>
                </div>

                <div className={styles.searchBarWrapper}>
                    <form onSubmit={explore} className={styles.searchBar}>
                        <input name='url' type="text" className={styles.searchInput} onChange={handleUrlChange}
                            placeholder={urlRecommand}
                            autoComplete='off'
                        />
                        <div className={styles.searchButtonWrapper} onClick={explore}>
                            <img src="/images/right.svg" className={styles.searchButton}
                                width="28px" height="28px" />
                        </div>
                    </form>
                </div>

                {
                    alert?
                    <div className={styles.alertWrapper}>
                        <p className={styles.alert}>
                            링크 복사 완료  ;)
                        </p>
                    </div>:<></>
                }

                <Frontground />
            </div>
        </div>
    )
}
