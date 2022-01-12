<script>
  // header section
  let arrow = 'left'
  let navColSize = 2;
  const toggleArrow = ()=>{
    if(arrow=='left'){
      arrow='right'
      navColSize = 1;
    }
    else{
      arrow='left'
      navColSize = 2;
    }
  }
  // header section

</script>

  <div class="row g-0 m-0 sticky-top" >
    <div class="col-{navColSize} p-0" id='col'>
      <nav class="navbar navbar-light bg-danger ">
        <div class="container-fluid justify-content-center">  
          <a class="navbar-brand" href="https://www.google.com" target="_blank">    
            <img src="images/svelte.png" alt="" width="30px" height="24px" class=" img-thumbnail">
          </a>    
        </div>
      </nav>
    </div>
    <div class="col p-0">
      <div class="navbar navbar-light bg-light">        
        <a class="navbar-brand" href="#">
          <i class="fas fa-arrow-{arrow} px-3" on:click={toggleArrow}></i></a>        
      </div>      
    </div>
  </div>


<style>
  #col{
    transition: .5s;
    border-right: 1px solid #222727;
  }
</style>
