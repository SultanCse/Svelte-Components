<div class="parent">
  <div class="child"></div>
</div>

<style>
    .parent{
        height: 100%;
        width: 100%;
        background: black;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
    }
    .child{
        --height: 100px;
        --width: 100px;
        --color: rgb(87, 195, 245);
        --time: .5s;
        --background: none;
        height: var(--height);
        width: var(--width);
        position: relative;
        background: var(--background);
        border-radius: 50%;
        border: 5px solid #fce51455;
        border-top: 5px solid #fce514;
        animation: ani 2s infinite linear;
    }
    .child:nth-child(1)::after{
        content: '';
        display: block;
        position: absolute;
        left: 100%;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: #fce514;
        transform: translate(-145%, 100%);
        box-shadow: 0 0 0 5px #fce51433,
                    0 0 0 10px #fce51422,
                    0 0 0 20px #fce51411,
                    0 0 20px #fce514,
                    0 0 50px #fce514;
    }
    @keyframes ani{
        0%{transform: rotate(0deg);}
        0%{transform: rotate(-360deg);}
    }
</style>
