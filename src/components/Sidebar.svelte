<!-- Sidebar -->
<script>
	import QuoteGenerator from './QuoteGenerator.svelte';
	import Toggle from './../elements/Toggle.svelte';
	import Circle from './Circle.svelte';
    import Calculator from './Calculator.svelte';
    import { onMount } from 'svelte';
    let list = ['QuoteGenerator','Calculator','Circle','Toggle Button',];
    let activeTab = 'QuoteGenerator';
    onMount(()=>{
    })

</script>

<div class="row g-0" style="overflow-x: hidden;" >
    <div class="col-2 Sidebar">
        <div class="list-group rounded-0">
            {#each list as item, index}
            <div class="d-flex list-group-item text-center" on:click={()=>{activeTab=list[index]}}>
                <i class="fas fa-tachometer-alt icon"></i>
                <span class='itemText'>{list[index]}</span>
            </div>
            {/each}          
        </div>
    </div>
    <!-- content -->
    <div class="col content">
            <div class="row justify-content-center">
                <div class="col text-center">    
                    {#if activeTab == 'QuoteGenerator'}
                        <QuoteGenerator/>
                    {:else if activeTab == "Calculator"}
                        <Calculator/>
                    {:else if activeTab == 'Toggle Button'}
                        <Toggle width='10rem' onText='on' offText='off'/>
                    {:else if activeTab == 'Circle'}
                        <Circle/>
                    {/if}
                </div>
            </div>        
    </div>
</div>

<style>
    :global(.my-link, .my-link:hover){
        text-decoration: none;
    }
    
    .content{
        margin-top: 0;
        margin-bottom: 0;
        margin-right: 0;
        margin-left: 0;
    }
    .icon{
        padding: .5rem;
        font-size: 2rem;
    }
    .itemText{
        margin-top: auto;
        margin-bottom: auto;
        font-size: 1.3rem;        
    }
    .list-group{
        height: 89vh;
        overflow-y: auto;
        overflow-x: hidden;
        text-decoration: none;
    }
    .list-group-item{
        font-family: Serif;
        color: black;
        cursor: pointer;
    }
    .list-group-item:hover{
        background: rgb(149, 149, 248);
        transition: .3s;
        color: white
    }
    .list-group-item:focus{
        background: rgb(149, 149, 248);
        color: white
    }
    ::-webkit-scrollbar {
    width: .1rem;
    }

    /* Track */
    ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 .1rem grey; 
    border-radius: .1rem;
    }
    
    /* Handle */
    ::-webkit-scrollbar-thumb {
    background: rgb(122, 122, 122); 
    border-radius: .1rem;
    }

    /* @media (max-width: 576px) { 
        .Sidebar{
            display: none;
        }
     } */
</style>