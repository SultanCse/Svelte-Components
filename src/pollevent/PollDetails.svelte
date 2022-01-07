<script>
    import Card from "../elements/Card.svelte"
    import {PollStore} from "../../src/store/PollStore"
    import Button from "../elements/Button.svelte"
    import {fade,slide,scale} from "svelte/transition"
    import { tweened} from 'svelte/motion';
    export let poll;
    $: totalVote = poll.vote1 + poll.vote2;
    $: percent1 = poll.vote1/totalVote*100 || 0;
    $: percent2 = poll.vote2/totalVote*100 || 0;

    let value1=tweened(0);
    let value2=tweened(0);
    $: value1.set(percent1);
    $: value2.set(percent2);
    
    const voteHandeller = (option,id) => {
        PollStore.update((currentData)=>{
            let copiedPolls=[...currentData];
            let updatablePoll= copiedPolls.find((poll) => poll.id==id);

            if(option == "1"){
                updatablePoll.vote1++;
            }else{
                updatablePoll.vote2++;	
            }
                return copiedPolls;
            })
	}
    const deleteHandeller=(id)=>{
        PollStore.update((currentData)=>{
            currentData = currentData.filter((node)=> node.id != id);
            return currentData;
        })
    }
</script>

<Card>
    <div class="poll">
        <h3>{poll.question}</h3>
        <p>TOtal vote: {totalVote}</p>
        <div class="answer" on:click="{()=>voteHandeller("1",poll.id)}">
            <div class="percent percent-1" style="width: {$value1}%"></div>
            <span>{poll.answer1} ({poll.vote1})</span>
        </div>
        <div class="answer" on:click="{voteHandeller("2",poll.id)}">
            <div class="percent percent-2" style="width: {$value2}%"></div>
            <span>{poll.answer2} ({poll.vote2})</span>            
        </div>
        <div class="delete">
            <Button flat={true} on:click={()=>deleteHandeller(poll.id)}>delete</Button>
        </div>
    </div>
</Card>

<style>
    h3{
        margin: 0 auto;
        color: #555;
    }
    p{
        margin-top: 6px;
        font-size: 14px;
        color: #aaa;
        margin-bottom: 30px;
    }
    .answer{
        background: #faf5f5;
        cursor: pointer;
        margin: 10px auto;
        position: relative;
    }
    .answer:hover{
        opacity: 0.6;
    }
    span{
        display: inline-block;
        padding: 10px 20px;
    }

    .percent{
        height: 100%;
        position: absolute;
        /* box-sizing: border-box; */
    }

    .percent-1{
        background: rgba(255, 0, 0, 0.4);
        border-left: 2px solid rgba(255, 0, 0, 0.9);
    }
    .percent-2{
        background: rgba(0,255,0,0.4);
        border-left: 2px solid rgba(0, 255, 0, 0.9);
    }
    .delete{
        margin-top: 30px;
        text-align: center;
    }
</style>