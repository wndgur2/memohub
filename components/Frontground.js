import { useEffect, useRef } from "react";
import styles from '@/app/hub/[room]/page.module.css'

export default function Frontground() {
    const canvasRef = useRef();
    useEffect(() => {
        // set canvas size to window size
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        startSnowing();

        // resize canvas when window size changes
        window.addEventListener('resize', ()=>{
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        });
    }, []);

    // to return snow at random x, y with random size, speed, opacity
    function getRandomSnow(){
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const size = Math.random() * 3 + 3;
        const speed = Math.random() * 1 + 1;
        const opacity = Math.random() * 0.3 + 0.7;

        return {x, y, size, speed, opacity};
    }

    // start animation of falling snows
    function startSnowing(){
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const snows = [];
        const snowCount = 32;
        const snowSpeed = 0.5;

        for(let i=0; i<snowCount; i++)
            snows.push(getRandomSnow());

        function drawSnow(snow){
            ctx.beginPath();
            ctx.arc(snow.x, snow.y, snow.size, 0, Math.PI*2);
            ctx.fillStyle = `rgba(255, 255, 255, ${snow.opacity})`;
            ctx.fill();
        }

        function moveSnow(snow){
            snow.y += snow.speed * snowSpeed;
            if(snow.y > window.innerHeight){
                snow.y = 0;
                snow.x = Math.random() * window.innerWidth;
            }
        }

        function animate(){
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            snows.forEach((snow)=>{
                drawSnow(snow);
                moveSnow(snow);
            });
            requestAnimationFrame(animate);
        }

        animate();
    }


    return (
        <canvas className={styles.frontground}
            ref={canvasRef}></canvas>
    )
}

