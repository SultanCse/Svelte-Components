<script>
    // export let actionText = '';
</script>
<div class="row g-0 shadow-sm item" tabindex="1" on:click>
    <div class="col-md-4 d-flex justify-content-center">
        <i class="fas fa-tachometer-alt icon"></i>
    </div>
    <div class="col-md-8 d-sm-none d-md-block title">Toggle Button</div>
</div>

<style>
    .icon{
        padding: .5rem;
        font-size: 2.5rem;
    }
    .title{
        margin-top: auto;
        margin-bottom: auto;
        font-size: 1.3rem;        
    }
    .item{
        cursor: pointer;
    }
    .item:hover{
        background: #f0764d;
        transition: .3s;
        color: white;
    }
    .item:focus{
        background: #FF4205;
        color: white;
        transition: .3s;
    }

</style>

<!-- create element and set attribute
<script>
import { onMount } from "svelte";
    
    let a = document.createElement('a');
    a.setAttribute('href','www.google.com');
    a.setAttribute('target', '_blank')
    a.innerHTML='click'
    onMount(()=>{
        const par = document.getElementById('parentid')
        par.appendChild(a);
    })
    
</script>
<div class="parent" id='parentid'>a</div> -->

<!-- for in loop
<script>
    let arr = {name: 'sultan', age: 23, post: 'Goalanda'};
    for(const key in arr){
        console.log(key + ' :' + arr[key]);,
    }
</script> -->

<!-- Array Assignment
<script>
    let arr = [1,2,3,4,5];
    let arr2 = [...arr];
    let arr2 = arr;
    let arr2 = arr.slice(0,5)
    console.log(arr2);
</script> -->

<!-- Call back function
<script>
    const taskOne = (callback)=>{
        console.log('task one');
        callback();
    }
    const tasktwo = ()=>{
        console.log('task two');
    }
    const taskthree = (num,callback)=>{
        console.log('task '+num);
        callback();
    }

    taskOne(()=>{console.log('callback done')});
    taskOne(tasktwo);
    taskthree(3,()=>{
        console.log('callback three');
    })

</script> -->


<!-- js promise
<script>
    console.log('start')
    const val = true;
    const promise1 = new Promise((resolve,reject)=>{
        if(val==true){
            resolve('resolved promise 1');
        }
        else{
              reject('rejected promise 1');             
        }
    })

    const promise2 = new Promise((resolve,reject)=>{
        if(val==true){
            resolve('resolved promise 2')
        }
        else{
            reject('rejected promise 2')
        }
    })

     promise1.then((res)=>{
        console.log(res);
    })
    .catch((res)=>{
        console.log(res);
    })

     promise2.then((res)=>{
        console.log(res);
    })
    .catch((res)=>{
        console.log(res);
    })

    Promise.race([promise1,promise2])
    .then((res)=>console.log(res))

    console.log('end')
</script> -->



<!-- deal with position -->
<!-- <div class="parent">
    <div class="child1"></div>
    <div class="child2"></div>
</div>

<style>
    .parent{
        height: 300px;
        width: 300px;
        /* position: relative; */
        border: 2px solid red;
    }
    .child1{
        position: relative;
        height: 100px;
        width: 100px;
        background-color: blue;
        border: 2px solid rgba(42, 16, 160, 0.904);
    }
    .child2{
        /* position: relative; */
        height: 110px;
        width: 120px;
        background: green;
        border: 2px solid rgb(37, 212, 139);
    }
</style> -->