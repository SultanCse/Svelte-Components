<div class="parent">
    <div class="moon"></div>
    <div class="cloud">
        <img src="images/cloud/cloud1.png" alt="img..">
        1
    </div>
    <div class="cloud">
        <img src="images/cloud/cloud2.png" alt="img..">
        2
    </div>   
    <div class="cloud">
        <img src="images/cloud/cloud3.png" alt="img..">
        3
    </div>    
    <div class="cloud"></div>   
</div>

<style>
    .parent{
        height: 100%;
        width: 100%;
        background: darkblue;
        background-image: url('../images/cloud/forest.png');
        background-repeat: no-repeat;
        background-position: bottom;
        position: relative;
        overflow-x: hidden;
    }
    .moon{
        height: 80px;
        width: 80px;
        border-radius: 50%;
        background: rgba(255, 255, 255, .80);
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 15%;
        top: 15%;
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
        background: darkblue;
        left: 30%; 
        bottom: 10%  
    }
    .cloud{
        height: 50%;
        width: 50%;
        position: absolute;
        color: red;
    }
    .cloud:nth-child(1){
        animation: cloud1 1s infinite linear;
    }
    .cloud:nth-child(2){
        animation: cloud2 5s infinite linear;
    }
    
    .cloud:nth-child(3){
        animation: cloud3 10s infinite linear;
    }
    .cloud:nth-child(4){
        animation: cloud4 10s infinite linear;
    }
    img{
        height: 100%;
        width: 100%;
    }

    @keyframes cloud1{
        0%{left: -100%}
        100%{left: 100%}
    }
    @keyframes cloud2{
        0%{left: -50%}
        100%{left: 100%}
    }
    @keyframes cloud3{
        0%{left: 0%}
        100%{left: 100%}
    }
</style>