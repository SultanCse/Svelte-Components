<script>
    import PollDetails from "./PollDetails.svelte"
    import {PollStore} from "../store/PollStore"
    import {fade,slide,scale,fly} from "svelte/transition"
    import {flip} from "svelte/animate"
</script>

<div class="poll-list">
    {#each $PollStore as poll (poll.id)}
    <div in:fly={{y:200, duration: 2000 }} out:scale|local animate:flip={{duration:2000}}>
    <PollDetails {poll}/>
    </div>
    {/each}
</div>

<style>
    .poll-list{
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 20px;
    }
</style>