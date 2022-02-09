<script>
	import Modal from './../elements/Modal.svelte';
  let display = true;
  export let title="";
  export let subtitle="";
  export let buttonText="Submit";
  export let className="bg-gray";
</script>

<div
  class="body {display
    ? ''
    : 'd-none'} position-absolute top-0 start-0 w-100 h-100  {className}"
>
  <div
    class="w-50 shadow-sm bg-white border rounded position-absolute start-25 top-20 "
  >
    <!-- Modal header -->
    <p class="text-center fs-1 m-0">{title}</p>
    <!-- sub header -->
    <p class="text-center fs-4 mb-0 {title || subtitle ? 'border-bottom' : ''}">
      {subtitle}
    </p>
    <!-- modal body -->
    <div class="p-2 border-bottom">
      <slot />
    </div>
    <!-- modal bottom buttons -->
    <div class="d-flex justify-content-center my-2">
      <div class="btn btn-primary me-2" type="">{buttonText}</div>
      <div class="btn btn-primary" type="" on:click={() => (display = false)}>
        Cancel
      </div>
    </div>
  </div>
</div>

<style>
  .body {
    z-index: 1111;
    background-color: #cac9c94f;
  }
  .top-20 {
    top: 20%;
  }
  .start-25 {
    left: 25%;
  }
</style>
