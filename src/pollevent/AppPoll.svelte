<script>
	import Header from './Header.svelte'
	import Footer from "./Footer.svelte"
	import Tabs from '../elements/Tabs.svelte';
	import CreatePollForm from './CreatePollForm.svelte';
	import PollList from "./PollList.svelte"
	import { onMount } from 'svelte';
	let items=["Current Polls","Add a new poll"]
	let activeItem="Current Polls";
	const handleAdd=()=>{
		activeItem = "Current Polls";
	}
</script>
<Header/>
<main>
	<Tabs {items} {activeItem} on:tabChange={(e)=>{activeItem=e.detail}} />
		{#if activeItem=="Current Polls"}
		<PollList ></PollList>
		{:else if activeItem=="Add a new poll"}
		<CreatePollForm on:add={handleAdd}/>
		{/if}
</main>
<Footer/>
<style>
	main{
		max-width: 960px;
		margin: 40px auto;
	}	
</style>