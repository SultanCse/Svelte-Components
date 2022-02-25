<script>

  let fakeApiLink = "https://jsonplaceholder.typicode.com/posts";
  
  const get = async (url)=>{
    let res = await fetch(url);
    if(!res.ok){
      throw new Error(`Error: '${res.status}`);
    }
    let data = await res.json();
    return data;
  }

  const post = async (url, postData)=>{
    let res = await fetch(url, postData)
    if(!res.ok){
      throw new Error(`Error: '${res.status}`);
    }
    let data = await res.json();
    return data;
  } 

  post(fakeApiLink, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: "sultan",
      body: "ahmed was here",
      userId: 2
    })
  }).then(data=>{
    console.log(data);
  }).catch(err=>{
    console.log(err);
  }
  )
  
  // get(fakeApiLink)
  // .then(res=>{
  //   console.log(res);
  // })
  // .catch(err=>{console.log(err)});

</script>
