<div class="circlediv">
    <div class="circle">
        <div class="circle2">
        </div>
    </div>
</div>
<style>
    :root{
        --height: 300px;
    }
	.circle{
        height: 300px;
        width: var(--height);
        background: yellow;
        border-radius: 50%; 
        border: 8px dashed red;  
        animation-name: circle1;
        animation-duration: 6s; 
        animation-iteration-count: infinite;
        animation-timing-function: linear;

    }

  .circle2{
        height: 150px;
        width: 150px;
        position: absolute; 
        top: 25%; 
        left: 25%;
        background: red;
        border-radius: 50%; 
        border: 8px dashed yellow; 
        animation-name: circle2;
        animation-duration: 3s;  
        animation-iteration-count: infinite; 
        animation-timing-function: linear;
        animation-direction: reverse;
    }

  @keyframes circle1 {
    100% {transform: rotate(360deg);}
  }

  @keyframes circle2 {
    100% {transform: rotate(360deg);}
  }
  
</style>