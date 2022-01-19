<!-- Sidebar -->
<script>
	import SideBar from './../elements/SideBar.svelte';
    import {PackageUsages, LightDarkTheme, AnimatedButton,AppPoll,QuoteGenerator,Toggle,Circle,Calculator,
    ActionTest,DateRange,InfiniteScroll,TestCode,
    LoadingCircle, JockTeller} from '../services/appList.js'
    
let toggleValue=false;
$: console.log(toggleValue);

let activeTab = 'TestCode';
    let sidebarItems=[
        {name:'TestCode', icon:'fas fa-tachometer-alt', component: TestCode},
        {name:'LightDarkTheme', icon:'fas fa-tachometer-alt', component: LightDarkTheme},
        {name:'LoadingCircle', icon:'fas fa-tachometer-alt', component: JockTeller},
        {name:'AnimatedButton', icon:"fab fa-medium", component: AnimatedButton},
        {name:'JockTeller', icon:'fas fa-tachometer-alt', component: LoadingCircle},
        {name:'QuoteGenerator', icon:'fas fa-tachometer-alt', component: QuoteGenerator},
        {name:'InfiniteScroll', icon:'fas fa-tachometer-alt', component: InfiniteScroll},
        {name:'Calculator', icon:'fas fa-tachometer-alt', component: Calculator},
        {name:'Circle', icon:'fas fa-tachometer-alt', component: Circle},
        {name:'Toggle', icon:'fas fa-tachometer-alt', component: Toggle},
        {name:'AppPoll', icon:'fas fa-tachometer-alt', component: AppPoll},
        {name:'ActionTest', icon:'fas fa-tachometer-alt', component: ActionTest},
        {name:'DateRange', icon:'fas fa-tachometer-alt', component: DateRange},
        {name:'PackageUsages', icon:'fas fa-tachometer-alt', component: PackageUsages}
    ]

</script>

<div class="row g-0 m-0" >
    
    <div class="col-2">
        <div class="parent">
            <SideBar list={sidebarItems} on:activeTab={(event)=>{activeTab=event.detail.activeTab}}/>
        </div>
    </div>
    <!-- content -->
    <div class="col">           
        <div class="content">  
            {#if activeTab == 'TestCode'}
                <TestCode on:click={()=>{console.log(activeTab)}}/>
            {:else if activeTab == 'LightDarkTheme'}
                <LightDarkTheme/>
            {:else if activeTab == 'JockTeller'}
                <JockTeller/>
            {:else if activeTab == 'AnimatedButton'}
                <AnimatedButton on:click={()=>console.log('animaed button')}/>
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
                <Toggle width='10rem' onText='on' offText='off' bind:checkedValue={toggleValue}/>
            {:else if activeTab == 'Circle'}
                <Circle/>
            {:else if activeTab == 'ActionTest'}
                <ActionTest/>
            {:else if activeTab == 'PackageUsages'}
                <PackageUsages/>
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

