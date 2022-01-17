<script>
    import { onMount } from "svelte";
    let dark = null;
    let themeName;
    let parent, toggleSwitch, nav, toggleIcon, image1, image2, image3, textbox, home, toggleText;
    const darkMode = ()=>{
        nav.style.backgroundColor='rgb(0 0 0 / 5%)'
        textbox.style.backgroundColor = 'rgb(255 255 255 / 50%)'
        toggleIcon.classList.replace('fa-sun', 'fa-moon')
        toggleText.textContent = 'Dark Mode'
        image1.src  = 'images/undraw_proud_coder_dark.svg'
        image2.src  = 'images/undraw_feeling_proud_dark.svg'
        image3.src  = 'images/undraw_conceptual_idea_dark.svg'
        localStorage.setItem('themeName', 'dark');
        themeName = 'dark'
        dark ="transition: 2s; --primary-color: rgb(150, 65, 255); --primary-variant: #6c63ff; --secondary-color: #03dac5; --on-primary: #000; --on-background: rgba(255, 255, 255, 0.9); --on-background-alt: rgba(255, 255, 255, 0.7); --background: #121212;"
    }
    const lightMode = ()=>{    
        nav.style.backgroundColor='rgb(255 255 255 / 50%)'
        textbox.style.backgroundColor = 'rgb(0 0 0 / 50%)'
        toggleIcon.classList.replace('fa-moon', 'fa-sun')
        toggleText.textContent = 'Light Mode'
        image1.src  = 'images/undraw_proud_coder_light.svg'
        image2.src  = 'images/undraw_feeling_proud_light.svg'
        image3.src  = 'images/undraw_conceptual_idea_light.svg'
        localStorage.setItem('themeName', 'light');
        themeName = 'light'
        dark='transition: 2s;';
        
    }
    const switchTheme = (event)=>{
        if(event.target.checked){   
            darkMode();
        }else{            
            lightMode();
        }
    }
    onMount(()=>{
        toggleSwitch = document.querySelector("input[type='checkbox']");
        home = document.getElementById('home')
        nav = document.getElementById('nav')
        image1 = document.getElementById('image1')
        image2 = document.getElementById('image2')
        image3 = document.getElementById('image3')
        textbox = document.getElementById('text-box')
        toggleIcon = document.getElementById('toggle-icon');
        toggleText = document.getElementById('toggle-text');
        parent = document.getElementById('parent')
        toggleSwitch.addEventListener('change', switchTheme)

        themeName = localStorage.getItem('themeName')
        console.log(themeName);
        if (themeName){
            if(themeName == 'dark'){
                toggleSwitch.checked=true;
                darkMode();
                console.log('dark called')
            }else{
                lightMode();
                console.log('light called')
            }
        }
    })
