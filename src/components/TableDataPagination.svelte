<script>
	import { onMount } from 'svelte';
    import { paginate, LightPaginationNav, PaginationNav } from 'svelte-paginate'
    let items = [
        {id: 1, value: 'one'},
        {id: 2, value: 'one'},
        {id: 3, value: 'one'},
        {id: 4, value: 'one'},
        {id: 5, value: 'one'},
        {id: 6, value: 'one'},
        {id: 7, value: 'one'},
        {id: 8, value: 'one'},
        {id: 9, value: 'one'},
        {id: 10, value: 'one'},
        {id: 11, value: 'one'},
        {id: 12, value: 'one'},
        
    ];
    let currentPage = 1
    let pageSize = 4
    $: paginatedItems = paginate({ items, pageSize, currentPage })
    let rightArrow, leftArrow;

    onMount(()=>{
        rightArrow = document.querySelector('.next');
    })

    // $: if(rightArrow && Math.ceil(items.length/pageSize)==currentPage){
    //     rightArrow.addEventListener("click", ()=>{
    //         rightArrow.style.
    //     })
        
    // }

</script>

<div class="parent">
  <table class="table table-striped">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">First</th>
        <th scope="col">Last</th>
        <th scope="col">Handle</th>
      </tr>
    </thead>
    <tbody>
      {#each paginatedItems as item}
        <tr>
          <th scope="row">{item.id}</th>
          <td>{item.value}</td>
          <td>Otto</td>
          <td>@mdo</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <LightPaginationNav
    totalItems={items.length}
    {pageSize}
    {currentPage}
    limit={1}
    showStepOptions={true}
    on:setPage={e => (currentPage = e.detail.page)}
  />
</div>

<style>
  table {
    border: 1px solid rgb(218, 217, 217);
  }
  .parent {
    padding: 0px 20px;
  }
  :global(.light-pagination-nav) {
    display: flex;
    justify-content: right;
  }
  :global(.pagination-nav) {
    /* background: orange !important; */
    padding: 0px 40px;
    box-shadow: 0 1px 2px rgb(0 0 0 / 13%) !important;
  }

  :global(.option.disabled) {
    opacity: 0.3;
  }
</style>
