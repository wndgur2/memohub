"use client"
import Room from '@/components/Room';
import styles from './page.module.css'

export default function Rooms() {

    function handleSearchSubmit(e){
        e.preventDefault();
        const newUrl = e.target.url.value;
        window.location.href = `/hub/${newUrl}`;
    }

    return (
        <div>
            <form onSubmit={handleSearchSubmit}>
                <input name='url' type="text" className={styles.search} placeholder='방 탐색'/>
            </form>
            <Room />
        </div>
    )
}
