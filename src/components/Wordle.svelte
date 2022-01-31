<script>
    const falseArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g',];
    const wordHandeler = (event)=>{
        if(word.length<5){
        word =word + event.key
        }
        if(event.key=='Enter'){
            checkWord();
        }
    }

</script>

<svelte:window on:keydown={event => wordHandeler(event)} />
<div class="container w-50 mt-2">
  {#each falseArray as item}
    <div class="row g-1 justify-content-center">
      <div class="col-2">
        <div class="p-1 border bg-light d-flex justify-content-center">a</div>
      </div>
      <div class="col-2 ">
        <div class="p-1 border bg-light d-flex justify-content-center">a</div>
      </div>
      <div class="col-2">
        <div class="p-1 border bg-light d-flex justify-content-center">a</div>
      </div>
      <div class="col-2">
        <div class="p-1 border bg-light d-flex justify-content-center">a</div>
      </div>
      <div class="col-2">
        <div class="p-1 border bg-light d-flex justify-content-center">a</div>
      </div>
    </div>
  {/each}
</div>

<style>
</style>
