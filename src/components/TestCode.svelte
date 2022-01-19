<div class="body">
	<div class="parent">
		<div class="circle"></div>
		<div class="circle"></div>
		<div class="dot"></div>
		
		<!-- <div class="circle"></div> -->
	</div>
</div>
<style>
	.body{
		height: 100%;
        width: 100%;
        background: rgb(80, 75, 75);
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
        border: 40px solid rgb(10, 0, 0);
		
    }
	.dot{
		height: 40px;
		width: 40px;
		background: rgb(247, 243, 243);
		position: absolute;
		top: 50%;
		left: 50%;
		border-radius: 50%;
		transform: translateY(-50%);
		/* transform-origin: 100px 50%; */
		transition: 2s linear;
		animation: ani 2s infinite linear;
	}

	@keyframes ani{
		0%{transform-origin: 100px 50%; transform: translate(-50%, -50%) rotate(0deg);}
		50%{transform-origin: 100px 50%; transform: translate(-50%, -50%) rotate(360deg);}
		50.00001%{transform-origin: 60px 50%;transform: translate(-50%, -50%) rotate(360deg);}
		100%{transform-origin: 60px 50%;transform: translate(-50%, -50%) rotate(360deg);}
	}
</style>
