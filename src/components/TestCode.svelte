<script>
import { onMount } from "svelte";
let info;


  let fakeApiLink = "http://localhost:3011/data";
  
  const get = async (url)=>{
    let res = await fetch(url);
    if(!res.ok){
      throw new Error(`Error: '${res.status}`);
    }
    let data = await res.json();
    return data;
  }
  onMount(async ()=>{
  get(fakeApiLink)
  .then(res=>{
    info = res.name;
    console.log(res);
  })
  .catch(err=>{console.log(err)});

  });

</script>

{#if info}
  <h1>{info}</h1>
{/if}
