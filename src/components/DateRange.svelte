<script>
import Litepicker from 'litepicker';
import { onMount } from 'svelte';
    onMount(()=>{
        const picker = new Litepicker({ 
            element: document.getElementById('litepicker') 
        });
    })
    
</script>

<p>hi</p>
<input type="text" id='litepicker'/>