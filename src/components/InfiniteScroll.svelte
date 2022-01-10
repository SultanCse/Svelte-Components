<script>
import { onMount } from 'svelte';

	import { fade } from 'svelte/transition';
    const api_key = 'WWsBOsSnXbn9GJv3gucUMHYWJ3YHryd2uZMN1wWlIHk';
    const count = 10;
    const link = `https://api.unsplash.com/photos/random/?client_id=${api_key}&count=${count}`;
    $: data=[];
    let loader = '';
    $: height = '100%';
    let imageCount = 0;
    const getPhotoes = async() => {
        try{
            const response = await fetch(link);
            let datas = await response.json();
            data = [...data, ...datas];
            console.log(data);
        }
        catch(error){
            console.log(error);
        }
    } 

    $: if(imageCount>0){
        loader = 'd-none';
        height = 'auto';
    }
    
    getPhotoes(); 
    let body;
    let elements;
    let img;
    onMount(()=>{
        body = document.getElementById('body');
        elements = document.getElementById('elements');
        img = document.getElementById('img');
    })

    const scrollFun = ()=>{
        if(window.innerHeight + body.scrollTop >= elements.offsetHeight-700 && imageCount == 10){
            imageCount = 0;
            getPhotoes();
            console.log(elements.offsetHeight);
            console.log(imageCount);
        }
    }
    const onLoadFun = ()=>{
        imageCount++;
        console.log(imageCount);
    }
</script>

<div class="body" on:scroll={scrollFun} id='body' style=" height: 100vh; overflow-x: auto;">
    <div class="elements" id='elements' style="height: {height};">
        <div class='title' >UNSPLASH API-INFINITE SCROLL</div>
        <div class="loader {loader}">
            <img src="./images/loader.svg" alt="loader img"/>
        </div>
        <div class="image-container" >
            {#if data.length>0}
                {#each data as image}
                <div in:fade={{duration:2000}}>
                <a href={image.links.html} target="_blank">
                <img in:fade={{duration:2000}} id='img' on:load={onLoadFun} class='img-thumbnail' src={image.urls.regular} alt={image.alt_description} title={image.alt_description} />
                </a>
                </div>
                {/each}
            {/if}
        </div>
    </div>
</div>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Raleway:wght@400;500&display=swap');
    .elements{
        width: 100%;
        /* height: auto; */
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
    @media screen and (max-width:700px){
        .title{
            font-size: 1.2rem;
        }
        .image-container{
        margin-left: 2%;
        margin-right: 2%;
        }
    }

</style>
<!-- <script>
import { onMount } from 'svelte';

	import { fade } from 'svelte/transition';
    // const imageContainer = document.getElementById('image-container')
    const loader = document.getElementById('loader')
    let photosArray = [];

    // api url
    const api_key = 'WWsBOsSnXbn9GJv3gucUMHYWJ3YHryd2uZMN1wWlIHk';
    const count = 5;
    const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${api_key}&count=${count}`;
    
    const setAttributes = (item,object)=>{
        for(const key in object){
            item.setAttribute(key, object[key]);
        }
    }
    //get photoes from api
    const getPhotoes = async() => {
        try{
            const response = await fetch(apiUrl);
            photosArray = await response.json();
            const imageContainer = document.getElementById('image-container')
            console.log(photosArray);
            photosArray.forEach((photo) => {
                // create anchor item
                const item = document.createElement('a');
                item.setAttribute('href', photo.links.html);
                item.setAttribute('target', '_blank');
                // create img for photo
                const img = document.createElement('img');
                // img.setAttribute('src', photo.urls.regular);
                // img.setAttribute('alt', photo.alt_description);
                // img.setAttribute('title', photo.alt_description);
                setAttributes(img,{src: photo.urls.regular, 
                    alt: photo.alt_description, 
                    title: photo.alt_description,
                })
                // document.getElementById("img").style.cssText = "display: block;margin-left: auto;margin-right: auto;width: 100%;height: auto;cursor: pointer";
                // Object.assign(img.style,{display: 'block';margin-left: 'auto';margin-right: 'auto';width: '100%';height: 'auto';cursor: 'pointer'});
                // put <img> inside <a> telement
                item.appendChild(img);
                imageContainer.appendChild(item);
            }
            );
            document.getElementById("img").style.cssText = "display: block;margin-left: auto;margin-right: auto;width: 100%;height: auto;cursor: pointer";
        }
        catch(error){
            console.log(error);
        }
    } 
    onMount(()=>{
        getPhotoes(); 
    })
    
</script>

<div class="test" style=" height: 100vh; overflow-x: auto;">
    <div class="body" style="">
        <div class='title'>UNSPLASH API-INFINITE SCROLL</div>
        <div class="loader" id='loader' hidden>
            <img src="./images/loader.svg" alt="loader img"/>
        </div>
        <div class="image-container" id="image-container">
            <div in:fade={{duration:2000}}>
                <a href='#' target="_blank">
                    <img id='img' class='img-thumbnail' src='images/propic.jpg' alt='' title='' />
                </a>
            </div>
        </div>
    </div>
</div>
<style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Raleway:wght@400;500&display=swap');
    .body{
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
    @media screen and (max-width:700px){
        .title{
            font-size: 1.2rem;
        }
        .image-container{
        margin-left: 2%;
        margin-right: 2%;
        }
    }

</style> -->
