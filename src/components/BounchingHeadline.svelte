<div class="parent">
  <p>
      <span style="--i:1">.</span>
      <span style="--i:2">.</span>
      <span style="--i:3">.</span>
      <span style="--i:4">W</span>
      <span style="--i:5">E</span>
      <span style="--i:6">L</span>
      <span style="--i:7">C</span>
      <span style="--i:8">O</span>
      <span style="--i:9">M</span>
      <span style="--i:10">E</span>
      <span style="--i:11">.</span>
      <span style="--i:12">.</span>
      <span style="--i:13">.</span>
  </p>
</div>

<style>
  .parent{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  p{
    position: relative;
    font-style: bold;
    font-size: 2rem;       
  }
  p span{
    position: relative;
    animation: ani 2s ease-in-out infinite; 
    color: lightgray;
    -webkit-box-reflect:  below -15px red;
    animation-delay: calc(.2s * var(--i));
  }

  @keyframes ani {
  0%   {top: 0;}
  50%   {top: -15px;}
  100%  {top: 0;}

  }
</style> 