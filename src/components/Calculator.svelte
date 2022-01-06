<script>
  let num1 = 1, num2 = 2, num3 = 3,
      num7 = 7, num8 = 8, num9 = 9;
  let numHash='/';
  let equation='';

  let pressedKeyList = [];

  document.addEventListener("keydown", (e) => {
    let x=e.key;
    if(Number(x) || x=='+' || x=='-' || x=='*' || x=='/'){
      equation = equation+x;
    }
    
  });

  const setNumber=(x)=>{
    equation=equation+x;
  }
</script>
<div class="container-fluid">
  <div class="row justify-content-center">
    <div class="col-md-4 col-md-offset-4">
      <!-- start of header section -->
      <div class="row header">
        <div class="col-md-2">
          <span class="glyphicon glyphicon glyphicon-menu-hamburger" />
        </div>
        <div class="col-md-8">
          <p>Calculator</p>
        </div>
        <div class="col-md-2">
          <span class="glyphicon glyphicon glyphicon-cog" />
        </div>
      </div>
      <!-- header div -->
      <!-- end of header section -->
      <!-- start of textbox -->
      <div class="row teaxtbox">
        <div class="col-md-12 padding-reset">
          <input type="text" name="" bind:value={equation} />
        </div>
      </div>
      <!-- end of textbox -->

      <!-- start of button design -->
      <div class="row commonbutton">
        <!-- first row -->
        <div class="col-3">
          <input type="submit" name="" value="&#8730;" class="" />
        </div>
        <div class="col-3">
          <input type="submit" name="" value="(" class="" />
        </div>
        <div class="col-3">
          <input type="submit" name="" value=")" class="" />
        </div>
        <div class="col-3">
          <input type="submit" name="" value="%" class="" />
        </div>
        <!-- second row -->
        <div class="col-3">
          <input type="submit" name="" bind:value={num7} on:click={()=>setNumber(7)} />
        </div>
        <div class="col-3">
          <input type="submit" name="" bind:value={num8} on:click={()=>setNumber(8)}/>
        </div>
        <div class="col-3">
          <input type="submit" name="" bind:value={num9} on:click={()=>setNumber(9)}/>
        </div>
        <div class="col-3">
          <input type="submit" name="" bind:value={numHash} class="" on:click={()=>setNumber('/')}/>
        </div>
        <!-- third row -->
        <div class="col-3">
          <input type="submit" name="" value="4" class="" on:click={()=>setNumber(4)} />
        </div>
        <div class="col-3">
          <input type="submit" name="" value="5" class="" on:click={()=>setNumber(5)}/>
        </div>
        <div class="col-3">
          <input type="submit" name="" value="6" class="" on:click={()=>setNumber(6)}/>
        </div>
        <div class="col-3">
          <input type="submit" name="" value="X" class="" on:click={()=>setNumber('x')}/>
        </div>
        <!-- four row -->
        <div class="col-3">
          <input type="submit" name="" value="1" class="" on:click={()=>setNumber(1)}/>
        </div>
        <div class="col-3">
          <input type="submit" name="" value="2" class="" on:click={()=>setNumber(2)}/>
        </div>
        <div class="col-3">
          <input type="submit" name="" value="3" class="" on:click={()=>setNumber(3)}/>
        </div>
        <div class="col-3">
          <input type="submit" name="" value="-" class="" />
        </div>
      </div>
      <!-- end of comonbutton div -->
      <!-- end of button design -->
      <!-- start of conflicting button area -->
      <div class="row conflict">
        <div class="col-md-9">
          <div class="row">
            <div class="col-md-8">
              <input type="submit" name="" value="0" class="" />
            </div>
            <div class="col-md-4">
              <input type="submit" name="" value="." class="" />
            </div>
            <div class="col-md-4">
              <input type="submit" name="" value="Del" id="del" />
            </div>
            <div class="col-md-8">
              <input type="submit" name="" value="=" id="equal" />
            </div>
          </div>
        </div>
        <!-- end  zero, dot, del and equal sign div -->
        <div class="col-md-3">
          <input type="submit" name="" value="+" id="plus" />
        </div>
      </div>
      <!-- end of conflicting area -->
      <!-- end of conflicting button area -->
    </div>
  </div>
</div>

<style>
  .header {
    background: #80c683;
  }
  .header p {
    text-align: center;
    font-size: 16px;
    color: #fff;
    padding: 16px;
    margin: 0;
    font-weight: 700;
  }
  span {
    color: #fff;
    padding: 16px;
  }
  .padding-reset {
    padding-left: 0;
    padding-right: 0;
    /*use for resing default padding for .row in input text section*/
  }
  .teaxtbox input[type="text"] {
    width: 100%;
    border: 1px solid #f1f1f1;
    font-size: 18px;
    font-weight: 700;
    padding: 12px;
  }
  .teaxtbox input[type="text"]:focus {
    outline: none;
  }
  .commonbutton input[type="submit"] {
    padding: 8px;
    background: #f2f2f2;
    border: none;
    font-size: 18px;
    font-weight: 700;
    width: 100%;
    margin-top: 15px;
    border-radius: 5px;
  }
  .conflict input[type="submit"] {
    padding: 8px;
    background: #f2f2f2;
    border: none;
    font-size: 18px;
    font-weight: 700;
    width: 100%;
    margin-top: 15px;
    border-radius: 5px;
  }
  .conflict input[type="submit"]:focus,
  .commonbutton input[type="submit"]:focus {
    outline: none;
  }
  #del {
    background: #f40057;
    color: #fff;
  }
  #plus {
    height: 97px;
  }
  #equal {
    background: #80c683;
    color: #fff;
  }
</style>
