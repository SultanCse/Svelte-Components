<script>
	import { fade } from 'svelte/transition';
    import { onMount } from "svelte";
    // api url
    const api_key = 'WWsBOsSnXbn9GJv3gucUMHYWJ3YHryd2uZMN1wWlIHk';
    const count = 5;
    const link = `https://api.unsplash.com/photos/random/?client_id=${api_key}&count=${count}`;
    let data=[];
    let loader = '';
    $: height = '100%';
    const getPhotoes = async() => {
        try{
            const response = await fetch(link);
            data = await response.json();
            console.log(data);
            if(data.length>0){
                loader = 'd-none';
                height = '';
                console.log(loader);
            }
        }
        catch(error){
            console.log(error);
        }
    } 
    getPhotoes();

    window.addEventListener('scroll',()=>{
        console.log("scroll")
    })
    // let imgcontainer = document.getElementById('imgcontainer');
    // imgcontainer.addEventListener('scroll',()=>{
    //     console.log("scroll");
    // })

    // let img = document.getElementById('img');
    // img.addEventListener('load',()=>{
    //         console.log('img ok')            
    //         img.setAttribute('transition', '2s');
    //     })
let container
   const loadFade = ()=>{
       container = document.getElementById('containers');
    //    container.style.background="red";
    //    console.log('P:'+container.offsetHeight)
   }

   onMount(()=>{
       container = document.getElementById('containers');
       console.log('image container:'+container.offsetHeight)
       console.log('window height:'+window.innerHeight)
   })
    const scroll = ()=>{
        console.log('image container:'+container.offsetHeight)
        console.log('scroll content');
    }
    window.addEventListener('click', ()=>{
        console.log('clicked')
    })
      
</script>
<div class="test" style=" height: 100vh; overflow-x: auto; " on:scroll={scroll}>
    <div class="body" style="height: {height};">
        <div class='title'>UNSPLASH API-INFINITE SCROLL</div>
        <div class="loader {loader}">
            <img src="./images/loader.svg" alt="loader img"/>
        </div>
        <div class="image-container" id="containers">
            {#if data.length>0}
                {#each data as image}
                <div in:fade={{duration:2000}}>
                <a href={image.links.html} target="_blank">
                <img id='img' on:show={scroll} class='img-thumbnail' src={image.urls.regular} alt={image.alt_description} title={image.alt_description} />
                </a>
                </div>
                {/each}
            {/if}
        </div>
    </div>
</div>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Raleway:wght@400;500&display=swap');
    .body{
        /* height: 100%; */
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
        background: whitesmoke;
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
        margin-left: 20%;
        margin-right: 20%;
        /* background: whitesmoke; */
        justify-content: center;
    }
    .image-container img{
        display: block;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        height: auto;
        cursor: pointer;
    }

    /* for large smart phone */
    @media screen and (max-width:700px){
        .title{
            font-size: 1.2rem;
        }
        .image-container{
        margin-left: 2%;
        margin-right: 2%;
        /* background: whitesmoke; */
        }
    }

</style>