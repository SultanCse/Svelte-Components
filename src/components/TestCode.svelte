<script>
import { onMount } from "svelte";
    let data =[];
    const stars = ()=>{
        let count = 500;
        // let parent = document.querySelector('.parent2');
        // let i= 0;
        
        while(count--){
            // star = document.createElement('i');
            let x = Math.floor(Math.random() *window.innerWidth) * .87;
            let y = Math.floor(Math.random() * window.innerHeight) * .87;
            let duration = Math.random() * 10;
            let size = Math.random() * 2;

            data.push({x,y,duration,size});
            
            // star.style.left = x + 'px';
            // star.style.top = y + 'px';
            // star.style.width = 1+size+'px';
            // star.style.height = 1+ size + 'px';
            // star.style.animationDuration = 5 + duration + 's';
            // star.style.animationDelay = duration + 's';
            // star.style.zIndex = 1005;
            // star.style.position = 'absolute';
            // star.style.background = '#fff';
            // star.style.borderRadius = '50%';
            // star.style.animation = 'animate 2s linear infinite';
            // parent.appendChild(star);
            // i++;
            // console.log(star);
        }
    }
    stars();
    onMount(()=>{
        
        console.log(data);
    })
</script>
<div class="parent2">
    <div class="moon"></div>
    <img src="images/cloud/forest.png" class='forest' alt="">
    {#if data}
    {#each data as item}
    <i style="left: {item.x}px; top: {item.y}px; width: {1+item.size}px; height: {1+item.size}px; animation-duration: {5+item.duration}s; animation-delay: {item.duration}s"></i>
    {/each}
    {/if}
</div>

<style>
    .parent2{
        height: 100%;
        width: 100%;
        background: linear-gradient(#111425, #3751e0);
        background-attachment: fixed;
        position: relative;
        overflow-x: hidden;
    }
    .parent2 i{ 
        position: absolute; 
        background: #fff; 
        border-radius: 50%;
        animation: animate 2s infinite;
        z-index: 2000;
    }
    .moon{
        height: 80px;
        width: 80px;
        border-radius: 50%;
        background: #fff;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 15%;
        top: 15%;
        z-index: 1000;
        box-shadow: 0 0 0 2px #fcfcfc33,
                0 0 0 4px #ffffffe3,
                0 0 0 8px #ffffff11,
                0 0 8px #ffffff;
    }
    .moon::after{
        content: '';
        height: 80px;
        width: 80px;
        position: absolute;
        justify-content: center;
        align-items: center;
        display: flex;
        border-radius: 50%;
        background: linear-gradient(#111425, #3751e0);
        background-attachment: fixed;
        left: 30%; 
        bottom: 10%  
    }
    .forest{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 1000;
    }

    @keyframes animate{
        0%{
            opacity: 0;
            transform: translateY(0);
        }
        10%,90%{
            opacity: 1;
        }
        100%{
            opacity: 0;
            transform: translateY(-100px);
        }
    }

</style>