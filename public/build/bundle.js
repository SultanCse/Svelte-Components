
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Navbar.svelte generated by Svelte v3.44.3 */

    const file$6 = "src\\components\\Navbar.svelte";

    function create_fragment$6(ctx) {
    	let div4;
    	let div1;
    	let nav;
    	let div0;
    	let a0;
    	let img;
    	let img_src_value;
    	let div1_class_value;
    	let t;
    	let div3;
    	let div2;
    	let a1;
    	let i;
    	let i_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			nav = element("nav");
    			div0 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t = space();
    			div3 = element("div");
    			div2 = element("div");
    			a1 = element("a");
    			i = element("i");
    			if (!src_url_equal(img.src, img_src_value = "images/slogo.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "30px");
    			attr_dev(img, "height", "24px");
    			attr_dev(img, "class", "rounded-pill img-thumbnail");
    			add_location(img, file$6, 23, 12, 547);
    			attr_dev(a0, "class", "navbar-brand");
    			attr_dev(a0, "href", "#");
    			add_location(a0, file$6, 22, 10, 496);
    			attr_dev(div0, "class", "container-fluid justify-content-center");
    			add_location(div0, file$6, 21, 8, 430);
    			attr_dev(nav, "class", "navbar navbar-light bg-secondary ");
    			add_location(nav, file$6, 20, 6, 373);
    			attr_dev(div1, "class", div1_class_value = "col-" + /*navColSize*/ ctx[1] + " p-0" + " svelte-5dgimf");
    			attr_dev(div1, "id", "col");
    			add_location(div1, file$6, 19, 4, 322);
    			attr_dev(i, "class", i_class_value = "fas fa-arrow-" + /*arrow*/ ctx[0] + " px-3");
    			add_location(i, file$6, 31, 10, 846);
    			attr_dev(a1, "class", "navbar-brand");
    			attr_dev(a1, "href", "#");
    			add_location(a1, file$6, 30, 8, 801);
    			attr_dev(div2, "class", "navbar navbar-light bg-light");
    			add_location(div2, file$6, 29, 6, 741);
    			attr_dev(div3, "class", "col p-0");
    			add_location(div3, file$6, 28, 4, 712);
    			attr_dev(div4, "class", "row g-0 sticky-top");
    			add_location(div4, file$6, 18, 2, 284);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, nav);
    			append_dev(nav, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img);
    			append_dev(div4, t);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, a1);
    			append_dev(a1, i);

    			if (!mounted) {
    				dispose = listen_dev(i, "click", /*toggleArrow*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*navColSize*/ 2 && div1_class_value !== (div1_class_value = "col-" + /*navColSize*/ ctx[1] + " p-0" + " svelte-5dgimf")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*arrow*/ 1 && i_class_value !== (i_class_value = "fas fa-arrow-" + /*arrow*/ ctx[0] + " px-3")) {
    				attr_dev(i, "class", i_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let arrow = 'left';
    	let navColSize = 2;

    	const toggleArrow = () => {
    		if (arrow == 'left') {
    			$$invalidate(0, arrow = 'right');
    			$$invalidate(1, navColSize = 1);
    		} else {
    			$$invalidate(0, arrow = 'left');
    			$$invalidate(1, navColSize = 2);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ arrow, navColSize, toggleArrow });

    	$$self.$inject_state = $$props => {
    		if ('arrow' in $$props) $$invalidate(0, arrow = $$props.arrow);
    		if ('navColSize' in $$props) $$invalidate(1, navColSize = $$props.navColSize);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [arrow, navColSize, toggleArrow];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* src\components\QuoteGenerator.svelte generated by Svelte v3.44.3 */

    const { console: console_1 } = globals;
    const file$5 = "src\\components\\QuoteGenerator.svelte";

    function create_fragment$5(ctx) {
    	let div5;
    	let div4;
    	let div0;
    	let h5;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let p0;
    	let t4;
    	let t5;
    	let t6;
    	let div3;
    	let div1;
    	let i0;
    	let t7;
    	let i1;
    	let t8;
    	let div2;
    	let p1;
    	let t9;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			h5 = element("h5");
    			t0 = text("''");
    			t1 = text(/*quote*/ ctx[1]);
    			t2 = text(".");
    			t3 = space();
    			p0 = element("p");
    			t4 = text("-");
    			t5 = text(/*author*/ ctx[2]);
    			t6 = space();
    			div3 = element("div");
    			div1 = element("div");
    			i0 = element("i");
    			t7 = space();
    			i1 = element("i");
    			t8 = space();
    			div2 = element("div");
    			p1 = element("p");
    			t9 = text("New Quote");
    			attr_dev(h5, "class", "card-title transition text-center svelte-1ijuw3q");
    			set_style(h5, "color", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(h5, file$5, 30, 6, 1166);
    			attr_dev(p0, "class", "card-text float-end");
    			set_style(p0, "color", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(p0, file$5, 31, 6, 1271);
    			attr_dev(div0, "class", "card-body");
    			add_location(div0, file$5, 29, 4, 1134);
    			attr_dev(i0, "class", "bi bi-twitter p-2 rounded transition svelte-1ijuw3q");
    			set_style(i0, "cursor", "pointer");
    			set_style(i0, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(i0, file$5, 35, 6, 1488);
    			attr_dev(i1, "class", "bi bi-whatsapp p-2 rounded transition svelte-1ijuw3q");
    			set_style(i1, "cursor", "pointer");
    			set_style(i1, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(i1, file$5, 36, 6, 1606);
    			attr_dev(div1, "class", "float-start mt-2 te");
    			add_location(div1, file$5, 34, 6, 1446);
    			attr_dev(p1, "class", "rounded p-2 transition svelte-1ijuw3q");
    			set_style(p1, "cursor", "pointer");
    			set_style(p1, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(p1, file$5, 40, 8, 1822);
    			attr_dev(div2, "class", "float-end");
    			add_location(div2, file$5, 39, 6, 1789);
    			attr_dev(div3, "class", "card-footer text-white mt-2 border-top-0 bg-transparent");
    			add_location(div3, file$5, 33, 4, 1369);
    			attr_dev(div4, "class", "card transition border-success py-4 px-2 mb-3 svelte-1ijuw3q");
    			add_location(div4, file$5, 28, 2, 1068);
    			attr_dev(div5, "class", "container mother transition d-flex justify-content-center svelte-1ijuw3q");
    			set_style(div5, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(div5, file$5, 27, 0, 952);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div0, h5);
    			append_dev(h5, t0);
    			append_dev(h5, t1);
    			append_dev(h5, t2);
    			append_dev(div0, t3);
    			append_dev(div0, p0);
    			append_dev(p0, t4);
    			append_dev(p0, t5);
    			append_dev(div4, t6);
    			append_dev(div4, div3);
    			append_dev(div3, div1);
    			append_dev(div1, i0);
    			append_dev(div1, t7);
    			append_dev(div1, i1);
    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			append_dev(div2, p1);
    			append_dev(p1, t9);

    			if (!mounted) {
    				dispose = listen_dev(p1, "click", /*getData*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*quote*/ 2) set_data_dev(t1, /*quote*/ ctx[1]);

    			if (dirty & /*colorIndex*/ 1) {
    				set_style(h5, "color", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			}

    			if (dirty & /*author*/ 4) set_data_dev(t5, /*author*/ ctx[2]);

    			if (dirty & /*colorIndex*/ 1) {
    				set_style(p0, "color", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			}

    			if (dirty & /*colorIndex*/ 1) {
    				set_style(i0, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			}

    			if (dirty & /*colorIndex*/ 1) {
    				set_style(i1, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			}

    			if (dirty & /*colorIndex*/ 1) {
    				set_style(p1, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			}

    			if (dirty & /*colorIndex*/ 1) {
    				set_style(div5, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QuoteGenerator', slots, []);

    	let colors = [
    		'#16a085',
    		'#27ae60',
    		'#2c3e50',
    		'#f39c12',
    		'#e74c3c',
    		'#9b59b6',
    		'#FB6964',
    		'#342224',
    		'#472E32',
    		'#BDBB99',
    		'#77B1A9',
    		'#73A857'
    	];

    	let colorIndex = 0;
    	let quote = '';
    	let author = '';

    	const getData = async () => {
    		fetch(`https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json`).then(response => response.json()).then(data => {
    			$$invalidate(0, colorIndex = Math.floor(Math.random() * colors.length));
    			let quteIndex = Math.floor(Math.random() * 100);
    			$$invalidate(1, quote = data.quotes[quteIndex].quote);
    			$$invalidate(2, author = data.quotes[quteIndex].author);
    		}).catch(error => {
    			console.log(error); // console.log(quote+"-"+author);
    			return [];
    		});
    	};

    	onMount(getData);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<QuoteGenerator> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		afterUpdate,
    		onMount,
    		fade,
    		slide,
    		fly,
    		scale,
    		colors,
    		colorIndex,
    		quote,
    		author,
    		getData
    	});

    	$$self.$inject_state = $$props => {
    		if ('colors' in $$props) $$invalidate(3, colors = $$props.colors);
    		if ('colorIndex' in $$props) $$invalidate(0, colorIndex = $$props.colorIndex);
    		if ('quote' in $$props) $$invalidate(1, quote = $$props.quote);
    		if ('author' in $$props) $$invalidate(2, author = $$props.author);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [colorIndex, quote, author, colors, getData];
    }

    class QuoteGenerator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuoteGenerator",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\elements\Toggle.svelte generated by Svelte v3.44.3 */
    const file$4 = "src\\elements\\Toggle.svelte";

    function create_fragment$4(ctx) {
    	let label;
    	let input;
    	let t0;
    	let div3;
    	let div2;
    	let div0;
    	let p0;
    	let t1;
    	let t2;
    	let div1;
    	let p1;
    	let t3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t1 = text(/*onText*/ ctx[1]);
    			t2 = space();
    			div1 = element("div");
    			p1 = element("p");
    			t3 = text(/*offText*/ ctx[2]);
    			attr_dev(input, "class", "toggle__input svelte-kbm3bv");
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "mytoggle");
    			add_location(input, file$4, 10, 4, 314);
    			attr_dev(p0, "class", "svelte-kbm3bv");
    			add_location(p0, file$4, 13, 32, 517);
    			attr_dev(div0, "class", "on col");
    			add_location(div0, file$4, 13, 12, 497);
    			attr_dev(p1, "class", "svelte-kbm3bv");
    			add_location(p1, file$4, 14, 33, 574);
    			attr_dev(div1, "class", "off col");
    			add_location(div1, file$4, 14, 12, 553);
    			attr_dev(div2, "class", "row g-0 h-100 mw-50 text-center");
    			add_location(div2, file$4, 12, 8, 438);
    			attr_dev(div3, "class", "toggle__fill  svelte-kbm3bv");
    			add_location(div3, file$4, 11, 4, 401);
    			attr_dev(label, "class", "toggle svelte-kbm3bv");
    			attr_dev(label, "for", "mytoggle");
    			set_style(label, "--width", /*width*/ ctx[3]);
    			add_location(label, file$4, 9, 0, 246);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = /*value*/ ctx[0];
    			append_dev(label, t0);
    			append_dev(label, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t1);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, p1);
    			append_dev(p1, t3);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 1) {
    				input.checked = /*value*/ ctx[0];
    			}

    			if (dirty & /*onText*/ 2) set_data_dev(t1, /*onText*/ ctx[1]);
    			if (dirty & /*offText*/ 4) set_data_dev(t3, /*offText*/ ctx[2]);

    			if (dirty & /*width*/ 8) {
    				set_style(label, "--width", /*width*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toggle', slots, []);
    	const dispatch = createEventDispatcher();
    	let { onText = '' } = $$props;
    	let { offText = '' } = $$props;
    	let { width = '80px' } = $$props;
    	let { value = false } = $$props;
    	const writable_props = ['onText', 'offText', 'width', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toggle> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		value = this.checked;
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('onText' in $$props) $$invalidate(1, onText = $$props.onText);
    		if ('offText' in $$props) $$invalidate(2, offText = $$props.offText);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		onText,
    		offText,
    		width,
    		value
    	});

    	$$self.$inject_state = $$props => {
    		if ('onText' in $$props) $$invalidate(1, onText = $$props.onText);
    		if ('offText' in $$props) $$invalidate(2, offText = $$props.offText);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, onText, offText, width, input_change_handler];
    }

    class Toggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			onText: 1,
    			offText: 2,
    			width: 3,
    			value: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toggle",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get onText() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onText(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offText() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offText(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Circle.svelte generated by Svelte v3.44.3 */

    const file$3 = "src\\components\\Circle.svelte";

    function create_fragment$3(ctx) {
    	let div2;
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "circle2 svelte-b2zlr6");
    			add_location(div0, file$3, 2, 8, 59);
    			attr_dev(div1, "class", "circle svelte-b2zlr6");
    			add_location(div1, file$3, 1, 4, 29);
    			attr_dev(div2, "class", "circlediv");
    			add_location(div2, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Circle', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Circle> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Circle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Circle",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\Calculator.svelte generated by Svelte v3.44.3 */

    const file$2 = "src\\components\\Calculator.svelte";

    function create_fragment$2(ctx) {
    	let div33;
    	let div32;
    	let div31;
    	let div3;
    	let div0;
    	let span0;
    	let t0;
    	let div1;
    	let p;
    	let t2;
    	let div2;
    	let span1;
    	let t3;
    	let div5;
    	let div4;
    	let input0;
    	let t4;
    	let div22;
    	let div6;
    	let input1;
    	let t5;
    	let div7;
    	let input2;
    	let t6;
    	let div8;
    	let input3;
    	let t7;
    	let div9;
    	let input4;
    	let t8;
    	let div10;
    	let input5;
    	let t9;
    	let div11;
    	let input6;
    	let t10;
    	let div12;
    	let input7;
    	let t11;
    	let div13;
    	let input8;
    	let t12;
    	let div14;
    	let input9;
    	let t13;
    	let div15;
    	let input10;
    	let t14;
    	let div16;
    	let input11;
    	let t15;
    	let div17;
    	let input12;
    	let t16;
    	let div18;
    	let input13;
    	let t17;
    	let div19;
    	let input14;
    	let t18;
    	let div20;
    	let input15;
    	let t19;
    	let div21;
    	let input16;
    	let t20;
    	let div30;
    	let div28;
    	let div27;
    	let div23;
    	let input17;
    	let t21;
    	let div24;
    	let input18;
    	let t22;
    	let div25;
    	let input19;
    	let t23;
    	let div26;
    	let input20;
    	let t24;
    	let div29;
    	let input21;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div33 = element("div");
    			div32 = element("div");
    			div31 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = space();
    			div1 = element("div");
    			p = element("p");
    			p.textContent = "Calculator";
    			t2 = space();
    			div2 = element("div");
    			span1 = element("span");
    			t3 = space();
    			div5 = element("div");
    			div4 = element("div");
    			input0 = element("input");
    			t4 = space();
    			div22 = element("div");
    			div6 = element("div");
    			input1 = element("input");
    			t5 = space();
    			div7 = element("div");
    			input2 = element("input");
    			t6 = space();
    			div8 = element("div");
    			input3 = element("input");
    			t7 = space();
    			div9 = element("div");
    			input4 = element("input");
    			t8 = space();
    			div10 = element("div");
    			input5 = element("input");
    			t9 = space();
    			div11 = element("div");
    			input6 = element("input");
    			t10 = space();
    			div12 = element("div");
    			input7 = element("input");
    			t11 = space();
    			div13 = element("div");
    			input8 = element("input");
    			t12 = space();
    			div14 = element("div");
    			input9 = element("input");
    			t13 = space();
    			div15 = element("div");
    			input10 = element("input");
    			t14 = space();
    			div16 = element("div");
    			input11 = element("input");
    			t15 = space();
    			div17 = element("div");
    			input12 = element("input");
    			t16 = space();
    			div18 = element("div");
    			input13 = element("input");
    			t17 = space();
    			div19 = element("div");
    			input14 = element("input");
    			t18 = space();
    			div20 = element("div");
    			input15 = element("input");
    			t19 = space();
    			div21 = element("div");
    			input16 = element("input");
    			t20 = space();
    			div30 = element("div");
    			div28 = element("div");
    			div27 = element("div");
    			div23 = element("div");
    			input17 = element("input");
    			t21 = space();
    			div24 = element("div");
    			input18 = element("input");
    			t22 = space();
    			div25 = element("div");
    			input19 = element("input");
    			t23 = space();
    			div26 = element("div");
    			input20 = element("input");
    			t24 = space();
    			div29 = element("div");
    			input21 = element("input");
    			attr_dev(span0, "class", "glyphicon glyphicon glyphicon-menu-hamburger svelte-17go6fw");
    			add_location(span0, file$2, 26, 10, 636);
    			attr_dev(div0, "class", "col-md-2");
    			add_location(div0, file$2, 25, 8, 602);
    			attr_dev(p, "class", "svelte-17go6fw");
    			add_location(p, file$2, 29, 10, 757);
    			attr_dev(div1, "class", "col-md-8");
    			add_location(div1, file$2, 28, 8, 723);
    			attr_dev(span1, "class", "glyphicon glyphicon glyphicon-cog svelte-17go6fw");
    			add_location(span1, file$2, 32, 10, 834);
    			attr_dev(div2, "class", "col-md-2");
    			add_location(div2, file$2, 31, 8, 800);
    			attr_dev(div3, "class", "row header svelte-17go6fw");
    			add_location(div3, file$2, 24, 6, 568);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "");
    			attr_dev(input0, "class", "svelte-17go6fw");
    			add_location(input0, file$2, 40, 10, 1105);
    			attr_dev(div4, "class", "col-md-12 padding-reset svelte-17go6fw");
    			add_location(div4, file$2, 39, 8, 1056);
    			attr_dev(div5, "class", "row teaxtbox svelte-17go6fw");
    			add_location(div5, file$2, 38, 6, 1020);
    			attr_dev(input1, "type", "submit");
    			attr_dev(input1, "name", "");
    			input1.value = "√";
    			attr_dev(input1, "class", " svelte-17go6fw");
    			add_location(input1, file$2, 49, 10, 1365);
    			attr_dev(div6, "class", "col-3");
    			add_location(div6, file$2, 48, 8, 1334);
    			attr_dev(input2, "type", "submit");
    			attr_dev(input2, "name", "");
    			input2.value = "(";
    			attr_dev(input2, "class", " svelte-17go6fw");
    			add_location(input2, file$2, 52, 10, 1478);
    			attr_dev(div7, "class", "col-3");
    			add_location(div7, file$2, 51, 8, 1447);
    			attr_dev(input3, "type", "submit");
    			attr_dev(input3, "name", "");
    			input3.value = ")";
    			attr_dev(input3, "class", " svelte-17go6fw");
    			add_location(input3, file$2, 55, 10, 1585);
    			attr_dev(div8, "class", "col-3");
    			add_location(div8, file$2, 54, 8, 1554);
    			attr_dev(input4, "type", "submit");
    			attr_dev(input4, "name", "");
    			input4.value = "%";
    			attr_dev(input4, "class", " svelte-17go6fw");
    			add_location(input4, file$2, 58, 10, 1692);
    			attr_dev(div9, "class", "col-3");
    			add_location(div9, file$2, 57, 8, 1661);
    			attr_dev(input5, "type", "submit");
    			attr_dev(input5, "name", "");
    			attr_dev(input5, "class", "svelte-17go6fw");
    			add_location(input5, file$2, 62, 10, 1828);
    			attr_dev(div10, "class", "col-3");
    			add_location(div10, file$2, 61, 8, 1797);
    			attr_dev(input6, "type", "submit");
    			attr_dev(input6, "name", "");
    			attr_dev(input6, "class", "svelte-17go6fw");
    			add_location(input6, file$2, 65, 10, 1962);
    			attr_dev(div11, "class", "col-3");
    			add_location(div11, file$2, 64, 8, 1931);
    			attr_dev(input7, "type", "submit");
    			attr_dev(input7, "name", "");
    			attr_dev(input7, "class", "svelte-17go6fw");
    			add_location(input7, file$2, 68, 10, 2095);
    			attr_dev(div12, "class", "col-3");
    			add_location(div12, file$2, 67, 8, 2064);
    			attr_dev(input8, "type", "submit");
    			attr_dev(input8, "name", "");
    			attr_dev(input8, "class", " svelte-17go6fw");
    			add_location(input8, file$2, 71, 10, 2228);
    			attr_dev(div13, "class", "col-3");
    			add_location(div13, file$2, 70, 8, 2197);
    			attr_dev(input9, "type", "submit");
    			attr_dev(input9, "name", "");
    			input9.value = "4";
    			attr_dev(input9, "class", " svelte-17go6fw");
    			add_location(input9, file$2, 75, 10, 2403);
    			attr_dev(div14, "class", "col-3");
    			add_location(div14, file$2, 74, 8, 2372);
    			attr_dev(input10, "type", "submit");
    			attr_dev(input10, "name", "");
    			input10.value = "5";
    			attr_dev(input10, "class", " svelte-17go6fw");
    			add_location(input10, file$2, 78, 10, 2538);
    			attr_dev(div15, "class", "col-3");
    			add_location(div15, file$2, 77, 8, 2507);
    			attr_dev(input11, "type", "submit");
    			attr_dev(input11, "name", "");
    			input11.value = "6";
    			attr_dev(input11, "class", " svelte-17go6fw");
    			add_location(input11, file$2, 81, 10, 2672);
    			attr_dev(div16, "class", "col-3");
    			add_location(div16, file$2, 80, 8, 2641);
    			attr_dev(input12, "type", "submit");
    			attr_dev(input12, "name", "");
    			input12.value = "X";
    			attr_dev(input12, "class", " svelte-17go6fw");
    			add_location(input12, file$2, 84, 10, 2806);
    			attr_dev(div17, "class", "col-3");
    			add_location(div17, file$2, 83, 8, 2775);
    			attr_dev(input13, "type", "submit");
    			attr_dev(input13, "name", "");
    			input13.value = "1";
    			attr_dev(input13, "class", " svelte-17go6fw");
    			add_location(input13, file$2, 88, 10, 2969);
    			attr_dev(div18, "class", "col-3");
    			add_location(div18, file$2, 87, 8, 2938);
    			attr_dev(input14, "type", "submit");
    			attr_dev(input14, "name", "");
    			input14.value = "2";
    			attr_dev(input14, "class", " svelte-17go6fw");
    			add_location(input14, file$2, 91, 10, 3103);
    			attr_dev(div19, "class", "col-3");
    			add_location(div19, file$2, 90, 8, 3072);
    			attr_dev(input15, "type", "submit");
    			attr_dev(input15, "name", "");
    			input15.value = "3";
    			attr_dev(input15, "class", " svelte-17go6fw");
    			add_location(input15, file$2, 94, 10, 3237);
    			attr_dev(div20, "class", "col-3");
    			add_location(div20, file$2, 93, 8, 3206);
    			attr_dev(input16, "type", "submit");
    			attr_dev(input16, "name", "");
    			input16.value = "-";
    			attr_dev(input16, "class", " svelte-17go6fw");
    			add_location(input16, file$2, 97, 10, 3371);
    			attr_dev(div21, "class", "col-3");
    			add_location(div21, file$2, 96, 8, 3340);
    			attr_dev(div22, "class", "row commonbutton svelte-17go6fw");
    			add_location(div22, file$2, 46, 6, 1266);
    			attr_dev(input17, "type", "submit");
    			attr_dev(input17, "name", "");
    			input17.value = "0";
    			attr_dev(input17, "class", " svelte-17go6fw");
    			add_location(input17, file$2, 107, 14, 3723);
    			attr_dev(div23, "class", "col-md-8");
    			add_location(div23, file$2, 106, 12, 3685);
    			attr_dev(input18, "type", "submit");
    			attr_dev(input18, "name", "");
    			input18.value = ".";
    			attr_dev(input18, "class", " svelte-17go6fw");
    			add_location(input18, file$2, 110, 14, 3845);
    			attr_dev(div24, "class", "col-md-4");
    			add_location(div24, file$2, 109, 12, 3807);
    			attr_dev(input19, "type", "submit");
    			attr_dev(input19, "name", "");
    			input19.value = "Del";
    			attr_dev(input19, "id", "del");
    			attr_dev(input19, "class", "svelte-17go6fw");
    			add_location(input19, file$2, 113, 14, 3967);
    			attr_dev(div25, "class", "col-md-4");
    			add_location(div25, file$2, 112, 12, 3929);
    			attr_dev(input20, "type", "submit");
    			attr_dev(input20, "name", "");
    			input20.value = "=";
    			attr_dev(input20, "id", "equal");
    			attr_dev(input20, "class", "svelte-17go6fw");
    			add_location(input20, file$2, 116, 14, 4091);
    			attr_dev(div26, "class", "col-md-8");
    			add_location(div26, file$2, 115, 12, 4053);
    			attr_dev(div27, "class", "row");
    			add_location(div27, file$2, 105, 10, 3654);
    			attr_dev(div28, "class", "col-md-9");
    			add_location(div28, file$2, 104, 8, 3620);
    			attr_dev(input21, "type", "submit");
    			attr_dev(input21, "name", "");
    			input21.value = "+";
    			attr_dev(input21, "id", "plus");
    			attr_dev(input21, "class", "svelte-17go6fw");
    			add_location(input21, file$2, 122, 10, 4298);
    			attr_dev(div29, "class", "col-md-3");
    			add_location(div29, file$2, 121, 8, 4264);
    			attr_dev(div30, "class", "row conflict svelte-17go6fw");
    			add_location(div30, file$2, 103, 6, 3584);
    			attr_dev(div31, "class", "col-md-4 col-md-offset-4");
    			add_location(div31, file$2, 22, 4, 482);
    			attr_dev(div32, "class", "row justify-content-center");
    			add_location(div32, file$2, 21, 2, 436);
    			attr_dev(div33, "class", "container-fluid");
    			add_location(div33, file$2, 20, 0, 403);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div33, anchor);
    			append_dev(div33, div32);
    			append_dev(div32, div31);
    			append_dev(div31, div3);
    			append_dev(div3, div0);
    			append_dev(div0, span0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, p);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, span1);
    			append_dev(div31, t3);
    			append_dev(div31, div5);
    			append_dev(div5, div4);
    			append_dev(div4, input0);
    			set_input_value(input0, /*equation*/ ctx[4]);
    			append_dev(div31, t4);
    			append_dev(div31, div22);
    			append_dev(div22, div6);
    			append_dev(div6, input1);
    			append_dev(div22, t5);
    			append_dev(div22, div7);
    			append_dev(div7, input2);
    			append_dev(div22, t6);
    			append_dev(div22, div8);
    			append_dev(div8, input3);
    			append_dev(div22, t7);
    			append_dev(div22, div9);
    			append_dev(div9, input4);
    			append_dev(div22, t8);
    			append_dev(div22, div10);
    			append_dev(div10, input5);
    			set_input_value(input5, /*num7*/ ctx[0]);
    			append_dev(div22, t9);
    			append_dev(div22, div11);
    			append_dev(div11, input6);
    			set_input_value(input6, /*num8*/ ctx[1]);
    			append_dev(div22, t10);
    			append_dev(div22, div12);
    			append_dev(div12, input7);
    			set_input_value(input7, /*num9*/ ctx[2]);
    			append_dev(div22, t11);
    			append_dev(div22, div13);
    			append_dev(div13, input8);
    			set_input_value(input8, /*numHash*/ ctx[3]);
    			append_dev(div22, t12);
    			append_dev(div22, div14);
    			append_dev(div14, input9);
    			append_dev(div22, t13);
    			append_dev(div22, div15);
    			append_dev(div15, input10);
    			append_dev(div22, t14);
    			append_dev(div22, div16);
    			append_dev(div16, input11);
    			append_dev(div22, t15);
    			append_dev(div22, div17);
    			append_dev(div17, input12);
    			append_dev(div22, t16);
    			append_dev(div22, div18);
    			append_dev(div18, input13);
    			append_dev(div22, t17);
    			append_dev(div22, div19);
    			append_dev(div19, input14);
    			append_dev(div22, t18);
    			append_dev(div22, div20);
    			append_dev(div20, input15);
    			append_dev(div22, t19);
    			append_dev(div22, div21);
    			append_dev(div21, input16);
    			append_dev(div31, t20);
    			append_dev(div31, div30);
    			append_dev(div30, div28);
    			append_dev(div28, div27);
    			append_dev(div27, div23);
    			append_dev(div23, input17);
    			append_dev(div27, t21);
    			append_dev(div27, div24);
    			append_dev(div24, input18);
    			append_dev(div27, t22);
    			append_dev(div27, div25);
    			append_dev(div25, input19);
    			append_dev(div27, t23);
    			append_dev(div27, div26);
    			append_dev(div26, input20);
    			append_dev(div30, t24);
    			append_dev(div30, div29);
    			append_dev(div29, input21);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[6]),
    					listen_dev(input5, "input", /*input5_input_handler*/ ctx[7]),
    					listen_dev(input5, "click", /*click_handler*/ ctx[8], false, false, false),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[9]),
    					listen_dev(input6, "click", /*click_handler_1*/ ctx[10], false, false, false),
    					listen_dev(input7, "input", /*input7_input_handler*/ ctx[11]),
    					listen_dev(input7, "click", /*click_handler_2*/ ctx[12], false, false, false),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[13]),
    					listen_dev(input8, "click", /*click_handler_3*/ ctx[14], false, false, false),
    					listen_dev(input9, "click", /*click_handler_4*/ ctx[15], false, false, false),
    					listen_dev(input10, "click", /*click_handler_5*/ ctx[16], false, false, false),
    					listen_dev(input11, "click", /*click_handler_6*/ ctx[17], false, false, false),
    					listen_dev(input12, "click", /*click_handler_7*/ ctx[18], false, false, false),
    					listen_dev(input13, "click", /*click_handler_8*/ ctx[19], false, false, false),
    					listen_dev(input14, "click", /*click_handler_9*/ ctx[20], false, false, false),
    					listen_dev(input15, "click", /*click_handler_10*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*equation*/ 16 && input0.value !== /*equation*/ ctx[4]) {
    				set_input_value(input0, /*equation*/ ctx[4]);
    			}

    			if (dirty & /*num7*/ 1) {
    				set_input_value(input5, /*num7*/ ctx[0]);
    			}

    			if (dirty & /*num8*/ 2) {
    				set_input_value(input6, /*num8*/ ctx[1]);
    			}

    			if (dirty & /*num9*/ 4) {
    				set_input_value(input7, /*num9*/ ctx[2]);
    			}

    			if (dirty & /*numHash*/ 8) {
    				set_input_value(input8, /*numHash*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div33);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Calculator', slots, []);
    	let num1 = 1, num2 = 2, num3 = 3, num7 = 7, num8 = 8, num9 = 9;
    	let numHash = '/';
    	let equation = '';
    	let pressedKeyList = [];

    	document.addEventListener("keydown", e => {
    		let x = e.key;

    		if (Number(x) || x == '+' || x == '-' || x == '*' || x == '/') {
    			$$invalidate(4, equation = equation + x);
    		}
    	});

    	const setNumber = x => {
    		$$invalidate(4, equation = equation + x);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Calculator> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		equation = this.value;
    		$$invalidate(4, equation);
    	}

    	function input5_input_handler() {
    		num7 = this.value;
    		$$invalidate(0, num7);
    	}

    	const click_handler = () => setNumber(7);

    	function input6_input_handler() {
    		num8 = this.value;
    		$$invalidate(1, num8);
    	}

    	const click_handler_1 = () => setNumber(8);

    	function input7_input_handler() {
    		num9 = this.value;
    		$$invalidate(2, num9);
    	}

    	const click_handler_2 = () => setNumber(9);

    	function input8_input_handler() {
    		numHash = this.value;
    		$$invalidate(3, numHash);
    	}

    	const click_handler_3 = () => setNumber('/');
    	const click_handler_4 = () => setNumber(4);
    	const click_handler_5 = () => setNumber(5);
    	const click_handler_6 = () => setNumber(6);
    	const click_handler_7 = () => setNumber('x');
    	const click_handler_8 = () => setNumber(1);
    	const click_handler_9 = () => setNumber(2);
    	const click_handler_10 = () => setNumber(3);

    	$$self.$capture_state = () => ({
    		num1,
    		num2,
    		num3,
    		num7,
    		num8,
    		num9,
    		numHash,
    		equation,
    		pressedKeyList,
    		setNumber
    	});

    	$$self.$inject_state = $$props => {
    		if ('num1' in $$props) num1 = $$props.num1;
    		if ('num2' in $$props) num2 = $$props.num2;
    		if ('num3' in $$props) num3 = $$props.num3;
    		if ('num7' in $$props) $$invalidate(0, num7 = $$props.num7);
    		if ('num8' in $$props) $$invalidate(1, num8 = $$props.num8);
    		if ('num9' in $$props) $$invalidate(2, num9 = $$props.num9);
    		if ('numHash' in $$props) $$invalidate(3, numHash = $$props.numHash);
    		if ('equation' in $$props) $$invalidate(4, equation = $$props.equation);
    		if ('pressedKeyList' in $$props) pressedKeyList = $$props.pressedKeyList;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		num7,
    		num8,
    		num9,
    		numHash,
    		equation,
    		setNumber,
    		input0_input_handler,
    		input5_input_handler,
    		click_handler,
    		input6_input_handler,
    		click_handler_1,
    		input7_input_handler,
    		click_handler_2,
    		input8_input_handler,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10
    	];
    }

    class Calculator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calculator",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\Sidebar.svelte generated by Svelte v3.44.3 */
    const file$1 = "src\\components\\Sidebar.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (18:12) {#each list as item, index}
    function create_each_block(ctx) {
    	let div;
    	let i;
    	let t0;
    	let span;
    	let t1_value = /*list*/ ctx[1][/*index*/ ctx[5]] + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*index*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			i = element("i");
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(i, "class", "fas fa-tachometer-alt icon svelte-r050a2");
    			add_location(i, file$1, 19, 16, 709);
    			attr_dev(span, "class", "itemText svelte-r050a2");
    			add_location(span, file$1, 20, 16, 769);
    			attr_dev(div, "class", "d-flex list-group-item text-center svelte-r050a2");
    			add_location(div, file$1, 18, 12, 604);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, i);
    			append_dev(div, t0);
    			append_dev(div, span);
    			append_dev(span, t1);
    			append_dev(div, t2);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(18:12) {#each list as item, index}",
    		ctx
    	});

    	return block;
    }

    // (36:52) 
    function create_if_block_3(ctx) {
    	let circle;
    	let current;
    	circle = new Circle({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(circle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(circle, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(circle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(circle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(circle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(36:52) ",
    		ctx
    	});

    	return block;
    }

    // (34:59) 
    function create_if_block_2(ctx) {
    	let toggle;
    	let current;

    	toggle = new Toggle({
    			props: {
    				width: "10rem",
    				onText: "on",
    				offText: "off"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(toggle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toggle, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toggle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toggle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toggle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(34:59) ",
    		ctx
    	});

    	return block;
    }

    // (32:56) 
    function create_if_block_1(ctx) {
    	let calculator;
    	let current;
    	calculator = new Calculator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(calculator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(calculator, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calculator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calculator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(calculator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(32:56) ",
    		ctx
    	});

    	return block;
    }

    // (30:20) {#if activeTab == 'QuoteGenerator'}
    function create_if_block(ctx) {
    	let quotegenerator;
    	let current;
    	quotegenerator = new QuoteGenerator({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(quotegenerator.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(quotegenerator, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quotegenerator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quotegenerator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(quotegenerator, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(30:20) {#if activeTab == 'QuoteGenerator'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div5;
    	let div1;
    	let div0;
    	let t;
    	let div4;
    	let div3;
    	let div2;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let each_value = /*list*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*activeTab*/ ctx[0] == 'QuoteGenerator') return 0;
    		if (/*activeTab*/ ctx[0] == "Calculator") return 1;
    		if (/*activeTab*/ ctx[0] == 'Toggle Button') return 2;
    		if (/*activeTab*/ ctx[0] == 'Circle') return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			div4 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "list-group rounded-0 svelte-r050a2");
    			add_location(div0, file$1, 16, 8, 515);
    			attr_dev(div1, "class", "col-2 Sidebar svelte-r050a2");
    			add_location(div1, file$1, 15, 4, 478);
    			attr_dev(div2, "class", "col text-center svelte-r050a2");
    			add_location(div2, file$1, 28, 16, 1016);
    			attr_dev(div3, "class", "row justify-content-center svelte-r050a2");
    			add_location(div3, file$1, 27, 12, 958);
    			attr_dev(div4, "class", "col content svelte-r050a2");
    			add_location(div4, file$1, 26, 4, 919);
    			attr_dev(div5, "class", "row g-0 svelte-r050a2");
    			set_style(div5, "overflow-x", "hidden");
    			add_location(div5, file$1, 14, 0, 422);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div5, t);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div2);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeTab, list*/ 3) {
    				each_value = /*list*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Sidebar', slots, []);
    	let list = ['QuoteGenerator', 'Calculator', 'Circle', 'Toggle Button'];
    	let activeTab = 'QuoteGenerator';

    	onMount(() => {
    		
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Sidebar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = index => {
    		$$invalidate(0, activeTab = list[index]);
    	};

    	$$self.$capture_state = () => ({
    		QuoteGenerator,
    		Toggle,
    		Circle,
    		Calculator,
    		onMount,
    		list,
    		activeTab
    	});

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) $$invalidate(1, list = $$props.list);
    		if ('activeTab' in $$props) $$invalidate(0, activeTab = $$props.activeTab);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeTab, list, click_handler];
    }

    class Sidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidebar",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.3 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let navbar;
    	let t;
    	let sidebar;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	sidebar = new Sidebar({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t = space();
    			create_component(sidebar.$$.fragment);
    			add_location(main, file, 4, 0, 131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t);
    			mount_component(sidebar, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(sidebar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(sidebar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(sidebar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Navbar, Sidebar });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getAugmentedNamespace(n) {
    	if (n.__esModule) return n;
    	var a = Object.defineProperty({}, '__esModule', {value: true});
    	Object.keys(n).forEach(function (k) {
    		var d = Object.getOwnPropertyDescriptor(n, k);
    		Object.defineProperty(a, k, d.get ? d : {
    			enumerable: true,
    			get: function () {
    				return n[k];
    			}
    		});
    	});
    	return a;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var top = 'top';
    var bottom = 'bottom';
    var right = 'right';
    var left = 'left';
    var auto = 'auto';
    var basePlacements = [top, bottom, right, left];
    var start = 'start';
    var end = 'end';
    var clippingParents = 'clippingParents';
    var viewport = 'viewport';
    var popper = 'popper';
    var reference = 'reference';
    var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
      return acc.concat([placement + "-" + start, placement + "-" + end]);
    }, []);
    var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
      return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
    }, []); // modifiers that need to read the DOM

    var beforeRead = 'beforeRead';
    var read = 'read';
    var afterRead = 'afterRead'; // pure-logic modifiers

    var beforeMain = 'beforeMain';
    var main = 'main';
    var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

    var beforeWrite = 'beforeWrite';
    var write = 'write';
    var afterWrite = 'afterWrite';
    var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

    function getNodeName(element) {
      return element ? (element.nodeName || '').toLowerCase() : null;
    }

    function getWindow(node) {
      if (node == null) {
        return window;
      }

      if (node.toString() !== '[object Window]') {
        var ownerDocument = node.ownerDocument;
        return ownerDocument ? ownerDocument.defaultView || window : window;
      }

      return node;
    }

    function isElement(node) {
      var OwnElement = getWindow(node).Element;
      return node instanceof OwnElement || node instanceof Element;
    }

    function isHTMLElement(node) {
      var OwnElement = getWindow(node).HTMLElement;
      return node instanceof OwnElement || node instanceof HTMLElement;
    }

    function isShadowRoot(node) {
      // IE 11 has no ShadowRoot
      if (typeof ShadowRoot === 'undefined') {
        return false;
      }

      var OwnElement = getWindow(node).ShadowRoot;
      return node instanceof OwnElement || node instanceof ShadowRoot;
    }

    // and applies them to the HTMLElements such as popper and arrow

    function applyStyles(_ref) {
      var state = _ref.state;
      Object.keys(state.elements).forEach(function (name) {
        var style = state.styles[name] || {};
        var attributes = state.attributes[name] || {};
        var element = state.elements[name]; // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        } // Flow doesn't support to extend this property, but it's the most
        // effective way to apply styles to an HTMLElement
        // $FlowFixMe[cannot-write]


        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (name) {
          var value = attributes[name];

          if (value === false) {
            element.removeAttribute(name);
          } else {
            element.setAttribute(name, value === true ? '' : value);
          }
        });
      });
    }

    function effect$2(_ref2) {
      var state = _ref2.state;
      var initialStyles = {
        popper: {
          position: state.options.strategy,
          left: '0',
          top: '0',
          margin: '0'
        },
        arrow: {
          position: 'absolute'
        },
        reference: {}
      };
      Object.assign(state.elements.popper.style, initialStyles.popper);
      state.styles = initialStyles;

      if (state.elements.arrow) {
        Object.assign(state.elements.arrow.style, initialStyles.arrow);
      }

      return function () {
        Object.keys(state.elements).forEach(function (name) {
          var element = state.elements[name];
          var attributes = state.attributes[name] || {};
          var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

          var style = styleProperties.reduce(function (style, property) {
            style[property] = '';
            return style;
          }, {}); // arrow is optional + virtual elements

          if (!isHTMLElement(element) || !getNodeName(element)) {
            return;
          }

          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function (attribute) {
            element.removeAttribute(attribute);
          });
        });
      };
    } // eslint-disable-next-line import/no-unused-modules


    var applyStyles$1 = {
      name: 'applyStyles',
      enabled: true,
      phase: 'write',
      fn: applyStyles,
      effect: effect$2,
      requires: ['computeStyles']
    };

    function getBasePlacement(placement) {
      return placement.split('-')[0];
    }

    var max = Math.max;
    var min = Math.min;
    var round = Math.round;

    function getBoundingClientRect(element, includeScale) {
      if (includeScale === void 0) {
        includeScale = false;
      }

      var rect = element.getBoundingClientRect();
      var scaleX = 1;
      var scaleY = 1;

      if (isHTMLElement(element) && includeScale) {
        var offsetHeight = element.offsetHeight;
        var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
        // Fallback to 1 in case both values are `0`

        if (offsetWidth > 0) {
          scaleX = round(rect.width) / offsetWidth || 1;
        }

        if (offsetHeight > 0) {
          scaleY = round(rect.height) / offsetHeight || 1;
        }
      }

      return {
        width: rect.width / scaleX,
        height: rect.height / scaleY,
        top: rect.top / scaleY,
        right: rect.right / scaleX,
        bottom: rect.bottom / scaleY,
        left: rect.left / scaleX,
        x: rect.left / scaleX,
        y: rect.top / scaleY
      };
    }

    // means it doesn't take into account transforms.

    function getLayoutRect(element) {
      var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
      // Fixes https://github.com/popperjs/popper-core/issues/1223

      var width = element.offsetWidth;
      var height = element.offsetHeight;

      if (Math.abs(clientRect.width - width) <= 1) {
        width = clientRect.width;
      }

      if (Math.abs(clientRect.height - height) <= 1) {
        height = clientRect.height;
      }

      return {
        x: element.offsetLeft,
        y: element.offsetTop,
        width: width,
        height: height
      };
    }

    function contains(parent, child) {
      var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

      if (parent.contains(child)) {
        return true;
      } // then fallback to custom implementation with Shadow DOM support
      else if (rootNode && isShadowRoot(rootNode)) {
          var next = child;

          do {
            if (next && parent.isSameNode(next)) {
              return true;
            } // $FlowFixMe[prop-missing]: need a better way to handle this...


            next = next.parentNode || next.host;
          } while (next);
        } // Give up, the result is false


      return false;
    }

    function getComputedStyle$1(element) {
      return getWindow(element).getComputedStyle(element);
    }

    function isTableElement(element) {
      return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
    }

    function getDocumentElement(element) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
      element.document) || window.document).documentElement;
    }

    function getParentNode(element) {
      if (getNodeName(element) === 'html') {
        return element;
      }

      return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
        // $FlowFixMe[incompatible-return]
        // $FlowFixMe[prop-missing]
        element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
        element.parentNode || ( // DOM Element detected
        isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
        // $FlowFixMe[incompatible-call]: HTMLElement is a Node
        getDocumentElement(element) // fallback

      );
    }

    function getTrueOffsetParent(element) {
      if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
      getComputedStyle$1(element).position === 'fixed') {
        return null;
      }

      return element.offsetParent;
    } // `.offsetParent` reports `null` for fixed elements, while absolute elements
    // return the containing block


    function getContainingBlock(element) {
      var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
      var isIE = navigator.userAgent.indexOf('Trident') !== -1;

      if (isIE && isHTMLElement(element)) {
        // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
        var elementCss = getComputedStyle$1(element);

        if (elementCss.position === 'fixed') {
          return null;
        }
      }

      var currentNode = getParentNode(element);

      while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
        var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
        // create a containing block.
        // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

        if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
          return currentNode;
        } else {
          currentNode = currentNode.parentNode;
        }
      }

      return null;
    } // Gets the closest ancestor positioned element. Handles some edge cases,
    // such as table ancestors and cross browser bugs.


    function getOffsetParent(element) {
      var window = getWindow(element);
      var offsetParent = getTrueOffsetParent(element);

      while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
        offsetParent = getTrueOffsetParent(offsetParent);
      }

      if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
        return window;
      }

      return offsetParent || getContainingBlock(element) || window;
    }

    function getMainAxisFromPlacement(placement) {
      return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
    }

    function within(min$1, value, max$1) {
      return max(min$1, min(value, max$1));
    }
    function withinMaxClamp(min, value, max) {
      var v = within(min, value, max);
      return v > max ? max : v;
    }

    function getFreshSideObject() {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      };
    }

    function mergePaddingObject(paddingObject) {
      return Object.assign({}, getFreshSideObject(), paddingObject);
    }

    function expandToHashMap(value, keys) {
      return keys.reduce(function (hashMap, key) {
        hashMap[key] = value;
        return hashMap;
      }, {});
    }

    var toPaddingObject = function toPaddingObject(padding, state) {
      padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
        placement: state.placement
      })) : padding;
      return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
    };

    function arrow(_ref) {
      var _state$modifiersData$;

      var state = _ref.state,
          name = _ref.name,
          options = _ref.options;
      var arrowElement = state.elements.arrow;
      var popperOffsets = state.modifiersData.popperOffsets;
      var basePlacement = getBasePlacement(state.placement);
      var axis = getMainAxisFromPlacement(basePlacement);
      var isVertical = [left, right].indexOf(basePlacement) >= 0;
      var len = isVertical ? 'height' : 'width';

      if (!arrowElement || !popperOffsets) {
        return;
      }

      var paddingObject = toPaddingObject(options.padding, state);
      var arrowRect = getLayoutRect(arrowElement);
      var minProp = axis === 'y' ? top : left;
      var maxProp = axis === 'y' ? bottom : right;
      var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
      var startDiff = popperOffsets[axis] - state.rects.reference[axis];
      var arrowOffsetParent = getOffsetParent(arrowElement);
      var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
      var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
      // outside of the popper bounds

      var min = paddingObject[minProp];
      var max = clientSize - arrowRect[len] - paddingObject[maxProp];
      var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
      var offset = within(min, center, max); // Prevents breaking syntax highlighting...

      var axisProp = axis;
      state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
    }

    function effect$1(_ref2) {
      var state = _ref2.state,
          options = _ref2.options;
      var _options$element = options.element,
          arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

      if (arrowElement == null) {
        return;
      } // CSS selector


      if (typeof arrowElement === 'string') {
        arrowElement = state.elements.popper.querySelector(arrowElement);

        if (!arrowElement) {
          return;
        }
      }

      if (process.env.NODE_ENV !== "production") {
        if (!isHTMLElement(arrowElement)) {
          console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', 'To use an SVG arrow, wrap it in an HTMLElement that will be used as', 'the arrow.'].join(' '));
        }
      }

      if (!contains(state.elements.popper, arrowElement)) {
        if (process.env.NODE_ENV !== "production") {
          console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', 'element.'].join(' '));
        }

        return;
      }

      state.elements.arrow = arrowElement;
    } // eslint-disable-next-line import/no-unused-modules


    var arrow$1 = {
      name: 'arrow',
      enabled: true,
      phase: 'main',
      fn: arrow,
      effect: effect$1,
      requires: ['popperOffsets'],
      requiresIfExists: ['preventOverflow']
    };

    function getVariation(placement) {
      return placement.split('-')[1];
    }

    var unsetSides = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto'
    }; // Round the offsets to the nearest suitable subpixel based on the DPR.
    // Zooming can change the DPR, but it seems to report a value that will
    // cleanly divide the values into the appropriate subpixels.

    function roundOffsetsByDPR(_ref) {
      var x = _ref.x,
          y = _ref.y;
      var win = window;
      var dpr = win.devicePixelRatio || 1;
      return {
        x: round(x * dpr) / dpr || 0,
        y: round(y * dpr) / dpr || 0
      };
    }

    function mapToStyles(_ref2) {
      var _Object$assign2;

      var popper = _ref2.popper,
          popperRect = _ref2.popperRect,
          placement = _ref2.placement,
          variation = _ref2.variation,
          offsets = _ref2.offsets,
          position = _ref2.position,
          gpuAcceleration = _ref2.gpuAcceleration,
          adaptive = _ref2.adaptive,
          roundOffsets = _ref2.roundOffsets,
          isFixed = _ref2.isFixed;

      var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === 'function' ? roundOffsets(offsets) : offsets,
          _ref3$x = _ref3.x,
          x = _ref3$x === void 0 ? 0 : _ref3$x,
          _ref3$y = _ref3.y,
          y = _ref3$y === void 0 ? 0 : _ref3$y;

      var hasX = offsets.hasOwnProperty('x');
      var hasY = offsets.hasOwnProperty('y');
      var sideX = left;
      var sideY = top;
      var win = window;

      if (adaptive) {
        var offsetParent = getOffsetParent(popper);
        var heightProp = 'clientHeight';
        var widthProp = 'clientWidth';

        if (offsetParent === getWindow(popper)) {
          offsetParent = getDocumentElement(popper);

          if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
            heightProp = 'scrollHeight';
            widthProp = 'scrollWidth';
          }
        } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


        offsetParent = offsetParent;

        if (placement === top || (placement === left || placement === right) && variation === end) {
          sideY = bottom;
          var offsetY = isFixed && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
          offsetParent[heightProp];
          y -= offsetY - popperRect.height;
          y *= gpuAcceleration ? 1 : -1;
        }

        if (placement === left || (placement === top || placement === bottom) && variation === end) {
          sideX = right;
          var offsetX = isFixed && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
          offsetParent[widthProp];
          x -= offsetX - popperRect.width;
          x *= gpuAcceleration ? 1 : -1;
        }
      }

      var commonStyles = Object.assign({
        position: position
      }, adaptive && unsetSides);

      if (gpuAcceleration) {
        var _Object$assign;

        return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
      }

      return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
    }

    function computeStyles(_ref4) {
      var state = _ref4.state,
          options = _ref4.options;
      var _options$gpuAccelerat = options.gpuAcceleration,
          gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
          _options$adaptive = options.adaptive,
          adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
          _options$roundOffsets = options.roundOffsets,
          roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

      if (process.env.NODE_ENV !== "production") {
        var transitionProperty = getComputedStyle$1(state.elements.popper).transitionProperty || '';

        if (adaptive && ['transform', 'top', 'right', 'bottom', 'left'].some(function (property) {
          return transitionProperty.indexOf(property) >= 0;
        })) {
          console.warn(['Popper: Detected CSS transitions on at least one of the following', 'CSS properties: "transform", "top", "right", "bottom", "left".', '\n\n', 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', 'for smooth transitions, or remove these properties from the CSS', 'transition declaration on the popper element if only transitioning', 'opacity or background-color for example.', '\n\n', 'We recommend using the popper element as a wrapper around an inner', 'element that can have any CSS property transitioned for animations.'].join(' '));
        }
      }

      var commonStyles = {
        placement: getBasePlacement(state.placement),
        variation: getVariation(state.placement),
        popper: state.elements.popper,
        popperRect: state.rects.popper,
        gpuAcceleration: gpuAcceleration,
        isFixed: state.options.strategy === 'fixed'
      };

      if (state.modifiersData.popperOffsets != null) {
        state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.popperOffsets,
          position: state.options.strategy,
          adaptive: adaptive,
          roundOffsets: roundOffsets
        })));
      }

      if (state.modifiersData.arrow != null) {
        state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
          offsets: state.modifiersData.arrow,
          position: 'absolute',
          adaptive: false,
          roundOffsets: roundOffsets
        })));
      }

      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-placement': state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var computeStyles$1 = {
      name: 'computeStyles',
      enabled: true,
      phase: 'beforeWrite',
      fn: computeStyles,
      data: {}
    };

    var passive = {
      passive: true
    };

    function effect(_ref) {
      var state = _ref.state,
          instance = _ref.instance,
          options = _ref.options;
      var _options$scroll = options.scroll,
          scroll = _options$scroll === void 0 ? true : _options$scroll,
          _options$resize = options.resize,
          resize = _options$resize === void 0 ? true : _options$resize;
      var window = getWindow(state.elements.popper);
      var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.addEventListener('scroll', instance.update, passive);
        });
      }

      if (resize) {
        window.addEventListener('resize', instance.update, passive);
      }

      return function () {
        if (scroll) {
          scrollParents.forEach(function (scrollParent) {
            scrollParent.removeEventListener('scroll', instance.update, passive);
          });
        }

        if (resize) {
          window.removeEventListener('resize', instance.update, passive);
        }
      };
    } // eslint-disable-next-line import/no-unused-modules


    var eventListeners = {
      name: 'eventListeners',
      enabled: true,
      phase: 'write',
      fn: function fn() {},
      effect: effect,
      data: {}
    };

    var hash$1 = {
      left: 'right',
      right: 'left',
      bottom: 'top',
      top: 'bottom'
    };
    function getOppositePlacement(placement) {
      return placement.replace(/left|right|bottom|top/g, function (matched) {
        return hash$1[matched];
      });
    }

    var hash = {
      start: 'end',
      end: 'start'
    };
    function getOppositeVariationPlacement(placement) {
      return placement.replace(/start|end/g, function (matched) {
        return hash[matched];
      });
    }

    function getWindowScroll(node) {
      var win = getWindow(node);
      var scrollLeft = win.pageXOffset;
      var scrollTop = win.pageYOffset;
      return {
        scrollLeft: scrollLeft,
        scrollTop: scrollTop
      };
    }

    function getWindowScrollBarX(element) {
      // If <html> has a CSS width greater than the viewport, then this will be
      // incorrect for RTL.
      // Popper 1 is broken in this case and never had a bug report so let's assume
      // it's not an issue. I don't think anyone ever specifies width on <html>
      // anyway.
      // Browsers where the left scrollbar doesn't cause an issue report `0` for
      // this (e.g. Edge 2019, IE11, Safari)
      return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
    }

    function getViewportRect(element) {
      var win = getWindow(element);
      var html = getDocumentElement(element);
      var visualViewport = win.visualViewport;
      var width = html.clientWidth;
      var height = html.clientHeight;
      var x = 0;
      var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
      // can be obscured underneath it.
      // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
      // if it isn't open, so if this isn't available, the popper will be detected
      // to overflow the bottom of the screen too early.

      if (visualViewport) {
        width = visualViewport.width;
        height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
        // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
        // errors due to floating point numbers, so we need to check precision.
        // Safari returns a number <= 0, usually < -1 when pinch-zoomed
        // Feature detection fails in mobile emulation mode in Chrome.
        // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
        // 0.001
        // Fallback here: "Not Safari" userAgent

        if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
          x = visualViewport.offsetLeft;
          y = visualViewport.offsetTop;
        }
      }

      return {
        width: width,
        height: height,
        x: x + getWindowScrollBarX(element),
        y: y
      };
    }

    // of the `<html>` and `<body>` rect bounds if horizontally scrollable

    function getDocumentRect(element) {
      var _element$ownerDocumen;

      var html = getDocumentElement(element);
      var winScroll = getWindowScroll(element);
      var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
      var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
      var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
      var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
      var y = -winScroll.scrollTop;

      if (getComputedStyle$1(body || html).direction === 'rtl') {
        x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
      }

      return {
        width: width,
        height: height,
        x: x,
        y: y
      };
    }

    function isScrollParent(element) {
      // Firefox wants us to check `-x` and `-y` variations as well
      var _getComputedStyle = getComputedStyle$1(element),
          overflow = _getComputedStyle.overflow,
          overflowX = _getComputedStyle.overflowX,
          overflowY = _getComputedStyle.overflowY;

      return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
    }

    function getScrollParent(node) {
      if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
        // $FlowFixMe[incompatible-return]: assume body is always available
        return node.ownerDocument.body;
      }

      if (isHTMLElement(node) && isScrollParent(node)) {
        return node;
      }

      return getScrollParent(getParentNode(node));
    }

    /*
    given a DOM element, return the list of all scroll parents, up the list of ancesors
    until we get to the top window object. This list is what we attach scroll listeners
    to, because if any of these parent elements scroll, we'll need to re-calculate the
    reference element's position.
    */

    function listScrollParents(element, list) {
      var _element$ownerDocumen;

      if (list === void 0) {
        list = [];
      }

      var scrollParent = getScrollParent(element);
      var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
      var win = getWindow(scrollParent);
      var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
      var updatedList = list.concat(target);
      return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      updatedList.concat(listScrollParents(getParentNode(target)));
    }

    function rectToClientRect(rect) {
      return Object.assign({}, rect, {
        left: rect.x,
        top: rect.y,
        right: rect.x + rect.width,
        bottom: rect.y + rect.height
      });
    }

    function getInnerBoundingClientRect(element) {
      var rect = getBoundingClientRect(element);
      rect.top = rect.top + element.clientTop;
      rect.left = rect.left + element.clientLeft;
      rect.bottom = rect.top + element.clientHeight;
      rect.right = rect.left + element.clientWidth;
      rect.width = element.clientWidth;
      rect.height = element.clientHeight;
      rect.x = rect.left;
      rect.y = rect.top;
      return rect;
    }

    function getClientRectFromMixedType(element, clippingParent) {
      return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
    } // A "clipping parent" is an overflowable container with the characteristic of
    // clipping (or hiding) overflowing elements with a position different from
    // `initial`


    function getClippingParents(element) {
      var clippingParents = listScrollParents(getParentNode(element));
      var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
      var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

      if (!isElement(clipperElement)) {
        return [];
      } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


      return clippingParents.filter(function (clippingParent) {
        return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body' && (canEscapeClipping ? getComputedStyle$1(clippingParent).position !== 'static' : true);
      });
    } // Gets the maximum area that the element is visible in due to any number of
    // clipping parents


    function getClippingRect(element, boundary, rootBoundary) {
      var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
      var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
      var firstClippingParent = clippingParents[0];
      var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
        var rect = getClientRectFromMixedType(element, clippingParent);
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      }, getClientRectFromMixedType(element, firstClippingParent));
      clippingRect.width = clippingRect.right - clippingRect.left;
      clippingRect.height = clippingRect.bottom - clippingRect.top;
      clippingRect.x = clippingRect.left;
      clippingRect.y = clippingRect.top;
      return clippingRect;
    }

    function computeOffsets(_ref) {
      var reference = _ref.reference,
          element = _ref.element,
          placement = _ref.placement;
      var basePlacement = placement ? getBasePlacement(placement) : null;
      var variation = placement ? getVariation(placement) : null;
      var commonX = reference.x + reference.width / 2 - element.width / 2;
      var commonY = reference.y + reference.height / 2 - element.height / 2;
      var offsets;

      switch (basePlacement) {
        case top:
          offsets = {
            x: commonX,
            y: reference.y - element.height
          };
          break;

        case bottom:
          offsets = {
            x: commonX,
            y: reference.y + reference.height
          };
          break;

        case right:
          offsets = {
            x: reference.x + reference.width,
            y: commonY
          };
          break;

        case left:
          offsets = {
            x: reference.x - element.width,
            y: commonY
          };
          break;

        default:
          offsets = {
            x: reference.x,
            y: reference.y
          };
      }

      var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

      if (mainAxis != null) {
        var len = mainAxis === 'y' ? 'height' : 'width';

        switch (variation) {
          case start:
            offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
            break;

          case end:
            offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
            break;
        }
      }

      return offsets;
    }

    function detectOverflow(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          _options$placement = _options.placement,
          placement = _options$placement === void 0 ? state.placement : _options$placement,
          _options$boundary = _options.boundary,
          boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
          _options$rootBoundary = _options.rootBoundary,
          rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
          _options$elementConte = _options.elementContext,
          elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
          _options$altBoundary = _options.altBoundary,
          altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
          _options$padding = _options.padding,
          padding = _options$padding === void 0 ? 0 : _options$padding;
      var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
      var altContext = elementContext === popper ? reference : popper;
      var popperRect = state.rects.popper;
      var element = state.elements[altBoundary ? altContext : elementContext];
      var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
      var referenceClientRect = getBoundingClientRect(state.elements.reference);
      var popperOffsets = computeOffsets({
        reference: referenceClientRect,
        element: popperRect,
        strategy: 'absolute',
        placement: placement
      });
      var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
      var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
      // 0 or negative = within the clipping rect

      var overflowOffsets = {
        top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
        bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
        left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
        right: elementClientRect.right - clippingClientRect.right + paddingObject.right
      };
      var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

      if (elementContext === popper && offsetData) {
        var offset = offsetData[placement];
        Object.keys(overflowOffsets).forEach(function (key) {
          var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
          var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
          overflowOffsets[key] += offset[axis] * multiply;
        });
      }

      return overflowOffsets;
    }

    function computeAutoPlacement(state, options) {
      if (options === void 0) {
        options = {};
      }

      var _options = options,
          placement = _options.placement,
          boundary = _options.boundary,
          rootBoundary = _options.rootBoundary,
          padding = _options.padding,
          flipVariations = _options.flipVariations,
          _options$allowedAutoP = _options.allowedAutoPlacements,
          allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
      var variation = getVariation(placement);
      var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
        return getVariation(placement) === variation;
      }) : basePlacements;
      var allowedPlacements = placements$1.filter(function (placement) {
        return allowedAutoPlacements.indexOf(placement) >= 0;
      });

      if (allowedPlacements.length === 0) {
        allowedPlacements = placements$1;

        if (process.env.NODE_ENV !== "production") {
          console.error(['Popper: The `allowedAutoPlacements` option did not allow any', 'placements. Ensure the `placement` option matches the variation', 'of the allowed placements.', 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(' '));
        }
      } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


      var overflows = allowedPlacements.reduce(function (acc, placement) {
        acc[placement] = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding
        })[getBasePlacement(placement)];
        return acc;
      }, {});
      return Object.keys(overflows).sort(function (a, b) {
        return overflows[a] - overflows[b];
      });
    }

    function getExpandedFallbackPlacements(placement) {
      if (getBasePlacement(placement) === auto) {
        return [];
      }

      var oppositePlacement = getOppositePlacement(placement);
      return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
    }

    function flip(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;

      if (state.modifiersData[name]._skip) {
        return;
      }

      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
          specifiedFallbackPlacements = options.fallbackPlacements,
          padding = options.padding,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          _options$flipVariatio = options.flipVariations,
          flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
          allowedAutoPlacements = options.allowedAutoPlacements;
      var preferredPlacement = state.options.placement;
      var basePlacement = getBasePlacement(preferredPlacement);
      var isBasePlacement = basePlacement === preferredPlacement;
      var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
      var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
        return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          padding: padding,
          flipVariations: flipVariations,
          allowedAutoPlacements: allowedAutoPlacements
        }) : placement);
      }, []);
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var checksMap = new Map();
      var makeFallbackChecks = true;
      var firstFittingPlacement = placements[0];

      for (var i = 0; i < placements.length; i++) {
        var placement = placements[i];

        var _basePlacement = getBasePlacement(placement);

        var isStartVariation = getVariation(placement) === start;
        var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
        var len = isVertical ? 'width' : 'height';
        var overflow = detectOverflow(state, {
          placement: placement,
          boundary: boundary,
          rootBoundary: rootBoundary,
          altBoundary: altBoundary,
          padding: padding
        });
        var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

        if (referenceRect[len] > popperRect[len]) {
          mainVariationSide = getOppositePlacement(mainVariationSide);
        }

        var altVariationSide = getOppositePlacement(mainVariationSide);
        var checks = [];

        if (checkMainAxis) {
          checks.push(overflow[_basePlacement] <= 0);
        }

        if (checkAltAxis) {
          checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
        }

        if (checks.every(function (check) {
          return check;
        })) {
          firstFittingPlacement = placement;
          makeFallbackChecks = false;
          break;
        }

        checksMap.set(placement, checks);
      }

      if (makeFallbackChecks) {
        // `2` may be desired in some cases – research later
        var numberOfChecks = flipVariations ? 3 : 1;

        var _loop = function _loop(_i) {
          var fittingPlacement = placements.find(function (placement) {
            var checks = checksMap.get(placement);

            if (checks) {
              return checks.slice(0, _i).every(function (check) {
                return check;
              });
            }
          });

          if (fittingPlacement) {
            firstFittingPlacement = fittingPlacement;
            return "break";
          }
        };

        for (var _i = numberOfChecks; _i > 0; _i--) {
          var _ret = _loop(_i);

          if (_ret === "break") break;
        }
      }

      if (state.placement !== firstFittingPlacement) {
        state.modifiersData[name]._skip = true;
        state.placement = firstFittingPlacement;
        state.reset = true;
      }
    } // eslint-disable-next-line import/no-unused-modules


    var flip$1 = {
      name: 'flip',
      enabled: true,
      phase: 'main',
      fn: flip,
      requiresIfExists: ['offset'],
      data: {
        _skip: false
      }
    };

    function getSideOffsets(overflow, rect, preventedOffsets) {
      if (preventedOffsets === void 0) {
        preventedOffsets = {
          x: 0,
          y: 0
        };
      }

      return {
        top: overflow.top - rect.height - preventedOffsets.y,
        right: overflow.right - rect.width + preventedOffsets.x,
        bottom: overflow.bottom - rect.height + preventedOffsets.y,
        left: overflow.left - rect.width - preventedOffsets.x
      };
    }

    function isAnySideFullyClipped(overflow) {
      return [top, right, bottom, left].some(function (side) {
        return overflow[side] >= 0;
      });
    }

    function hide(_ref) {
      var state = _ref.state,
          name = _ref.name;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var preventedOffsets = state.modifiersData.preventOverflow;
      var referenceOverflow = detectOverflow(state, {
        elementContext: 'reference'
      });
      var popperAltOverflow = detectOverflow(state, {
        altBoundary: true
      });
      var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
      var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
      var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
      var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
      state.modifiersData[name] = {
        referenceClippingOffsets: referenceClippingOffsets,
        popperEscapeOffsets: popperEscapeOffsets,
        isReferenceHidden: isReferenceHidden,
        hasPopperEscaped: hasPopperEscaped
      };
      state.attributes.popper = Object.assign({}, state.attributes.popper, {
        'data-popper-reference-hidden': isReferenceHidden,
        'data-popper-escaped': hasPopperEscaped
      });
    } // eslint-disable-next-line import/no-unused-modules


    var hide$1 = {
      name: 'hide',
      enabled: true,
      phase: 'main',
      requiresIfExists: ['preventOverflow'],
      fn: hide
    };

    function distanceAndSkiddingToXY(placement, rects, offset) {
      var basePlacement = getBasePlacement(placement);
      var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

      var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
        placement: placement
      })) : offset,
          skidding = _ref[0],
          distance = _ref[1];

      skidding = skidding || 0;
      distance = (distance || 0) * invertDistance;
      return [left, right].indexOf(basePlacement) >= 0 ? {
        x: distance,
        y: skidding
      } : {
        x: skidding,
        y: distance
      };
    }

    function offset(_ref2) {
      var state = _ref2.state,
          options = _ref2.options,
          name = _ref2.name;
      var _options$offset = options.offset,
          offset = _options$offset === void 0 ? [0, 0] : _options$offset;
      var data = placements.reduce(function (acc, placement) {
        acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
        return acc;
      }, {});
      var _data$state$placement = data[state.placement],
          x = _data$state$placement.x,
          y = _data$state$placement.y;

      if (state.modifiersData.popperOffsets != null) {
        state.modifiersData.popperOffsets.x += x;
        state.modifiersData.popperOffsets.y += y;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var offset$1 = {
      name: 'offset',
      enabled: true,
      phase: 'main',
      requires: ['popperOffsets'],
      fn: offset
    };

    function popperOffsets(_ref) {
      var state = _ref.state,
          name = _ref.name;
      // Offsets are the actual position the popper needs to have to be
      // properly positioned near its reference element
      // This is the most basic placement, and will be adjusted by
      // the modifiers in the next step
      state.modifiersData[name] = computeOffsets({
        reference: state.rects.reference,
        element: state.rects.popper,
        strategy: 'absolute',
        placement: state.placement
      });
    } // eslint-disable-next-line import/no-unused-modules


    var popperOffsets$1 = {
      name: 'popperOffsets',
      enabled: true,
      phase: 'read',
      fn: popperOffsets,
      data: {}
    };

    function getAltAxis(axis) {
      return axis === 'x' ? 'y' : 'x';
    }

    function preventOverflow(_ref) {
      var state = _ref.state,
          options = _ref.options,
          name = _ref.name;
      var _options$mainAxis = options.mainAxis,
          checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
          _options$altAxis = options.altAxis,
          checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
          boundary = options.boundary,
          rootBoundary = options.rootBoundary,
          altBoundary = options.altBoundary,
          padding = options.padding,
          _options$tether = options.tether,
          tether = _options$tether === void 0 ? true : _options$tether,
          _options$tetherOffset = options.tetherOffset,
          tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
      var overflow = detectOverflow(state, {
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
        altBoundary: altBoundary
      });
      var basePlacement = getBasePlacement(state.placement);
      var variation = getVariation(state.placement);
      var isBasePlacement = !variation;
      var mainAxis = getMainAxisFromPlacement(basePlacement);
      var altAxis = getAltAxis(mainAxis);
      var popperOffsets = state.modifiersData.popperOffsets;
      var referenceRect = state.rects.reference;
      var popperRect = state.rects.popper;
      var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
        placement: state.placement
      })) : tetherOffset;
      var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
        mainAxis: tetherOffsetValue,
        altAxis: tetherOffsetValue
      } : Object.assign({
        mainAxis: 0,
        altAxis: 0
      }, tetherOffsetValue);
      var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
      var data = {
        x: 0,
        y: 0
      };

      if (!popperOffsets) {
        return;
      }

      if (checkMainAxis) {
        var _offsetModifierState$;

        var mainSide = mainAxis === 'y' ? top : left;
        var altSide = mainAxis === 'y' ? bottom : right;
        var len = mainAxis === 'y' ? 'height' : 'width';
        var offset = popperOffsets[mainAxis];
        var min$1 = offset + overflow[mainSide];
        var max$1 = offset - overflow[altSide];
        var additive = tether ? -popperRect[len] / 2 : 0;
        var minLen = variation === start ? referenceRect[len] : popperRect[len];
        var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
        // outside the reference bounds

        var arrowElement = state.elements.arrow;
        var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
          width: 0,
          height: 0
        };
        var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
        var arrowPaddingMin = arrowPaddingObject[mainSide];
        var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
        // to include its full size in the calculation. If the reference is small
        // and near the edge of a boundary, the popper can overflow even if the
        // reference is not overflowing as well (e.g. virtual elements with no
        // width or height)

        var arrowLen = within(0, referenceRect[len], arrowRect[len]);
        var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
        var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
        var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
        var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
        var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
        var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
        var tetherMax = offset + maxOffset - offsetModifierValue;
        var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
        popperOffsets[mainAxis] = preventedOffset;
        data[mainAxis] = preventedOffset - offset;
      }

      if (checkAltAxis) {
        var _offsetModifierState$2;

        var _mainSide = mainAxis === 'x' ? top : left;

        var _altSide = mainAxis === 'x' ? bottom : right;

        var _offset = popperOffsets[altAxis];

        var _len = altAxis === 'y' ? 'height' : 'width';

        var _min = _offset + overflow[_mainSide];

        var _max = _offset - overflow[_altSide];

        var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

        var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

        var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

        var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

        var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

        popperOffsets[altAxis] = _preventedOffset;
        data[altAxis] = _preventedOffset - _offset;
      }

      state.modifiersData[name] = data;
    } // eslint-disable-next-line import/no-unused-modules


    var preventOverflow$1 = {
      name: 'preventOverflow',
      enabled: true,
      phase: 'main',
      fn: preventOverflow,
      requiresIfExists: ['offset']
    };

    function getHTMLElementScroll(element) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }

    function getNodeScroll(node) {
      if (node === getWindow(node) || !isHTMLElement(node)) {
        return getWindowScroll(node);
      } else {
        return getHTMLElementScroll(node);
      }
    }

    function isElementScaled(element) {
      var rect = element.getBoundingClientRect();
      var scaleX = round(rect.width) / element.offsetWidth || 1;
      var scaleY = round(rect.height) / element.offsetHeight || 1;
      return scaleX !== 1 || scaleY !== 1;
    } // Returns the composite rect of an element relative to its offsetParent.
    // Composite means it takes into account transforms as well as layout.


    function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
      if (isFixed === void 0) {
        isFixed = false;
      }

      var isOffsetParentAnElement = isHTMLElement(offsetParent);
      var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
      var documentElement = getDocumentElement(offsetParent);
      var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
      var scroll = {
        scrollLeft: 0,
        scrollTop: 0
      };
      var offsets = {
        x: 0,
        y: 0
      };

      if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
        if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
        isScrollParent(documentElement)) {
          scroll = getNodeScroll(offsetParent);
        }

        if (isHTMLElement(offsetParent)) {
          offsets = getBoundingClientRect(offsetParent, true);
          offsets.x += offsetParent.clientLeft;
          offsets.y += offsetParent.clientTop;
        } else if (documentElement) {
          offsets.x = getWindowScrollBarX(documentElement);
        }
      }

      return {
        x: rect.left + scroll.scrollLeft - offsets.x,
        y: rect.top + scroll.scrollTop - offsets.y,
        width: rect.width,
        height: rect.height
      };
    }

    function order(modifiers) {
      var map = new Map();
      var visited = new Set();
      var result = [];
      modifiers.forEach(function (modifier) {
        map.set(modifier.name, modifier);
      }); // On visiting object, check for its dependencies and visit them recursively

      function sort(modifier) {
        visited.add(modifier.name);
        var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
        requires.forEach(function (dep) {
          if (!visited.has(dep)) {
            var depModifier = map.get(dep);

            if (depModifier) {
              sort(depModifier);
            }
          }
        });
        result.push(modifier);
      }

      modifiers.forEach(function (modifier) {
        if (!visited.has(modifier.name)) {
          // check for visited object
          sort(modifier);
        }
      });
      return result;
    }

    function orderModifiers(modifiers) {
      // order based on dependencies
      var orderedModifiers = order(modifiers); // order based on phase

      return modifierPhases.reduce(function (acc, phase) {
        return acc.concat(orderedModifiers.filter(function (modifier) {
          return modifier.phase === phase;
        }));
      }, []);
    }

    function debounce(fn) {
      var pending;
      return function () {
        if (!pending) {
          pending = new Promise(function (resolve) {
            Promise.resolve().then(function () {
              pending = undefined;
              resolve(fn());
            });
          });
        }

        return pending;
      };
    }

    function format(str) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return [].concat(args).reduce(function (p, c) {
        return p.replace(/%s/, c);
      }, str);
    }

    var INVALID_MODIFIER_ERROR = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s';
    var MISSING_DEPENDENCY_ERROR = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available';
    var VALID_PROPERTIES = ['name', 'enabled', 'phase', 'fn', 'effect', 'requires', 'options'];
    function validateModifiers(modifiers) {
      modifiers.forEach(function (modifier) {
        [].concat(Object.keys(modifier), VALID_PROPERTIES) // IE11-compatible replacement for `new Set(iterable)`
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        }).forEach(function (key) {
          switch (key) {
            case 'name':
              if (typeof modifier.name !== 'string') {
                console.error(format(INVALID_MODIFIER_ERROR, String(modifier.name), '"name"', '"string"', "\"" + String(modifier.name) + "\""));
              }

              break;

            case 'enabled':
              if (typeof modifier.enabled !== 'boolean') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"enabled"', '"boolean"', "\"" + String(modifier.enabled) + "\""));
              }

              break;

            case 'phase':
              if (modifierPhases.indexOf(modifier.phase) < 0) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"phase"', "either " + modifierPhases.join(', '), "\"" + String(modifier.phase) + "\""));
              }

              break;

            case 'fn':
              if (typeof modifier.fn !== 'function') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"fn"', '"function"', "\"" + String(modifier.fn) + "\""));
              }

              break;

            case 'effect':
              if (modifier.effect != null && typeof modifier.effect !== 'function') {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"effect"', '"function"', "\"" + String(modifier.fn) + "\""));
              }

              break;

            case 'requires':
              if (modifier.requires != null && !Array.isArray(modifier.requires)) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requires"', '"array"', "\"" + String(modifier.requires) + "\""));
              }

              break;

            case 'requiresIfExists':
              if (!Array.isArray(modifier.requiresIfExists)) {
                console.error(format(INVALID_MODIFIER_ERROR, modifier.name, '"requiresIfExists"', '"array"', "\"" + String(modifier.requiresIfExists) + "\""));
              }

              break;

            case 'options':
            case 'data':
              break;

            default:
              console.error("PopperJS: an invalid property has been provided to the \"" + modifier.name + "\" modifier, valid properties are " + VALID_PROPERTIES.map(function (s) {
                return "\"" + s + "\"";
              }).join(', ') + "; but \"" + key + "\" was provided.");
          }

          modifier.requires && modifier.requires.forEach(function (requirement) {
            if (modifiers.find(function (mod) {
              return mod.name === requirement;
            }) == null) {
              console.error(format(MISSING_DEPENDENCY_ERROR, String(modifier.name), requirement, requirement));
            }
          });
        });
      });
    }

    function uniqueBy(arr, fn) {
      var identifiers = new Set();
      return arr.filter(function (item) {
        var identifier = fn(item);

        if (!identifiers.has(identifier)) {
          identifiers.add(identifier);
          return true;
        }
      });
    }

    function mergeByName(modifiers) {
      var merged = modifiers.reduce(function (merged, current) {
        var existing = merged[current.name];
        merged[current.name] = existing ? Object.assign({}, existing, current, {
          options: Object.assign({}, existing.options, current.options),
          data: Object.assign({}, existing.data, current.data)
        }) : current;
        return merged;
      }, {}); // IE11 does not support Object.values

      return Object.keys(merged).map(function (key) {
        return merged[key];
      });
    }

    var INVALID_ELEMENT_ERROR = 'Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.';
    var INFINITE_LOOP_ERROR = 'Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.';
    var DEFAULT_OPTIONS = {
      placement: 'bottom',
      modifiers: [],
      strategy: 'absolute'
    };

    function areValidElements() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return !args.some(function (element) {
        return !(element && typeof element.getBoundingClientRect === 'function');
      });
    }

    function popperGenerator(generatorOptions) {
      if (generatorOptions === void 0) {
        generatorOptions = {};
      }

      var _generatorOptions = generatorOptions,
          _generatorOptions$def = _generatorOptions.defaultModifiers,
          defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
          _generatorOptions$def2 = _generatorOptions.defaultOptions,
          defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
      return function createPopper(reference, popper, options) {
        if (options === void 0) {
          options = defaultOptions;
        }

        var state = {
          placement: 'bottom',
          orderedModifiers: [],
          options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
          modifiersData: {},
          elements: {
            reference: reference,
            popper: popper
          },
          attributes: {},
          styles: {}
        };
        var effectCleanupFns = [];
        var isDestroyed = false;
        var instance = {
          state: state,
          setOptions: function setOptions(setOptionsAction) {
            var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
            cleanupModifierEffects();
            state.options = Object.assign({}, defaultOptions, state.options, options);
            state.scrollParents = {
              reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
              popper: listScrollParents(popper)
            }; // Orders the modifiers based on their dependencies and `phase`
            // properties

            var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

            state.orderedModifiers = orderedModifiers.filter(function (m) {
              return m.enabled;
            }); // Validate the provided modifiers so that the consumer will get warned
            // if one of the modifiers is invalid for any reason

            if (process.env.NODE_ENV !== "production") {
              var modifiers = uniqueBy([].concat(orderedModifiers, state.options.modifiers), function (_ref) {
                var name = _ref.name;
                return name;
              });
              validateModifiers(modifiers);

              if (getBasePlacement(state.options.placement) === auto) {
                var flipModifier = state.orderedModifiers.find(function (_ref2) {
                  var name = _ref2.name;
                  return name === 'flip';
                });

                if (!flipModifier) {
                  console.error(['Popper: "auto" placements require the "flip" modifier be', 'present and enabled to work.'].join(' '));
                }
              }

              var _getComputedStyle = getComputedStyle$1(popper),
                  marginTop = _getComputedStyle.marginTop,
                  marginRight = _getComputedStyle.marginRight,
                  marginBottom = _getComputedStyle.marginBottom,
                  marginLeft = _getComputedStyle.marginLeft; // We no longer take into account `margins` on the popper, and it can
              // cause bugs with positioning, so we'll warn the consumer


              if ([marginTop, marginRight, marginBottom, marginLeft].some(function (margin) {
                return parseFloat(margin);
              })) {
                console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', 'between the popper and its reference element or boundary.', 'To replicate margin, use the `offset` modifier, as well as', 'the `padding` option in the `preventOverflow` and `flip`', 'modifiers.'].join(' '));
              }
            }

            runModifierEffects();
            return instance.update();
          },
          // Sync update – it will always be executed, even if not necessary. This
          // is useful for low frequency updates where sync behavior simplifies the
          // logic.
          // For high frequency updates (e.g. `resize` and `scroll` events), always
          // prefer the async Popper#update method
          forceUpdate: function forceUpdate() {
            if (isDestroyed) {
              return;
            }

            var _state$elements = state.elements,
                reference = _state$elements.reference,
                popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
            // anymore

            if (!areValidElements(reference, popper)) {
              if (process.env.NODE_ENV !== "production") {
                console.error(INVALID_ELEMENT_ERROR);
              }

              return;
            } // Store the reference and popper rects to be read by modifiers


            state.rects = {
              reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
              popper: getLayoutRect(popper)
            }; // Modifiers have the ability to reset the current update cycle. The
            // most common use case for this is the `flip` modifier changing the
            // placement, which then needs to re-run all the modifiers, because the
            // logic was previously ran for the previous placement and is therefore
            // stale/incorrect

            state.reset = false;
            state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
            // is filled with the initial data specified by the modifier. This means
            // it doesn't persist and is fresh on each update.
            // To ensure persistent data, use `${name}#persistent`

            state.orderedModifiers.forEach(function (modifier) {
              return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
            });
            var __debug_loops__ = 0;

            for (var index = 0; index < state.orderedModifiers.length; index++) {
              if (process.env.NODE_ENV !== "production") {
                __debug_loops__ += 1;

                if (__debug_loops__ > 100) {
                  console.error(INFINITE_LOOP_ERROR);
                  break;
                }
              }

              if (state.reset === true) {
                state.reset = false;
                index = -1;
                continue;
              }

              var _state$orderedModifie = state.orderedModifiers[index],
                  fn = _state$orderedModifie.fn,
                  _state$orderedModifie2 = _state$orderedModifie.options,
                  _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
                  name = _state$orderedModifie.name;

              if (typeof fn === 'function') {
                state = fn({
                  state: state,
                  options: _options,
                  name: name,
                  instance: instance
                }) || state;
              }
            }
          },
          // Async and optimistically optimized update – it will not be executed if
          // not necessary (debounced to run at most once-per-tick)
          update: debounce(function () {
            return new Promise(function (resolve) {
              instance.forceUpdate();
              resolve(state);
            });
          }),
          destroy: function destroy() {
            cleanupModifierEffects();
            isDestroyed = true;
          }
        };

        if (!areValidElements(reference, popper)) {
          if (process.env.NODE_ENV !== "production") {
            console.error(INVALID_ELEMENT_ERROR);
          }

          return instance;
        }

        instance.setOptions(options).then(function (state) {
          if (!isDestroyed && options.onFirstUpdate) {
            options.onFirstUpdate(state);
          }
        }); // Modifiers have the ability to execute arbitrary code before the first
        // update cycle runs. They will be executed in the same order as the update
        // cycle. This is useful when a modifier adds some persistent data that
        // other modifiers need to use, but the modifier is run after the dependent
        // one.

        function runModifierEffects() {
          state.orderedModifiers.forEach(function (_ref3) {
            var name = _ref3.name,
                _ref3$options = _ref3.options,
                options = _ref3$options === void 0 ? {} : _ref3$options,
                effect = _ref3.effect;

            if (typeof effect === 'function') {
              var cleanupFn = effect({
                state: state,
                name: name,
                instance: instance,
                options: options
              });

              var noopFn = function noopFn() {};

              effectCleanupFns.push(cleanupFn || noopFn);
            }
          });
        }

        function cleanupModifierEffects() {
          effectCleanupFns.forEach(function (fn) {
            return fn();
          });
          effectCleanupFns = [];
        }

        return instance;
      };
    }
    var createPopper$2 = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules

    var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
    var createPopper$1 = /*#__PURE__*/popperGenerator({
      defaultModifiers: defaultModifiers$1
    }); // eslint-disable-next-line import/no-unused-modules

    var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
    var createPopper = /*#__PURE__*/popperGenerator({
      defaultModifiers: defaultModifiers
    }); // eslint-disable-next-line import/no-unused-modules

    var lib = /*#__PURE__*/Object.freeze({
        __proto__: null,
        popperGenerator: popperGenerator,
        detectOverflow: detectOverflow,
        createPopperBase: createPopper$2,
        createPopper: createPopper,
        createPopperLite: createPopper$1,
        top: top,
        bottom: bottom,
        right: right,
        left: left,
        auto: auto,
        basePlacements: basePlacements,
        start: start,
        end: end,
        clippingParents: clippingParents,
        viewport: viewport,
        popper: popper,
        reference: reference,
        variationPlacements: variationPlacements,
        placements: placements,
        beforeRead: beforeRead,
        read: read,
        afterRead: afterRead,
        beforeMain: beforeMain,
        main: main,
        afterMain: afterMain,
        beforeWrite: beforeWrite,
        write: write,
        afterWrite: afterWrite,
        modifierPhases: modifierPhases,
        applyStyles: applyStyles$1,
        arrow: arrow$1,
        computeStyles: computeStyles$1,
        eventListeners: eventListeners,
        flip: flip$1,
        hide: hide$1,
        offset: offset$1,
        popperOffsets: popperOffsets$1,
        preventOverflow: preventOverflow$1
    });

    var require$$0 = /*@__PURE__*/getAugmentedNamespace(lib);

    /*!
      * Bootstrap v5.1.3 (https://getbootstrap.com/)
      * Copyright 2011-2021 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
      * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
      */

    createCommonjsModule(function (module, exports) {
    (function (global, factory) {
      module.exports = factory(require$$0) ;
    })(commonjsGlobal, (function (Popper) {
      function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        const n = Object.create(null);
        if (e) {
          for (const k in e) {
            if (k !== 'default') {
              const d = Object.getOwnPropertyDescriptor(e, k);
              Object.defineProperty(n, k, d.get ? d : {
                enumerable: true,
                get: () => e[k]
              });
            }
          }
        }
        n.default = e;
        return Object.freeze(n);
      }

      const Popper__namespace = /*#__PURE__*/_interopNamespace(Popper);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): util/index.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      const MAX_UID = 1000000;
      const MILLISECONDS_MULTIPLIER = 1000;
      const TRANSITION_END = 'transitionend'; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

      const toType = obj => {
        if (obj === null || obj === undefined) {
          return `${obj}`;
        }

        return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
      };
      /**
       * --------------------------------------------------------------------------
       * Public Util Api
       * --------------------------------------------------------------------------
       */


      const getUID = prefix => {
        do {
          prefix += Math.floor(Math.random() * MAX_UID);
        } while (document.getElementById(prefix));

        return prefix;
      };

      const getSelector = element => {
        let selector = element.getAttribute('data-bs-target');

        if (!selector || selector === '#') {
          let hrefAttr = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
          // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
          // `document.querySelector` will rightfully complain it is invalid.
          // See https://github.com/twbs/bootstrap/issues/32273

          if (!hrefAttr || !hrefAttr.includes('#') && !hrefAttr.startsWith('.')) {
            return null;
          } // Just in case some CMS puts out a full URL with the anchor appended


          if (hrefAttr.includes('#') && !hrefAttr.startsWith('#')) {
            hrefAttr = `#${hrefAttr.split('#')[1]}`;
          }

          selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : null;
        }

        return selector;
      };

      const getSelectorFromElement = element => {
        const selector = getSelector(element);

        if (selector) {
          return document.querySelector(selector) ? selector : null;
        }

        return null;
      };

      const getElementFromSelector = element => {
        const selector = getSelector(element);
        return selector ? document.querySelector(selector) : null;
      };

      const getTransitionDurationFromElement = element => {
        if (!element) {
          return 0;
        } // Get transition-duration of the element


        let {
          transitionDuration,
          transitionDelay
        } = window.getComputedStyle(element);
        const floatTransitionDuration = Number.parseFloat(transitionDuration);
        const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

        if (!floatTransitionDuration && !floatTransitionDelay) {
          return 0;
        } // If multiple durations are defined, take the first


        transitionDuration = transitionDuration.split(',')[0];
        transitionDelay = transitionDelay.split(',')[0];
        return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
      };

      const triggerTransitionEnd = element => {
        element.dispatchEvent(new Event(TRANSITION_END));
      };

      const isElement = obj => {
        if (!obj || typeof obj !== 'object') {
          return false;
        }

        if (typeof obj.jquery !== 'undefined') {
          obj = obj[0];
        }

        return typeof obj.nodeType !== 'undefined';
      };

      const getElement = obj => {
        if (isElement(obj)) {
          // it's a jQuery object or a node element
          return obj.jquery ? obj[0] : obj;
        }

        if (typeof obj === 'string' && obj.length > 0) {
          return document.querySelector(obj);
        }

        return null;
      };

      const typeCheckConfig = (componentName, config, configTypes) => {
        Object.keys(configTypes).forEach(property => {
          const expectedTypes = configTypes[property];
          const value = config[property];
          const valueType = value && isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new TypeError(`${componentName.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
          }
        });
      };

      const isVisible = element => {
        if (!isElement(element) || element.getClientRects().length === 0) {
          return false;
        }

        return getComputedStyle(element).getPropertyValue('visibility') === 'visible';
      };

      const isDisabled = element => {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
          return true;
        }

        if (element.classList.contains('disabled')) {
          return true;
        }

        if (typeof element.disabled !== 'undefined') {
          return element.disabled;
        }

        return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
      };

      const findShadowRoot = element => {
        if (!document.documentElement.attachShadow) {
          return null;
        } // Can find the shadow root otherwise it'll return the document


        if (typeof element.getRootNode === 'function') {
          const root = element.getRootNode();
          return root instanceof ShadowRoot ? root : null;
        }

        if (element instanceof ShadowRoot) {
          return element;
        } // when we don't find a shadow root


        if (!element.parentNode) {
          return null;
        }

        return findShadowRoot(element.parentNode);
      };

      const noop = () => {};
      /**
       * Trick to restart an element's animation
       *
       * @param {HTMLElement} element
       * @return void
       *
       * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
       */


      const reflow = element => {
        // eslint-disable-next-line no-unused-expressions
        element.offsetHeight;
      };

      const getjQuery = () => {
        const {
          jQuery
        } = window;

        if (jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
          return jQuery;
        }

        return null;
      };

      const DOMContentLoadedCallbacks = [];

      const onDOMContentLoaded = callback => {
        if (document.readyState === 'loading') {
          // add listener on the first call when the document is in loading state
          if (!DOMContentLoadedCallbacks.length) {
            document.addEventListener('DOMContentLoaded', () => {
              DOMContentLoadedCallbacks.forEach(callback => callback());
            });
          }

          DOMContentLoadedCallbacks.push(callback);
        } else {
          callback();
        }
      };

      const isRTL = () => document.documentElement.dir === 'rtl';

      const defineJQueryPlugin = plugin => {
        onDOMContentLoaded(() => {
          const $ = getjQuery();
          /* istanbul ignore if */

          if ($) {
            const name = plugin.NAME;
            const JQUERY_NO_CONFLICT = $.fn[name];
            $.fn[name] = plugin.jQueryInterface;
            $.fn[name].Constructor = plugin;

            $.fn[name].noConflict = () => {
              $.fn[name] = JQUERY_NO_CONFLICT;
              return plugin.jQueryInterface;
            };
          }
        });
      };

      const execute = callback => {
        if (typeof callback === 'function') {
          callback();
        }
      };

      const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
        if (!waitForTransition) {
          execute(callback);
          return;
        }

        const durationPadding = 5;
        const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
        let called = false;

        const handler = ({
          target
        }) => {
          if (target !== transitionElement) {
            return;
          }

          called = true;
          transitionElement.removeEventListener(TRANSITION_END, handler);
          execute(callback);
        };

        transitionElement.addEventListener(TRANSITION_END, handler);
        setTimeout(() => {
          if (!called) {
            triggerTransitionEnd(transitionElement);
          }
        }, emulatedDuration);
      };
      /**
       * Return the previous/next element of a list.
       *
       * @param {array} list    The list of elements
       * @param activeElement   The active element
       * @param shouldGetNext   Choose to get next or previous element
       * @param isCycleAllowed
       * @return {Element|elem} The proper element
       */


      const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
        let index = list.indexOf(activeElement); // if the element does not exist in the list return an element depending on the direction and if cycle is allowed

        if (index === -1) {
          return list[!shouldGetNext && isCycleAllowed ? list.length - 1 : 0];
        }

        const listLength = list.length;
        index += shouldGetNext ? 1 : -1;

        if (isCycleAllowed) {
          index = (index + listLength) % listLength;
        }

        return list[Math.max(0, Math.min(index, listLength - 1))];
      };

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): dom/event-handler.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
      const stripNameRegex = /\..*/;
      const stripUidRegex = /::\d+$/;
      const eventRegistry = {}; // Events storage

      let uidEvent = 1;
      const customEvents = {
        mouseenter: 'mouseover',
        mouseleave: 'mouseout'
      };
      const customEventsRegex = /^(mouseenter|mouseleave)/i;
      const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
      /**
       * ------------------------------------------------------------------------
       * Private methods
       * ------------------------------------------------------------------------
       */

      function getUidEvent(element, uid) {
        return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
      }

      function getEvent(element) {
        const uid = getUidEvent(element);
        element.uidEvent = uid;
        eventRegistry[uid] = eventRegistry[uid] || {};
        return eventRegistry[uid];
      }

      function bootstrapHandler(element, fn) {
        return function handler(event) {
          event.delegateTarget = element;

          if (handler.oneOff) {
            EventHandler.off(element, event.type, fn);
          }

          return fn.apply(element, [event]);
        };
      }

      function bootstrapDelegationHandler(element, selector, fn) {
        return function handler(event) {
          const domElements = element.querySelectorAll(selector);

          for (let {
            target
          } = event; target && target !== this; target = target.parentNode) {
            for (let i = domElements.length; i--;) {
              if (domElements[i] === target) {
                event.delegateTarget = target;

                if (handler.oneOff) {
                  EventHandler.off(element, event.type, selector, fn);
                }

                return fn.apply(target, [event]);
              }
            }
          } // To please ESLint


          return null;
        };
      }

      function findHandler(events, handler, delegationSelector = null) {
        const uidEventList = Object.keys(events);

        for (let i = 0, len = uidEventList.length; i < len; i++) {
          const event = events[uidEventList[i]];

          if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
            return event;
          }
        }

        return null;
      }

      function normalizeParams(originalTypeEvent, handler, delegationFn) {
        const delegation = typeof handler === 'string';
        const originalHandler = delegation ? delegationFn : handler;
        let typeEvent = getTypeEvent(originalTypeEvent);
        const isNative = nativeEvents.has(typeEvent);

        if (!isNative) {
          typeEvent = originalTypeEvent;
        }

        return [delegation, originalHandler, typeEvent];
      }

      function addHandler(element, originalTypeEvent, handler, delegationFn, oneOff) {
        if (typeof originalTypeEvent !== 'string' || !element) {
          return;
        }

        if (!handler) {
          handler = delegationFn;
          delegationFn = null;
        } // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
        // this prevents the handler from being dispatched the same way as mouseover or mouseout does


        if (customEventsRegex.test(originalTypeEvent)) {
          const wrapFn = fn => {
            return function (event) {
              if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
                return fn.call(this, event);
              }
            };
          };

          if (delegationFn) {
            delegationFn = wrapFn(delegationFn);
          } else {
            handler = wrapFn(handler);
          }
        }

        const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
        const events = getEvent(element);
        const handlers = events[typeEvent] || (events[typeEvent] = {});
        const previousFn = findHandler(handlers, originalHandler, delegation ? handler : null);

        if (previousFn) {
          previousFn.oneOff = previousFn.oneOff && oneOff;
          return;
        }

        const uid = getUidEvent(originalHandler, originalTypeEvent.replace(namespaceRegex, ''));
        const fn = delegation ? bootstrapDelegationHandler(element, handler, delegationFn) : bootstrapHandler(element, handler);
        fn.delegationSelector = delegation ? handler : null;
        fn.originalHandler = originalHandler;
        fn.oneOff = oneOff;
        fn.uidEvent = uid;
        handlers[uid] = fn;
        element.addEventListener(typeEvent, fn, delegation);
      }

      function removeHandler(element, events, typeEvent, handler, delegationSelector) {
        const fn = findHandler(events[typeEvent], handler, delegationSelector);

        if (!fn) {
          return;
        }

        element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
        delete events[typeEvent][fn.uidEvent];
      }

      function removeNamespacedHandlers(element, events, typeEvent, namespace) {
        const storeElementEvent = events[typeEvent] || {};
        Object.keys(storeElementEvent).forEach(handlerKey => {
          if (handlerKey.includes(namespace)) {
            const event = storeElementEvent[handlerKey];
            removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
          }
        });
      }

      function getTypeEvent(event) {
        // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
        event = event.replace(stripNameRegex, '');
        return customEvents[event] || event;
      }

      const EventHandler = {
        on(element, event, handler, delegationFn) {
          addHandler(element, event, handler, delegationFn, false);
        },

        one(element, event, handler, delegationFn) {
          addHandler(element, event, handler, delegationFn, true);
        },

        off(element, originalTypeEvent, handler, delegationFn) {
          if (typeof originalTypeEvent !== 'string' || !element) {
            return;
          }

          const [delegation, originalHandler, typeEvent] = normalizeParams(originalTypeEvent, handler, delegationFn);
          const inNamespace = typeEvent !== originalTypeEvent;
          const events = getEvent(element);
          const isNamespace = originalTypeEvent.startsWith('.');

          if (typeof originalHandler !== 'undefined') {
            // Simplest case: handler is passed, remove that listener ONLY.
            if (!events || !events[typeEvent]) {
              return;
            }

            removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
            return;
          }

          if (isNamespace) {
            Object.keys(events).forEach(elementEvent => {
              removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
            });
          }

          const storeElementEvent = events[typeEvent] || {};
          Object.keys(storeElementEvent).forEach(keyHandlers => {
            const handlerKey = keyHandlers.replace(stripUidRegex, '');

            if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
              const event = storeElementEvent[keyHandlers];
              removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
            }
          });
        },

        trigger(element, event, args) {
          if (typeof event !== 'string' || !element) {
            return null;
          }

          const $ = getjQuery();
          const typeEvent = getTypeEvent(event);
          const inNamespace = event !== typeEvent;
          const isNative = nativeEvents.has(typeEvent);
          let jQueryEvent;
          let bubbles = true;
          let nativeDispatch = true;
          let defaultPrevented = false;
          let evt = null;

          if (inNamespace && $) {
            jQueryEvent = $.Event(event, args);
            $(element).trigger(jQueryEvent);
            bubbles = !jQueryEvent.isPropagationStopped();
            nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
            defaultPrevented = jQueryEvent.isDefaultPrevented();
          }

          if (isNative) {
            evt = document.createEvent('HTMLEvents');
            evt.initEvent(typeEvent, bubbles, true);
          } else {
            evt = new CustomEvent(event, {
              bubbles,
              cancelable: true
            });
          } // merge custom information in our event


          if (typeof args !== 'undefined') {
            Object.keys(args).forEach(key => {
              Object.defineProperty(evt, key, {
                get() {
                  return args[key];
                }

              });
            });
          }

          if (defaultPrevented) {
            evt.preventDefault();
          }

          if (nativeDispatch) {
            element.dispatchEvent(evt);
          }

          if (evt.defaultPrevented && typeof jQueryEvent !== 'undefined') {
            jQueryEvent.preventDefault();
          }

          return evt;
        }

      };

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): dom/data.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */

      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */
      const elementMap = new Map();
      const Data = {
        set(element, key, instance) {
          if (!elementMap.has(element)) {
            elementMap.set(element, new Map());
          }

          const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
          // can be removed later when multiple key/instances are fine to be used

          if (!instanceMap.has(key) && instanceMap.size !== 0) {
            // eslint-disable-next-line no-console
            console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
            return;
          }

          instanceMap.set(key, instance);
        },

        get(element, key) {
          if (elementMap.has(element)) {
            return elementMap.get(element).get(key) || null;
          }

          return null;
        },

        remove(element, key) {
          if (!elementMap.has(element)) {
            return;
          }

          const instanceMap = elementMap.get(element);
          instanceMap.delete(key); // free up element references if there are no instances left for an element

          if (instanceMap.size === 0) {
            elementMap.delete(element);
          }
        }

      };

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): base-component.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const VERSION = '5.1.3';

      class BaseComponent {
        constructor(element) {
          element = getElement(element);

          if (!element) {
            return;
          }

          this._element = element;
          Data.set(this._element, this.constructor.DATA_KEY, this);
        }

        dispose() {
          Data.remove(this._element, this.constructor.DATA_KEY);
          EventHandler.off(this._element, this.constructor.EVENT_KEY);
          Object.getOwnPropertyNames(this).forEach(propertyName => {
            this[propertyName] = null;
          });
        }

        _queueCallback(callback, element, isAnimated = true) {
          executeAfterTransition(callback, element, isAnimated);
        }
        /** Static */


        static getInstance(element) {
          return Data.get(getElement(element), this.DATA_KEY);
        }

        static getOrCreateInstance(element, config = {}) {
          return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
        }

        static get VERSION() {
          return VERSION;
        }

        static get NAME() {
          throw new Error('You have to implement the static method "NAME", for each component!');
        }

        static get DATA_KEY() {
          return `bs.${this.NAME}`;
        }

        static get EVENT_KEY() {
          return `.${this.DATA_KEY}`;
        }

      }

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): util/component-functions.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */

      const enableDismissTrigger = (component, method = 'hide') => {
        const clickEvent = `click.dismiss${component.EVENT_KEY}`;
        const name = component.NAME;
        EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
          if (['A', 'AREA'].includes(this.tagName)) {
            event.preventDefault();
          }

          if (isDisabled(this)) {
            return;
          }

          const target = getElementFromSelector(this) || this.closest(`.${name}`);
          const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

          instance[method]();
        });
      };

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): alert.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const NAME$d = 'alert';
      const DATA_KEY$c = 'bs.alert';
      const EVENT_KEY$c = `.${DATA_KEY$c}`;
      const EVENT_CLOSE = `close${EVENT_KEY$c}`;
      const EVENT_CLOSED = `closed${EVENT_KEY$c}`;
      const CLASS_NAME_FADE$5 = 'fade';
      const CLASS_NAME_SHOW$8 = 'show';
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

      class Alert extends BaseComponent {
        // Getters
        static get NAME() {
          return NAME$d;
        } // Public


        close() {
          const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);

          if (closeEvent.defaultPrevented) {
            return;
          }

          this._element.classList.remove(CLASS_NAME_SHOW$8);

          const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);

          this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
        } // Private


        _destroyElement() {
          this._element.remove();

          EventHandler.trigger(this._element, EVENT_CLOSED);
          this.dispose();
        } // Static


        static jQueryInterface(config) {
          return this.each(function () {
            const data = Alert.getOrCreateInstance(this);

            if (typeof config !== 'string') {
              return;
            }

            if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
              throw new TypeError(`No method named "${config}"`);
            }

            data[config](this);
          });
        }

      }
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */


      enableDismissTrigger(Alert, 'close');
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       * add .Alert to jQuery only if jQuery is present
       */

      defineJQueryPlugin(Alert);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): button.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const NAME$c = 'button';
      const DATA_KEY$b = 'bs.button';
      const EVENT_KEY$b = `.${DATA_KEY$b}`;
      const DATA_API_KEY$7 = '.data-api';
      const CLASS_NAME_ACTIVE$3 = 'active';
      const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
      const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$b}${DATA_API_KEY$7}`;
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

      class Button extends BaseComponent {
        // Getters
        static get NAME() {
          return NAME$c;
        } // Public


        toggle() {
          // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
          this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
        } // Static


        static jQueryInterface(config) {
          return this.each(function () {
            const data = Button.getOrCreateInstance(this);

            if (config === 'toggle') {
              data[config]();
            }
          });
        }

      }
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */


      EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
        event.preventDefault();
        const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
        const data = Button.getOrCreateInstance(button);
        data.toggle();
      });
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       * add .Button to jQuery only if jQuery is present
       */

      defineJQueryPlugin(Button);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): dom/manipulator.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      function normalizeData(val) {
        if (val === 'true') {
          return true;
        }

        if (val === 'false') {
          return false;
        }

        if (val === Number(val).toString()) {
          return Number(val);
        }

        if (val === '' || val === 'null') {
          return null;
        }

        return val;
      }

      function normalizeDataKey(key) {
        return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
      }

      const Manipulator = {
        setDataAttribute(element, key, value) {
          element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
        },

        removeDataAttribute(element, key) {
          element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
        },

        getDataAttributes(element) {
          if (!element) {
            return {};
          }

          const attributes = {};
          Object.keys(element.dataset).filter(key => key.startsWith('bs')).forEach(key => {
            let pureKey = key.replace(/^bs/, '');
            pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
            attributes[pureKey] = normalizeData(element.dataset[key]);
          });
          return attributes;
        },

        getDataAttribute(element, key) {
          return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
        },

        offset(element) {
          const rect = element.getBoundingClientRect();
          return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
          };
        },

        position(element) {
          return {
            top: element.offsetTop,
            left: element.offsetLeft
          };
        }

      };

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): dom/selector-engine.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      const NODE_TEXT = 3;
      const SelectorEngine = {
        find(selector, element = document.documentElement) {
          return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
        },

        findOne(selector, element = document.documentElement) {
          return Element.prototype.querySelector.call(element, selector);
        },

        children(element, selector) {
          return [].concat(...element.children).filter(child => child.matches(selector));
        },

        parents(element, selector) {
          const parents = [];
          let ancestor = element.parentNode;

          while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
            if (ancestor.matches(selector)) {
              parents.push(ancestor);
            }

            ancestor = ancestor.parentNode;
          }

          return parents;
        },

        prev(element, selector) {
          let previous = element.previousElementSibling;

          while (previous) {
            if (previous.matches(selector)) {
              return [previous];
            }

            previous = previous.previousElementSibling;
          }

          return [];
        },

        next(element, selector) {
          let next = element.nextElementSibling;

          while (next) {
            if (next.matches(selector)) {
              return [next];
            }

            next = next.nextElementSibling;
          }

          return [];
        },

        focusableChildren(element) {
          const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(', ');
          return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
        }

      };

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): carousel.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const NAME$b = 'carousel';
      const DATA_KEY$a = 'bs.carousel';
      const EVENT_KEY$a = `.${DATA_KEY$a}`;
      const DATA_API_KEY$6 = '.data-api';
      const ARROW_LEFT_KEY = 'ArrowLeft';
      const ARROW_RIGHT_KEY = 'ArrowRight';
      const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

      const SWIPE_THRESHOLD = 40;
      const Default$a = {
        interval: 5000,
        keyboard: true,
        slide: false,
        pause: 'hover',
        wrap: true,
        touch: true
      };
      const DefaultType$a = {
        interval: '(number|boolean)',
        keyboard: 'boolean',
        slide: '(boolean|string)',
        pause: '(string|boolean)',
        wrap: 'boolean',
        touch: 'boolean'
      };
      const ORDER_NEXT = 'next';
      const ORDER_PREV = 'prev';
      const DIRECTION_LEFT = 'left';
      const DIRECTION_RIGHT = 'right';
      const KEY_TO_DIRECTION = {
        [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
        [ARROW_RIGHT_KEY]: DIRECTION_LEFT
      };
      const EVENT_SLIDE = `slide${EVENT_KEY$a}`;
      const EVENT_SLID = `slid${EVENT_KEY$a}`;
      const EVENT_KEYDOWN = `keydown${EVENT_KEY$a}`;
      const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY$a}`;
      const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY$a}`;
      const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$a}`;
      const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$a}`;
      const EVENT_TOUCHEND = `touchend${EVENT_KEY$a}`;
      const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$a}`;
      const EVENT_POINTERUP = `pointerup${EVENT_KEY$a}`;
      const EVENT_DRAG_START = `dragstart${EVENT_KEY$a}`;
      const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$a}${DATA_API_KEY$6}`;
      const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
      const CLASS_NAME_CAROUSEL = 'carousel';
      const CLASS_NAME_ACTIVE$2 = 'active';
      const CLASS_NAME_SLIDE = 'slide';
      const CLASS_NAME_END = 'carousel-item-end';
      const CLASS_NAME_START = 'carousel-item-start';
      const CLASS_NAME_NEXT = 'carousel-item-next';
      const CLASS_NAME_PREV = 'carousel-item-prev';
      const CLASS_NAME_POINTER_EVENT = 'pointer-event';
      const SELECTOR_ACTIVE$1 = '.active';
      const SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
      const SELECTOR_ITEM = '.carousel-item';
      const SELECTOR_ITEM_IMG = '.carousel-item img';
      const SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
      const SELECTOR_INDICATORS = '.carousel-indicators';
      const SELECTOR_INDICATOR = '[data-bs-target]';
      const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
      const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
      const POINTER_TYPE_TOUCH = 'touch';
      const POINTER_TYPE_PEN = 'pen';
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

      class Carousel extends BaseComponent {
        constructor(element, config) {
          super(element);
          this._items = null;
          this._interval = null;
          this._activeElement = null;
          this._isPaused = false;
          this._isSliding = false;
          this.touchTimeout = null;
          this.touchStartX = 0;
          this.touchDeltaX = 0;
          this._config = this._getConfig(config);
          this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
          this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
          this._pointerEvent = Boolean(window.PointerEvent);

          this._addEventListeners();
        } // Getters


        static get Default() {
          return Default$a;
        }

        static get NAME() {
          return NAME$b;
        } // Public


        next() {
          this._slide(ORDER_NEXT);
        }

        nextWhenVisible() {
          // Don't call next when the page isn't visible
          // or the carousel or its parent isn't visible
          if (!document.hidden && isVisible(this._element)) {
            this.next();
          }
        }

        prev() {
          this._slide(ORDER_PREV);
        }

        pause(event) {
          if (!event) {
            this._isPaused = true;
          }

          if (SelectorEngine.findOne(SELECTOR_NEXT_PREV, this._element)) {
            triggerTransitionEnd(this._element);
            this.cycle(true);
          }

          clearInterval(this._interval);
          this._interval = null;
        }

        cycle(event) {
          if (!event) {
            this._isPaused = false;
          }

          if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
          }

          if (this._config && this._config.interval && !this._isPaused) {
            this._updateInterval();

            this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
          }
        }

        to(index) {
          this._activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

          const activeIndex = this._getItemIndex(this._activeElement);

          if (index > this._items.length - 1 || index < 0) {
            return;
          }

          if (this._isSliding) {
            EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
            return;
          }

          if (activeIndex === index) {
            this.pause();
            this.cycle();
            return;
          }

          const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;

          this._slide(order, this._items[index]);
        } // Private


        _getConfig(config) {
          config = { ...Default$a,
            ...Manipulator.getDataAttributes(this._element),
            ...(typeof config === 'object' ? config : {})
          };
          typeCheckConfig(NAME$b, config, DefaultType$a);
          return config;
        }

        _handleSwipe() {
          const absDeltax = Math.abs(this.touchDeltaX);

          if (absDeltax <= SWIPE_THRESHOLD) {
            return;
          }

          const direction = absDeltax / this.touchDeltaX;
          this.touchDeltaX = 0;

          if (!direction) {
            return;
          }

          this._slide(direction > 0 ? DIRECTION_RIGHT : DIRECTION_LEFT);
        }

        _addEventListeners() {
          if (this._config.keyboard) {
            EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
          }

          if (this._config.pause === 'hover') {
            EventHandler.on(this._element, EVENT_MOUSEENTER, event => this.pause(event));
            EventHandler.on(this._element, EVENT_MOUSELEAVE, event => this.cycle(event));
          }

          if (this._config.touch && this._touchSupported) {
            this._addTouchEventListeners();
          }
        }

        _addTouchEventListeners() {
          const hasPointerPenTouch = event => {
            return this._pointerEvent && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
          };

          const start = event => {
            if (hasPointerPenTouch(event)) {
              this.touchStartX = event.clientX;
            } else if (!this._pointerEvent) {
              this.touchStartX = event.touches[0].clientX;
            }
          };

          const move = event => {
            // ensure swiping with one touch and not pinching
            this.touchDeltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this.touchStartX;
          };

          const end = event => {
            if (hasPointerPenTouch(event)) {
              this.touchDeltaX = event.clientX - this.touchStartX;
            }

            this._handleSwipe();

            if (this._config.pause === 'hover') {
              // If it's a touch-enabled device, mouseenter/leave are fired as
              // part of the mouse compatibility events on first tap - the carousel
              // would stop cycling until user tapped out of it;
              // here, we listen for touchend, explicitly pause the carousel
              // (as if it's the second time we tap on it, mouseenter compat event
              // is NOT fired) and after a timeout (to allow for mouse compatibility
              // events to fire) we explicitly restart cycling
              this.pause();

              if (this.touchTimeout) {
                clearTimeout(this.touchTimeout);
              }

              this.touchTimeout = setTimeout(event => this.cycle(event), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
            }
          };

          SelectorEngine.find(SELECTOR_ITEM_IMG, this._element).forEach(itemImg => {
            EventHandler.on(itemImg, EVENT_DRAG_START, event => event.preventDefault());
          });

          if (this._pointerEvent) {
            EventHandler.on(this._element, EVENT_POINTERDOWN, event => start(event));
            EventHandler.on(this._element, EVENT_POINTERUP, event => end(event));

            this._element.classList.add(CLASS_NAME_POINTER_EVENT);
          } else {
            EventHandler.on(this._element, EVENT_TOUCHSTART, event => start(event));
            EventHandler.on(this._element, EVENT_TOUCHMOVE, event => move(event));
            EventHandler.on(this._element, EVENT_TOUCHEND, event => end(event));
          }
        }

        _keydown(event) {
          if (/input|textarea/i.test(event.target.tagName)) {
            return;
          }

          const direction = KEY_TO_DIRECTION[event.key];

          if (direction) {
            event.preventDefault();

            this._slide(direction);
          }
        }

        _getItemIndex(element) {
          this._items = element && element.parentNode ? SelectorEngine.find(SELECTOR_ITEM, element.parentNode) : [];
          return this._items.indexOf(element);
        }

        _getItemByOrder(order, activeElement) {
          const isNext = order === ORDER_NEXT;
          return getNextActiveElement(this._items, activeElement, isNext, this._config.wrap);
        }

        _triggerSlideEvent(relatedTarget, eventDirectionName) {
          const targetIndex = this._getItemIndex(relatedTarget);

          const fromIndex = this._getItemIndex(SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element));

          return EventHandler.trigger(this._element, EVENT_SLIDE, {
            relatedTarget,
            direction: eventDirectionName,
            from: fromIndex,
            to: targetIndex
          });
        }

        _setActiveIndicatorElement(element) {
          if (this._indicatorsElement) {
            const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE$1, this._indicatorsElement);
            activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
            activeIndicator.removeAttribute('aria-current');
            const indicators = SelectorEngine.find(SELECTOR_INDICATOR, this._indicatorsElement);

            for (let i = 0; i < indicators.length; i++) {
              if (Number.parseInt(indicators[i].getAttribute('data-bs-slide-to'), 10) === this._getItemIndex(element)) {
                indicators[i].classList.add(CLASS_NAME_ACTIVE$2);
                indicators[i].setAttribute('aria-current', 'true');
                break;
              }
            }
          }
        }

        _updateInterval() {
          const element = this._activeElement || SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

          if (!element) {
            return;
          }

          const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);

          if (elementInterval) {
            this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
            this._config.interval = elementInterval;
          } else {
            this._config.interval = this._config.defaultInterval || this._config.interval;
          }
        }

        _slide(directionOrOrder, element) {
          const order = this._directionToOrder(directionOrOrder);

          const activeElement = SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);

          const activeElementIndex = this._getItemIndex(activeElement);

          const nextElement = element || this._getItemByOrder(order, activeElement);

          const nextElementIndex = this._getItemIndex(nextElement);

          const isCycling = Boolean(this._interval);
          const isNext = order === ORDER_NEXT;
          const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
          const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;

          const eventDirectionName = this._orderToDirection(order);

          if (nextElement && nextElement.classList.contains(CLASS_NAME_ACTIVE$2)) {
            this._isSliding = false;
            return;
          }

          if (this._isSliding) {
            return;
          }

          const slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

          if (slideEvent.defaultPrevented) {
            return;
          }

          if (!activeElement || !nextElement) {
            // Some weirdness is happening, so we bail
            return;
          }

          this._isSliding = true;

          if (isCycling) {
            this.pause();
          }

          this._setActiveIndicatorElement(nextElement);

          this._activeElement = nextElement;

          const triggerSlidEvent = () => {
            EventHandler.trigger(this._element, EVENT_SLID, {
              relatedTarget: nextElement,
              direction: eventDirectionName,
              from: activeElementIndex,
              to: nextElementIndex
            });
          };

          if (this._element.classList.contains(CLASS_NAME_SLIDE)) {
            nextElement.classList.add(orderClassName);
            reflow(nextElement);
            activeElement.classList.add(directionalClassName);
            nextElement.classList.add(directionalClassName);

            const completeCallBack = () => {
              nextElement.classList.remove(directionalClassName, orderClassName);
              nextElement.classList.add(CLASS_NAME_ACTIVE$2);
              activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
              this._isSliding = false;
              setTimeout(triggerSlidEvent, 0);
            };

            this._queueCallback(completeCallBack, activeElement, true);
          } else {
            activeElement.classList.remove(CLASS_NAME_ACTIVE$2);
            nextElement.classList.add(CLASS_NAME_ACTIVE$2);
            this._isSliding = false;
            triggerSlidEvent();
          }

          if (isCycling) {
            this.cycle();
          }
        }

        _directionToOrder(direction) {
          if (![DIRECTION_RIGHT, DIRECTION_LEFT].includes(direction)) {
            return direction;
          }

          if (isRTL()) {
            return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
          }

          return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
        }

        _orderToDirection(order) {
          if (![ORDER_NEXT, ORDER_PREV].includes(order)) {
            return order;
          }

          if (isRTL()) {
            return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
          }

          return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
        } // Static


        static carouselInterface(element, config) {
          const data = Carousel.getOrCreateInstance(element, config);
          let {
            _config
          } = data;

          if (typeof config === 'object') {
            _config = { ..._config,
              ...config
            };
          }

          const action = typeof config === 'string' ? config : _config.slide;

          if (typeof config === 'number') {
            data.to(config);
          } else if (typeof action === 'string') {
            if (typeof data[action] === 'undefined') {
              throw new TypeError(`No method named "${action}"`);
            }

            data[action]();
          } else if (_config.interval && _config.ride) {
            data.pause();
            data.cycle();
          }
        }

        static jQueryInterface(config) {
          return this.each(function () {
            Carousel.carouselInterface(this, config);
          });
        }

        static dataApiClickHandler(event) {
          const target = getElementFromSelector(this);

          if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
            return;
          }

          const config = { ...Manipulator.getDataAttributes(target),
            ...Manipulator.getDataAttributes(this)
          };
          const slideIndex = this.getAttribute('data-bs-slide-to');

          if (slideIndex) {
            config.interval = false;
          }

          Carousel.carouselInterface(target, config);

          if (slideIndex) {
            Carousel.getInstance(target).to(slideIndex);
          }

          event.preventDefault();
        }

      }
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */


      EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, Carousel.dataApiClickHandler);
      EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
        const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);

        for (let i = 0, len = carousels.length; i < len; i++) {
          Carousel.carouselInterface(carousels[i], Carousel.getInstance(carousels[i]));
        }
      });
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       * add .Carousel to jQuery only if jQuery is present
       */

      defineJQueryPlugin(Carousel);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): collapse.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const NAME$a = 'collapse';
      const DATA_KEY$9 = 'bs.collapse';
      const EVENT_KEY$9 = `.${DATA_KEY$9}`;
      const DATA_API_KEY$5 = '.data-api';
      const Default$9 = {
        toggle: true,
        parent: null
      };
      const DefaultType$9 = {
        toggle: 'boolean',
        parent: '(null|element)'
      };
      const EVENT_SHOW$5 = `show${EVENT_KEY$9}`;
      const EVENT_SHOWN$5 = `shown${EVENT_KEY$9}`;
      const EVENT_HIDE$5 = `hide${EVENT_KEY$9}`;
      const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$9}`;
      const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$9}${DATA_API_KEY$5}`;
      const CLASS_NAME_SHOW$7 = 'show';
      const CLASS_NAME_COLLAPSE = 'collapse';
      const CLASS_NAME_COLLAPSING = 'collapsing';
      const CLASS_NAME_COLLAPSED = 'collapsed';
      const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
      const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
      const WIDTH = 'width';
      const HEIGHT = 'height';
      const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
      const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

      class Collapse extends BaseComponent {
        constructor(element, config) {
          super(element);
          this._isTransitioning = false;
          this._config = this._getConfig(config);
          this._triggerArray = [];
          const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);

          for (let i = 0, len = toggleList.length; i < len; i++) {
            const elem = toggleList[i];
            const selector = getSelectorFromElement(elem);
            const filterElement = SelectorEngine.find(selector).filter(foundElem => foundElem === this._element);

            if (selector !== null && filterElement.length) {
              this._selector = selector;

              this._triggerArray.push(elem);
            }
          }

          this._initializeChildren();

          if (!this._config.parent) {
            this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
          }

          if (this._config.toggle) {
            this.toggle();
          }
        } // Getters


        static get Default() {
          return Default$9;
        }

        static get NAME() {
          return NAME$a;
        } // Public


        toggle() {
          if (this._isShown()) {
            this.hide();
          } else {
            this.show();
          }
        }

        show() {
          if (this._isTransitioning || this._isShown()) {
            return;
          }

          let actives = [];
          let activesData;

          if (this._config.parent) {
            const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
            actives = SelectorEngine.find(SELECTOR_ACTIVES, this._config.parent).filter(elem => !children.includes(elem)); // remove children if greater depth
          }

          const container = SelectorEngine.findOne(this._selector);

          if (actives.length) {
            const tempActiveData = actives.find(elem => container !== elem);
            activesData = tempActiveData ? Collapse.getInstance(tempActiveData) : null;

            if (activesData && activesData._isTransitioning) {
              return;
            }
          }

          const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$5);

          if (startEvent.defaultPrevented) {
            return;
          }

          actives.forEach(elemActive => {
            if (container !== elemActive) {
              Collapse.getOrCreateInstance(elemActive, {
                toggle: false
              }).hide();
            }

            if (!activesData) {
              Data.set(elemActive, DATA_KEY$9, null);
            }
          });

          const dimension = this._getDimension();

          this._element.classList.remove(CLASS_NAME_COLLAPSE);

          this._element.classList.add(CLASS_NAME_COLLAPSING);

          this._element.style[dimension] = 0;

          this._addAriaAndCollapsedClass(this._triggerArray, true);

          this._isTransitioning = true;

          const complete = () => {
            this._isTransitioning = false;

            this._element.classList.remove(CLASS_NAME_COLLAPSING);

            this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

            this._element.style[dimension] = '';
            EventHandler.trigger(this._element, EVENT_SHOWN$5);
          };

          const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
          const scrollSize = `scroll${capitalizedDimension}`;

          this._queueCallback(complete, this._element, true);

          this._element.style[dimension] = `${this._element[scrollSize]}px`;
        }

        hide() {
          if (this._isTransitioning || !this._isShown()) {
            return;
          }

          const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$5);

          if (startEvent.defaultPrevented) {
            return;
          }

          const dimension = this._getDimension();

          this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
          reflow(this._element);

          this._element.classList.add(CLASS_NAME_COLLAPSING);

          this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);

          const triggerArrayLength = this._triggerArray.length;

          for (let i = 0; i < triggerArrayLength; i++) {
            const trigger = this._triggerArray[i];
            const elem = getElementFromSelector(trigger);

            if (elem && !this._isShown(elem)) {
              this._addAriaAndCollapsedClass([trigger], false);
            }
          }

          this._isTransitioning = true;

          const complete = () => {
            this._isTransitioning = false;

            this._element.classList.remove(CLASS_NAME_COLLAPSING);

            this._element.classList.add(CLASS_NAME_COLLAPSE);

            EventHandler.trigger(this._element, EVENT_HIDDEN$5);
          };

          this._element.style[dimension] = '';

          this._queueCallback(complete, this._element, true);
        }

        _isShown(element = this._element) {
          return element.classList.contains(CLASS_NAME_SHOW$7);
        } // Private


        _getConfig(config) {
          config = { ...Default$9,
            ...Manipulator.getDataAttributes(this._element),
            ...config
          };
          config.toggle = Boolean(config.toggle); // Coerce string values

          config.parent = getElement(config.parent);
          typeCheckConfig(NAME$a, config, DefaultType$9);
          return config;
        }

        _getDimension() {
          return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
        }

        _initializeChildren() {
          if (!this._config.parent) {
            return;
          }

          const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
          SelectorEngine.find(SELECTOR_DATA_TOGGLE$4, this._config.parent).filter(elem => !children.includes(elem)).forEach(element => {
            const selected = getElementFromSelector(element);

            if (selected) {
              this._addAriaAndCollapsedClass([element], this._isShown(selected));
            }
          });
        }

        _addAriaAndCollapsedClass(triggerArray, isOpen) {
          if (!triggerArray.length) {
            return;
          }

          triggerArray.forEach(elem => {
            if (isOpen) {
              elem.classList.remove(CLASS_NAME_COLLAPSED);
            } else {
              elem.classList.add(CLASS_NAME_COLLAPSED);
            }

            elem.setAttribute('aria-expanded', isOpen);
          });
        } // Static


        static jQueryInterface(config) {
          return this.each(function () {
            const _config = {};

            if (typeof config === 'string' && /show|hide/.test(config)) {
              _config.toggle = false;
            }

            const data = Collapse.getOrCreateInstance(this, _config);

            if (typeof config === 'string') {
              if (typeof data[config] === 'undefined') {
                throw new TypeError(`No method named "${config}"`);
              }

              data[config]();
            }
          });
        }

      }
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */


      EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
        // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
        if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
          event.preventDefault();
        }

        const selector = getSelectorFromElement(this);
        const selectorElements = SelectorEngine.find(selector);
        selectorElements.forEach(element => {
          Collapse.getOrCreateInstance(element, {
            toggle: false
          }).toggle();
        });
      });
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       * add .Collapse to jQuery only if jQuery is present
       */

      defineJQueryPlugin(Collapse);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): dropdown.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const NAME$9 = 'dropdown';
      const DATA_KEY$8 = 'bs.dropdown';
      const EVENT_KEY$8 = `.${DATA_KEY$8}`;
      const DATA_API_KEY$4 = '.data-api';
      const ESCAPE_KEY$2 = 'Escape';
      const SPACE_KEY = 'Space';
      const TAB_KEY$1 = 'Tab';
      const ARROW_UP_KEY = 'ArrowUp';
      const ARROW_DOWN_KEY = 'ArrowDown';
      const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

      const REGEXP_KEYDOWN = new RegExp(`${ARROW_UP_KEY}|${ARROW_DOWN_KEY}|${ESCAPE_KEY$2}`);
      const EVENT_HIDE$4 = `hide${EVENT_KEY$8}`;
      const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$8}`;
      const EVENT_SHOW$4 = `show${EVENT_KEY$8}`;
      const EVENT_SHOWN$4 = `shown${EVENT_KEY$8}`;
      const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$8}${DATA_API_KEY$4}`;
      const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$8}${DATA_API_KEY$4}`;
      const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$8}${DATA_API_KEY$4}`;
      const CLASS_NAME_SHOW$6 = 'show';
      const CLASS_NAME_DROPUP = 'dropup';
      const CLASS_NAME_DROPEND = 'dropend';
      const CLASS_NAME_DROPSTART = 'dropstart';
      const CLASS_NAME_NAVBAR = 'navbar';
      const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]';
      const SELECTOR_MENU = '.dropdown-menu';
      const SELECTOR_NAVBAR_NAV = '.navbar-nav';
      const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
      const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
      const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
      const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
      const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
      const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
      const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
      const Default$8 = {
        offset: [0, 2],
        boundary: 'clippingParents',
        reference: 'toggle',
        display: 'dynamic',
        popperConfig: null,
        autoClose: true
      };
      const DefaultType$8 = {
        offset: '(array|string|function)',
        boundary: '(string|element)',
        reference: '(string|element|object)',
        display: 'string',
        popperConfig: '(null|object|function)',
        autoClose: '(boolean|string)'
      };
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

      class Dropdown extends BaseComponent {
        constructor(element, config) {
          super(element);
          this._popper = null;
          this._config = this._getConfig(config);
          this._menu = this._getMenuElement();
          this._inNavbar = this._detectNavbar();
        } // Getters


        static get Default() {
          return Default$8;
        }

        static get DefaultType() {
          return DefaultType$8;
        }

        static get NAME() {
          return NAME$9;
        } // Public


        toggle() {
          return this._isShown() ? this.hide() : this.show();
        }

        show() {
          if (isDisabled(this._element) || this._isShown(this._menu)) {
            return;
          }

          const relatedTarget = {
            relatedTarget: this._element
          };
          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, relatedTarget);

          if (showEvent.defaultPrevented) {
            return;
          }

          const parent = Dropdown.getParentFromElement(this._element); // Totally disable Popper for Dropdowns in Navbar

          if (this._inNavbar) {
            Manipulator.setDataAttribute(this._menu, 'popper', 'none');
          } else {
            this._createPopper(parent);
          } // If this is a touch-enabled device we add extra
          // empty mouseover listeners to the body's immediate children;
          // only needed because of broken event delegation on iOS
          // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


          if ('ontouchstart' in document.documentElement && !parent.closest(SELECTOR_NAVBAR_NAV)) {
            [].concat(...document.body.children).forEach(elem => EventHandler.on(elem, 'mouseover', noop));
          }

          this._element.focus();

          this._element.setAttribute('aria-expanded', true);

          this._menu.classList.add(CLASS_NAME_SHOW$6);

          this._element.classList.add(CLASS_NAME_SHOW$6);

          EventHandler.trigger(this._element, EVENT_SHOWN$4, relatedTarget);
        }

        hide() {
          if (isDisabled(this._element) || !this._isShown(this._menu)) {
            return;
          }

          const relatedTarget = {
            relatedTarget: this._element
          };

          this._completeHide(relatedTarget);
        }

        dispose() {
          if (this._popper) {
            this._popper.destroy();
          }

          super.dispose();
        }

        update() {
          this._inNavbar = this._detectNavbar();

          if (this._popper) {
            this._popper.update();
          }
        } // Private


        _completeHide(relatedTarget) {
          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4, relatedTarget);

          if (hideEvent.defaultPrevented) {
            return;
          } // If this is a touch-enabled device we remove the extra
          // empty mouseover listeners we added for iOS support


          if ('ontouchstart' in document.documentElement) {
            [].concat(...document.body.children).forEach(elem => EventHandler.off(elem, 'mouseover', noop));
          }

          if (this._popper) {
            this._popper.destroy();
          }

          this._menu.classList.remove(CLASS_NAME_SHOW$6);

          this._element.classList.remove(CLASS_NAME_SHOW$6);

          this._element.setAttribute('aria-expanded', 'false');

          Manipulator.removeDataAttribute(this._menu, 'popper');
          EventHandler.trigger(this._element, EVENT_HIDDEN$4, relatedTarget);
        }

        _getConfig(config) {
          config = { ...this.constructor.Default,
            ...Manipulator.getDataAttributes(this._element),
            ...config
          };
          typeCheckConfig(NAME$9, config, this.constructor.DefaultType);

          if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
            // Popper virtual elements require a getBoundingClientRect method
            throw new TypeError(`${NAME$9.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
          }

          return config;
        }

        _createPopper(parent) {
          if (typeof Popper__namespace === 'undefined') {
            throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
          }

          let referenceElement = this._element;

          if (this._config.reference === 'parent') {
            referenceElement = parent;
          } else if (isElement(this._config.reference)) {
            referenceElement = getElement(this._config.reference);
          } else if (typeof this._config.reference === 'object') {
            referenceElement = this._config.reference;
          }

          const popperConfig = this._getPopperConfig();

          const isDisplayStatic = popperConfig.modifiers.find(modifier => modifier.name === 'applyStyles' && modifier.enabled === false);
          this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);

          if (isDisplayStatic) {
            Manipulator.setDataAttribute(this._menu, 'popper', 'static');
          }
        }

        _isShown(element = this._element) {
          return element.classList.contains(CLASS_NAME_SHOW$6);
        }

        _getMenuElement() {
          return SelectorEngine.next(this._element, SELECTOR_MENU)[0];
        }

        _getPlacement() {
          const parentDropdown = this._element.parentNode;

          if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
            return PLACEMENT_RIGHT;
          }

          if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
            return PLACEMENT_LEFT;
          } // We need to trim the value because custom properties can also include spaces


          const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';

          if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
            return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
          }

          return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
        }

        _detectNavbar() {
          return this._element.closest(`.${CLASS_NAME_NAVBAR}`) !== null;
        }

        _getOffset() {
          const {
            offset
          } = this._config;

          if (typeof offset === 'string') {
            return offset.split(',').map(val => Number.parseInt(val, 10));
          }

          if (typeof offset === 'function') {
            return popperData => offset(popperData, this._element);
          }

          return offset;
        }

        _getPopperConfig() {
          const defaultBsPopperConfig = {
            placement: this._getPlacement(),
            modifiers: [{
              name: 'preventOverflow',
              options: {
                boundary: this._config.boundary
              }
            }, {
              name: 'offset',
              options: {
                offset: this._getOffset()
              }
            }]
          }; // Disable Popper if we have a static display

          if (this._config.display === 'static') {
            defaultBsPopperConfig.modifiers = [{
              name: 'applyStyles',
              enabled: false
            }];
          }

          return { ...defaultBsPopperConfig,
            ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
          };
        }

        _selectMenuItem({
          key,
          target
        }) {
          const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(isVisible);

          if (!items.length) {
            return;
          } // if target isn't included in items (e.g. when expanding the dropdown)
          // allow cycling to get the last item in case key equals ARROW_UP_KEY


          getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
        } // Static


        static jQueryInterface(config) {
          return this.each(function () {
            const data = Dropdown.getOrCreateInstance(this, config);

            if (typeof config !== 'string') {
              return;
            }

            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }

            data[config]();
          });
        }

        static clearMenus(event) {
          if (event && (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1)) {
            return;
          }

          const toggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE$3);

          for (let i = 0, len = toggles.length; i < len; i++) {
            const context = Dropdown.getInstance(toggles[i]);

            if (!context || context._config.autoClose === false) {
              continue;
            }

            if (!context._isShown()) {
              continue;
            }

            const relatedTarget = {
              relatedTarget: context._element
            };

            if (event) {
              const composedPath = event.composedPath();
              const isMenuTarget = composedPath.includes(context._menu);

              if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
                continue;
              } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu


              if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
                continue;
              }

              if (event.type === 'click') {
                relatedTarget.clickEvent = event;
              }
            }

            context._completeHide(relatedTarget);
          }
        }

        static getParentFromElement(element) {
          return getElementFromSelector(element) || element.parentNode;
        }

        static dataApiKeydownHandler(event) {
          // If not input/textarea:
          //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
          // If input/textarea:
          //  - If space key => not a dropdown command
          //  - If key is other than escape
          //    - If key is not up or down => not a dropdown command
          //    - If trigger inside the menu => not a dropdown command
          if (/input|textarea/i.test(event.target.tagName) ? event.key === SPACE_KEY || event.key !== ESCAPE_KEY$2 && (event.key !== ARROW_DOWN_KEY && event.key !== ARROW_UP_KEY || event.target.closest(SELECTOR_MENU)) : !REGEXP_KEYDOWN.test(event.key)) {
            return;
          }

          const isActive = this.classList.contains(CLASS_NAME_SHOW$6);

          if (!isActive && event.key === ESCAPE_KEY$2) {
            return;
          }

          event.preventDefault();
          event.stopPropagation();

          if (isDisabled(this)) {
            return;
          }

          const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0];
          const instance = Dropdown.getOrCreateInstance(getToggleButton);

          if (event.key === ESCAPE_KEY$2) {
            instance.hide();
            return;
          }

          if (event.key === ARROW_UP_KEY || event.key === ARROW_DOWN_KEY) {
            if (!isActive) {
              instance.show();
            }

            instance._selectMenuItem(event);

            return;
          }

          if (!isActive || event.key === SPACE_KEY) {
            Dropdown.clearMenus();
          }
        }

      }
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */


      EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
      EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
      EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
      EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
      EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
        event.preventDefault();
        Dropdown.getOrCreateInstance(this).toggle();
      });
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       * add .Dropdown to jQuery only if jQuery is present
       */

      defineJQueryPlugin(Dropdown);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): util/scrollBar.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
      const SELECTOR_STICKY_CONTENT = '.sticky-top';

      class ScrollBarHelper {
        constructor() {
          this._element = document.body;
        }

        getWidth() {
          // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
          const documentWidth = document.documentElement.clientWidth;
          return Math.abs(window.innerWidth - documentWidth);
        }

        hide() {
          const width = this.getWidth();

          this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width


          this._setElementAttributes(this._element, 'paddingRight', calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth


          this._setElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight', calculatedValue => calculatedValue + width);

          this._setElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight', calculatedValue => calculatedValue - width);
        }

        _disableOverFlow() {
          this._saveInitialAttribute(this._element, 'overflow');

          this._element.style.overflow = 'hidden';
        }

        _setElementAttributes(selector, styleProp, callback) {
          const scrollbarWidth = this.getWidth();

          const manipulationCallBack = element => {
            if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
              return;
            }

            this._saveInitialAttribute(element, styleProp);

            const calculatedValue = window.getComputedStyle(element)[styleProp];
            element.style[styleProp] = `${callback(Number.parseFloat(calculatedValue))}px`;
          };

          this._applyManipulationCallback(selector, manipulationCallBack);
        }

        reset() {
          this._resetElementAttributes(this._element, 'overflow');

          this._resetElementAttributes(this._element, 'paddingRight');

          this._resetElementAttributes(SELECTOR_FIXED_CONTENT, 'paddingRight');

          this._resetElementAttributes(SELECTOR_STICKY_CONTENT, 'marginRight');
        }

        _saveInitialAttribute(element, styleProp) {
          const actualValue = element.style[styleProp];

          if (actualValue) {
            Manipulator.setDataAttribute(element, styleProp, actualValue);
          }
        }

        _resetElementAttributes(selector, styleProp) {
          const manipulationCallBack = element => {
            const value = Manipulator.getDataAttribute(element, styleProp);

            if (typeof value === 'undefined') {
              element.style.removeProperty(styleProp);
            } else {
              Manipulator.removeDataAttribute(element, styleProp);
              element.style[styleProp] = value;
            }
          };

          this._applyManipulationCallback(selector, manipulationCallBack);
        }

        _applyManipulationCallback(selector, callBack) {
          if (isElement(selector)) {
            callBack(selector);
          } else {
            SelectorEngine.find(selector, this._element).forEach(callBack);
          }
        }

        isOverflowing() {
          return this.getWidth() > 0;
        }

      }

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): util/backdrop.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      const Default$7 = {
        className: 'modal-backdrop',
        isVisible: true,
        // if false, we use the backdrop helper without adding any element to the dom
        isAnimated: false,
        rootElement: 'body',
        // give the choice to place backdrop under different elements
        clickCallback: null
      };
      const DefaultType$7 = {
        className: 'string',
        isVisible: 'boolean',
        isAnimated: 'boolean',
        rootElement: '(element|string)',
        clickCallback: '(function|null)'
      };
      const NAME$8 = 'backdrop';
      const CLASS_NAME_FADE$4 = 'fade';
      const CLASS_NAME_SHOW$5 = 'show';
      const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$8}`;

      class Backdrop {
        constructor(config) {
          this._config = this._getConfig(config);
          this._isAppended = false;
          this._element = null;
        }

        show(callback) {
          if (!this._config.isVisible) {
            execute(callback);
            return;
          }

          this._append();

          if (this._config.isAnimated) {
            reflow(this._getElement());
          }

          this._getElement().classList.add(CLASS_NAME_SHOW$5);

          this._emulateAnimation(() => {
            execute(callback);
          });
        }

        hide(callback) {
          if (!this._config.isVisible) {
            execute(callback);
            return;
          }

          this._getElement().classList.remove(CLASS_NAME_SHOW$5);

          this._emulateAnimation(() => {
            this.dispose();
            execute(callback);
          });
        } // Private


        _getElement() {
          if (!this._element) {
            const backdrop = document.createElement('div');
            backdrop.className = this._config.className;

            if (this._config.isAnimated) {
              backdrop.classList.add(CLASS_NAME_FADE$4);
            }

            this._element = backdrop;
          }

          return this._element;
        }

        _getConfig(config) {
          config = { ...Default$7,
            ...(typeof config === 'object' ? config : {})
          }; // use getElement() with the default "body" to get a fresh Element on each instantiation

          config.rootElement = getElement(config.rootElement);
          typeCheckConfig(NAME$8, config, DefaultType$7);
          return config;
        }

        _append() {
          if (this._isAppended) {
            return;
          }

          this._config.rootElement.append(this._getElement());

          EventHandler.on(this._getElement(), EVENT_MOUSEDOWN, () => {
            execute(this._config.clickCallback);
          });
          this._isAppended = true;
        }

        dispose() {
          if (!this._isAppended) {
            return;
          }

          EventHandler.off(this._element, EVENT_MOUSEDOWN);

          this._element.remove();

          this._isAppended = false;
        }

        _emulateAnimation(callback) {
          executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
        }

      }

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): util/focustrap.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      const Default$6 = {
        trapElement: null,
        // The element to trap focus inside of
        autofocus: true
      };
      const DefaultType$6 = {
        trapElement: 'element',
        autofocus: 'boolean'
      };
      const NAME$7 = 'focustrap';
      const DATA_KEY$7 = 'bs.focustrap';
      const EVENT_KEY$7 = `.${DATA_KEY$7}`;
      const EVENT_FOCUSIN$1 = `focusin${EVENT_KEY$7}`;
      const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$7}`;
      const TAB_KEY = 'Tab';
      const TAB_NAV_FORWARD = 'forward';
      const TAB_NAV_BACKWARD = 'backward';

      class FocusTrap {
        constructor(config) {
          this._config = this._getConfig(config);
          this._isActive = false;
          this._lastTabNavDirection = null;
        }

        activate() {
          const {
            trapElement,
            autofocus
          } = this._config;

          if (this._isActive) {
            return;
          }

          if (autofocus) {
            trapElement.focus();
          }

          EventHandler.off(document, EVENT_KEY$7); // guard against infinite focus loop

          EventHandler.on(document, EVENT_FOCUSIN$1, event => this._handleFocusin(event));
          EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
          this._isActive = true;
        }

        deactivate() {
          if (!this._isActive) {
            return;
          }

          this._isActive = false;
          EventHandler.off(document, EVENT_KEY$7);
        } // Private


        _handleFocusin(event) {
          const {
            target
          } = event;
          const {
            trapElement
          } = this._config;

          if (target === document || target === trapElement || trapElement.contains(target)) {
            return;
          }

          const elements = SelectorEngine.focusableChildren(trapElement);

          if (elements.length === 0) {
            trapElement.focus();
          } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
            elements[elements.length - 1].focus();
          } else {
            elements[0].focus();
          }
        }

        _handleKeydown(event) {
          if (event.key !== TAB_KEY) {
            return;
          }

          this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
        }

        _getConfig(config) {
          config = { ...Default$6,
            ...(typeof config === 'object' ? config : {})
          };
          typeCheckConfig(NAME$7, config, DefaultType$6);
          return config;
        }

      }

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): modal.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const NAME$6 = 'modal';
      const DATA_KEY$6 = 'bs.modal';
      const EVENT_KEY$6 = `.${DATA_KEY$6}`;
      const DATA_API_KEY$3 = '.data-api';
      const ESCAPE_KEY$1 = 'Escape';
      const Default$5 = {
        backdrop: true,
        keyboard: true,
        focus: true
      };
      const DefaultType$5 = {
        backdrop: '(boolean|string)',
        keyboard: 'boolean',
        focus: 'boolean'
      };
      const EVENT_HIDE$3 = `hide${EVENT_KEY$6}`;
      const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$6}`;
      const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$6}`;
      const EVENT_SHOW$3 = `show${EVENT_KEY$6}`;
      const EVENT_SHOWN$3 = `shown${EVENT_KEY$6}`;
      const EVENT_RESIZE = `resize${EVENT_KEY$6}`;
      const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$6}`;
      const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$6}`;
      const EVENT_MOUSEUP_DISMISS = `mouseup.dismiss${EVENT_KEY$6}`;
      const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$6}`;
      const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
      const CLASS_NAME_OPEN = 'modal-open';
      const CLASS_NAME_FADE$3 = 'fade';
      const CLASS_NAME_SHOW$4 = 'show';
      const CLASS_NAME_STATIC = 'modal-static';
      const OPEN_SELECTOR$1 = '.modal.show';
      const SELECTOR_DIALOG = '.modal-dialog';
      const SELECTOR_MODAL_BODY = '.modal-body';
      const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

      class Modal extends BaseComponent {
        constructor(element, config) {
          super(element);
          this._config = this._getConfig(config);
          this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
          this._backdrop = this._initializeBackDrop();
          this._focustrap = this._initializeFocusTrap();
          this._isShown = false;
          this._ignoreBackdropClick = false;
          this._isTransitioning = false;
          this._scrollBar = new ScrollBarHelper();
        } // Getters


        static get Default() {
          return Default$5;
        }

        static get NAME() {
          return NAME$6;
        } // Public


        toggle(relatedTarget) {
          return this._isShown ? this.hide() : this.show(relatedTarget);
        }

        show(relatedTarget) {
          if (this._isShown || this._isTransitioning) {
            return;
          }

          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
            relatedTarget
          });

          if (showEvent.defaultPrevented) {
            return;
          }

          this._isShown = true;

          if (this._isAnimated()) {
            this._isTransitioning = true;
          }

          this._scrollBar.hide();

          document.body.classList.add(CLASS_NAME_OPEN);

          this._adjustDialog();

          this._setEscapeEvent();

          this._setResizeEvent();

          EventHandler.on(this._dialog, EVENT_MOUSEDOWN_DISMISS, () => {
            EventHandler.one(this._element, EVENT_MOUSEUP_DISMISS, event => {
              if (event.target === this._element) {
                this._ignoreBackdropClick = true;
              }
            });
          });

          this._showBackdrop(() => this._showElement(relatedTarget));
        }

        hide() {
          if (!this._isShown || this._isTransitioning) {
            return;
          }

          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);

          if (hideEvent.defaultPrevented) {
            return;
          }

          this._isShown = false;

          const isAnimated = this._isAnimated();

          if (isAnimated) {
            this._isTransitioning = true;
          }

          this._setEscapeEvent();

          this._setResizeEvent();

          this._focustrap.deactivate();

          this._element.classList.remove(CLASS_NAME_SHOW$4);

          EventHandler.off(this._element, EVENT_CLICK_DISMISS);
          EventHandler.off(this._dialog, EVENT_MOUSEDOWN_DISMISS);

          this._queueCallback(() => this._hideModal(), this._element, isAnimated);
        }

        dispose() {
          [window, this._dialog].forEach(htmlElement => EventHandler.off(htmlElement, EVENT_KEY$6));

          this._backdrop.dispose();

          this._focustrap.deactivate();

          super.dispose();
        }

        handleUpdate() {
          this._adjustDialog();
        } // Private


        _initializeBackDrop() {
          return new Backdrop({
            isVisible: Boolean(this._config.backdrop),
            // 'static' option will be translated to true, and booleans will keep their value
            isAnimated: this._isAnimated()
          });
        }

        _initializeFocusTrap() {
          return new FocusTrap({
            trapElement: this._element
          });
        }

        _getConfig(config) {
          config = { ...Default$5,
            ...Manipulator.getDataAttributes(this._element),
            ...(typeof config === 'object' ? config : {})
          };
          typeCheckConfig(NAME$6, config, DefaultType$5);
          return config;
        }

        _showElement(relatedTarget) {
          const isAnimated = this._isAnimated();

          const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);

          if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
            // Don't move modal's DOM position
            document.body.append(this._element);
          }

          this._element.style.display = 'block';

          this._element.removeAttribute('aria-hidden');

          this._element.setAttribute('aria-modal', true);

          this._element.setAttribute('role', 'dialog');

          this._element.scrollTop = 0;

          if (modalBody) {
            modalBody.scrollTop = 0;
          }

          if (isAnimated) {
            reflow(this._element);
          }

          this._element.classList.add(CLASS_NAME_SHOW$4);

          const transitionComplete = () => {
            if (this._config.focus) {
              this._focustrap.activate();
            }

            this._isTransitioning = false;
            EventHandler.trigger(this._element, EVENT_SHOWN$3, {
              relatedTarget
            });
          };

          this._queueCallback(transitionComplete, this._dialog, isAnimated);
        }

        _setEscapeEvent() {
          if (this._isShown) {
            EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
              if (this._config.keyboard && event.key === ESCAPE_KEY$1) {
                event.preventDefault();
                this.hide();
              } else if (!this._config.keyboard && event.key === ESCAPE_KEY$1) {
                this._triggerBackdropTransition();
              }
            });
          } else {
            EventHandler.off(this._element, EVENT_KEYDOWN_DISMISS$1);
          }
        }

        _setResizeEvent() {
          if (this._isShown) {
            EventHandler.on(window, EVENT_RESIZE, () => this._adjustDialog());
          } else {
            EventHandler.off(window, EVENT_RESIZE);
          }
        }

        _hideModal() {
          this._element.style.display = 'none';

          this._element.setAttribute('aria-hidden', true);

          this._element.removeAttribute('aria-modal');

          this._element.removeAttribute('role');

          this._isTransitioning = false;

          this._backdrop.hide(() => {
            document.body.classList.remove(CLASS_NAME_OPEN);

            this._resetAdjustments();

            this._scrollBar.reset();

            EventHandler.trigger(this._element, EVENT_HIDDEN$3);
          });
        }

        _showBackdrop(callback) {
          EventHandler.on(this._element, EVENT_CLICK_DISMISS, event => {
            if (this._ignoreBackdropClick) {
              this._ignoreBackdropClick = false;
              return;
            }

            if (event.target !== event.currentTarget) {
              return;
            }

            if (this._config.backdrop === true) {
              this.hide();
            } else if (this._config.backdrop === 'static') {
              this._triggerBackdropTransition();
            }
          });

          this._backdrop.show(callback);
        }

        _isAnimated() {
          return this._element.classList.contains(CLASS_NAME_FADE$3);
        }

        _triggerBackdropTransition() {
          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);

          if (hideEvent.defaultPrevented) {
            return;
          }

          const {
            classList,
            scrollHeight,
            style
          } = this._element;
          const isModalOverflowing = scrollHeight > document.documentElement.clientHeight; // return if the following background transition hasn't yet completed

          if (!isModalOverflowing && style.overflowY === 'hidden' || classList.contains(CLASS_NAME_STATIC)) {
            return;
          }

          if (!isModalOverflowing) {
            style.overflowY = 'hidden';
          }

          classList.add(CLASS_NAME_STATIC);

          this._queueCallback(() => {
            classList.remove(CLASS_NAME_STATIC);

            if (!isModalOverflowing) {
              this._queueCallback(() => {
                style.overflowY = '';
              }, this._dialog);
            }
          }, this._dialog);

          this._element.focus();
        } // ----------------------------------------------------------------------
        // the following methods are used to handle overflowing modals
        // ----------------------------------------------------------------------


        _adjustDialog() {
          const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

          const scrollbarWidth = this._scrollBar.getWidth();

          const isBodyOverflowing = scrollbarWidth > 0;

          if (!isBodyOverflowing && isModalOverflowing && !isRTL() || isBodyOverflowing && !isModalOverflowing && isRTL()) {
            this._element.style.paddingLeft = `${scrollbarWidth}px`;
          }

          if (isBodyOverflowing && !isModalOverflowing && !isRTL() || !isBodyOverflowing && isModalOverflowing && isRTL()) {
            this._element.style.paddingRight = `${scrollbarWidth}px`;
          }
        }

        _resetAdjustments() {
          this._element.style.paddingLeft = '';
          this._element.style.paddingRight = '';
        } // Static


        static jQueryInterface(config, relatedTarget) {
          return this.each(function () {
            const data = Modal.getOrCreateInstance(this, config);

            if (typeof config !== 'string') {
              return;
            }

            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }

            data[config](relatedTarget);
          });
        }

      }
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */


      EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
        const target = getElementFromSelector(this);

        if (['A', 'AREA'].includes(this.tagName)) {
          event.preventDefault();
        }

        EventHandler.one(target, EVENT_SHOW$3, showEvent => {
          if (showEvent.defaultPrevented) {
            // only register focus restorer if modal will actually get shown
            return;
          }

          EventHandler.one(target, EVENT_HIDDEN$3, () => {
            if (isVisible(this)) {
              this.focus();
            }
          });
        }); // avoid conflict when clicking moddal toggler while another one is open

        const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);

        if (allReadyOpen) {
          Modal.getInstance(allReadyOpen).hide();
        }

        const data = Modal.getOrCreateInstance(target);
        data.toggle(this);
      });
      enableDismissTrigger(Modal);
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       * add .Modal to jQuery only if jQuery is present
       */

      defineJQueryPlugin(Modal);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): offcanvas.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const NAME$5 = 'offcanvas';
      const DATA_KEY$5 = 'bs.offcanvas';
      const EVENT_KEY$5 = `.${DATA_KEY$5}`;
      const DATA_API_KEY$2 = '.data-api';
      const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$5}${DATA_API_KEY$2}`;
      const ESCAPE_KEY = 'Escape';
      const Default$4 = {
        backdrop: true,
        keyboard: true,
        scroll: false
      };
      const DefaultType$4 = {
        backdrop: 'boolean',
        keyboard: 'boolean',
        scroll: 'boolean'
      };
      const CLASS_NAME_SHOW$3 = 'show';
      const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
      const OPEN_SELECTOR = '.offcanvas.show';
      const EVENT_SHOW$2 = `show${EVENT_KEY$5}`;
      const EVENT_SHOWN$2 = `shown${EVENT_KEY$5}`;
      const EVENT_HIDE$2 = `hide${EVENT_KEY$5}`;
      const EVENT_HIDDEN$2 = `hidden${EVENT_KEY$5}`;
      const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$5}${DATA_API_KEY$2}`;
      const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$5}`;
      const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

      class Offcanvas extends BaseComponent {
        constructor(element, config) {
          super(element);
          this._config = this._getConfig(config);
          this._isShown = false;
          this._backdrop = this._initializeBackDrop();
          this._focustrap = this._initializeFocusTrap();

          this._addEventListeners();
        } // Getters


        static get NAME() {
          return NAME$5;
        }

        static get Default() {
          return Default$4;
        } // Public


        toggle(relatedTarget) {
          return this._isShown ? this.hide() : this.show(relatedTarget);
        }

        show(relatedTarget) {
          if (this._isShown) {
            return;
          }

          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$2, {
            relatedTarget
          });

          if (showEvent.defaultPrevented) {
            return;
          }

          this._isShown = true;
          this._element.style.visibility = 'visible';

          this._backdrop.show();

          if (!this._config.scroll) {
            new ScrollBarHelper().hide();
          }

          this._element.removeAttribute('aria-hidden');

          this._element.setAttribute('aria-modal', true);

          this._element.setAttribute('role', 'dialog');

          this._element.classList.add(CLASS_NAME_SHOW$3);

          const completeCallBack = () => {
            if (!this._config.scroll) {
              this._focustrap.activate();
            }

            EventHandler.trigger(this._element, EVENT_SHOWN$2, {
              relatedTarget
            });
          };

          this._queueCallback(completeCallBack, this._element, true);
        }

        hide() {
          if (!this._isShown) {
            return;
          }

          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$2);

          if (hideEvent.defaultPrevented) {
            return;
          }

          this._focustrap.deactivate();

          this._element.blur();

          this._isShown = false;

          this._element.classList.remove(CLASS_NAME_SHOW$3);

          this._backdrop.hide();

          const completeCallback = () => {
            this._element.setAttribute('aria-hidden', true);

            this._element.removeAttribute('aria-modal');

            this._element.removeAttribute('role');

            this._element.style.visibility = 'hidden';

            if (!this._config.scroll) {
              new ScrollBarHelper().reset();
            }

            EventHandler.trigger(this._element, EVENT_HIDDEN$2);
          };

          this._queueCallback(completeCallback, this._element, true);
        }

        dispose() {
          this._backdrop.dispose();

          this._focustrap.deactivate();

          super.dispose();
        } // Private


        _getConfig(config) {
          config = { ...Default$4,
            ...Manipulator.getDataAttributes(this._element),
            ...(typeof config === 'object' ? config : {})
          };
          typeCheckConfig(NAME$5, config, DefaultType$4);
          return config;
        }

        _initializeBackDrop() {
          return new Backdrop({
            className: CLASS_NAME_BACKDROP,
            isVisible: this._config.backdrop,
            isAnimated: true,
            rootElement: this._element.parentNode,
            clickCallback: () => this.hide()
          });
        }

        _initializeFocusTrap() {
          return new FocusTrap({
            trapElement: this._element
          });
        }

        _addEventListeners() {
          EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
            if (this._config.keyboard && event.key === ESCAPE_KEY) {
              this.hide();
            }
          });
        } // Static


        static jQueryInterface(config) {
          return this.each(function () {
            const data = Offcanvas.getOrCreateInstance(this, config);

            if (typeof config !== 'string') {
              return;
            }

            if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
              throw new TypeError(`No method named "${config}"`);
            }

            data[config](this);
          });
        }

      }
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */


      EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
        const target = getElementFromSelector(this);

        if (['A', 'AREA'].includes(this.tagName)) {
          event.preventDefault();
        }

        if (isDisabled(this)) {
          return;
        }

        EventHandler.one(target, EVENT_HIDDEN$2, () => {
          // focus on trigger when it is closed
          if (isVisible(this)) {
            this.focus();
          }
        }); // avoid conflict when clicking a toggler of an offcanvas, while another is open

        const allReadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);

        if (allReadyOpen && allReadyOpen !== target) {
          Offcanvas.getInstance(allReadyOpen).hide();
        }

        const data = Offcanvas.getOrCreateInstance(target);
        data.toggle(this);
      });
      EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => SelectorEngine.find(OPEN_SELECTOR).forEach(el => Offcanvas.getOrCreateInstance(el).show()));
      enableDismissTrigger(Offcanvas);
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       */

      defineJQueryPlugin(Offcanvas);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): util/sanitizer.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
      const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
      /**
       * A pattern that recognizes a commonly useful subset of URLs that are safe.
       *
       * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
       */

      const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
      /**
       * A pattern that matches safe data URLs. Only matches image, video and audio types.
       *
       * Shoutout to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
       */

      const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

      const allowedAttribute = (attribute, allowedAttributeList) => {
        const attributeName = attribute.nodeName.toLowerCase();

        if (allowedAttributeList.includes(attributeName)) {
          if (uriAttributes.has(attributeName)) {
            return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
          }

          return true;
        }

        const regExp = allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp); // Check if a regular expression validates the attribute.

        for (let i = 0, len = regExp.length; i < len; i++) {
          if (regExp[i].test(attributeName)) {
            return true;
          }
        }

        return false;
      };

      const DefaultAllowlist = {
        // Global attributes allowed on any supplied element below.
        '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
        a: ['target', 'href', 'title', 'rel'],
        area: [],
        b: [],
        br: [],
        col: [],
        code: [],
        div: [],
        em: [],
        hr: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        i: [],
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
        li: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        u: [],
        ul: []
      };
      function sanitizeHtml(unsafeHtml, allowList, sanitizeFn) {
        if (!unsafeHtml.length) {
          return unsafeHtml;
        }

        if (sanitizeFn && typeof sanitizeFn === 'function') {
          return sanitizeFn(unsafeHtml);
        }

        const domParser = new window.DOMParser();
        const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
        const elements = [].concat(...createdDocument.body.querySelectorAll('*'));

        for (let i = 0, len = elements.length; i < len; i++) {
          const element = elements[i];
          const elementName = element.nodeName.toLowerCase();

          if (!Object.keys(allowList).includes(elementName)) {
            element.remove();
            continue;
          }

          const attributeList = [].concat(...element.attributes);
          const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
          attributeList.forEach(attribute => {
            if (!allowedAttribute(attribute, allowedAttributes)) {
              element.removeAttribute(attribute.nodeName);
            }
          });
        }

        return createdDocument.body.innerHTML;
      }

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): tooltip.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const NAME$4 = 'tooltip';
      const DATA_KEY$4 = 'bs.tooltip';
      const EVENT_KEY$4 = `.${DATA_KEY$4}`;
      const CLASS_PREFIX$1 = 'bs-tooltip';
      const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
      const DefaultType$3 = {
        animation: 'boolean',
        template: 'string',
        title: '(string|element|function)',
        trigger: 'string',
        delay: '(number|object)',
        html: 'boolean',
        selector: '(string|boolean)',
        placement: '(string|function)',
        offset: '(array|string|function)',
        container: '(string|element|boolean)',
        fallbackPlacements: 'array',
        boundary: '(string|element)',
        customClass: '(string|function)',
        sanitize: 'boolean',
        sanitizeFn: '(null|function)',
        allowList: 'object',
        popperConfig: '(null|object|function)'
      };
      const AttachmentMap = {
        AUTO: 'auto',
        TOP: 'top',
        RIGHT: isRTL() ? 'left' : 'right',
        BOTTOM: 'bottom',
        LEFT: isRTL() ? 'right' : 'left'
      };
      const Default$3 = {
        animation: true,
        template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        selector: false,
        placement: 'top',
        offset: [0, 0],
        container: false,
        fallbackPlacements: ['top', 'right', 'bottom', 'left'],
        boundary: 'clippingParents',
        customClass: '',
        sanitize: true,
        sanitizeFn: null,
        allowList: DefaultAllowlist,
        popperConfig: null
      };
      const Event$2 = {
        HIDE: `hide${EVENT_KEY$4}`,
        HIDDEN: `hidden${EVENT_KEY$4}`,
        SHOW: `show${EVENT_KEY$4}`,
        SHOWN: `shown${EVENT_KEY$4}`,
        INSERTED: `inserted${EVENT_KEY$4}`,
        CLICK: `click${EVENT_KEY$4}`,
        FOCUSIN: `focusin${EVENT_KEY$4}`,
        FOCUSOUT: `focusout${EVENT_KEY$4}`,
        MOUSEENTER: `mouseenter${EVENT_KEY$4}`,
        MOUSELEAVE: `mouseleave${EVENT_KEY$4}`
      };
      const CLASS_NAME_FADE$2 = 'fade';
      const CLASS_NAME_MODAL = 'modal';
      const CLASS_NAME_SHOW$2 = 'show';
      const HOVER_STATE_SHOW = 'show';
      const HOVER_STATE_OUT = 'out';
      const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
      const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
      const EVENT_MODAL_HIDE = 'hide.bs.modal';
      const TRIGGER_HOVER = 'hover';
      const TRIGGER_FOCUS = 'focus';
      const TRIGGER_CLICK = 'click';
      const TRIGGER_MANUAL = 'manual';
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

      class Tooltip extends BaseComponent {
        constructor(element, config) {
          if (typeof Popper__namespace === 'undefined') {
            throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
          }

          super(element); // private

          this._isEnabled = true;
          this._timeout = 0;
          this._hoverState = '';
          this._activeTrigger = {};
          this._popper = null; // Protected

          this._config = this._getConfig(config);
          this.tip = null;

          this._setListeners();
        } // Getters


        static get Default() {
          return Default$3;
        }

        static get NAME() {
          return NAME$4;
        }

        static get Event() {
          return Event$2;
        }

        static get DefaultType() {
          return DefaultType$3;
        } // Public


        enable() {
          this._isEnabled = true;
        }

        disable() {
          this._isEnabled = false;
        }

        toggleEnabled() {
          this._isEnabled = !this._isEnabled;
        }

        toggle(event) {
          if (!this._isEnabled) {
            return;
          }

          if (event) {
            const context = this._initializeOnDelegatedTarget(event);

            context._activeTrigger.click = !context._activeTrigger.click;

            if (context._isWithActiveTrigger()) {
              context._enter(null, context);
            } else {
              context._leave(null, context);
            }
          } else {
            if (this.getTipElement().classList.contains(CLASS_NAME_SHOW$2)) {
              this._leave(null, this);

              return;
            }

            this._enter(null, this);
          }
        }

        dispose() {
          clearTimeout(this._timeout);
          EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

          if (this.tip) {
            this.tip.remove();
          }

          this._disposePopper();

          super.dispose();
        }

        show() {
          if (this._element.style.display === 'none') {
            throw new Error('Please use show on visible elements');
          }

          if (!(this.isWithContent() && this._isEnabled)) {
            return;
          }

          const showEvent = EventHandler.trigger(this._element, this.constructor.Event.SHOW);
          const shadowRoot = findShadowRoot(this._element);
          const isInTheDom = shadowRoot === null ? this._element.ownerDocument.documentElement.contains(this._element) : shadowRoot.contains(this._element);

          if (showEvent.defaultPrevented || !isInTheDom) {
            return;
          } // A trick to recreate a tooltip in case a new title is given by using the NOT documented `data-bs-original-title`
          // This will be removed later in favor of a `setContent` method


          if (this.constructor.NAME === 'tooltip' && this.tip && this.getTitle() !== this.tip.querySelector(SELECTOR_TOOLTIP_INNER).innerHTML) {
            this._disposePopper();

            this.tip.remove();
            this.tip = null;
          }

          const tip = this.getTipElement();
          const tipId = getUID(this.constructor.NAME);
          tip.setAttribute('id', tipId);

          this._element.setAttribute('aria-describedby', tipId);

          if (this._config.animation) {
            tip.classList.add(CLASS_NAME_FADE$2);
          }

          const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;

          const attachment = this._getAttachment(placement);

          this._addAttachmentClass(attachment);

          const {
            container
          } = this._config;
          Data.set(tip, this.constructor.DATA_KEY, this);

          if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
            container.append(tip);
            EventHandler.trigger(this._element, this.constructor.Event.INSERTED);
          }

          if (this._popper) {
            this._popper.update();
          } else {
            this._popper = Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
          }

          tip.classList.add(CLASS_NAME_SHOW$2);

          const customClass = this._resolvePossibleFunction(this._config.customClass);

          if (customClass) {
            tip.classList.add(...customClass.split(' '));
          } // If this is a touch-enabled device we add extra
          // empty mouseover listeners to the body's immediate children;
          // only needed because of broken event delegation on iOS
          // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


          if ('ontouchstart' in document.documentElement) {
            [].concat(...document.body.children).forEach(element => {
              EventHandler.on(element, 'mouseover', noop);
            });
          }

          const complete = () => {
            const prevHoverState = this._hoverState;
            this._hoverState = null;
            EventHandler.trigger(this._element, this.constructor.Event.SHOWN);

            if (prevHoverState === HOVER_STATE_OUT) {
              this._leave(null, this);
            }
          };

          const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);

          this._queueCallback(complete, this.tip, isAnimated);
        }

        hide() {
          if (!this._popper) {
            return;
          }

          const tip = this.getTipElement();

          const complete = () => {
            if (this._isWithActiveTrigger()) {
              return;
            }

            if (this._hoverState !== HOVER_STATE_SHOW) {
              tip.remove();
            }

            this._cleanTipClass();

            this._element.removeAttribute('aria-describedby');

            EventHandler.trigger(this._element, this.constructor.Event.HIDDEN);

            this._disposePopper();
          };

          const hideEvent = EventHandler.trigger(this._element, this.constructor.Event.HIDE);

          if (hideEvent.defaultPrevented) {
            return;
          }

          tip.classList.remove(CLASS_NAME_SHOW$2); // If this is a touch-enabled device we remove the extra
          // empty mouseover listeners we added for iOS support

          if ('ontouchstart' in document.documentElement) {
            [].concat(...document.body.children).forEach(element => EventHandler.off(element, 'mouseover', noop));
          }

          this._activeTrigger[TRIGGER_CLICK] = false;
          this._activeTrigger[TRIGGER_FOCUS] = false;
          this._activeTrigger[TRIGGER_HOVER] = false;
          const isAnimated = this.tip.classList.contains(CLASS_NAME_FADE$2);

          this._queueCallback(complete, this.tip, isAnimated);

          this._hoverState = '';
        }

        update() {
          if (this._popper !== null) {
            this._popper.update();
          }
        } // Protected


        isWithContent() {
          return Boolean(this.getTitle());
        }

        getTipElement() {
          if (this.tip) {
            return this.tip;
          }

          const element = document.createElement('div');
          element.innerHTML = this._config.template;
          const tip = element.children[0];
          this.setContent(tip);
          tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
          this.tip = tip;
          return this.tip;
        }

        setContent(tip) {
          this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TOOLTIP_INNER);
        }

        _sanitizeAndSetContent(template, content, selector) {
          const templateElement = SelectorEngine.findOne(selector, template);

          if (!content && templateElement) {
            templateElement.remove();
            return;
          } // we use append for html objects to maintain js events


          this.setElementContent(templateElement, content);
        }

        setElementContent(element, content) {
          if (element === null) {
            return;
          }

          if (isElement(content)) {
            content = getElement(content); // content is a DOM node or a jQuery

            if (this._config.html) {
              if (content.parentNode !== element) {
                element.innerHTML = '';
                element.append(content);
              }
            } else {
              element.textContent = content.textContent;
            }

            return;
          }

          if (this._config.html) {
            if (this._config.sanitize) {
              content = sanitizeHtml(content, this._config.allowList, this._config.sanitizeFn);
            }

            element.innerHTML = content;
          } else {
            element.textContent = content;
          }
        }

        getTitle() {
          const title = this._element.getAttribute('data-bs-original-title') || this._config.title;

          return this._resolvePossibleFunction(title);
        }

        updateAttachment(attachment) {
          if (attachment === 'right') {
            return 'end';
          }

          if (attachment === 'left') {
            return 'start';
          }

          return attachment;
        } // Private


        _initializeOnDelegatedTarget(event, context) {
          return context || this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
        }

        _getOffset() {
          const {
            offset
          } = this._config;

          if (typeof offset === 'string') {
            return offset.split(',').map(val => Number.parseInt(val, 10));
          }

          if (typeof offset === 'function') {
            return popperData => offset(popperData, this._element);
          }

          return offset;
        }

        _resolvePossibleFunction(content) {
          return typeof content === 'function' ? content.call(this._element) : content;
        }

        _getPopperConfig(attachment) {
          const defaultBsPopperConfig = {
            placement: attachment,
            modifiers: [{
              name: 'flip',
              options: {
                fallbackPlacements: this._config.fallbackPlacements
              }
            }, {
              name: 'offset',
              options: {
                offset: this._getOffset()
              }
            }, {
              name: 'preventOverflow',
              options: {
                boundary: this._config.boundary
              }
            }, {
              name: 'arrow',
              options: {
                element: `.${this.constructor.NAME}-arrow`
              }
            }, {
              name: 'onChange',
              enabled: true,
              phase: 'afterWrite',
              fn: data => this._handlePopperPlacementChange(data)
            }],
            onFirstUpdate: data => {
              if (data.options.placement !== data.placement) {
                this._handlePopperPlacementChange(data);
              }
            }
          };
          return { ...defaultBsPopperConfig,
            ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
          };
        }

        _addAttachmentClass(attachment) {
          this.getTipElement().classList.add(`${this._getBasicClassPrefix()}-${this.updateAttachment(attachment)}`);
        }

        _getAttachment(placement) {
          return AttachmentMap[placement.toUpperCase()];
        }

        _setListeners() {
          const triggers = this._config.trigger.split(' ');

          triggers.forEach(trigger => {
            if (trigger === 'click') {
              EventHandler.on(this._element, this.constructor.Event.CLICK, this._config.selector, event => this.toggle(event));
            } else if (trigger !== TRIGGER_MANUAL) {
              const eventIn = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSEENTER : this.constructor.Event.FOCUSIN;
              const eventOut = trigger === TRIGGER_HOVER ? this.constructor.Event.MOUSELEAVE : this.constructor.Event.FOCUSOUT;
              EventHandler.on(this._element, eventIn, this._config.selector, event => this._enter(event));
              EventHandler.on(this._element, eventOut, this._config.selector, event => this._leave(event));
            }
          });

          this._hideModalHandler = () => {
            if (this._element) {
              this.hide();
            }
          };

          EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);

          if (this._config.selector) {
            this._config = { ...this._config,
              trigger: 'manual',
              selector: ''
            };
          } else {
            this._fixTitle();
          }
        }

        _fixTitle() {
          const title = this._element.getAttribute('title');

          const originalTitleType = typeof this._element.getAttribute('data-bs-original-title');

          if (title || originalTitleType !== 'string') {
            this._element.setAttribute('data-bs-original-title', title || '');

            if (title && !this._element.getAttribute('aria-label') && !this._element.textContent) {
              this._element.setAttribute('aria-label', title);
            }

            this._element.setAttribute('title', '');
          }
        }

        _enter(event, context) {
          context = this._initializeOnDelegatedTarget(event, context);

          if (event) {
            context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
          }

          if (context.getTipElement().classList.contains(CLASS_NAME_SHOW$2) || context._hoverState === HOVER_STATE_SHOW) {
            context._hoverState = HOVER_STATE_SHOW;
            return;
          }

          clearTimeout(context._timeout);
          context._hoverState = HOVER_STATE_SHOW;

          if (!context._config.delay || !context._config.delay.show) {
            context.show();
            return;
          }

          context._timeout = setTimeout(() => {
            if (context._hoverState === HOVER_STATE_SHOW) {
              context.show();
            }
          }, context._config.delay.show);
        }

        _leave(event, context) {
          context = this._initializeOnDelegatedTarget(event, context);

          if (event) {
            context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
          }

          if (context._isWithActiveTrigger()) {
            return;
          }

          clearTimeout(context._timeout);
          context._hoverState = HOVER_STATE_OUT;

          if (!context._config.delay || !context._config.delay.hide) {
            context.hide();
            return;
          }

          context._timeout = setTimeout(() => {
            if (context._hoverState === HOVER_STATE_OUT) {
              context.hide();
            }
          }, context._config.delay.hide);
        }

        _isWithActiveTrigger() {
          for (const trigger in this._activeTrigger) {
            if (this._activeTrigger[trigger]) {
              return true;
            }
          }

          return false;
        }

        _getConfig(config) {
          const dataAttributes = Manipulator.getDataAttributes(this._element);
          Object.keys(dataAttributes).forEach(dataAttr => {
            if (DISALLOWED_ATTRIBUTES.has(dataAttr)) {
              delete dataAttributes[dataAttr];
            }
          });
          config = { ...this.constructor.Default,
            ...dataAttributes,
            ...(typeof config === 'object' && config ? config : {})
          };
          config.container = config.container === false ? document.body : getElement(config.container);

          if (typeof config.delay === 'number') {
            config.delay = {
              show: config.delay,
              hide: config.delay
            };
          }

          if (typeof config.title === 'number') {
            config.title = config.title.toString();
          }

          if (typeof config.content === 'number') {
            config.content = config.content.toString();
          }

          typeCheckConfig(NAME$4, config, this.constructor.DefaultType);

          if (config.sanitize) {
            config.template = sanitizeHtml(config.template, config.allowList, config.sanitizeFn);
          }

          return config;
        }

        _getDelegateConfig() {
          const config = {};

          for (const key in this._config) {
            if (this.constructor.Default[key] !== this._config[key]) {
              config[key] = this._config[key];
            }
          } // In the future can be replaced with:
          // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
          // `Object.fromEntries(keysWithDifferentValues)`


          return config;
        }

        _cleanTipClass() {
          const tip = this.getTipElement();
          const basicClassPrefixRegex = new RegExp(`(^|\\s)${this._getBasicClassPrefix()}\\S+`, 'g');
          const tabClass = tip.getAttribute('class').match(basicClassPrefixRegex);

          if (tabClass !== null && tabClass.length > 0) {
            tabClass.map(token => token.trim()).forEach(tClass => tip.classList.remove(tClass));
          }
        }

        _getBasicClassPrefix() {
          return CLASS_PREFIX$1;
        }

        _handlePopperPlacementChange(popperData) {
          const {
            state
          } = popperData;

          if (!state) {
            return;
          }

          this.tip = state.elements.popper;

          this._cleanTipClass();

          this._addAttachmentClass(this._getAttachment(state.placement));
        }

        _disposePopper() {
          if (this._popper) {
            this._popper.destroy();

            this._popper = null;
          }
        } // Static


        static jQueryInterface(config) {
          return this.each(function () {
            const data = Tooltip.getOrCreateInstance(this, config);

            if (typeof config === 'string') {
              if (typeof data[config] === 'undefined') {
                throw new TypeError(`No method named "${config}"`);
              }

              data[config]();
            }
          });
        }

      }
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       * add .Tooltip to jQuery only if jQuery is present
       */


      defineJQueryPlugin(Tooltip);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): popover.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const NAME$3 = 'popover';
      const DATA_KEY$3 = 'bs.popover';
      const EVENT_KEY$3 = `.${DATA_KEY$3}`;
      const CLASS_PREFIX = 'bs-popover';
      const Default$2 = { ...Tooltip.Default,
        placement: 'right',
        offset: [0, 8],
        trigger: 'click',
        content: '',
        template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>'
      };
      const DefaultType$2 = { ...Tooltip.DefaultType,
        content: '(string|element|function)'
      };
      const Event$1 = {
        HIDE: `hide${EVENT_KEY$3}`,
        HIDDEN: `hidden${EVENT_KEY$3}`,
        SHOW: `show${EVENT_KEY$3}`,
        SHOWN: `shown${EVENT_KEY$3}`,
        INSERTED: `inserted${EVENT_KEY$3}`,
        CLICK: `click${EVENT_KEY$3}`,
        FOCUSIN: `focusin${EVENT_KEY$3}`,
        FOCUSOUT: `focusout${EVENT_KEY$3}`,
        MOUSEENTER: `mouseenter${EVENT_KEY$3}`,
        MOUSELEAVE: `mouseleave${EVENT_KEY$3}`
      };
      const SELECTOR_TITLE = '.popover-header';
      const SELECTOR_CONTENT = '.popover-body';
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

      class Popover extends Tooltip {
        // Getters
        static get Default() {
          return Default$2;
        }

        static get NAME() {
          return NAME$3;
        }

        static get Event() {
          return Event$1;
        }

        static get DefaultType() {
          return DefaultType$2;
        } // Overrides


        isWithContent() {
          return this.getTitle() || this._getContent();
        }

        setContent(tip) {
          this._sanitizeAndSetContent(tip, this.getTitle(), SELECTOR_TITLE);

          this._sanitizeAndSetContent(tip, this._getContent(), SELECTOR_CONTENT);
        } // Private


        _getContent() {
          return this._resolvePossibleFunction(this._config.content);
        }

        _getBasicClassPrefix() {
          return CLASS_PREFIX;
        } // Static


        static jQueryInterface(config) {
          return this.each(function () {
            const data = Popover.getOrCreateInstance(this, config);

            if (typeof config === 'string') {
              if (typeof data[config] === 'undefined') {
                throw new TypeError(`No method named "${config}"`);
              }

              data[config]();
            }
          });
        }

      }
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       * add .Popover to jQuery only if jQuery is present
       */


      defineJQueryPlugin(Popover);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): scrollspy.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const NAME$2 = 'scrollspy';
      const DATA_KEY$2 = 'bs.scrollspy';
      const EVENT_KEY$2 = `.${DATA_KEY$2}`;
      const DATA_API_KEY$1 = '.data-api';
      const Default$1 = {
        offset: 10,
        method: 'auto',
        target: ''
      };
      const DefaultType$1 = {
        offset: 'number',
        method: 'string',
        target: '(string|element)'
      };
      const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
      const EVENT_SCROLL = `scroll${EVENT_KEY$2}`;
      const EVENT_LOAD_DATA_API = `load${EVENT_KEY$2}${DATA_API_KEY$1}`;
      const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
      const CLASS_NAME_ACTIVE$1 = 'active';
      const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
      const SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
      const SELECTOR_NAV_LINKS = '.nav-link';
      const SELECTOR_NAV_ITEMS = '.nav-item';
      const SELECTOR_LIST_ITEMS = '.list-group-item';
      const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}, .${CLASS_NAME_DROPDOWN_ITEM}`;
      const SELECTOR_DROPDOWN$1 = '.dropdown';
      const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
      const METHOD_OFFSET = 'offset';
      const METHOD_POSITION = 'position';
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

      class ScrollSpy extends BaseComponent {
        constructor(element, config) {
          super(element);
          this._scrollElement = this._element.tagName === 'BODY' ? window : this._element;
          this._config = this._getConfig(config);
          this._offsets = [];
          this._targets = [];
          this._activeTarget = null;
          this._scrollHeight = 0;
          EventHandler.on(this._scrollElement, EVENT_SCROLL, () => this._process());
          this.refresh();

          this._process();
        } // Getters


        static get Default() {
          return Default$1;
        }

        static get NAME() {
          return NAME$2;
        } // Public


        refresh() {
          const autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
          const offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
          const offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
          this._offsets = [];
          this._targets = [];
          this._scrollHeight = this._getScrollHeight();
          const targets = SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target);
          targets.map(element => {
            const targetSelector = getSelectorFromElement(element);
            const target = targetSelector ? SelectorEngine.findOne(targetSelector) : null;

            if (target) {
              const targetBCR = target.getBoundingClientRect();

              if (targetBCR.width || targetBCR.height) {
                return [Manipulator[offsetMethod](target).top + offsetBase, targetSelector];
              }
            }

            return null;
          }).filter(item => item).sort((a, b) => a[0] - b[0]).forEach(item => {
            this._offsets.push(item[0]);

            this._targets.push(item[1]);
          });
        }

        dispose() {
          EventHandler.off(this._scrollElement, EVENT_KEY$2);
          super.dispose();
        } // Private


        _getConfig(config) {
          config = { ...Default$1,
            ...Manipulator.getDataAttributes(this._element),
            ...(typeof config === 'object' && config ? config : {})
          };
          config.target = getElement(config.target) || document.documentElement;
          typeCheckConfig(NAME$2, config, DefaultType$1);
          return config;
        }

        _getScrollTop() {
          return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
        }

        _getScrollHeight() {
          return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        }

        _getOffsetHeight() {
          return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
        }

        _process() {
          const scrollTop = this._getScrollTop() + this._config.offset;

          const scrollHeight = this._getScrollHeight();

          const maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

          if (this._scrollHeight !== scrollHeight) {
            this.refresh();
          }

          if (scrollTop >= maxScroll) {
            const target = this._targets[this._targets.length - 1];

            if (this._activeTarget !== target) {
              this._activate(target);
            }

            return;
          }

          if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
            this._activeTarget = null;

            this._clear();

            return;
          }

          for (let i = this._offsets.length; i--;) {
            const isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

            if (isActiveTarget) {
              this._activate(this._targets[i]);
            }
          }
        }

        _activate(target) {
          this._activeTarget = target;

          this._clear();

          const queries = SELECTOR_LINK_ITEMS.split(',').map(selector => `${selector}[data-bs-target="${target}"],${selector}[href="${target}"]`);
          const link = SelectorEngine.findOne(queries.join(','), this._config.target);
          link.classList.add(CLASS_NAME_ACTIVE$1);

          if (link.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
            SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, link.closest(SELECTOR_DROPDOWN$1)).classList.add(CLASS_NAME_ACTIVE$1);
          } else {
            SelectorEngine.parents(link, SELECTOR_NAV_LIST_GROUP$1).forEach(listGroup => {
              // Set triggered links parents as active
              // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
              SelectorEngine.prev(listGroup, `${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1)); // Handle special case when .nav-link is inside .nav-item

              SelectorEngine.prev(listGroup, SELECTOR_NAV_ITEMS).forEach(navItem => {
                SelectorEngine.children(navItem, SELECTOR_NAV_LINKS).forEach(item => item.classList.add(CLASS_NAME_ACTIVE$1));
              });
            });
          }

          EventHandler.trigger(this._scrollElement, EVENT_ACTIVATE, {
            relatedTarget: target
          });
        }

        _clear() {
          SelectorEngine.find(SELECTOR_LINK_ITEMS, this._config.target).filter(node => node.classList.contains(CLASS_NAME_ACTIVE$1)).forEach(node => node.classList.remove(CLASS_NAME_ACTIVE$1));
        } // Static


        static jQueryInterface(config) {
          return this.each(function () {
            const data = ScrollSpy.getOrCreateInstance(this, config);

            if (typeof config !== 'string') {
              return;
            }

            if (typeof data[config] === 'undefined') {
              throw new TypeError(`No method named "${config}"`);
            }

            data[config]();
          });
        }

      }
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */


      EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
        SelectorEngine.find(SELECTOR_DATA_SPY).forEach(spy => new ScrollSpy(spy));
      });
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       * add .ScrollSpy to jQuery only if jQuery is present
       */

      defineJQueryPlugin(ScrollSpy);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): tab.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const NAME$1 = 'tab';
      const DATA_KEY$1 = 'bs.tab';
      const EVENT_KEY$1 = `.${DATA_KEY$1}`;
      const DATA_API_KEY = '.data-api';
      const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
      const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
      const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
      const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
      const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}${DATA_API_KEY}`;
      const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
      const CLASS_NAME_ACTIVE = 'active';
      const CLASS_NAME_FADE$1 = 'fade';
      const CLASS_NAME_SHOW$1 = 'show';
      const SELECTOR_DROPDOWN = '.dropdown';
      const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
      const SELECTOR_ACTIVE = '.active';
      const SELECTOR_ACTIVE_UL = ':scope > li > .active';
      const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
      const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
      const SELECTOR_DROPDOWN_ACTIVE_CHILD = ':scope > .dropdown-menu .active';
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

      class Tab extends BaseComponent {
        // Getters
        static get NAME() {
          return NAME$1;
        } // Public


        show() {
          if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
            return;
          }

          let previous;
          const target = getElementFromSelector(this._element);

          const listElement = this._element.closest(SELECTOR_NAV_LIST_GROUP);

          if (listElement) {
            const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
            previous = SelectorEngine.find(itemSelector, listElement);
            previous = previous[previous.length - 1];
          }

          const hideEvent = previous ? EventHandler.trigger(previous, EVENT_HIDE$1, {
            relatedTarget: this._element
          }) : null;
          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$1, {
            relatedTarget: previous
          });

          if (showEvent.defaultPrevented || hideEvent !== null && hideEvent.defaultPrevented) {
            return;
          }

          this._activate(this._element, listElement);

          const complete = () => {
            EventHandler.trigger(previous, EVENT_HIDDEN$1, {
              relatedTarget: this._element
            });
            EventHandler.trigger(this._element, EVENT_SHOWN$1, {
              relatedTarget: previous
            });
          };

          if (target) {
            this._activate(target, target.parentNode, complete);
          } else {
            complete();
          }
        } // Private


        _activate(element, container, callback) {
          const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? SelectorEngine.find(SELECTOR_ACTIVE_UL, container) : SelectorEngine.children(container, SELECTOR_ACTIVE);
          const active = activeElements[0];
          const isTransitioning = callback && active && active.classList.contains(CLASS_NAME_FADE$1);

          const complete = () => this._transitionComplete(element, active, callback);

          if (active && isTransitioning) {
            active.classList.remove(CLASS_NAME_SHOW$1);

            this._queueCallback(complete, element, true);
          } else {
            complete();
          }
        }

        _transitionComplete(element, active, callback) {
          if (active) {
            active.classList.remove(CLASS_NAME_ACTIVE);
            const dropdownChild = SelectorEngine.findOne(SELECTOR_DROPDOWN_ACTIVE_CHILD, active.parentNode);

            if (dropdownChild) {
              dropdownChild.classList.remove(CLASS_NAME_ACTIVE);
            }

            if (active.getAttribute('role') === 'tab') {
              active.setAttribute('aria-selected', false);
            }
          }

          element.classList.add(CLASS_NAME_ACTIVE);

          if (element.getAttribute('role') === 'tab') {
            element.setAttribute('aria-selected', true);
          }

          reflow(element);

          if (element.classList.contains(CLASS_NAME_FADE$1)) {
            element.classList.add(CLASS_NAME_SHOW$1);
          }

          let parent = element.parentNode;

          if (parent && parent.nodeName === 'LI') {
            parent = parent.parentNode;
          }

          if (parent && parent.classList.contains(CLASS_NAME_DROPDOWN_MENU)) {
            const dropdownElement = element.closest(SELECTOR_DROPDOWN);

            if (dropdownElement) {
              SelectorEngine.find(SELECTOR_DROPDOWN_TOGGLE, dropdownElement).forEach(dropdown => dropdown.classList.add(CLASS_NAME_ACTIVE));
            }

            element.setAttribute('aria-expanded', true);
          }

          if (callback) {
            callback();
          }
        } // Static


        static jQueryInterface(config) {
          return this.each(function () {
            const data = Tab.getOrCreateInstance(this);

            if (typeof config === 'string') {
              if (typeof data[config] === 'undefined') {
                throw new TypeError(`No method named "${config}"`);
              }

              data[config]();
            }
          });
        }

      }
      /**
       * ------------------------------------------------------------------------
       * Data Api implementation
       * ------------------------------------------------------------------------
       */


      EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
        if (['A', 'AREA'].includes(this.tagName)) {
          event.preventDefault();
        }

        if (isDisabled(this)) {
          return;
        }

        const data = Tab.getOrCreateInstance(this);
        data.show();
      });
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       * add .Tab to jQuery only if jQuery is present
       */

      defineJQueryPlugin(Tab);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): toast.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      /**
       * ------------------------------------------------------------------------
       * Constants
       * ------------------------------------------------------------------------
       */

      const NAME = 'toast';
      const DATA_KEY = 'bs.toast';
      const EVENT_KEY = `.${DATA_KEY}`;
      const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
      const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
      const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
      const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
      const EVENT_HIDE = `hide${EVENT_KEY}`;
      const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
      const EVENT_SHOW = `show${EVENT_KEY}`;
      const EVENT_SHOWN = `shown${EVENT_KEY}`;
      const CLASS_NAME_FADE = 'fade';
      const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility

      const CLASS_NAME_SHOW = 'show';
      const CLASS_NAME_SHOWING = 'showing';
      const DefaultType = {
        animation: 'boolean',
        autohide: 'boolean',
        delay: 'number'
      };
      const Default = {
        animation: true,
        autohide: true,
        delay: 5000
      };
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

      class Toast extends BaseComponent {
        constructor(element, config) {
          super(element);
          this._config = this._getConfig(config);
          this._timeout = null;
          this._hasMouseInteraction = false;
          this._hasKeyboardInteraction = false;

          this._setListeners();
        } // Getters


        static get DefaultType() {
          return DefaultType;
        }

        static get Default() {
          return Default;
        }

        static get NAME() {
          return NAME;
        } // Public


        show() {
          const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);

          if (showEvent.defaultPrevented) {
            return;
          }

          this._clearTimeout();

          if (this._config.animation) {
            this._element.classList.add(CLASS_NAME_FADE);
          }

          const complete = () => {
            this._element.classList.remove(CLASS_NAME_SHOWING);

            EventHandler.trigger(this._element, EVENT_SHOWN);

            this._maybeScheduleHide();
          };

          this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated


          reflow(this._element);

          this._element.classList.add(CLASS_NAME_SHOW);

          this._element.classList.add(CLASS_NAME_SHOWING);

          this._queueCallback(complete, this._element, this._config.animation);
        }

        hide() {
          if (!this._element.classList.contains(CLASS_NAME_SHOW)) {
            return;
          }

          const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);

          if (hideEvent.defaultPrevented) {
            return;
          }

          const complete = () => {
            this._element.classList.add(CLASS_NAME_HIDE); // @deprecated


            this._element.classList.remove(CLASS_NAME_SHOWING);

            this._element.classList.remove(CLASS_NAME_SHOW);

            EventHandler.trigger(this._element, EVENT_HIDDEN);
          };

          this._element.classList.add(CLASS_NAME_SHOWING);

          this._queueCallback(complete, this._element, this._config.animation);
        }

        dispose() {
          this._clearTimeout();

          if (this._element.classList.contains(CLASS_NAME_SHOW)) {
            this._element.classList.remove(CLASS_NAME_SHOW);
          }

          super.dispose();
        } // Private


        _getConfig(config) {
          config = { ...Default,
            ...Manipulator.getDataAttributes(this._element),
            ...(typeof config === 'object' && config ? config : {})
          };
          typeCheckConfig(NAME, config, this.constructor.DefaultType);
          return config;
        }

        _maybeScheduleHide() {
          if (!this._config.autohide) {
            return;
          }

          if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
            return;
          }

          this._timeout = setTimeout(() => {
            this.hide();
          }, this._config.delay);
        }

        _onInteraction(event, isInteracting) {
          switch (event.type) {
            case 'mouseover':
            case 'mouseout':
              this._hasMouseInteraction = isInteracting;
              break;

            case 'focusin':
            case 'focusout':
              this._hasKeyboardInteraction = isInteracting;
              break;
          }

          if (isInteracting) {
            this._clearTimeout();

            return;
          }

          const nextElement = event.relatedTarget;

          if (this._element === nextElement || this._element.contains(nextElement)) {
            return;
          }

          this._maybeScheduleHide();
        }

        _setListeners() {
          EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
          EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
          EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
          EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
        }

        _clearTimeout() {
          clearTimeout(this._timeout);
          this._timeout = null;
        } // Static


        static jQueryInterface(config) {
          return this.each(function () {
            const data = Toast.getOrCreateInstance(this, config);

            if (typeof config === 'string') {
              if (typeof data[config] === 'undefined') {
                throw new TypeError(`No method named "${config}"`);
              }

              data[config](this);
            }
          });
        }

      }

      enableDismissTrigger(Toast);
      /**
       * ------------------------------------------------------------------------
       * jQuery
       * ------------------------------------------------------------------------
       * add .Toast to jQuery only if jQuery is present
       */

      defineJQueryPlugin(Toast);

      /**
       * --------------------------------------------------------------------------
       * Bootstrap (v5.1.3): index.umd.js
       * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
       * --------------------------------------------------------------------------
       */
      const index_umd = {
        Alert,
        Button,
        Carousel,
        Collapse,
        Dropdown,
        Modal,
        Offcanvas,
        Popover,
        ScrollSpy,
        Tab,
        Toast,
        Tooltip
      };

      return index_umd;

    }));

    });

    // import '../node_modules/bootstrap/dist/css/bootstrap.css.map'
    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
