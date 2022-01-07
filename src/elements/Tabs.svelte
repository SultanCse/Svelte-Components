<script>
    import { fade, fly } from 'svelte/transition';
    export let items;
    export let activeItem;
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<div>
    <ul>
        {#each items as item}
            <li on:click={()=>dispatch('tabChange', item)}>
                <div class:active={ item == activeItem }>{item}</div>
            </li>
        {/each}
    </ul>
</div>
<style>
    .active{
        color: #d91b42;
        border-bottom: 2px solid #d91b42;
    }
    ul{
        display: flex;
        justify-content: center;
        list-style-type: none;
        cursor: pointer;
    }
    li{
        margin: 10px;
    }
</style>