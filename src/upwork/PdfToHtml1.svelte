<body>
  <h1>INDULTA</h1>
  <h4>MAGAZINE OF NEW THOUGHT</h4>
  <div class="mark">MAGAZINE ORDER FORM</div>
  <h4>Mail Checks or Money Orders to:</h4>
  <div class="normal-line">INDULTA</div>
  <div class="normal-line">625 Kenmoor Ave SE Ste 350</div>
  <div class="normal-line">PMB 70338</div>
  <div class="normal-line">Grand Rapids, Michigan 49546-2395</div>
  <div class="form-div">
    <h3>My Information:</h3>
    <span>(Write so we can read it.)</span>
    <br />
    <div class="label">First Name</div>
    <input type="text" />
  </div>
  <div class="row">
    <div class="column">
      <p>Some text..</p>
    </div>
    <div class="column">
      <p>Some text..</p>
    </div>
    <div class="column">
      <p>Some text..</p>
    </div>
  </div>
  <p>
    You will receive the most recent issue of INDULTA once your subscription
    begins. The first issue of our monthly magazine should arrive within 4-6
    weeks of your order. Rest assured, your subscription starts when you receive
    your first issue -- not when you place your order. EMAIL:
    SUPPORT@INDULTA.COM
  </p>
  <div class="banners">
    <div class="point" />
    MOST
    <p>populer</p>
  </div>
</body>

<style>
  .point {
    height: 5px;
    width: 5px;
    border-radius: 50%;
    background: rgb(0, 0, 0);
    position: absolute;
    top: -30px;
    left: 52px;
  }
  .banners {
    background: black;
    color: white;
    text-align: center;
    position: absolute;
    transform: rotate(-20deg);
    border-radius: 5px;
    left: 50%;
    top: 70%;
    padding: 0 2rem;
  }
  .banners::before {
    content: 'A';
    position: absolute;
    width: 40px;
    border-bottom: 4px solid black;
    transform: rotate(-40deg);
    bottom: 70px;
    left: 10px;
  }
  .banners::after {
    content: 'A';
    position: absolute;
    width: 40px;
    border-bottom: 4px solid black;
    transform: rotate(40deg);
    bottom: 70px;
  }
  body {
    background: #ffffff;
    color: #000000;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: 2px solid rgb(0, 0, 0);
    overflow-y: auto;
  }
  input {
    width: 50%;
    height: 30px;
    display: inline;
    border: none;
    border-bottom: 2px solid rgb(0, 0, 0);
    padding-bottom: 0;
  }
  .label {
    font-size: 25px;
    display: inline;
    padding-top: 5px;
  }
  h1 {
    text-align: center;
    font-size: 50px;
    font-weight: 900;
  }
  h3 {
    display: inline-block;
  }
  h4 {
    text-align: center;
    font-size: 15px;
    font-weight: 700;
  }
  .mark {
    text-align: center;
    margin: auto;
    font-size: 30px;
    background: gray;
    color: #ffffff;
    width: 80%;
  }
  .normal-line {
    text-align: center;
    margin: auto;
    font-size: 30px;
    font-size: 20px;
  }
  .column {
    float: left;
    width: 33.33%;
    padding: 10px;
  }
  .row:after {
    content: '';
    display: table;
    clear: both;
  }
</style>
