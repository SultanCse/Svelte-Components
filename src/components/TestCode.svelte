<script>
import { onMount } from "svelte";
    let data =[];
    const stars = ()=>{
        let count = 500;        
        while(count--){
            // star = document.createElement('i');
            let x = Math.floor(Math.random() *window.innerWidth) * .87;
            let y = Math.floor(Math.random() * window.innerHeight) * .87;
            let duration = Math.random() * 10;
            let size = Math.random() * 2;
            data.push({x,y,duration,size});
        }
    }
    stars();
    onMount(()=>{
        
        console.log(data);
    })
</script>

<div class="parent2">
  <div class="moon" />
  <img src="images/cloud/forest.png" class="forest" alt="img" />
  <img src="images/cloud/cloud1.png" class="cloud1" alt="img" />
  <img src="images/cloud/cloud2.png" class="cloud2" alt="img" />
  <img src="images/cloud/cloud3.png" class="cloud3" alt="img" />
  <img src="images/cloud/cloud1.png" class="cloud4" alt="img" />
  <img src="images/cloud/cloud2.png" class="cloud5" alt="img" />
  <img src="images/cloud/cloud3.png" class="cloud6" alt="img" />
  {#if data}
    {#each data as item}
      <i
        style="left: {item.x}px; top: {item.y}px; width: {1 +
          item.size}px; height: {1 + item.size}px; animation-duration: {5 +
          item.duration}s; animation-delay: {item.duration}s"
      />
    {/each}
  {/if}
</div>

<!-- // star.style.left = x + 'px';
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
// console.log(star); -->
<style>
  .parent2 {
    height: 100%;
    width: 100%;
    background: linear-gradient(#111425, #3751e0);
    background-attachment: fixed;
    position: relative;
    overflow-x: hidden;
  }
  .parent2 i {
    position: absolute;
    background: #fff;
    border-radius: 50%;
    animation: animate 2s infinite;
    z-index: 2000;
  }
  .moon {
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
    box-shadow: 0 0 0 2px #fcfcfc33, 0 0 0 4px #ffffffe3, 0 0 0 8px #ffffff11,
      0 0 8px #ffffff;
  }
  .moon::after {
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
    bottom: 10%;
  }
  .forest {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 1000;
  }

  .cloud1 {
    position: absolute;
    left: 0;
    top: 50px;
    max-width: 600px;
    z-index: 1001;
    animation: cloud 60s linear infinite;
  }
  .cloud2 {
    position: absolute;
    left: 0;
    top: -100px;
    max-width: 400px;
    z-index: 1001;
    animation: cloud 80s linear infinite;
  }
  .cloud3 {
    position: absolute;
    left: 0;
    top: 0;
    max-width: 620px;
    z-index: 1001;
    animation: cloud 160s linear infinite;
  }
  .cloud4 {
    position: absolute;
    left: 0;
    top: 50px;
    max-width: 350px;
    z-index: 1001;
    animation: cloud 120s linear infinite;
  }
  .cloud5 {
    position: absolute;
    left: 0;
    top: 20px;
    max-width: 500px;
    z-index: 1001;
    animation: cloud 70s linear infinite;
  }
  .cloud6 {
    position: absolute;
    left: 0;
    top: -90px;
    max-width: 550px;
    z-index: 1001;
    animation: cloud 90s linear infinite;
  }

  @keyframes animate {
    0% {
      opacity: 0;
      transform: translateY(-100px);
    }
    10%,
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(0px);
    }
  }
  @keyframes cloud {
    0% {
      transform: translateX(400%) scale(1);
    }
    100% {
      transform: translateX(-100%) scale(1.5);
    }
  }
</style>
