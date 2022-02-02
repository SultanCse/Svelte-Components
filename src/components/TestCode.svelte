<script>
	import { createEventDispatcher } from 'svelte';
  let word = "";
  let keyColors = [];
  let rightWord = "light";
  const falseArray = ['A', 'B', 'C', 'D', 'E', 'F'];
  const charSet = [['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                   ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                   ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'reset',]]; 

  let nextCount = 5;
  const keyboardHandeler = (event)=>{
    if(word.length<nextCount && event.keyCode>=65 && event.keyCode<=90){
      word = word + event.key
    }
    if(word.length != 0 && word.length % 5 == 0 && event.key == 'Enter'){
      checkWord();
      nextCount = word.length + 5;
    }
    if(event.key=='Backspace' && nextCount-5 != word.length){
      word = word.substring(0, word.length-1);
    }
  }
  const onScreenKbHandeller = (b)=> {
    if(word.length<nextCount && b!='bks' && b!='reset' && b!='Enter'){
      word = word + b;
    }
    if(word.length != 0 && word.length % 5 == 0 && b=='Enter'){
      checkWord();
      nextCount = word.length + 5;
    }
    if(b=='bks' && nextCount-5 != word.length){
      word = word.substring(0, word.length-1);
    }
    if(b=='reset' ){
      word = '';
      nextCount = 5;
      colors = [];
      keyColors = [];
    }
    console.log(word);
  }
  let colors=[];
  const checkWord = ()=>{
    colors = [];
    keyColors = [];
       for(let i = 0; i<word.length; i++){
        if(rightWord[i%5] == word[i]){
          colors.push('green');
          keyColors.push({char: word[i].toUpperCase(), color: 'green'})
        }else if(rightWord.includes(word[i]) ){
          colors.push('yellow');
          keyColors.push({char: word[i].toUpperCase(), color: 'yellow'})
        }else{
          colors.push('red');
          keyColors.push({char: word[i].toUpperCase(), color: 'red'})
        }
    }   

      keyColorPerRow();
      
  }

  let firstRow = [];
  let secondRow = [];
  let thirdRow = [];
  const keyColorPerRow = () => {
    firstRow = [];
    secondRow = [];
    thirdRow = [];
    for(let i=0; i<word.length; i++){
      if(charSet[0].includes(keyColors[i].char)){
        firstRow.push({char: keyColors[i].char, color: keyColors[i].color})
      }else if(charSet[1].includes(keyColors[i].char)){
        secondRow.push({char: keyColors[i].char, color: keyColors[i].color})
      }else{
         thirdRow.push({char: keyColors[i].char, color: keyColors[i].color})
      }
    }
    rowColorFilter(firstRow);
    rowColorFilter(secondRow);
    rowColorFilter(thirdRow);
    console.log('firstRow:', firstRow, 'secondRow:', secondRow, 'thirdRow:', thirdRow);
  }

  const rowColorFilter = (row) => {
    for(let i =0; i<row.length; i++){
      if(row[i].color == 'yellow'){
        for(let j =i+1; j<row.length; j++){
          if(row[i].char == row[j].char && row[j].color=='green'){
            row.splice(i,1);
            j--;
          }else if(row[i].char == row[j].char && row[j].color=='yellow'){
            row.splice(j,1);
            j--;
          }
        }
      } 
      else if(row[i].color == 'green'){
        for(let j =i+1; j<row.length; j++){
          if(row[i].char == row[j].char && row[j].color=='yellow'){
            row.splice(j,1);
            j--;
          }else if(row[i].char == row[j].char && row[j].color=='green'){
            row.splice(i,1);
            j--;
          }
        }
      } 
      else if(row[i].color == 'red'){
        for(let j =i+1; j<row.length; j++){
          if(row[i].char == row[j].char && row[j].color=='red'){
            row.splice(i,1);
            j--;
          }
        }
      }

    }
  }
  

</script>

<svelte:window on:keydown={event => keyboardHandeler(event)} />
<div class="position-relative w-100 h-100 border">
  <div class="w-25 mt-2 position-absolute left-50">
    <div class="row mb-1 row-cols-5 gx-2">
      {#each word as item, i}
        <div class="col my-1">
          <div
            class="p-1 border rounded h-2 w-100 d-flex justify-content-center"
            style="background-color: {colors[i]};"
          >
            {item.toUpperCase()}
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
  </div>
  <!-- bottom div -->
  <div class="w-50 mt-2 position-absolute left-50 bottom-0">
    <!-- row1 -->
    <div class="row mb-1 row-cols-10 gx-2">
      {#each charSet[0] as item, i (i)}
        <div class="col my-1 c-p" on:click={() => onScreenKbHandeller(item)}>
          <div
            class="p-1 border rounded h-2 w-100 d-flex justify-content-center"
            style="background-color: {firstRow.color};"
          >
            {item}
          </div>
        </div>
      {/each}
    </div>
    <!-- row2 -->
    <div class="row mb-1 mx-4 row-cols-9 gx-2">
      {#each charSet[1] as item, i (i)}
        <div class="col my-1 c-p" on:click={() => onScreenKbHandeller(item)}>
          <div
            class="p-1 border rounded h-2 w-100 d-flex justify-content-center"
          >
            {item}
          </div>
        </div>
      {/each}
    </div>
    <!-- row3 -->
    <div class="row mb-1 row-cols-10 gx-2">
      {#each charSet[2] as item, i (i)}
        <div class="col my-1 c-p" on:click={() => onScreenKbHandeller(item)}>
          <div
            class="p-1 border rounded h-2 w-100 d-flex justify-content-center"
          >
            {item}
          </div>
        </div>
      {/each}
      <div class="col my-1 c-p" on:click={() => onScreenKbHandeller('bks')}>
        <div class="p-1 border rounded h-2 w-100 d-flex justify-content-center">
          <i class="fas fa-backspace icon" />
        </div>
      </div>
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
  .bottom-0 {
    bottom: 0;
  }
  .c-p {
    cursor: pointer;
  }
  .icon {
    font-size: 1.5rem;
    padding-top: 0.5rem;
    color: crimson;
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
