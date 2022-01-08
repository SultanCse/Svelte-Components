<div class="circlediv">
    <div class="circle">
        <div class="circle2">
        </div>
    </div>
</div>
<div class="div1" style="">
  <div class="div2" style=""></div>
  <div class="div3" style=""></div>
</div>
<div class="circlediv">
    <div class="circle">
        <div class="circle2">
        </div>
    </div>
</div>
<div class="div1" style="">
  <div class="div2" style=""></div>
  <div class="div3" style=""></div>
</div>
<div class="circlediv">
    <div class="circle">
        <div class="circle2">
        </div>
    </div>
</div>
<div class="div1" style="">
  <div class="div2" style=""></div>
  <div class="div3" style=""></div>
</div>
<div class="circlediv">
    <div class="circle">
        <div class="circle2">
        </div>
    </div>
</div>
<div class="div1" style="">
  <div class="div2" style=""></div>
  <div class="div3" style=""></div>
</div>
<div class="circlediv">
    <div class="circle">
        <div class="circle2">
        </div>
    </div>
</div>
<div class="div1" style="">
  <div class="div2" style=""></div>
  <div class="div3" style=""></div>
</div>
<div class="circlediv">
    <div class="circle">
        <div class="circle2">
        </div>
    </div>
</div>
<div class="div1" style="">
  <div class="div2" style=""></div>
  <div class="div3" style=""></div>
</div>


<style>
  .div1{
    /* height: 200px;  */
    width: 200px; 
    height: 50px;
    position: relative; 
    top: 40px; 
    border:2px solid red;
    display: flex;
  }
  .div2{
    height: 50px; 
    width: 50px; 
    position: absolute; 
    top: 30px; 
    border: 2px solid green;
  }
  .div3{
    height: 50px; 
    width: 50px; 
    position: absolute; 
    bottom: 30px; 
    right: 0px;
    border: 2px solid green;
  }
    :root{
        --height: 100px;
    }
	.circle{
        height: var(--height);
        width: var(--height);
        background: transparent;
        border-radius: 50%; 
        border: 8px dashed rgb(45, 5, 156);  
        animation-name: circle1;
        animation-duration: 6s; 
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        margin: 0;
  }

  .circle2{
        height: calc(var(--height) / 4);
        width: calc(var(--height) / 4);
        margin: 0 auto;
        margin-top: 50%;
        margin-left: 50%;
        background: rgb(5, 190, 67);
        border-radius: 50%; 
        border: 8px dashed transparent; 
        animation-name: circle2;
        animation-duration: 3s;  
        animation-iteration-count: infinite; 
        animation-timing-function: linear;
        animation-direction: reverse;
        box-shadow: 15px 15px rgb(255, 0, 21);
    }

  @keyframes circle1 {
    100% {transform: rotate(360deg);}
  }

  @keyframes circle2 {
    100% {transform: rotate(360deg);}
  }
  
</style>