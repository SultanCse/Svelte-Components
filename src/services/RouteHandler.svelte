<script>
import Sidebar from "../components/Sidebar.svelte";
import { onMount } from "svelte";
onMount(()=>{
    console.log(Sidebar.name);
})
</script>
<p>routehandle</p>