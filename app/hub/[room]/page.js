"use client"

import { useEffect, useState } from 'react';
import styles from './page.module.css'
import { getMemo, saveMemo } from '@/util/controller';

export default function Room() {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [url, setUrl] = useState('');
    const [memo, setMemo] = useState([]);

    useEffect(() => {
        setUrl(window.location.pathname.split('/')[2]);
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
        // console log path name divided by '/'
        getMemo(window.location.pathname.split('/')[2])
        .then(
            (data)=>{
                console.log(data);
                setMemo(data.query);
            }
        )
        .catch((err)=>{console.log(err)});
    }, []);

    useEffect(() => {
        memo.forEach((memo)=>{
            addMemo(memo);
        }); 
    }, [memo]);

    function addMemo(memo){
        let div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = memo.x + 'px';
        div.style.top = memo.y + 'px';
        div.style.padding = '5px';
        div.style.fontSize = memo.fontSize + 'px';
        div.style.fontFamily = 'sans-serif';
        div.style.backgroundColor = memo.color;
        div.style.pointerEvents = 'none';
        div.className = styles.content;
        div.innerHTML = memo.text;
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

    function handleTouch(e) {
        let x = parseInt(e.changedTouches[0].clientX),
        y = parseInt(e.changedTouches[0].clientY);

        // create textarea at x,y
        let textarea = document.createElement('textarea');
        textarea.className = styles.content;
        textarea.style.position = 'absolute';
        textarea.style.left = x + 'px';
        textarea.style.top = y + 'px';
        textarea.style.width = '40px';
        textarea.style.height = '42px';

        // var heightLimit = 200;
        textarea.oninput = function() {
            // textarea.style.height = "";
            // textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
            textarea.style.width = getTextWidth(textarea.value, '32px sans-serif') + 24 + 'px';
            if(getTextWidth(textarea.value, '32px sans-serif') + 24 + x > width-12){
                textarea.style.left = width - getTextWidth(textarea.value, '32px sans-serif') - 36 + 'px';
                x = width - getTextWidth(textarea.value, '32px sans-serif') - 36;
            }
        };

        document.body.appendChild(textarea);
        textarea.focus();
        textarea.addEventListener('blur', function(e) {
            let text = e.target.value;
            if(text.length > 0) {
                let div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.left = x + 'px';
                div.style.top = y + 'px';
                div.style.padding = '5px';
                div.style.fontSize = '32px';
                div.style.fontFamily = 'sans-serif';
                div.style.backgroundColor = 'white';
                div.style.pointerEvents = 'none';
                div.className = styles.content;
                div.innerHTML = text;
                document.body.appendChild(div);
                saveMemo({
                    url,
                    text,
                    x: x,
                    y: y,
                    color: 'white',
                    fontSize: 32,
                });
            }
            document.body.removeChild(e.target);
        });
    }

    return (
        <div className={styles.background} onTouchEnd={handleTouch}>
            <form onSubmit={(e)=> console.log(e)}>
                <input type="text" className={styles.search}/>
            </form>
        </div>
    )
}
