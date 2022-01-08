<!-- Sidebar -->
<script>
import { Litepicker } from 'litepicker';
import { slide } from 'svelte/transition';
import Sidebar from './Sidebar.svelte';
import AppPoll from '../pollevent/AppPoll.svelte';
import QuoteGenerator from './QuoteGenerator.svelte';
import Toggle from './../elements/Toggle.svelte';
import Circle from './Circle.svelte';
import Calculator from './Calculator.svelte';
import { onMount } from 'svelte';
import ActionTest from './ActionTest.svelte';
import DateRange from './DateRange.svelte';
import InfiniteScroll from './InfiniteScroll.svelte';
import TestCode from './TestCode.svelte';
    let list = ['InfiniteScroll','QuoteGenerator','Calculator','Circle','Toggle Button','AppPoll',
    'ActionTest','DateRange','DateRange','DateRange','ActionTest','Toggle Button'];
    let activeTab = 'InfiniteScroll';
    onMount(()=>{
    })

</script>

<div class="row g-0 m-0" >
    <div class="col-2">        
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
    <div class="col">    
        <div class="content">   
            {#if activeTab == 'InfiniteScroll'}
                <InfiniteScroll/> 
                <!-- <TestCode/> -->
            {:else if activeTab == 'QuoteGenerator'}
                <QuoteGenerator/>
                <!-- <Circle/> -->
            {:else if activeTab == 'AppPoll'}
                <AppPoll/>
            {:else if activeTab == "Calculator"}
                <Calculator/>
            {:else if activeTab == 'Toggle Button'}
                <Toggle width='10rem' onText='on' offText='off'/>
            {:else if activeTab == 'Circle'}
                <Circle/>
            {:else if activeTab == 'ActionTest'}
                <ActionTest/>
            {:else if activeTab == 'DateRange'}
                <DateRange/>
            {/if}
        </div>         
    </div>            
</div>

<style>
    :global(.my-link, .my-link:hover){
        text-decoration: none;
    }
    :global(body){
        overflow: hidden;
    }
    /* .sidebar{
        max-width: 100vh;
        overflow-y: scroll;
    } */
    .content{
        height: 90vh;
        overflow: auto;
        padding: 1rem;
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