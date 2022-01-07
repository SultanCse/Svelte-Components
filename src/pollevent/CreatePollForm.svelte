<script>
	import { PollStore } from './../store/PollStore.js';
	import Button from './../elements/Button.svelte';
    import {createEventDispatcher} from "svelte"
    import {fade,slide,scale} from "svelte/transition"
    const dispatch = createEventDispatcher();
    let fields={question: "", answer1: "", answer2: ""}
    let errors={question: "", answer1: "", answer2: ""}
    let valid = false;
    let invalid= false;
    const submitHandeller=()=>{
        valid = true;
        if(fields.question.trim().length<5){
            valid = false;
            invalid=true;
            errors.question = "Question length should not be less than 5 character"            
        }else{
            errors.question = '';
            invalid=false;
        }
        if(fields.answer1.trim().length<1){
            valid = false;
            invalid=true;
            errors.answer1 = "Answer should not be empty"
        }else{
            errors.answer1 = '';
            invalid=false;
        }
        if(fields.answer2.trim().length<1){
            valid = false;
            invalid=true;
            errors.answer2 = "Answer should not be empty"
        }else{
            errors.answer2 = '';
            invalid=false;
        }
        if(valid){
            let poll={...fields, vote1: 0, vote2: 0, id: Math.random()};
            PollStore.update((currentData)=>{
                currentData=[poll,...currentData]
                dispatch("add");
                return currentData;
            });
            
        }else{
            console.log("invalid: "+errors);
        } 
    };
</script>

<div in:fade={{duration:500}}>
    <form on:submit|preventDefault="{submitHandeller}">
        <div class="form-field">
            <label for="question">Poll Question:</label>
            <input type="text" id="question" bind:value={fields.question} class:valid={invalid}>
            <div class="error">{errors.question}</div>
        </div>
        <div class="form-field">
            <label for="answer1">Answer 1:</label>
            <input type="text" id="answer1" bind:value={fields.answer1} class:valid={invalid}>
            <div class="error">{errors.answer1}</div>
        </div>
        <div class="form-field">
            <label for="answer2">Answer 2:</label>
            <input type="text" id="answer2" bind:value={fields.answer2} class:valid={invalid}>
            <div class="error">{errors.answer2}</div>
        </div>
        <Button type="secondary" >Add Poll</Button>
    </form>
</div>
<style>
    form{
        width: 400px;
        margin: 0px auto;
        text-align: right;
    }
    input{
        border-radius: 6px;
        width: 100%;
    }
    label{
        margin: 10px auto;
    }
    .form-field{
        margin: 18px auto;
        text-align: left;
    }
    .error{
        color: #d91b42;
        font-weight: bolt;
        font-size: 10px;
    }
    .valid{
        border: 1px solid red;
    }

</style>