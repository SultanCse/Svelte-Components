import App from './App.svelte';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap/dist/js/bootstrap.js'
// import '../node_modules/bootstrap/dist/css/bootstrap.css.map'



const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;