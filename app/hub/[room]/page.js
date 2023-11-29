"use client"
import Room from '@/components/Room';
import styles from './page.module.css'
import { useEffect, useRef, useState } from 'react';
import { getRandomURL } from '@/util/controller';
import { useRouter } from 'next/navigation';
import Frontground from '@/components/Frontground';
import initKakao from '@/util/kakaoShare';

export default function Rooms() {
    const [urlRecommand, setUrlRecommand] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [currentUrl, setCurrentUrl] = useState('');
    const [alert, setAlert] = useState(false);
    const [platform, setPlatform] = useState(false);
    const container = useRef();
    const router = useRouter();

    useEffect(() => {
        const currentUrl = decodeURIComponent(window.location.pathname.split('/')[2]);
        setCurrentUrl(currentUrl);
        getRandomURL().then(data => {
            let url = decodeURIComponent(data.query.url);
            setUrlRecommand(url);
        });
        const curPlatform = getPlatform();
        setPlatform(curPlatform);

        // fullscreen
        // const containerElement = container.current;
        // const fullScreenRequest = containerElement.requestFullscreen || containerElement.webkitRequestFullscreen || containerElement.msRequestFullscreen;
        // if (fullScreenRequest)
        //     fullScreenRequest.call(containerElement).catch(err => {
        //         console.log("fullscreen error");
        //     });
    }, []);

    useEffect(()=>{
        if(!alert) return;
        setTimeout(()=>{
            setAlert(false);
        },2000);
    }, [alert]);

    useEffect(()=>{
        if(!platform[1]) return;
        initKakao(urlRecommand);
    }, [platform]);

    function getPlatform(){
        const navigator = window.navigator;
        const userAgent = navigator.userAgent;
        const normalizedUserAgent = userAgent.toLowerCase();
        const standalone = navigator.standalone;

        const isIos = /ip(ad|hone|od)/.test(normalizedUserAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
        const isAndroid = /android/.test(normalizedUserAgent);
        const isSafari = /safari/.test(normalizedUserAgent);
        const isWebview = (isAndroid && /; wv\)/.test(normalizedUserAgent)) || (isIos && !standalone && !isSafari);
        const isMobile = isIos || isAndroid;
        return [isWebview, isMobile];
    }

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
        if(e.target.value.length > 10) return;
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
        const shares = document.getElementsByClassName(styles.hidden);
        for(let i=0; i<shares.length; i++){
            shares[i].classList.toggle(styles.drop);
        }
    }

    return (
        <div>
            <div className={styles.container} ref={container}>

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
                    <div className={styles.shareWrapper + ' ' + styles.hidden}>
                        <img onClick={copyBtnHandler} src="/images/shares/copy.svg" alt="링크 복사 버튼" width="32px" height="32px" />
                    </div>
                    {
                        platform[1] && !platform[0]?
                            <div className={styles.shareWrapper + ' ' + styles.hidden}>
                                <img onClick={shareBtnHandler} src="/images/shares/share2.svg" alt="공유 보내기 버튼" width="29px" height="29px" />
                            </div>
                            :<></>
                    }{
                        platform[1]?
                            <div className={styles.shareWrapper + ' ' + styles.hidden} style={{boxShadow:"none"}}>
                                <img id='kakaotalk-sharing-btn' src="/images/shares/kakao_round.png" alt="카카오톡 공유 보내기 버튼" width="42px" height="42px" />
                            </div>
                        :<></>
                    }
                </div>

                <div className={styles.searchBarWrapper}>
                    <form onSubmit={explore} className={styles.searchBar}>
                        <input name='url' type="text" className={styles.searchInput}
                            onChange={handleUrlChange}
                            value={searchUrl}
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
