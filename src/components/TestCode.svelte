<script>
    let task='';
    let completed = false;
    let todos = [{ task: 'task1', completed: false, date: new Date() }, 
        { task: 'task2', completed: false, date: new Date() },];

    const addTodo = () => {
        if(task){
          let todo = { task, completed, date: new Date() }
            todo.task=task;
            todos=[todo,...todos];
        }        
        task='';
    }

    const deleteTodo = (index) => {
      todos = todos.filter(item=>item!=todos[index]);
      console.log(todos);
    };
    const updateTodo = (index) => {};
    $:  completedTodo = (index) => {
      todos[index].completed=!todos[index].completed;
    };

    const keyboardHandeler = (e)=>{
      if(e.keyCode==13){
        addTodo();
      }
    }
</script>

<svelte:window on:keydown={event => keyboardHandeler(event)} />
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
    {#each todos as todo, index}
      <div class="row  shadow-sm justify-content-center my-1">
        <div class="col-1">
          <input
            type="checkbox"
            bind:checked={todo.completed}
            on:click={() => completedTodo(index)}
          />
        </div>
        <div class="col" class:completed={todo.completed}>
          <p>{todo.task}</p>
        </div>
        <div class="col-1 c-p" on:click={() => deleteTodo(index)}>❌</div>
      </div>
    {:else}
      <p class="text-center text-danger">No task added yet</p>
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
  .c-p {
    cursor: pointer;
  }
  .completed {
    text-decoration: line-through;
  }
</style>
