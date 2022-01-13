<script>
    
</script>
<div class="container">
    <button id="button">tell me a Jock</button>
    <audio id='audio' controls></audio>
</div>

<style>
    .container{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
        background: url('../images/robot.gif');
        background-size: contain;
        background-position: left center;
        background-repeat: no-repeat;
    }
    button{
        cursor: pointer;
        outline: none;
        font-family: 'Cursor new', Courier, monospace;
        font-size: 20px;
        color: white;
        background: #ff3482;
        border: none;
        border-radius: 5px;
        box-shadow: 2px 2px 20px 10px rgba(0, 0, 0, .2);
    }

    button:hover{
        filter: brightness(95%);
    }
    button:active{
        transform: scale(.95);
    }
    button:disabled{
        cursor: default;
        filter: brightness(30%);
    }

    @media screen and (max-width: 1000px){
        .container{
            background-position:center center;
            background-size: cover;
        }
    }
</style>