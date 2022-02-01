<script>
  let word = "";
  let wordList = [];
  let rightWord = "light";
  let letterList = [];
  const falseArray = ['a', 'b', 'c', 'd', 'e', 'f',];

  const wordHandeler = (event)=>{
    if(word.length<6 && event.keyCode>=65 && event.keyCode<=90){
      word = word + event.key
    }
    if(event.key=='Enter'){
      checkWord();
    }
     if(event.key=='Backspace'){
      word = word.substring(0, word.length-1);
    }
  }
  $: console.log(letterList)

  let colors = [];

  const checkWord = ()=>{
       for(let i = 0; i<word.length; i++){
        if(rightWord[i%5] == word[i]){
          colors.push('green');
        }else if(rightWord.includes(word[i]) ){
          colors.push('yellow');
        }else{
          colors.push('red');
        }
       }
       colors = colors;      
  }

</script>

<svelte:window on:keydown={event => wordHandeler(event)} />
<div class="position-relative" style="left:30%;">
  <div class="w-50 mt-2 position-absolute">
    <div class="row mb-1 row-cols-5 gx-2">
      {#each word as item, i}
        <div class="col my-1">
          <div
            class="p-1 border h-2 w-100 d-flex justify-content-center"
            style="background-color: {colors[i]};"
          >
            {item}
          </div>
        </div>
      {/each}
    </div>
  </div>
  <div class="w-50 mt-2 position-absolute">
    <div class="row mb-1 row-cols-5 gx-2">
      {#each falseArray as item}
        <div class="col my-1">
          <div class="p-1 border h-2 w-100 d-flex justify-content-center" />
        </div>
        <div class="col my-1">
          <div class="p-1 border h-2 w-100 d-flex justify-content-center" />
        </div>
        <div class="col my-1">
          <div class="p-1 border h-2 w-100 d-flex justify-content-center" />
        </div>
        <div class="col my-1">
          <div class="p-1 border h-2 w-100 d-flex justify-content-center" />
        </div>
        <div class="col my-1">
          <div class="p-1 border h-2 w-100 d-flex justify-content-center" />
        </div>
      {/each}
    </div>

    <button on:click={() => console.log('reset')}>reset</button>
  </div>
</div>

<style>
  .h-2 {
    height: 3rem;
  }
  .wrong {
    background-color: red;
  }
  .correct {
    background-color: green;
  }
  .positionWrong {
    background-color: yellow;
  }
</style>
