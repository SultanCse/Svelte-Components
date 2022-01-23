<div class="body">
	<div class="parent">
		<div class="circle"></div>
		<div class="circle"></div>
		<div class="dot" style='--i:0'></div>
		<div class="dot" style='--i:1'></div>
		<div class="dot" style='--i:2'></div>
		<div class="dot" style='--i:3'></div>
		<div class="dot" style='--i:4'></div>
		<div class="dot" style='--i:5'></div>
		<div class="dot" style='--i:6'></div>
		<div class="dot" style='--i:7'></div>
		<div class="dot" style='--i:8'></div>
		<div class="dot" style='--i:9'></div>
		<div class="dot" style='--i:10'></div>
		<div class="dot" style='--i:11'></div>
		<div class="dot" style='--i:12'></div>
		<div class="dot" style='--i:13'></div>
		<div class="dot" style='--i:14'></div>
		<div class="dot" style='--i:15'></div>
		<div class="dot" style='--i:16'></div>
		<div class="dot" style='--i:17'></div>
		<div class="dot" style='--i:18'></div>
		<div class="dot" style='--i:19'></div>
		<div class="dot" style='--i:20'></div>
		
		
		<!-- <div class="circle"></div> -->
	</div>
</div>
<style>
	.body{
		height: 100%;
        width: 100%;
        background: rgb(17, 3, 51);
		margin: 0;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;

	}
    .parent{
        
		position: relative;
		width: 360px;
		height: 200px;
		/* background: chartreuse; */
		display: flex;
		justify-content: center;
		align-items: center;
    }

    .circle{
        height: 200px;
        width: 200px;
		margin: 0 -20px;
		/* display: flex;
		justify-content: center;
        align-items: center; */
        position: relative;
        border-radius: 50%;
        border: 40px solid rgb(15, 15, 15);
		
    }
	.dot{
		height: 40px;
		width: 40px;
		background: #2edce8;
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 50%;
		transform: translateY(-50%);
		transition: 2s linear;
		animation: ani 2s infinite linear;
		animation-delay: calc(var(--i) * .021s);
		box-shadow: 0 0 5px #0aefff;
	}

	@keyframes ani{
		0%{filter:brightness(200%); transform-origin: 100px 50%; transform: translate(-50%, -50%) rotate(0deg);}
		50%{transform-origin: 100px 50%; transform: translate(-50%, -50%) rotate(360deg);}
		50.00001%{transform-origin: -60px 50%;transform: translate(-50%, -50%) rotate(360deg);}
		100%{filter:brightness(400%);transform-origin: -60px 50%;transform: translate(-50%, -50%) rotate(0deg);}
	}
</style>
