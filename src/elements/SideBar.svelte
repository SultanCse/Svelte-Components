<script>
    import { createEventDispatcher, onMount } from "svelte";
    // import AppPoll from "../pollevent/AppPoll.svelte";
    // export let list;
    export let list=[
        // {name: 'TestCode',icon: 'fas fa-tachometer-alt', component: AppPoll},
        // {name: 'TestCode',icon: 'fas fa-tachometer-alt', component: AppPoll},
        // {name: 'TestCode',icon: 'fas fa-tachometer-alt', component: AppPoll},
    ];
    export let selected = '';
    $: console.log(selected);
    const dispatch = createEventDispatcher();
    onMount(() => {
        // console.log(activeClass);
    });
</script>

{#each list as item}
  <div
    class="row g-0 shadow-sm item"
    class:select={selected == item.name ? true : false}
    tabindex="1"
    on:click={() => {
      dispatch('activeTab', {activeTab: item.name});
    }}
  >
    <div class="col-lg-4 col-md-12 d-flex justify-content-center">
      <i class="{item.icon} icon" />
    </div>
    <div
      class="col-lg-8 col-md-12 d-sm-none d-md-block d-flex text-lg-start text-md-center title"
    >
      {item.name ? item.name : item.component.name}
    </div>
  </div>
{/each}

<style>
  .icon {
    padding: 0.8rem;
    font-size: 2.5rem;
  }
  .title {
    margin-top: auto;
    margin-bottom: auto;
    font-size: 1rem;
  }
  .item {
    cursor: pointer;
    color: #ff4205;
  }
  .item:hover {
    background: #f0764d;
    transition: 0.3s;
    color: white;
  }
  .item:focus {
    background: #ff4205;
    color: white;
    transition: 0.3s;
  }
  .item:focus .icon {
    transform: scale(1.4);
  }
  .select {
    background: #ff4205;
    color: white;
    transition: 0.3s;
  }
  .row:hover .icon {
    transform: scale(1.4);
    transition: 0.2s;
  }
</style>
