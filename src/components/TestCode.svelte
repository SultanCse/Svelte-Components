<div class="parent">
    <div class="circle">
        <div class="dot">

        </div>
    </div>
</div>

<style>
    .parent{
        height: 100%;
        width: 100%;
        background: rgb(80, 75, 75);
        display: flex;
        justify-content: center;
        align-items: center;
		margin: 0;
		padding: 0;
    }
    .circle{
        height: 200px;
        width: 200px;
		/* display: flex;
		justify-content: center;
        align-items: center; */
        position: relative;
        border-radius: 50%;
        border: 30px solid white;
		
    }
	.dot{
		height: 30px;
		width: 30px;
		background: black;
		position: absolute;
		top: 50%;
		left: -30px;
		border-radius: 50%;
		transform: translateY(-50%);
		transform-origin: 100px 50%;
		transition: 2s linear;
		animation: ani 2s infinite linear;
	}

	@keyframes ani{
		0%{ transform: translateY(-50%) rotate(0deg);}
		100%{transform: translateY(-50%) rotate(360deg);}
	}
</style>