</script>
<!-- dark mode switch -->
<div class="parent" style='{dark}' id= 'parent'>
    <div class="theme-switch-wrapper">
        <div>
            <span class="toggle-text" id="toggle-text">Light Mode</span>
            <i class="fas fa-sun" id='toggle-icon'></i>
        </div>
        <label class="theme-switch">
            <input type="checkbox">
            <div class="slider round"></div>
        </label>
    </div>
    <!-- Nav section -->
    <nav id='nav'>
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">CONTACT</a>
    </nav>
    <!-- home section -->
    <section id="home">
        <div class="title-group">
            <h1>Welcome To Freedom</h1>
            <h2>Here you are free to buy anyting without custom</h2>
        </div>    
    </section>
    <section id="about" >
        <h1>Undraw Illustration</h1>   
        <div class="about-container">
            <div class="image-container">
                <h2>Web Inovation</h2>
                <img src="images/undraw_proud_coder_light.svg"
                alt="proud coder" id='image1'>
            </div>
            <div class="image-container">
                <h2>Problem Solving</h2>
                <img src="images/undraw_feeling_proud_light.svg"
                alt="proud coder" id='image2' >
            </div>
            <div class="image-container">
                <h2>High Concept</h2>
                <img src="images/undraw_conceptual_idea_light.svg" 
                alt="proud coder" id='image3'>
            </div>
        </div>
    </section>
    <section id="projects">
        <h1>Buttons</h1>    
        <div class="buttons">
            <button class="primary">Primary</button>
            <button class="secondary">Secondary</button>
            <button class="primary" disabled>disabled</button>
            <button class="outline">Outline</button>
            <button class="secondary outline">Alt outline</button>
            <button class="outline" disabled>Disabled</button>
        </div>
        <div class="text-box" id='text-box'>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus velit dolorum quod laboriosam inventore tempore ex commodi. Quas consequatur quod laudantium amet? Tempore, quidem. Sapiente voluptate nemo saepe, reiciendis adipisci aperiam ut aut sequi suscipit, in perferendis earum quia libero ratione nisi, distinctio voluptates. Optio, distinctio omnis! Similique, molestias perferendis.</p>
        </div>
    </section>
    <section id="contact">  
        <div class="social-icons">
            <i class="fab fa-github"></i>
            <i class="fab fa-codepen"></i>
            <i class="fab fa-linkedin"></i>
            <i class="fab fa-medium"></i>
            <i class="fab fa-instagram"></i>
            <i class="fab fa-youtube"></i>
        </div>
    </section>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Comfortaa&family=Kaushan+Script&family=Oswald&family=Raleway:wght@400;500&display=swap');
    :root {
    --primary-color: rgb(255, 92, 92);
    --primary-variant: #ff2d2d;
    --secondary-color: #1b9999;
    --on-primary: rgb(250, 250, 250);
    --on-background: rgb(66, 66, 66);
    --on-background-alt: rgba(66, 66, 66, 0.7);
    --background: rgb(255, 255, 255);
    --box-shadow: 0 5px 20px 1px rgba(0, 0, 0, 0.5);
    }

    [data-theme="dark"] {
    --primary-color: rgb(150, 65, 255);
    --primary-variant: #6c63ff;
    --secondary-color: #03dac5;
    --on-primary: #000;
    --on-background: rgba(255, 255, 255, 0.9);
    --on-background-alt: rgba(255, 255, 255, 0.7);
    --background: #121212;
    }

    .parent {
    margin: 0;
    background-color: var(--background);
    background-image: url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M81.28 88H68.413l19.298 19.298L81.28 88zm2.107 0h13.226L90 107.838 83.387 88zm15.334 0h12.866l-19.298 19.298L98.72 88zm-32.927-2.207L73.586 78h32.827l.5.5 7.294 7.293L115.414 87l-24.707 24.707-.707.707L64.586 87l1.207-1.207zm2.62.207L74 80.414 79.586 86H68.414zm16 0L90 80.414 95.586 86H84.414zm16 0L106 80.414 111.586 86h-11.172zm-8-6h11.173L98 85.586 92.414 80zM82 85.586L87.586 80H76.414L82 85.586zM17.414 0L.707 16.707 0 17.414V0h17.414zM4.28 0L0 12.838V0h4.28zm10.306 0L2.288 12.298 6.388 0h8.198zM180 17.414L162.586 0H180v17.414zM165.414 0l12.298 12.298L173.612 0h-8.198zM180 12.838L175.72 0H180v12.838zM0 163h16.413l.5.5 7.294 7.293L25.414 172l-8 8H0v-17zm0 10h6.613l-2.334 7H0v-7zm14.586 7l7-7H8.72l-2.333 7h8.2zM0 165.414L5.586 171H0v-5.586zM10.414 171L16 165.414 21.586 171H10.414zm-8-6h11.172L8 170.586 2.414 165zM180 163h-16.413l-7.794 7.793-1.207 1.207 8 8H180v-17zm-14.586 17l-7-7h12.865l2.333 7h-8.2zM180 173h-6.613l2.334 7H180v-7zm-21.586-2l5.586-5.586 5.586 5.586h-11.172zM180 165.414L174.414 171H180v-5.586zm-8 5.172l5.586-5.586h-11.172l5.586 5.586zM152.933 25.653l1.414 1.414-33.94 33.942-1.416-1.416 33.943-33.94zm1.414 127.28l-1.414 1.414-33.942-33.94 1.416-1.416 33.94 33.943zm-127.28 1.414l-1.414-1.414 33.94-33.942 1.416 1.416-33.943 33.94zm-1.414-127.28l1.414-1.414 33.942 33.94-1.416 1.416-33.94-33.943zM0 85c2.21 0 4 1.79 4 4s-1.79 4-4 4v-8zm180 0c-2.21 0-4 1.79-4 4s1.79 4 4 4v-8zM94 0c0 2.21-1.79 4-4 4s-4-1.79-4-4h8zm0 180c0-2.21-1.79-4-4-4s-4 1.79-4 4h8z' fill='%2394b3b3' fill-opacity='0.3' fill-rule='evenodd'/%3E%3C/svg%3E");
    font-family: Comforta, sans-serif;
    }

    section {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    }

    section h1 {
    font-size: 100px;
    margin-bottom: 0;
    font-family: Kaushan Script, sans-serif;
    color: var(--on-background)
    }

    section h2 {
    font-size: 32px;
    font-weight: normal;
    color: var(--on-background-alt);
    }

    /* Navigation */
    nav {
    z-index: 10;
    position: fixed;
    font-size: 24px;
    letter-spacing: 3px;
    padding: 25px;
    width: 100vw;
    font-family: Oswald, sans-serif;
    background: rgb(255 255 255 / 50%);
    }

    nav a {
    margin-right: 25px;
    color: var(--primary-color);
    text-decoration: none;
    border-bottom: 3px solid transparent;
    font-weight: bold;
    }

    nav a:hover,
    nav a:focus {
    color: var(--on-background);
    border-bottom: 3px solid;
    }

    /* Home Section */
    .title-group {
    text-align: center;
    }

    /* About Section */
    .about-container {
    display: flex;
    }

    .image-container {
    border: 1px solid var(--secondary-color);
    border-radius: 10px;
    padding: 10px 20px;
    margin-right: 25px;
    width: auto;
    background: var(--background);
    box-shadow: var(--box-shadow);
    }

    img {
    height: 300px;
    width: 300px;
    }

    /* Projects Section */
    .buttons {
    margin-top: 15px;
    margin-bottom: 50px;
    }

    button {
    min-width: 100px;
    height: 40px;
    cursor: pointer;
    border-radius: 10px;
    margin-right: 10px;
    border: 2px solid var(--primary-color);
    font-size: 15px;
    outline: none;
    }

    button:disabled {
    opacity: 0.4;
    cursor: default;
    }

    button:hover:not(.outline) {
    filter: brightness(110%);
    }

    .primary {
    background: var(--primary-color);
    color: var(--on-primary);
    }

    .secondary {
    border: 2px solid var(--secondary-color);
    }

    .secondary,
    .secondary:hover,
    .outline.secondary:hover {
    background: var(--secondary-color);
    color: var(--on-primary);
    }

    .outline {
    background: var(--background);
    color: var(--on-background);
    }

    .outline:hover {
    background: var(--primary-color);
    color: var(--on-primary);
    }

    .text-box {
    width: 40%;
    text-align: justify;
    background: rgb(0 0 0 / 50%);
    color: var(--on-primary);
    border-radius: 10px;
    padding: 30px;
    }

    p {
    margin: 0;
    line-height: 25px;
    }

    /* Contact Section */
    .fab {
    font-size: 100px;
    margin-right: 50px;
    cursor: pointer;
    color: var(--primary-color);
    }

    .fab:hover {
    color: var(--on-background);
    }

    /* Dark Mode Toggle */
    .theme-switch-wrapper {
    display: flex;
    align-items: center;
    z-index: 100;
    position: fixed;
    right: 25px;
    top: 90px;
    }

    .theme-switch-wrapper span {
    margin-right: 10px;
    font-size: 1rem;
    }

    .toggle-text {
    position: relative;
    top: -4px;
    right: 5px;
    color: var(--on-background);
    }

    .theme-switch {
    display: inline-block;
    height: 34px;
    position: relative;
    width: 60px;
    }

    .theme-switch input {
    display: none;
    }

    .slider {
    background: #ccc;
    bottom: 0;
    cursor: pointer;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transition: 0.4s;
    }

    .slider::before {
    background: #fff;
    bottom: 4px;
    content: "";
    height: 26px;
    left: 4px;
    position: absolute;
    transition: 0.4s;
    width: 26px;
    }

    input:checked + .slider {
    background: var(--primary-color);
    }

    input:checked + .slider::before {
    transform: translateX(26px);
    }

    .slider.round {
    border-radius: 34px;
    }

    .slider.round::before {
    border-radius: 50%;
    }

    .fas {
    font-size: 30px;
    margin-right: 5px;
    color: var(--on-background)
    }
</style>