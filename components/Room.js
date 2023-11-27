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
    const [fontSize, setFontSize] = useState(24);
    const [touchedX, setTouchedX] = useState(0);
    const [touchedY, setTouchedY] = useState(0);
    const newMemoRef = useRef(null);

    useEffect(() => {
        socket.connect();
        const url = decodeURIComponent(window.location.pathname.split('/')[2]);
        socket.emit('enter',url);
        socket.on('userOrder', (data) => {
            printMemo(data);
        });

        setUrl(url);
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
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

        div.style.fontSize = memo.fontSize + 'px';
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
        const currentHour = date.getHours();
        let hour, minute, second, color;
        if(currentHour>=6 && currentHour<=17){
            hour = parseInt(date.getHours() * 128 / 24 + 127);
            minute = parseInt(date.getMinutes() * 128 / 60 + 127);
            second = parseInt(date.getSeconds() * 128 / 60 + 127);
        } else{
            hour = parseInt(date.getHours() * 128 / 24);
            minute = parseInt(date.getMinutes() * 128 / 60);
            second = parseInt(date.getSeconds() * 128 / 60);
        }
        [hour, minute, second] = [hour, minute, second].map((value) => {
            if (value <= 15) return '0' + value.toString(16);
            else return value.toString(16);
        });
        color = `#${hour}${minute}${second}`;
        return color;
    }

    function playPencilSound(length) {
        const audio = new Audio('/audio/pencil.wav');
        audio.onloadeddata = () => {
            const playTime = length * 200;
            audio.volume = 0.75;
            audio.currentTime = parseInt((audio.duration - playTime/1000) * Math.random());
            audio.play();
            setTimeout(() => { audio.pause(); }, playTime);
        }
    }

    function createTextArea(x, y){
        setFontSize(24);
        // create textarea at x,y
        let textarea = document.createElement('textarea');
        newMemoRef.current = textarea;

        textarea.className = styles.content;
        textarea.id = 'newMemo';
        textarea.style.position = 'absolute';
        textarea.style.left = x + 'px';
        textarea.style.top = y + 'px';
        textarea.style.width = '40px';
        textarea.style.height = fontSize + 6 + 'px';
        textarea.style.fontSize = fontSize+'px';

        textarea.oninput = function () {
            const textWidth = getTextWidth(textarea.value, fontSize + 'px sans-serif');
            textarea.style.width = textWidth + 24 + 'px';
            if (textWidth + 36 + x > width) {
                textarea.style.left = width - textWidth - 24 + 'px';
                x = width - textWidth - 24;
            }
        };

        document.body.appendChild(textarea);
        textarea.focus();

        // save memos
        const listener = function (e) {
            const newMemo =
            {
                url,
                text: "",
                x,
                y,
                color: getColorByCurrentTime(),
                fontSize,
                text: e.target.value,
            };
            if (newMemo.text.length > 0) {
                playPencilSound(newMemo.text.length);
                printMemo(newMemo);
                saveMemo(newMemo);
                socket.emit('order', url, newMemo);
            }
            document.body.removeChild(e.target);
        };
        textarea.addEventListener('blur', listener);
        textarea.addEventListener('keydown', function (e) {
            if (e.keyCode == 13) {
                e.target.removeEventListener('blur', listener);
                listener(e);
            }
        });
    }

    function handleRoomTouch(e) {
        let x = parseInt(e.clientX), y = parseInt(e.clientY);
        if (x > width - 60) x = width - 60;
        if (y > height - 60) y = height - 60;
        createTextArea(x, y);
    }

    function handleRoomTouchStart(e) {
        let x = parseInt(e.changedTouches[0].clientX), y = parseInt(e.changedTouches[0].clientY);
        setTouchedX(x);
        setTouchedY(y);
        createTextArea(x, y);
        newMemoRef.current.focus();
    }

    function handleRoomTouchMove(e) {
        let x = parseInt(e.changedTouches[0].clientX), y = parseInt(e.changedTouches[0].clientY);
        let newFontSize = parseInt(Math.abs(y - touchedY)/4 + Math.abs(x - touchedX)/4 + 12);
        setFontSize(newFontSize);
        newMemoRef.current.style.fontSize = newFontSize + 'px';
        newMemoRef.current.style.height = newFontSize + 6 + 'px';
    }

    function handleRoomTouchEnd(e) {
        createTextArea(touchedX, touchedY);
        newMemoRef.current.focus();
    }

    return (
        <>
            <div id='room' className={styles.room}
                onClick={handleRoomTouch}
                onTouchStart={handleRoomTouchStart}
                onTouchMove={handleRoomTouchMove}
                onTouchEnd={handleRoomTouchEnd}
            />
        </>
    )
}
