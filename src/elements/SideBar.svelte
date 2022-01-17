<script>
    import { createEventDispatcher, onMount } from "svelte";
    // import AppPoll from "../pollevent/AppPoll.svelte";
    // export let list;
    export let list=[
        // {name: 'TestCode',icon: 'fas fa-tachometer-alt', component: AppPoll},
        // {name: 'TestCode',icon: 'fas fa-tachometer-alt', component: AppPoll},
        // {name: 'TestCode',icon: 'fas fa-tachometer-alt', component: AppPoll},
    ];
    const dispatch = createEventDispatcher();
</script>
{#each list as item}
<div class="row g-0 shadow-sm item" tabindex="1" on:click={()=>{dispatch('activeTab',{activeTab: item.name})}}>
    <div class="col-lg-4 col-md-12 d-flex justify-content-center">
        <i class="{item.icon} icon" ></i>
    </div>
    <div class="col-lg-8 col-md-12 d-sm-none d-md-block d-flex text-lg-start text-md-center title">
        {item.name? item.name : item.component.name }
    </div>
</div>
{/each}
<style>
    
    .icon{
        padding: .5rem;
        font-size: 2.5rem;
    }
    .title{
        margin-top: auto;
        margin-bottom: auto;
        font-size: 1.3rem;        
    }
    .item{
        cursor: pointer;
    }
    .item:hover{
        background: #f0764d;
        transition: .3s;
        color: white;
    }
    .item:focus{
        background: #FF4205;
        color: white;
        transition: .3s;
    }

</style>