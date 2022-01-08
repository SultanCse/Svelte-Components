<script>
import { onMount } from "svelte";


    // api url
    const api_key = 'WWsBOsSnXbn9GJv3gucUMHYWJ3YHryd2uZMN1wWlIHk'
    const count = 5;
    const link = `https://api.unsplash.com/photos/random/?client_id=${api_key}&count=${count}`;
    // https://api.unsplash.com/photos/random/?client_id=WWsBOsSnXbn9GJv3gucUMHYWJ3YHryd2uZMN1wWlIHk&count=5
    //get photes
    let data;
    let fdata = [];
    const getPhotoes = async() => {
        try{
            const response = await fetch(link);
            data = await response.json();
            console.log(data);
        }
        catch(error){
            console.log(error);
        }
    }
    getPhotoes();
    $: fdata = data.slice(0);
    
    onMount(()=>{
        console.log(fdata.length)
    })
</script>
<div class="body">
    <div class='title'>UNSPLASH API-INFINITE SCROLL</div>
    <div class="loader" >
        <img src="./images/loader.svg" alt="loader img"/>
    </div>
    <div class="image-container">
        {#if fdata.length>0}
            {#each data as image}
            <img src={image.urls.regular} alt='img' />
            {/each}
        {/if}
    </div>

</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Raleway:wght@400;500&display=swap');
    .body{
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
        background: whitesmoke;        
    }
    .title{
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        letter-spacing: 5px;
        font-family: Bebas Neue;
        font-size: 1.5rem;
        font-style: bold;
        text-align: center;
    }
    .loader{
        position: relative;
        height: 100%;
        width: 100%;
        background: rgba(182, 179, 179, 0.8);
        position: relative;
        top: -2.2rem;
        /* padding: fixed; */
        /* top: 50%; */
    }
    .loader img{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .image-container{
        margin-left: 10%;
        margin-right: 10%;
        justify-content: center;
    }
    .image-container img{
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        height: auto;
    }
    

</style>