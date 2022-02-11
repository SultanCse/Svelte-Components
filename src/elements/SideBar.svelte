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
    class="row g-0 shadow-sm item m-1"
    class:select={selected == item.name ? true : false}
    tabindex="1"
    on:click={() => {
      dispatch('activeTab', {activeTab: item.name});
    }}
  >
    <div class="col-lg-4 col-12 d-flex justify-content-center">
      <i class="{item.icon} icon text-center" />
    </div>
    <div
      class="col-lg-8 col-12 d-none d-md-block text-lg-start text-md-center title"
    >
      {item.name ? item.name : item.component.name}
    </div>
  </div>
{/each}

<style>
  .icon {
    /* padding: 0.8rem; */
    /* margin-top: 1.2rem; */
    font-size: 1rem;
  }
  .title {
    margin-top: auto;
    margin-bottom: auto;
    font-size: 0.9rem;
  }
  .item {
    cursor: pointer;
    border-radius: 3px;
    padding: 1rem 0;
    /* height: 50px; */
    /* color: #ff4205; */
  }
  .item:hover {
    background: #f76e11;
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
    background: #f76e11;
    color: white;
    transition: 0.3s;
  }
  .row:hover .icon {
    transform: scale(1.4);
    transition: 0.2s;
  }
</style>
