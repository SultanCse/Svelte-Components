<script>
import { onMount } from "svelte";


    onMount(()=>{
        console.log('called')
    })
</script>

<div class="parent" on:click>
  <a href="#" style="--color: #ff22bb; --i:0"><span>button1</span></a>
  <a href="#" style="--color: #00ccff; --i:1"><span>button2</span></a>
  <a href="#" style="--color: #22e622; --i:2"><span>button3</span></a>
</div>

<style>
  a {
    position: relative;
    text-decoration: none;
    padding: 20px 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 40px;
    background: rgba(0, 0, 0, 0.5);
    transition: 1s;
    overflow: hidden;
    -webkit-box-reflect: below 1px
      linear-gradient(transparent, transparent, #0004);
  }
  a:hover {
    background: var(--color);
    box-shadow: 0 0 10px var(--color), 0 0 30px var(--color),
      0 0 60px var(--color), 0 0 100px var(--color);
  }
  a::before {
    content: '';
    height: 400px;
    width: 40px;
    position: absolute;
    background: var(--color);
    transition: 1s;
    animation: animate 2s linear infinite;
    animation-delay: calc(0.33s * var(--i));
  }
  a:hover::before {
    width: 100%;
  }
  a:after {
    content: '';
    position: absolute;
    inset: 2px;
    background: #0e1538;
  }
  a:hover::after {
    background: var(--color);
  }
  a span {
    position: relative;
    z-index: 1;
    font-size: 2rem;
    color: white;
    opacity: 0.5;
    text-transform: uppercase;
    letter-spacing: 4px;
    transition: 0.5s;
  }
  a:hover span {
    opacity: 1;
  }
  @keyframes animate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
