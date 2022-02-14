<script>
    let task='';
    let completed = false;
    let todo = { task, completed, date: new Date() }
    let todos = [{ task: 'task1', completed: false, date: new Date() }, 
        { task: 'task2', completed: false, date: new Date() },];

    const addTodo = () => {
        if(task){
            todo.task=task;
            todos=[...todos,todo];
            task='';
        }        
    }

    const deleteTodo = (index) => {};
    const updateTodo = (index) => {};
    const taskCompleted = (index) => {};
</script>

<div class="d-flex justify-content-center m-2">
  <input
    type="text"
    placeholder="add task"
    autofocus="autofocus"
    bind:value={task}
    class="w50"
  />
  <div class="btn btn-outline-secondary" on:click={() => addTodo()}>add</div>
</div>

<div class="d-flex justify-content-center">
  <div class="m-2 w50">
    {#each todos as todo}
      <div class="row  shadow-sm justify-content-center my-1">
        <div class="col-1"><input type="checkbox" /></div>
        <div class="col"><p>{todo.task}</p></div>
        <div class="col-1"><i class="fas fa-trash font-red" /></div>
      </div>
    {/each}
  </div>
</div>

<!-- {#each todos as todo} -->
<style>
  .w75 {
    width: 75%;
  }
  .w50 {
    width: 50%;
  }
  .w25 {
    width: 25%;
  }
  input:focus {
    outline: none;
  }
</style>
