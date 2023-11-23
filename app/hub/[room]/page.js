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
        .then((data)=>{setMemo(data.query);})
        .catch((err)=>{console.log(err)});
    }, []);

    useEffect(() => {
        memo.forEach((memo)=>{addMemo(memo);}); 
    }, [memo]);

    function addMemo(memo){
        let div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = memo.x + 'px';
        if(getTextWidth(memo.text, memo.fontSize + 'px sans-serif') + 24 + memo.x > width-12){
            div.style.left = width - getTextWidth(memo.text, memo.fontSize + 'px sans-serif') - 36 + 'px';
        }
        div.style.top = memo.y + 'px';
        div.style.padding = '5px';
        div.style.font = memo.fontSize + 'px';
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
        let x = parseInt(e.touches[0].clientX),
        y = parseInt(e.touches[0].clientY);

        // create textarea at x,y
        let textarea = document.createElement('textarea');
        textarea.className = styles.content;
        textarea.id = 'newMemo';
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
        const newMemo = 
        {
            url,
            text: "",
            x,
            y,
            color: 'white',
            fontSize: 32,
        };
        // save memo when key down enter
        const listener = function(e) {
            newMemo.text = e.target.value;
            if(newMemo.text.length > 0) {
                addMemo(newMemo);
                saveMemo(newMemo);
            }
            document.body.removeChild(e.target);
        };
        textarea.addEventListener('keydown', function(e) {
            if(e.keyCode == 13) {
                e.target.removeEventListener('blur', listener);
                newMemo.text = e.target.value;
                if(newMemo.text.length > 0) {
                    addMemo(newMemo);
                    saveMemo(newMemo);
                }
                document.body.removeChild(e.target);
            }
        });
        textarea.addEventListener('blur', listener);
    }

    return (
        <div>
            <form onSubmit={(e)=> console.log(e)}>
                <input type="text" className={styles.search}/>
            </form>
            <div className={styles.background} onClick={handleTouch}>
            </div>
        </div>
    )
}
