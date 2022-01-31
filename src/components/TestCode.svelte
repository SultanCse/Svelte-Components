<script>
  let word = "";
  let rightWord = "light";
  let letterList = [];
  const falseArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g',];

  const wordHandeler = (event)=>{
    if(word.length<5){
      word =word + event.key
    }
    if(event.key=='Enter'){
      checkWord();
    }
     if(event.key=='Backspace'){
       console.log(event.key)
      word = word.substring(0, word.length);
    }
  }
  $: console.log(letterList)

  let wrong = false;
  let correct = false;
  let positionWrong = false;

  let colors = [];

  const checkWord = ()=>{
     word = word.split('');
       for(let i = 0; i<word.length; i++){
        if(rightWord[i] == word[i]){
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

<div class="container w-50 mt-2">
  <div class="row gx-1 mb-1 justify-content-center">
    <div class="col-2 border">
      <div
        class="p-1 h-2 w-100 d-flex justify-content-center"
        style="background:{colors[0]}"
      >
        {word[0] ? word[0] : ''}
      </div>
    </div>
    <div class="col-2 border">
      <div
        class="p-1 h-100 w-100  bg-light d-flex justify-content-center"
        style="background:{colors[1]}"
      >
        {word[1] ? word[1] : ''}
      </div>
    </div>
    <div class="col-2">
      <div
        class="p-1 h-100 w-100 border bg-light d-flex justify-content-center"
      >
        {word[2] ? word[2] : ''}
      </div>
    </div>
    <div class="col-2">
      <div
        class="p-1 h-100 w-100 border bg-light d-flex justify-content-center"
      >
        {word[3] ? word[3] : ''}
      </div>
    </div>
    <div class="col-2">
      <div
        class="p-1 h-100 w-100 border bg-light d-flex justify-content-center"
      >
        {word[4] ? word[4] : ''}
      </div>
    </div>
  </div>
  <div class="row g-1 mb-1 justify-content-center">
    {#each word as item, i}
      <div class="col-2">
        <div
          class="p-1 h-2 w-100 border d-flex justify-content-center"
          id={item.id}
          style="background-color: {colors[i]};"
        >
          {item}
        </div>
      </div>
    {/each}
  </div>
</div>
<div class="container w-50 mt-2">
  {#each falseArray as item}
    <div class="row gx-1 mb-1 justify-content-center">
      <div class="col-2 border">
        <div class="p-1 h-2 w-100 d-flex justify-content-center" />
      </div>
      <div class="col-2 border">
        <div class="p-1 h-2 w-100 d-flex justify-content-center" />
      </div>
      <div class="col-2 border">
        <div class="p-1 h-2 w-100 d-flex justify-content-center" />
      </div>
      <div class="col-2 border">
        <div class="p-1 h-2 w-100 d-flex justify-content-center" />
      </div>
      <div class="col-2 border">
        <div class="p-1 h-2 w-100 d-flex justify-content-center" />
      </div>
    </div>
  {/each}
  <button on:click={() => checkWord()}>check</button>
</div>
<div class="container w-75 mt-5">
  <div class="row g-1 mb-1 justify-content-center">
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1 ">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1 ">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
  </div>
  <div class="row g-1 mb-1 justify-content-center">
    <div class="col-1 ">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1 ">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
  </div>
  <div class="row g-1 mb-1 justify-content-center">
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1 ">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1 ">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
    <div class="col-1">
      <div class="p-1 border bg-light d-flex justify-content-center">a</div>
    </div>
  </div>
</div>

<style>
  .h-2 {
    height: 2rem;
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
