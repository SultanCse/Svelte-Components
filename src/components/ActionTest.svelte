<script>
    let show=false;
    const test=(node, params)=>{
        console.log(node, params);
        return{ 
            destroy(){
                console.log("node destroyed");
            }
        }
    } 
</script>

<input type="checkbox" bind:checked={show}/>

{#if show}
<h1 use:test={"hi"} >hello</h1>
{/if}