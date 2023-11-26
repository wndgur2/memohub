"use client"

import { useEffect, useRef, useState } from 'react';
import styles from '@/app/hub/[room]/page.module.css'
import { getMemo, saveMemo } from '@/util/controller';
import { io } from 'socket.io-client';

export default function Room() {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [url, setUrl] = useState('');
    const [memo, setMemo] = useState([]);
    const [socket, setSocket] = useState();

    

    useEffect(() => {
        fetch('/api/socket').then((res) => {
            console.log(res);
            const sock = io();
            setSocket(sock);
    
            sock.on('welcome', (data) => {
                console.log('Message from server:', data);
            });
    
            sock.on('userCome', (socket) => {
                console.log(socket);
                // 서버에서 외부 socket 이 연결됨을 알림..
            })
    
            sock.on('addMemo', (memo) => {
                console.log(memo)
                // 서버에서 외부 socket의 memo가 추가됨을 알림..
            })
        }).catch((err) => {
            console.log(err);
        });

        // 컴포넌트가 언마운트될 때 소켓 연결 해제
        return () => {
            sock?.disconnect();
        };
    }, []);

    useEffect(() => {
        const url = decodeURIComponent(window.location.pathname.split('/')[2]);
        console.log(url);
        setUrl(url);
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
        // console log path name divided by '/'
        getMemo(url)
            .then((data) => { setMemo(data.query); })
            .catch((err) => { console.log(err) });

        window.addEventListener('resize', () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        });
    }, []);

    useEffect(() => {
        memo.forEach((memo) => { printMemo(memo); });
    }, [memo]);

    function socketAddMemo(url, memo) {
        socket.emit('addMemo', url, memo);
    }

    function socketUserCome(url) {
        socket.emit('userCome', url);
    }

    function printMemo(memo) {
        if (!memo.text) return;

        const skewDeg = -4;

        let div = document.createElement('div');
        div.className = styles.content;
        div.style.left = memo.x + 'px';
        div.style.top = memo.y + 'px';

        div.style.transform = `skew(${skewDeg}deg)`;

        div.style.font = memo.fontSize + 'px';
        div.style.fontFamily = 'sans-serif';
        if (parseInt(memo.color.substring(1, 3), 16) + parseInt(memo.color.substring(3, 5), 16) + parseInt(memo.color.substring(5, 7), 16) < 382)
            div.style.color = '#ffffff';
        div.style.backgroundColor = memo.color;
        div.innerHTML = memo.text;
        
        document.getElementById('room').appendChild(div);
    }

    function getTextWidth(text, font) {
        // re-use canvas object for better performance
        const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        const context = canvas.getContext("2d");
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    }

    function getColorByCurrentTime() {
        const date = new Date();
        const hour = parseInt(date.getHours() * 255 / 24);
        const minute = parseInt(date.getMinutes() * 255 / 60);
        const second = parseInt(date.getSeconds() * 255 / 60);
        const color = `#${hour.toString(16)}${minute.toString(16)}${second.toString(16)}`;
        return color;
    }

    function handleRoomTouch(e) {
        let x = parseInt(e.clientX), y = parseInt(e.clientY);
        if (x > width - 60) x = width - 60;
        if (y > height - 60) y = height - 60;

        // create textarea at x,y
        let textarea = document.createElement('textarea');
        textarea.className = styles.content;
        textarea.id = 'newMemo';
        textarea.style.position = 'absolute';
        textarea.style.left = x + 'px';
        textarea.style.top = y + 'px';
        textarea.style.width = '40px';
        textarea.style.height = '42px';

        textarea.oninput = function () {
            textarea.style.width = getTextWidth(textarea.value, '32px sans-serif') + 24 + 'px';
            if (getTextWidth(textarea.value, '32px sans-serif') + 24 + x > width - 12) {
                textarea.style.left = width - getTextWidth(textarea.value, '32px sans-serif') - 36 + 'px';
                x = width - getTextWidth(textarea.value, '32px sans-serif') - 36;
            }
        };

        document.body.appendChild(textarea);
        textarea.focus();
        const newMemo =
        {
            url,
            text: "",
            x,
            y,
            color: getColorByCurrentTime(),
            fontSize: 32,
        };
        // save memo when key down enter
        const listener = function (e) {
            newMemo.text = e.target.value;
            if (newMemo.text.length > 0) {
                printMemo(newMemo);
                saveMemo(newMemo);
            }
            document.body.removeChild(e.target);
        };

        textarea.addEventListener('keydown', function (e) {
            if (e.keyCode == 13) {
                e.target.removeEventListener('blur', listener);
                newMemo.text = e.target.value;
                if (newMemo.text.length > 0) {
                    printMemo(newMemo);
                    saveMemo(newMemo);
                }
                document.body.removeChild(e.target);
            }
        });
        textarea.addEventListener('blur', listener);
    }

    return (
        <>
        <div id='room' className={styles.room} onClick={handleRoomTouch} />
        <button onClick={()=>{socketUserCome(url)}}>userCome</button>
        <button onClick={()=>{console.log('clicked')}}>addMemo</button>
        </>
    )
}
