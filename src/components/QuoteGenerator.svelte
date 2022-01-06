<script>
import { afterUpdate, onMount } from "svelte";

  import {fade,slide,fly,scale} from "svelte/transition"
  let colors = ['#16a085','#27ae60','#2c3e50','#f39c12',
  '#e74c3c','#9b59b6','#FB6964','#342224','#472E32',
  '#BDBB99','#77B1A9','#73A857'];
  let colorIndex=0;
  let quote='';
  let author='';
  
  const getData=(async () => {
    fetch(`https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json`)
    .then(response => response.json())
    .then(data => {
      colorIndex = Math.floor(Math.random()*colors.length);
      let quteIndex = Math.floor(Math.random()*100);
      quote = data.quotes[quteIndex].quote;
      author = data.quotes[quteIndex].author;
      // console.log(quote+"-"+author);
    }).catch(error => {            
        console.log(error);
        return [];
    });
  });  
  onMount(getData); 
</script>
<div class="container mother transition d-flex justify-content-center" style="background: {colors[colorIndex]}">
  <div class="card transition border-success py-4 px-2 mb-3" >
    <div class="card-body" >
      <h5 class="card-title transition text-center" style="color: {colors[colorIndex]}">''{quote}.</h5>
      <p class="card-text float-end" style="color: {colors[colorIndex]}">-{author}</p>
    </div>
    <div class="card-footer text-white mt-2 border-top-0 bg-transparent">
      <div class="float-start  mt-2 te">
      <i class="bi bi-twitter p-2 rounded transition" style="cursor: pointer; background: {colors[colorIndex]}"></i>
      <i class="bi bi-whatsapp p-2 rounded transition" style="cursor: pointer; background: {colors[colorIndex]}"></i>
      <!-- <i class="fas fa-check-circle"></i> -->
    </div>
      <div class="float-end">
        <p on:click={getData} class="rounded p-2 transition" style="cursor: pointer; background: {colors[colorIndex]}">New Quote</p>
      </div>
    </div>
  </div>
</div>

<style>
  .card{
  max-width: 30rem;
  position: relative;
  top: 7rem;
  font-family: Raleway;
  min-width: 30rem;
  }
  .card-title{
    font-size: 2rem;
    font-weight: lighter;

  }
  .transition{
    transition: 1s ease-in;
  }
</style>