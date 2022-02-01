<script>
    import { onMount } from "svelte";
    let button = null;
    let audioElement = null;
    let loading = null;
    const jockTextURL = `https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,sexist,explicit`;
    const jockAudioAPIkey = '06d028ad85324cd89d340dfd22ace56b'

    const VoiceRSS = {
        speech: function(e) {
            console.log(e)
            this._validate(e), this._request(e)
        },
        _validate: function(e) {
            if (!e) throw "The settings are undefined";
            if (!e.key) throw "The API key is undefined";
            if (!e.src) throw "The text is undefined";
            if (!e.hl) throw "The language is undefined";
            if (e.c && "auto" != e.c.toLowerCase()) {
                var a = !1;
                switch (e.c.toLowerCase()) {
                    case "mp3":
                        a = (new Audio).canPlayType("audio/mpeg").replace("no", "");
                        break;
                    case "wav":
                        a = (new Audio).canPlayType("audio/wav").replace("no", "");
                        break;
                    case "aac":
                        a = (new Audio).canPlayType("audio/aac").replace("no", "");
                        break;
                    case "ogg":
                        a = (new Audio).canPlayType("audio/ogg").replace("no", "");
                        break;
                    case "caf":
                        a = (new Audio).canPlayType("audio/x-caf").replace("no", "")
                }
                if (!a) throw "The browser does not support the audio codec " + e.c
            }
        },
        _request: function(e) {
            var a = this._buildRequest(e),
                t = this._getXHR();
            t.onreadystatechange = function() {
                if (4 == t.readyState && 200 == t.status) {
                    if (0 == t.responseText.indexOf("ERROR")) throw t.responseText;
                    audioElement.src = t.responseText, 
                    // audioElement.play()
                    audioElement.play();
                    console.log(e.audioElement);
                }
            }, t.open("POST", "https://api.voicerss.org/", !0), t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"), t.send(a)
        },
        _buildRequest: function(e) {
            var a = e.c && "auto" != e.c.toLowerCase() ? e.c : this._detectCodec();
            return "key=" + (e.key || "") + "&src=" + (e.src || "") + "&hl=" + (e.hl || "") + "&r=" + (e.r || "") + "&c=" + (a || "") + "&f=" + (e.f || "") + "&ssml=" + (e.ssml || "") + "&b64=true"
        },
        _detectCodec: function() {
            var e = new Audio;
            return e.canPlayType("audio/mpeg").replace("no", "") ? "mp3" : e.canPlayType("audio/wav").replace("no", "") ? "wav" : e.canPlayType("audio/aac").replace("no", "") ? "aac" : e.canPlayType("audio/ogg").replace("no", "") ? "ogg" : e.canPlayType("audio/x-caf").replace("no", "") ? "caf" : ""
        },
        _getXHR: function() {
            try {
                return new XMLHttpRequest
            } catch (e) {}
            try {
                return new ActiveXObject("Msxml3.XMLHTTP")
            } catch (e) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.6.0")
            } catch (e) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0")
            } catch (e) {}
            try {
                return new ActiveXObject("Msxml2.XMLHTTP")
            } catch (e) {}
            try {
                return new ActiveXObject("Microsoft.XMLHTTP")
            } catch (e) {}
            throw "The browser does not support HTTP request"
        }
    };

    let jockText='hello';
    const getJock = async ()=>{
        try{
            const response = await fetch(jockTextURL);
            const data= await response.json();
            console.log(data);
            if(data.type=='twopart'){
                jockText = `${data.setup} ... ${data.delivery}`;
            }
            else {
                jockText = data.joke;
            }
            VoiceRSS.speech({
            key: jockAudioAPIkey,
            src: jockText,  
            hl: 'en-us',
            r: 0, 
            c: 'mp3',
            f: '44khz_16bit_stereo',
            ssml: false,
            audioElement: audioElement,
            });
            toggle(button);
        }        
        catch(error){
            console.log(error);
        }
    }

    const toggle = (a)=>{
        a.disabled = !a.disabled;
        console.log(a.disabled);
    }
       
    onMount(()=>{        
        // audioElement = document.getElementById('audio');
        audioElement = document.getElementById('audio');
        button = document.getElementById('button');
        loading = document.getElementById('loading');
        loading.style.display='none';
        audioElement.style.display='none'
        console.log(loading.style.display) 
        console.log('loading:' +loading.visible)
        button.addEventListener('click',()=>{getJock(); loading.hidded=true; loading.style.display='block';});
        audioElement.addEventListener('ended',()=>{toggle(button),audioElement.style.display='none'});
    })

</script>

<div class="container">
  <button id="button">tell me a Jock</button>
  <audio
    id="audio"
    controls
    on:loadeddata={() => {
      (loading.style.display = 'none'), (audioElement.style.display = 'block');
    }}
  />
  <div id="loading"><img src="images/spinner.svg" alt="" /></div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    background: url('../images/robot.gif');
    background-color: #45badd;
    background-size: contain;
    background-position: left center;
    background-repeat: no-repeat;
    overflow-x: auto;
  }
  button {
    cursor: pointer;
    outline: none;
    font-family: 'Cursor new', Courier, monospace;
    font-size: 20px;
    color: white;
    background: #ff3482;
    border: none;
    border-radius: 5px;
    box-shadow: 2px 2px 20px 10px rgba(0, 0, 0, 0.2);
    margin-bottom: 2rem;
  }

  button:hover {
    filter: brightness(95%);
  }
  button:active {
    transform: scale(0.95);
  }
  button:disabled {
    cursor: default;
    filter: brightness(30%);
  }

  @media screen and (max-width: 1000px) {
    .container {
      background-position: center center;
      background-size: cover;
    }
  }
</style>
