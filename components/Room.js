"use client"

import { useEffect, useRef, useState } from 'react';
import styles from '@/app/hub/[room]/page.module.css'
import { getMemo, saveMemo } from '@/util/controller';

export default function Room() {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [url, setUrl] = useState('');
    const [memo, setMemo] = useState([]);
    const canvas = useRef(null);

    useEffect(() => {
        const url = decodeURIComponent(window.location.pathname.split('/')[2]);
        setUrl(url);
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
        // console log path name divided by '/'
        getMemo(url)
        .then((data)=>{setMemo(data.query);})
        .catch((err)=>{console.log(err)});
        // draw filled circle on canvas
        const ctx = canvas.current.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(width/2, height/2, 100, 0, 2*Math.PI);
        ctx.fill();


    }, []);

    useEffect(() => {
        memo.forEach((memo)=>{printMemo(memo);}); 
    }, [memo]);

    function printMemo(memo){
        if(!memo.text) return;
        
        const textWidth = getTextWidth(memo.text, memo.fontSize + 'px sans-serif');
        const memoWidth = textWidth + 24;
        const skewDeg = -4;

        let div = document.createElement('div');
        div.className = styles.content;
        div.style.left = memo.x + 'px';
        if(memoWidth + memo.x > width-12)
            div.style.left = width - textWidth - 36 + 'px';
        div.style.top = memo.y + 'px';
        div.style.width = memoWidth + 'px';

        div.style.transform = `skew(${skewDeg}deg)`;

        div.style.font = memo.fontSize + 'px';
        div.style.fontFamily = 'sans-serif';
        if(parseInt(memo.color.substring(1,3), 16) + parseInt(memo.color.substring(3,5), 16) + parseInt(memo.color.substring(5,7), 16) < 382)
            div.style.color = '#ffffff';
        div.style.backgroundColor = memo.color;
        div.innerHTML = memo.text;

        // new element for shadow
        let shadow = document.createElement('div');
        shadow.className = styles.shadow;
        shadow.style.position = 'absolute';
        shadow.style.left = memo.x + 2 + 'px';
        if(memoWidth + memo.x > width-12)
            shadow.style.left = width - textWidth - 36 + 'px';
        shadow.style.top = memo.y + 'px';
        shadow.style.width = memoWidth + 10 + 'px';
        shadow.style.height = memo.fontSize + 20 + 'px';
        shadow.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
        
        document.body.appendChild(shadow);
        document.body.appendChild(div);
    }

    function getTextWidth(text, font) {
        // re-use canvas object for better performance
        const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
        const context = canvas.getContext("2d");
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for(let i = 0; i < 3; i++) 
            color += letters[Math.floor(Math.random() * 4 + 12)];
        return color;
    }

    function handleRoomTouch(e) {
        let x = parseInt(e.clientX),
        y = parseInt(e.clientY);

        // create textarea at x,y
        let textarea = document.createElement('textarea');
        textarea.className = styles.content;
        textarea.id = 'newMemo';
        textarea.style.position = 'absolute';
        textarea.style.left = x + 'px';
        textarea.style.top = y + 'px';
        textarea.style.width = '40px';
        textarea.style.height = '42px';

        textarea.oninput = function() {
            textarea.style.width = getTextWidth(textarea.value, '32px sans-serif') + 24 + 'px';
            if(getTextWidth(textarea.value, '32px sans-serif') + 24 + x > width-12){
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
            color: getRandomColor(),
            fontSize: 32,
        };
        // save memo when key down enter
        const listener = function(e) {
            newMemo.text = e.target.value;
            if(newMemo.text.length > 0) {
                printMemo(newMemo);
                saveMemo(newMemo);
            }
            document.body.removeChild(e.target);
        };
        textarea.addEventListener('keydown', function(e) {
            if(e.keyCode == 13) {
                e.target.removeEventListener('blur', listener);
                newMemo.text = e.target.value;
                if(newMemo.text.length > 0) {
                    printMemo(newMemo);
                    saveMemo(newMemo);
                }
                document.body.removeChild(e.target);
            }
        });
        textarea.addEventListener('blur', listener);
    }

    return (
        <div>
            <div className={styles.background} onClick={handleRoomTouch}>
            </div>
            <canvas className={styles.canvas} ref={canvas} width={width} height={height}></canvas>
        </div>
    )
}
