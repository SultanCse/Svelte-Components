<!-- Sidebar -->
<script>
import {AppPoll,QuoteGenerator,Toggle,Circle,Calculator,
    ActionTest,DateRange,InfiniteScroll,TestCode,
    LoadingCircle} from '../services/appList.js'
    
let value=false;

    // let list = ['TestCode','InfiniteScroll','QuoteGenerator','Calculator',
    // 'Circle','Toggle','AppPoll','LoadingCircle','InfiniteScroll','QuoteGenerator','Calculator',
    // 'Circle','Toggle','AppPoll',];
    let sidebarItems=[
        {name:'TestCode', icon:'fas fa-tachometer-alt', component:'TestCode'},
        {name:'LoadingCircle', icon:'fas fa-tachometer-alt', component:'LoadingCircle'},
        {name:'QuoteGenerator', icon:'fas fa-tachometer-alt', component:'QuoteGenerator'},
        {name:'InfiniteScroll', icon:'fas fa-tachometer-alt', component:'InfiniteScroll'},
        {name:'Calculator', icon:'fas fa-tachometer-alt', component:'Calculator'},
        {name:'Circle', icon:'fas fa-tachometer-alt', component:'Circle'},
        {name:'Toggle', icon:'fas fa-tachometer-alt', component:'Toggle'},
        {name:'AppPoll', icon:'fas fa-tachometer-alt', component:'AppPoll'},
        {name:'ActionTest', icon:'fas fa-tachometer-alt', component:'ActionTest'},
        {name:'DateRange', icon:'fas fa-tachometer-alt', component:'DateRange'},
        {name:'TestCode', icon:'fas fa-tachometer-alt', component:'TestCode'},
        {name:'QuoteGenerator', icon:'fas fa-tachometer-alt', component:'QuoteGenerator'},
        {name:'InfiniteScroll', icon:'fas fa-tachometer-alt', component:'InfiniteScroll'},
        {name:'Calculator', icon:'fas fa-tachometer-alt', component:'Calculator'},
        {name:'Circle', icon:'fas fa-tachometer-alt', component:'Circle'},
        {name:'Toggle', icon:'fas fa-tachometer-alt', component:'Toggle'},
        {name:'AppPoll', icon:'fas fa-tachometer-alt', component:'AppPoll'},
        {name:'ActionTest', icon:'fas fa-tachometer-alt', component:'ActionTest'},
        {name:'DateRange', icon:'fas fa-tachometer-alt', component:'DateRange'},
    ]

    let activeTab = 'LoadingCircle';

    $: if(value){
        console.log(value);
    }
</script>

<div class="row g-0 m-0" >
    
        <div class="col-2">
            <div class="parent">
            <TestCode list={sidebarItems} on:activeTab={(event)=>{activeTab=event.detail.activeTab}}/>
            <!-- <div class="list-group rounded-0">
                {#each list as item, index}
                <div class="d-flex list-group-item text-center" on:click={()=>{activeTab=list[index]}}>
                    <i class="fas fa-tachometer-alt icon"></i>
                    <span class='itemText'>{list[index]}</span>
                </div>
                {/each}                 
            </div>                        -->
        </div>
    </div>
    <!-- content -->
    <div class="col">   
        
        <div class="content">  
            {#if activeTab == 'TestCode'}
                <TestCode on:click={()=>{console.log(activeTab)}}/>
            {:else if activeTab == 'LoadingCircle'}
                <LoadingCircle/>
            {:else if activeTab == 'InfiniteScroll'}
                <InfiniteScroll/>
            {:else if activeTab == 'QuoteGenerator'}
                <QuoteGenerator/>
            {:else if activeTab == 'AppPoll'}
                <AppPoll/>
            {:else if activeTab == "Calculator"}
                <Calculator/>
            {:else if activeTab == 'Toggle'}
                <Toggle width='10rem' onText='on' offText='off' bind:value/>
            {:else if activeTab == 'Circle'}
                <Circle/>
            {:else if activeTab == 'ActionTest'}
                <ActionTest/>
            {:else if activeTab == 'DateRange'}
                <DateRange/>
            {/if}
            <!-- <div></div> -->
        </div>         
    </div>            
</div>
<style>
    :global(.my-link, .my-link:hover){
        text-decoration: none;
    }
    :global(body){
        overflow-y: hidden;
    }
    .parent{
        height: 89vh;
        overflow-y: auto;
        overflow-x: hidden;
        text-decoration: none;
        border-right: .1rem solid #f0764d;;
    }
    .content{
        height: 89vh;
        overflow: auto;
        padding-left: 1rem;

        padding-bottom: 1rem;
    }
    /* .icon{
        padding: .5rem;
        font-size: 2rem;
    }
    .itemText{
        margin-top: auto;
        margin-bottom: auto;
        font-size: 1.3rem;        
    } */
    /* .list-group{
        height: 89vh;
        overflow-y: auto;
        overflow-x: hidden;
        text-decoration: none;
    } */
    /* .list-group-item{
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
    } */
    :global(::-webkit-scrollbar) {
    width: .1rem;
    }

    /* Track */
    :global(::-webkit-scrollbar-track) {
    /* box-shadow: inset 0 0 .1rem grey;  */
    border-radius: .1rem;
    }
    
    /* Handle */
    :global(::-webkit-scrollbar-thumb) {
    background: #FF4205; 
    border-radius: .1rem;
    }

    /* @media (max-width: 576px) { 
        .Sidebar{
            display: none;
        }
     } */
</style>



    <!-- let sidebarItems=[
        {name:'TestCode', icon:'fas fa-tachometer-alt', component:'TestCode'},
        {name:'QuoteGenerator', icon:'fas fa-tachometer-alt', component:'QuoteGenerator'},
        {name:'InfiniteScroll', icon:'fas fa-tachometer-alt', component:'InfiniteScroll'},
        {name:'Calculator', icon:'fas fa-tachometer-alt', component:'Calculator'},
        {name:'Circle', icon:'fas fa-tachometer-alt', component:'Circle'},
        {name:'Toggle', icon:'fas fa-tachometer-alt', component:'Toggle'},
        {name:'AppPoll', icon:'fas fa-tachometer-alt', component:'AppPoll'},
        {name:'ActionTest', icon:'fas fa-tachometer-alt', component:'ActionTest'},
        {name:'DateRange', icon:'fas fa-tachometer-alt', component:'DateRange'},
        {name:'TestCode', icon:'fas fa-tachometer-alt', component:'TestCode'},
        {name:'QuoteGenerator', icon:'fas fa-tachometer-alt', component:'QuoteGenerator'},
        {name:'InfiniteScroll', icon:'fas fa-tachometer-alt', component:'InfiniteScroll'},
        {name:'Calculator', icon:'fas fa-tachometer-alt', component:'Calculator'},
        {name:'Circle', icon:'fas fa-tachometer-alt', component:'Circle'},
        {name:'Toggle', icon:'fas fa-tachometer-alt', component:'Toggle'},
        {name:'AppPoll', icon:'fas fa-tachometer-alt', component:'AppPoll'},
        {name:'ActionTest', icon:'fas fa-tachometer-alt', component:'ActionTest'},
        {name:'DateRange', icon:'fas fa-tachometer-alt', component:'DateRange'},
    ] -->