"use client"

import { useEffect, useRef, useState } from 'react';
import styles from '@/app/hub/[room]/page.module.css'
import { getMemo, saveMemo } from '@/util/controller';
import socket from '@/util/socket-client';

export default function Room() {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [url, setUrl] = useState('');
    const [memo, setMemo] = useState([]);


    useEffect(() => {
        socket.connect();
        const url = decodeURIComponent(window.location.pathname.split('/')[2]);
        socket.emit('enter',url);
        socket.on('userOrder', (data) => {
            console.log(data);
            printMemo(data);
        })
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
        return()=>{
            socket.emit('leave',url);
            socket.disconnect();
        }
    }, []);


    useEffect(() => {
        memo.forEach((memo) => { printMemo(memo); });
    }, [memo]);


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

        // new element for shadow
        // let shadow = document.createElement('div');
        // shadow.className = styles.shadow;
        // shadow.style.position = 'absolute';
        // shadow.style.left = memo.x + 3 + 'px';
        // if(memoWidth + memo.x > width-12)
        //     shadow.style.left = width - textWidth - 36 + 'px';
        // shadow.style.top = memo.y + 2 + 'px';
        // shadow.style.width = memoWidth + 8 + 'px';
        // shadow.style.height = memo.fontSize + 16 + 'px';
        // shadow.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';

        // document.getElementById('room').appendChild(shadow);
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
                socket.emit('order', url, newMemo);
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
                    socket.emit('order', url, newMemo);
                }
                document.body.removeChild(e.target);
            }
        });
        textarea.addEventListener('blur', listener);
    }

    return (
        <>
            <div id='room' className={styles.room} onClick={handleRoomTouch} />

        </>
    )
}
