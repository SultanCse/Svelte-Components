<script>
  let word = "";
  let rightWord = "light";
  const falseArray = ['a', 'b', 'c', 'd', 'e', 'f'];

  let nextCount = 5;
  const wordHandeler = (event)=>{
    if(word.length<nextCount && event.keyCode>=65 && event.keyCode<=90){
      word = word + event.key
    }
    if(word.length != 0 && word.length % 5 == 0 && event.key == 'Enter'){
      checkWord();
      nextCount = word.length + 5;
    }
    if(event.key=='Backspace'){
      word = word.substring(0, word.length-1);
    }
  }
  let colors=[];
  const checkWord = ()=>{
    colors = [];
       for(let i = 0; i<word.length; i++){
        if(rightWord[i%5] == word[i]){
          colors.push('green');
        }else if(rightWord.includes(word[i]) ){
          colors.push('yellow');
        }else{
          colors.push('red');
        }
       }    
       console.log(colors)
  }

</script>

<svelte:window on:keydown={event => wordHandeler(event)} />
<div class="position-relative">
  <div class="w-25 mt-2 position-absolute left-50">
    <div class="row mb-1 row-cols-5 gx-2">
      {#each word as item, i}
        <div class="col my-1">
          <div
            class="p-1 border rounded h-2 w-100 d-flex justify-content-center"
            style="background-color: {colors[i]};"
          >
            {item}
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div class="w-25 mt-2 position-absolute left-50">
    <div class="row mb-1 row-cols-5 gx-2">
      {#each falseArray as item}
        <div class="col my-1">
          <div
            class="p-1 border rounded h-2 w-100 d-flex justify-content-center"
          />
        </div>
        <div class="col my-1">
          <div
            class="p-1 border rounded h-2 w-100 d-flex justify-content-center"
          />
        </div>
        <div class="col my-1">
          <div
            class="p-1 border rounded h-2 w-100 d-flex justify-content-center"
          />
        </div>
        <div class="col my-1">
          <div
            class="p-1 border rounded h-2 w-100 d-flex justify-content-center"
          />
        </div>
        <div class="col my-1">
          <div
            class="p-1 border rounded h-2 w-100 d-flex justify-content-center"
          />
        </div>
      {/each}
    </div>

    <div
      type="button"
      class="btn btn-outline-danger"
      on:click={() => {
        word = '';
        colors = [];
        nextCount = 5;
      }}
    >
      reset
    </div>
  </div>
</div>

<style>
  .h-2 {
    height: 3rem;
  }
  .left-50 {
    left: 50%;
    transform: translateX(-50%);
  }
  @media (max-width: 1000px) {
    .w-25 {
      width: 50% !important;
    }
  }
  @media (max-width: 500px) {
    .w-25 {
      width: 80% !important;
    }
    .left-50 {
      left: 1%;
    }
  }
</style>
