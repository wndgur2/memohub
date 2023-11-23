"use client"

import { useEffect, useState } from 'react';
import styles from './page.module.css'

export default function Home() {
    const [creating, setCreating] = useState(false);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }, []);

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
        if(creating) return;
        setCreating(true);

        // create textarea at x,y
        let textarea = document.createElement('textarea');
        textarea.className = styles.content;
        textarea.style.position = 'absolute';
        textarea.style.left = x + 'px';
        textarea.style.top = y + 'px';
        textarea.style.width = '40px';

        var heightLimit = 200;
        textarea.oninput = function() {
          textarea.style.height = "";
          textarea.style.height = Math.min(textarea.scrollHeight, heightLimit) + "px";
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
                div.className = styles.content;
                div.innerHTML = text;
                document.body.appendChild(div);
            }
            document.body.removeChild(e.target);
            setCreating(false);
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
