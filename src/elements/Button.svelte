<script>
    export let type= "primary";
    export let flat = false;
    export let inverse = false;

</script>

<button class={type} class:flat={flat} class:inverse={inverse} on:click>
    <slot></slot>
</button>

<style>
    button{
        border-radius: 6px;
        border: 0;
        cursor: pointer;
        padding: 10;
        font-weight: bolt;
        box-shadow: 1px 2px 3px rgb(0,0,0,.5);
    }
    .primary{
        background: #d91b42;
        color: white;
    }
    .secondary{
        background-color: #45c496;
        color: white;
    }

    .flat{
        box-shadow: none;
    }
    .primary.inverse{
        background: white;
        color: #d91b42;
        border: 2px solid red;
    }
    .secondary.inverse{
        background-color: white;
        color: #45c496;
        border: 2px solid #45c496;
    }
</style>