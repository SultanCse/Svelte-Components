<h1>
    <span>W</span>
    <span>E</span>
    <span>L</span>
    <span>C</span>
    <span>O</span>
    <span>M</span>
    <span>E</span>
</h1>

<style>
  h1{
    position: absolute;
    transform: translate(-50%,-50%);
    top: 50%;
    left: 50%;
    font-size: 2rem;
    font-style: bold; 
    text-align: center;
  }
  span:nth-child(1){
    animation: w 1s ease 0s 1 none;
    animation-fill-mode: ease;
    /* animation: name duration(5s) timing-function(linear) delay(2s) iteration-count(infinite) animation-direction(alternate); */
  }
  span:nth-child(2){
    animation: e 1.2s ease .2s 1 none;
    animation-fill-mode: ease;
  }
   span:nth-child(3){
    animation: l 1.4s ease .4s 1 none;
    animation-fill-mode: ease;
  }
   span:nth-child(4){
   animation: c 1.6s ease .6s 1 none;
   animation-fill-mode: ease;
  }
  span:nth-child(5){
   animation: o 2s ease 1s 1 none;
    animation-fill-mode: ease;
  }
  span:nth-child(6){
   animation: m 2s ease 1s 1 none;
    animation-fill-mode: ease;
  }
  /* 7th no space */
  span:nth-child(7){
   animation: e 2s ease 1s 1 none;
    animation-fill-mode: ease;
  }

  @keyframes w {
  0%   {color: black; transform: rotate(0deg);}
  50%  {color: red; font-size: 3rem;}
  100%  {color: black; font-size: 2rem;}
  }
  @keyframes e {
  0%   {color:black; }
  50%  {color: red; font-size: 2.9rem;}
  100%  {color:black;  font-size: 2rem;}
  }
  @keyframes l {
  0%   {color:black; }
  50%  {color: red; font-size: 2.8rem;}
  100%  {color:black;  font-size: 2rem;}
  }
  @keyframes c {
  0%   {color:black; }
  50%  {color: red; font-size: 2.4rem;}
  100%  {color:black;  font-size: 2rem;}
  }
  @keyframes o {
  0%   {color:black; }
  50%  {color: red; font-size: 2.4rem;}
  100%  {color:black;  font-size: 2rem;}
  }
  @keyframes m {
  0%   {color:black; }
  50%  {color: red; font-size: 2.2rem;}
  100%  {color:black;  font-size: 2rem;}
  }

  @keyframes e {
  0%   {color:black; }
  50%  {color: red; font-size: 3rem;}
  100%  {color:black;  font-size: 2rem;}
  }

</style> 