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
      <nav class="navbar navbar-light bg-secondary ">
        <div class="container-fluid justify-content-center">  
          <a class="navbar-brand" href="#">    
            <img src="images/svelte.png" alt="" width="30px" height="24px" class="rounded-pill img-thumbnail">
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


<!-- <nav class="navbar navbar-expand-md navbar-light bg-light">
  <div class="container-fluid">
      <a class="navbar-brand h1" href="#">Components</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand" href="#">Navbar</a>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled">Disabled</a>
        </li>
      </ul>
      <form class="d-flex">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav> -->