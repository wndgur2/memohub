"use client"

import { useState } from 'react';
import styles from './page.module.css'

export default function Home() {
  const [memo, setMemo] = useState('/temp.jpeg');
  const [creating, setCreating] = useState(false);

  function handleTouch(e) {
    if(creating) return;
    setCreating(true);
    let x = e.changedTouches[0].clientX, y = e.changedTouches[0].clientY;
    console.log(x, y);
    
  }

  function handleMemoSubmit(e) {
    e.preventDefault();
    setCreating(false);
    console.log(e.target.value);
  }

  return (
    <div className={styles.background} onTouchEnd={handleTouch}>
      <img src={memo} className={styles.momo} />
      <form onSubmit={(e)=> console.log(e)}>
        <input type="text" className={styles.input} onChange={(e) => console.log(e.target.value)} />
      </form>
      { creating?
        <form onSubmit={handleMemoSubmit}>
          <input type="text" className={styles.newMemo} onChange={(e) => console.log(e.target.value)} />
        </form>:<></>
      }
    </div>
  )
}
