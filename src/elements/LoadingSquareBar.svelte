<script>
  export let height = '200px';
  export let width = '200px';
  export let color = '#2edce8';
  export let time = '.5s';
  export let background = 'none';
  export let className = '';

</script> 

<div class="parent">
  <div class="child {className}" style='--height:{height}; --width:{width}; --color:{color}; --time:{time}; --background:{background}'>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>

<style>
  .parent{
    height: 100%;
    width: 100%;
    background: black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .child{
    /* --height: 50px;
    --width: 50px;
    --color: red;
    --time: .5s;
    --background: none; */
    height: var(--height);
    width: var(--width);
    position: relative;
    overflow: hidden;
    background: var(--background);
  }
  .child:hover{
    box-shadow: 0 0 10px var(--color),
                0 0 30px var(--color),
                0 0 60px var(--color);
    background: var(--color);  
    border-radius: 50%;
  }
  span{
     display: block;
     position: absolute;
  }
  .child span:nth-child(1){
    top: 0;
    left: -100%;
    height: calc(var(--height) / 10);
    width: 100%;
    background: linear-gradient(90deg, transparent, var(--color));
    animation: ani1 var(--time) linear infinite;
    animation-delay: 0s;
  }
  
  .child span:nth-child(3){
    bottom: 0;
    right: -100%;
    height: calc(var(--height) / 10);
    width: 100%;
    background: linear-gradient(270deg, transparent, var(--color));
    animation: ani3 var(--time) linear infinite;
    animation-delay: 0s;
  }

  .child span:nth-child(2){
    top: -100%;
    right: 0;
    height: 100%;
    width: calc(var(--height) / 10);
    background: linear-gradient(180deg, transparent, var(--color));
    animation: ani2 var(--time) linear infinite;
    animation-delay: calc(var(--time) / 2);
  }
  .child span:nth-child(4){
    bottom: -100%;
    left: 0;
    height: 100%;
    width: calc(var(--height) / 10);
    background: linear-gradient(3600deg, transparent, var(--color));
    animation: ani4 var(--time) linear infinite;
    animation-delay: calc(var(--time) / 2);
  }
  @keyframes ani1{
    0%{left: -100%;}
    100%{left: 100%;}
  }
  @keyframes ani3{
    0%{right: -100%;}
    100%{right: 100%;}
  }

  @keyframes ani2{
    0%{top: -100%;}
    100%{top: 100%;}
  }
  
  @keyframes ani4{
    0%{bottom: -100%;}
    100%{bottom: 100%;}
  }
</style>