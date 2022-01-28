<!-- Sidebar -->
<script>
	import SideBar from './../elements/SideBar.svelte';
    import {PackageUsages, LightDarkTheme, AnimatedButton,AppPoll,QuoteGenerator,
        Toggle,Calculator,InfiniteScroll,TestCode,LoadingCircle, JockTeller,TableDataPagination,
        LoadingSquareBar, LoadingInfinityBar, BounchingHeadline, SvgIcon,
        LoadingSingleCircle} from '../services/appList.js'
    
let toggleValue=false;
$: console.log(toggleValue);

let activeTab = 'TestCode';
    let sidebarItems=[
        {name:'TableDataPagination', icon:'fas fa-tachometer-alt', component: TableDataPagination},
        {name:'LoadingSingleCircle', icon:'fas fa-tachometer-alt', component: LoadingSingleCircle},
        {name:'TestCode', icon:'fas fa-tachometer-alt', component: TestCode},
        {name:'SvgIcon', icon:'fas fa-tachometer-alt', component: SvgIcon},
        {name:'LightDarkTheme', icon:'fas fa-tachometer-alt', component: LightDarkTheme},
        {name:'LoadingSquareBar', icon:'fas fa-tachometer-alt', component: LoadingSquareBar},
        {name:'LoadingInfinityBar', icon:'fas fa-tachometer-alt', component: LoadingInfinityBar},
        {name:'JockTeller', icon:'fas fa-tachometer-alt', component: JockTeller},
        {name:'AnimatedButton', icon:"fab fa-medium", component: AnimatedButton},
        {name:'LoadingCircle', icon:'fas fa-tachometer-alt', component: LoadingCircle},
        {name:'QuoteGenerator', icon:'fas fa-tachometer-alt', component: QuoteGenerator},
        {name:'InfiniteScroll', icon:'fas fa-tachometer-alt', component: InfiniteScroll},
        {name:'Calculator', icon:'fas fa-tachometer-alt', component: Calculator},
        {name:'Toggle', icon:'fas fa-tachometer-alt', component: Toggle},
        {name:'AppPoll', icon:'fas fa-tachometer-alt', component: AppPoll},
        {name:'PackageUsages', icon:'fas fa-tachometer-alt', component: PackageUsages}
    ]

</script>

<div class="row g-0 m-0">
  <div class="col-2">
    <div class="parent">
      <SideBar
        list={sidebarItems}
        on:activeTab={event => {
          activeTab = event.detail.activeTab;
        }}
        selected={activeTab}
      />
      <!-- selected={sidebarItems.name == activeTab ? true : false} -->
    </div>
  </div>

  <!-- content -->
  <div class="col">
    <div class="content">
      {#if activeTab == 'TableDataPagination'}
        <TableDataPagination
          on:click={() => {
            console.log(activeTab);
          }}
        />
      {:else if activeTab == 'TestCode'}
        <TestCode
          on:click={() => {
            console.log(activeTab);
          }}
        />
      {:else if activeTab == 'LoadingSingleCircle'}
        <LoadingSingleCircle
          on:click={() => {
            console.log(activeTab);
          }}
        />
      {:else if activeTab == 'SvgIcon'}
        <SvgIcon
          on:click={() => {
            console.log(activeTab);
          }}
        />
      {:else if activeTab == 'LightDarkTheme'}
        <LightDarkTheme />
      {:else if activeTab == 'JockTeller'}
        <JockTeller />
      {:else if activeTab == 'LoadingInfinityBar'}
        <LoadingInfinityBar />
      {:else if activeTab == 'LoadingSquareBar'}
        <LoadingSquareBar />
      {:else if activeTab == 'AnimatedButton'}
        <AnimatedButton on:click={() => console.log('animaed button')} />
      {:else if activeTab == 'LoadingCircle'}
        <LoadingCircle />
      {:else if activeTab == 'InfiniteScroll'}
        <InfiniteScroll />
      {:else if activeTab == 'QuoteGenerator'}
        <QuoteGenerator />
      {:else if activeTab == 'AppPoll'}
        <AppPoll />
      {:else if activeTab == 'Calculator'}
        <Calculator />
      {:else if activeTab == 'Toggle'}
        <Toggle
          width="10rem"
          onText="on"
          offText="off"
          bind:checkedValue={toggleValue}
        />
      {:else if activeTab == 'PackageUsages'}
        <PackageUsages />
      {/if}
      <!-- <div></div> -->
    </div>
  </div>
</div>

<style>
  :global(.my-link, .my-link:hover) {
    text-decoration: none;
  }
  :global(body) {
    overflow-y: hidden;
  }
  .parent {
    height: 89vh;
    overflow-y: auto;
    overflow-x: hidden;
    text-decoration: none;
    border-right: 0.1rem solid #f0764d;
  }
  .content {
    height: 89vh;
    overflow: auto;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-bottom: 0.5rem;
  }

  :global(::-webkit-scrollbar) {
    width: 0.1rem;
  }

  /* Track */
  :global(::-webkit-scrollbar-track) {
    /* box-shadow: inset 0 0 .1rem grey;  */
    border-radius: 0.1rem;
  }

  /* Handle */
  :global(::-webkit-scrollbar-thumb) {
    background: #ff4205;
    border-radius: 0.1rem;
  }
</style>
