<script>
  export let header = '...welcome...';
  let arr = header.split('');
</script>

<div class="parent">
  <p>
    {#each arr as item, index}
      <span style="--i:{index + 1}">{item}</span>
    {/each}
  </p>
</div>

<style>
  .parent {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  p {
    position: relative;
    font-style: bold;
    font-size: 2rem;
    letter-spacing: 0.2rem;
  }
  p span {
    position: relative;
    animation: ani 2s ease-in-out infinite;
    color: lightgray;
    -webkit-box-reflect: below -15px red;
    animation-delay: calc(0.2s * var(--i));
  }

  @keyframes ani {
    0% {
      top: 0;
    }
    50% {
      top: -15px;
    }
    100% {
      top: 0;
    }
  }
</style>
