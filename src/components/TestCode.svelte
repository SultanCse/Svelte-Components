<script>
    let task=''
    let todo = { task: '', completed: false, date: new Date() }
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
  <input type="text" placeholder="add task" bind:value={task} />
  <div class="btn btn-outline-secondary" on:click={() => addTodo()}>add</div>
</div>
{#each todos as todo}
  <div class="m-2 p-2 shadow-sm">
    <input type="checkbox" />
    <span>{todo.task}</span>
    <i class="fas fa-check" />
  </div>
{/each}

<!-- {#each todos as todo} -->
