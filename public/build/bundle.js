
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
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
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash$2(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash$2(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
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
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
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
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
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

    /* src\components\LoadingCircle.svelte generated by Svelte v3.44.3 */

    const file$l = "src\\components\\LoadingCircle.svelte";

    function create_fragment$l(ctx) {
    	let h1;
    	let span0;
    	let t1;
    	let span1;
    	let t3;
    	let span2;
    	let t5;
    	let span3;
    	let t7;
    	let span4;
    	let t9;
    	let span5;
    	let t11;
    	let span6;
    	let t13;
    	let span7;
    	let t15;
    	let span8;
    	let t17;
    	let span9;
    	let t19;
    	let span10;
    	let t21;
    	let span11;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			span0 = element("span");
    			span0.textContent = "S";
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "U";
    			t3 = space();
    			span2 = element("span");
    			span2.textContent = "L";
    			t5 = space();
    			span3 = element("span");
    			span3.textContent = "T";
    			t7 = space();
    			span4 = element("span");
    			span4.textContent = "A";
    			t9 = space();
    			span5 = element("span");
    			span5.textContent = "N";
    			t11 = space();
    			span6 = element("span");
    			span6.textContent = " ";
    			t13 = space();
    			span7 = element("span");
    			span7.textContent = "A";
    			t15 = space();
    			span8 = element("span");
    			span8.textContent = "H";
    			t17 = space();
    			span9 = element("span");
    			span9.textContent = "M";
    			t19 = space();
    			span10 = element("span");
    			span10.textContent = "E";
    			t21 = space();
    			span11 = element("span");
    			span11.textContent = "D";
    			attr_dev(span0, "class", "svelte-163mav3");
    			add_location(span0, file$l, 1, 4, 10);
    			attr_dev(span1, "class", "svelte-163mav3");
    			add_location(span1, file$l, 2, 4, 30);
    			attr_dev(span2, "class", "svelte-163mav3");
    			add_location(span2, file$l, 3, 4, 50);
    			attr_dev(span3, "class", "svelte-163mav3");
    			add_location(span3, file$l, 4, 4, 70);
    			attr_dev(span4, "class", "svelte-163mav3");
    			add_location(span4, file$l, 5, 4, 90);
    			attr_dev(span5, "class", "svelte-163mav3");
    			add_location(span5, file$l, 6, 4, 110);
    			attr_dev(span6, "class", "svelte-163mav3");
    			add_location(span6, file$l, 7, 4, 130);
    			attr_dev(span7, "class", "svelte-163mav3");
    			add_location(span7, file$l, 8, 4, 155);
    			attr_dev(span8, "class", "svelte-163mav3");
    			add_location(span8, file$l, 9, 4, 175);
    			attr_dev(span9, "class", "svelte-163mav3");
    			add_location(span9, file$l, 10, 4, 195);
    			attr_dev(span10, "class", "svelte-163mav3");
    			add_location(span10, file$l, 11, 4, 215);
    			attr_dev(span11, "class", "svelte-163mav3");
    			add_location(span11, file$l, 12, 4, 235);
    			attr_dev(h1, "class", "svelte-163mav3");
    			add_location(h1, file$l, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, span0);
    			append_dev(h1, t1);
    			append_dev(h1, span1);
    			append_dev(h1, t3);
    			append_dev(h1, span2);
    			append_dev(h1, t5);
    			append_dev(h1, span3);
    			append_dev(h1, t7);
    			append_dev(h1, span4);
    			append_dev(h1, t9);
    			append_dev(h1, span5);
    			append_dev(h1, t11);
    			append_dev(h1, span6);
    			append_dev(h1, t13);
    			append_dev(h1, span7);
    			append_dev(h1, t15);
    			append_dev(h1, span8);
    			append_dev(h1, t17);
    			append_dev(h1, span9);
    			append_dev(h1, t19);
    			append_dev(h1, span10);
    			append_dev(h1, t21);
    			append_dev(h1, span11);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadingCircle', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingCircle> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class LoadingCircle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingCircle",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\components\Navbar.svelte generated by Svelte v3.44.3 */
    const file$k = "src\\components\\Navbar.svelte";

    function create_fragment$k(ctx) {
    	let div4;
    	let div1;
    	let nav;
    	let div0;
    	let a0;
    	let img;
    	let img_src_value;
    	let div1_class_value;
    	let t0;
    	let div3;
    	let div2;
    	let a1;
    	let i;
    	let i_class_value;
    	let t1;
    	let loadingcircle;
    	let current;
    	let mounted;
    	let dispose;
    	loadingcircle = new LoadingCircle({ $$inline: true });

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			nav = element("nav");
    			div0 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			a1 = element("a");
    			i = element("i");
    			t1 = space();
    			create_component(loadingcircle.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = "images/svelte.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "30px");
    			attr_dev(img, "height", "24px");
    			attr_dev(img, "class", "img-thumbnail");
    			add_location(img, file$k, 25, 12, 641);
    			attr_dev(a0, "class", "navbar-brand");
    			attr_dev(a0, "href", "https://www.google.com");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$k, 24, 10, 553);
    			attr_dev(div0, "class", "container-fluid justify-content-center");
    			add_location(div0, file$k, 23, 8, 487);
    			attr_dev(nav, "class", "navbar navbar-light bg-danger ");
    			add_location(nav, file$k, 22, 6, 433);
    			attr_dev(div1, "class", div1_class_value = "col-" + /*navColSize*/ ctx[1] + " p-0" + " svelte-5dgimf");
    			attr_dev(div1, "id", "col");
    			add_location(div1, file$k, 21, 4, 382);
    			attr_dev(i, "class", i_class_value = "fas fa-arrow-" + /*arrow*/ ctx[0] + " px-3");
    			add_location(i, file$k, 33, 10, 929);
    			attr_dev(a1, "class", "navbar-brand");
    			attr_dev(a1, "href", "#");
    			add_location(a1, file$k, 32, 8, 884);
    			attr_dev(div2, "class", "navbar navbar-light bg-light");
    			add_location(div2, file$k, 31, 6, 824);
    			attr_dev(div3, "class", "col p-0");
    			add_location(div3, file$k, 30, 4, 795);
    			attr_dev(div4, "class", "row g-0 m-0 sticky-top");
    			add_location(div4, file$k, 20, 2, 339);
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
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, a1);
    			append_dev(a1, i);
    			append_dev(div2, t1);
    			mount_component(loadingcircle, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(i, "click", /*toggleArrow*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*navColSize*/ 2 && div1_class_value !== (div1_class_value = "col-" + /*navColSize*/ ctx[1] + " p-0" + " svelte-5dgimf")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*arrow*/ 1 && i_class_value !== (i_class_value = "fas fa-arrow-" + /*arrow*/ ctx[0] + " px-3")) {
    				attr_dev(i, "class", i_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingcircle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingcircle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(loadingcircle);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
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

    	$$self.$capture_state = () => ({
    		LoadingCircle,
    		arrow,
    		navColSize,
    		toggleArrow
    	});

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
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\pollevent\Header.svelte generated by Svelte v3.44.3 */

    const file$j = "src\\pollevent\\Header.svelte";

    function create_fragment$j(ctx) {
    	let header;
    	let h1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./images/slogo.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "image");
    			attr_dev(img, "class", "svelte-fu2kfn");
    			add_location(img, file$j, 2, 8, 28);
    			attr_dev(h1, "class", "svelte-fu2kfn");
    			add_location(h1, file$j, 1, 4, 14);
    			attr_dev(header, "class", "svelte-fu2kfn");
    			add_location(header, file$j, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(h1, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\pollevent\Footer.svelte generated by Svelte v3.44.3 */

    const file$i = "src\\pollevent\\Footer.svelte";

    function create_fragment$i(ctx) {
    	let footer;
    	let div;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			div.textContent = "@Copyright 2021 Poll";
    			attr_dev(div, "class", "copyright svelte-15ik3qo");
    			add_location(div, file$i, 1, 4, 14);
    			attr_dev(footer, "class", "svelte-15ik3qo");
    			add_location(footer, file$i, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$i.name
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

    /* src\elements\Tabs.svelte generated by Svelte v3.44.3 */
    const file$h = "src\\elements\\Tabs.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (11:8) {#each items as item}
    function create_each_block$3(ctx) {
    	let li;
    	let div;
    	let t0_value = /*item*/ ctx[4] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*item*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "svelte-7s9uir");
    			toggle_class(div, "active", /*item*/ ctx[4] == /*activeItem*/ ctx[1]);
    			add_location(div, file$h, 12, 16, 351);
    			attr_dev(li, "class", "svelte-7s9uir");
    			add_location(li, file$h, 11, 12, 286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*items*/ 1 && t0_value !== (t0_value = /*item*/ ctx[4] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*items, activeItem*/ 3) {
    				toggle_class(div, "active", /*item*/ ctx[4] == /*activeItem*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(11:8) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div;
    	let ul;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-7s9uir");
    			add_location(ul, file$h, 9, 4, 237);
    			add_location(div, file$h, 8, 0, 226);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dispatch, items, activeItem*/ 7) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, []);
    	let { items } = $$props;
    	let { activeItem } = $$props;
    	const dispatch = createEventDispatcher();
    	const writable_props = ['items', 'activeItem'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => dispatch('tabChange', item);

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		items,
    		activeItem,
    		createEventDispatcher,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [items, activeItem, dispatch, click_handler];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { items: 0, activeItem: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[0] === undefined && !('items' in props)) {
    			console.warn("<Tabs> was created without expected prop 'items'");
    		}

    		if (/*activeItem*/ ctx[1] === undefined && !('activeItem' in props)) {
    			console.warn("<Tabs> was created without expected prop 'activeItem'");
    		}
    	}

    	get items() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeItem() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeItem(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const PollStore= writable(
            [
                {
                    question: "python or js",
                    answer1: "python",
                    answer2: "js",
                    vote1: 5,
                    vote2: 10,
                    id: 1, 
                },
                {
                    question: "java or C++",
                    answer1: "java",
                    answer2: "C++",
                    vote1: 12,
                    vote2: 13,
                    id: 2, 
                }
            ]
        );

    /* src\elements\Button.svelte generated by Svelte v3.44.3 */

    const file$g = "src\\elements\\Button.svelte";

    function create_fragment$g(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*type*/ ctx[0]) + " svelte-te3x3w"));
    			toggle_class(button, "flat", /*flat*/ ctx[1]);
    			toggle_class(button, "inverse", /*inverse*/ ctx[2]);
    			add_location(button, file$g, 7, 0, 121);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*type*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*type*/ ctx[0]) + " svelte-te3x3w"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*type, flat*/ 3) {
    				toggle_class(button, "flat", /*flat*/ ctx[1]);
    			}

    			if (dirty & /*type, inverse*/ 5) {
    				toggle_class(button, "inverse", /*inverse*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { type = "primary" } = $$props;
    	let { flat = false } = $$props;
    	let { inverse = false } = $$props;
    	const writable_props = ['type', 'flat', 'inverse'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('flat' in $$props) $$invalidate(1, flat = $$props.flat);
    		if ('inverse' in $$props) $$invalidate(2, inverse = $$props.inverse);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ type, flat, inverse });

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('flat' in $$props) $$invalidate(1, flat = $$props.flat);
    		if ('inverse' in $$props) $$invalidate(2, inverse = $$props.inverse);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, flat, inverse, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { type: 0, flat: 1, inverse: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flat() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flat(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pollevent\CreatePollForm.svelte generated by Svelte v3.44.3 */

    const { console: console_1$5 } = globals;
    const file$f = "src\\pollevent\\CreatePollForm.svelte";

    // (68:8) <Button type="secondary" >
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Add Poll");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(68:8) <Button type=\\\"secondary\\\" >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div6;
    	let form;
    	let div1;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let div0;
    	let t3_value = /*errors*/ ctx[1].question + "";
    	let t3;
    	let t4;
    	let div3;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let div2;
    	let t8_value = /*errors*/ ctx[1].answer1 + "";
    	let t8;
    	let t9;
    	let div5;
    	let label2;
    	let t11;
    	let input2;
    	let t12;
    	let div4;
    	let t13_value = /*errors*/ ctx[1].answer2 + "";
    	let t13;
    	let t14;
    	let button;
    	let div6_intro;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				type: "secondary",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			form = element("form");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Poll Question:";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div0 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Answer 1:";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div2 = element("div");
    			t8 = text(t8_value);
    			t9 = space();
    			div5 = element("div");
    			label2 = element("label");
    			label2.textContent = "Answer 2:";
    			t11 = space();
    			input2 = element("input");
    			t12 = space();
    			div4 = element("div");
    			t13 = text(t13_value);
    			t14 = space();
    			create_component(button.$$.fragment);
    			attr_dev(label0, "for", "question");
    			attr_dev(label0, "class", "svelte-ed1edj");
    			add_location(label0, file$f, 53, 12, 1797);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "question");
    			attr_dev(input0, "class", "svelte-ed1edj");
    			toggle_class(input0, "valid", /*invalid*/ ctx[2]);
    			add_location(input0, file$f, 54, 12, 1855);
    			attr_dev(div0, "class", "error svelte-ed1edj");
    			add_location(div0, file$f, 55, 12, 1953);
    			attr_dev(div1, "class", "form-field svelte-ed1edj");
    			add_location(div1, file$f, 52, 8, 1759);
    			attr_dev(label1, "for", "answer1");
    			attr_dev(label1, "class", "svelte-ed1edj");
    			add_location(label1, file$f, 58, 12, 2059);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "answer1");
    			attr_dev(input1, "class", "svelte-ed1edj");
    			toggle_class(input1, "valid", /*invalid*/ ctx[2]);
    			add_location(input1, file$f, 59, 12, 2111);
    			attr_dev(div2, "class", "error svelte-ed1edj");
    			add_location(div2, file$f, 60, 12, 2207);
    			attr_dev(div3, "class", "form-field svelte-ed1edj");
    			add_location(div3, file$f, 57, 8, 2021);
    			attr_dev(label2, "for", "answer2");
    			attr_dev(label2, "class", "svelte-ed1edj");
    			add_location(label2, file$f, 63, 12, 2312);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "answer2");
    			attr_dev(input2, "class", "svelte-ed1edj");
    			toggle_class(input2, "valid", /*invalid*/ ctx[2]);
    			add_location(input2, file$f, 64, 12, 2364);
    			attr_dev(div4, "class", "error svelte-ed1edj");
    			add_location(div4, file$f, 65, 12, 2460);
    			attr_dev(div5, "class", "form-field svelte-ed1edj");
    			add_location(div5, file$f, 62, 8, 2274);
    			attr_dev(form, "class", "svelte-ed1edj");
    			add_location(form, file$f, 51, 4, 1698);
    			add_location(div6, file$f, 50, 0, 1662);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, form);
    			append_dev(form, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*fields*/ ctx[0].question);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, t3);
    			append_dev(form, t4);
    			append_dev(form, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t6);
    			append_dev(div3, input1);
    			set_input_value(input1, /*fields*/ ctx[0].answer1);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, t8);
    			append_dev(form, t9);
    			append_dev(form, div5);
    			append_dev(div5, label2);
    			append_dev(div5, t11);
    			append_dev(div5, input2);
    			set_input_value(input2, /*fields*/ ctx[0].answer2);
    			append_dev(div5, t12);
    			append_dev(div5, div4);
    			append_dev(div4, t13);
    			append_dev(form, t14);
    			mount_component(button, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[6]),
    					listen_dev(form, "submit", prevent_default(/*submitHandeller*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*fields*/ 1 && input0.value !== /*fields*/ ctx[0].question) {
    				set_input_value(input0, /*fields*/ ctx[0].question);
    			}

    			if (dirty & /*invalid*/ 4) {
    				toggle_class(input0, "valid", /*invalid*/ ctx[2]);
    			}

    			if ((!current || dirty & /*errors*/ 2) && t3_value !== (t3_value = /*errors*/ ctx[1].question + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*fields*/ 1 && input1.value !== /*fields*/ ctx[0].answer1) {
    				set_input_value(input1, /*fields*/ ctx[0].answer1);
    			}

    			if (dirty & /*invalid*/ 4) {
    				toggle_class(input1, "valid", /*invalid*/ ctx[2]);
    			}

    			if ((!current || dirty & /*errors*/ 2) && t8_value !== (t8_value = /*errors*/ ctx[1].answer1 + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*fields*/ 1 && input2.value !== /*fields*/ ctx[0].answer2) {
    				set_input_value(input2, /*fields*/ ctx[0].answer2);
    			}

    			if (dirty & /*invalid*/ 4) {
    				toggle_class(input2, "valid", /*invalid*/ ctx[2]);
    			}

    			if ((!current || dirty & /*errors*/ 2) && t13_value !== (t13_value = /*errors*/ ctx[1].answer2 + "")) set_data_dev(t13, t13_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 512) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			if (!div6_intro) {
    				add_render_callback(() => {
    					div6_intro = create_in_transition(div6, fade, { duration: 500 });
    					div6_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CreatePollForm', slots, []);
    	const dispatch = createEventDispatcher();
    	let fields = { question: "", answer1: "", answer2: "" };
    	let errors = { question: "", answer1: "", answer2: "" };
    	let valid = false;
    	let invalid = false;

    	const submitHandeller = () => {
    		valid = true;

    		if (fields.question.trim().length < 5) {
    			valid = false;
    			$$invalidate(2, invalid = true);
    			$$invalidate(1, errors.question = "Question length should not be less than 5 character", errors);
    		} else {
    			$$invalidate(1, errors.question = '', errors);
    			$$invalidate(2, invalid = false);
    		}

    		if (fields.answer1.trim().length < 1) {
    			valid = false;
    			$$invalidate(2, invalid = true);
    			$$invalidate(1, errors.answer1 = "Answer should not be empty", errors);
    		} else {
    			$$invalidate(1, errors.answer1 = '', errors);
    			$$invalidate(2, invalid = false);
    		}

    		if (fields.answer2.trim().length < 1) {
    			valid = false;
    			$$invalidate(2, invalid = true);
    			$$invalidate(1, errors.answer2 = "Answer should not be empty", errors);
    		} else {
    			$$invalidate(1, errors.answer2 = '', errors);
    			$$invalidate(2, invalid = false);
    		}

    		if (valid) {
    			let poll = {
    				...fields,
    				vote1: 0,
    				vote2: 0,
    				id: Math.random()
    			};

    			PollStore.update(currentData => {
    				currentData = [poll, ...currentData];
    				dispatch("add");
    				return currentData;
    			});
    		} else {
    			console.log("invalid: " + errors);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<CreatePollForm> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		fields.question = this.value;
    		$$invalidate(0, fields);
    	}

    	function input1_input_handler() {
    		fields.answer1 = this.value;
    		$$invalidate(0, fields);
    	}

    	function input2_input_handler() {
    		fields.answer2 = this.value;
    		$$invalidate(0, fields);
    	}

    	$$self.$capture_state = () => ({
    		PollStore,
    		Button,
    		createEventDispatcher,
    		fade,
    		slide,
    		scale,
    		dispatch,
    		fields,
    		errors,
    		valid,
    		invalid,
    		submitHandeller
    	});

    	$$self.$inject_state = $$props => {
    		if ('fields' in $$props) $$invalidate(0, fields = $$props.fields);
    		if ('errors' in $$props) $$invalidate(1, errors = $$props.errors);
    		if ('valid' in $$props) valid = $$props.valid;
    		if ('invalid' in $$props) $$invalidate(2, invalid = $$props.invalid);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		fields,
    		errors,
    		invalid,
    		submitHandeller,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class CreatePollForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CreatePollForm",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\elements\Card.svelte generated by Svelte v3.44.3 */

    const file$e = "src\\elements\\Card.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "card svelte-cdnta8");
    			add_location(div, file$e, 2, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src\pollevent\PollDetails.svelte generated by Svelte v3.44.3 */
    const file$d = "src\\pollevent\\PollDetails.svelte";

    // (51:12) <Button flat={true} on:click={()=>deleteHandeller(poll.id)}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("delete");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(51:12) <Button flat={true} on:click={()=>deleteHandeller(poll.id)}>",
    		ctx
    	});

    	return block;
    }

    // (38:0) <Card>
    function create_default_slot(ctx) {
    	let div5;
    	let h3;
    	let t0_value = /*poll*/ ctx[0].question + "";
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let t4;
    	let div1;
    	let div0;
    	let t5;
    	let span0;
    	let t6_value = /*poll*/ ctx[0].answer1 + "";
    	let t6;
    	let t7;
    	let t8_value = /*poll*/ ctx[0].vote1 + "";
    	let t8;
    	let t9;
    	let t10;
    	let div3;
    	let div2;
    	let t11;
    	let span1;
    	let t12_value = /*poll*/ ctx[0].answer2 + "";
    	let t12;
    	let t13;
    	let t14_value = /*poll*/ ctx[0].vote2 + "";
    	let t14;
    	let t15;
    	let t16;
    	let div4;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				flat: true,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_1*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text("TOtal vote: ");
    			t3 = text(/*totalVote*/ ctx[1]);
    			t4 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t5 = space();
    			span0 = element("span");
    			t6 = text(t6_value);
    			t7 = text(" (");
    			t8 = text(t8_value);
    			t9 = text(")");
    			t10 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t11 = space();
    			span1 = element("span");
    			t12 = text(t12_value);
    			t13 = text(" (");
    			t14 = text(t14_value);
    			t15 = text(")");
    			t16 = space();
    			div4 = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(h3, "class", "svelte-a8769z");
    			add_location(h3, file$d, 39, 8, 1227);
    			attr_dev(p, "class", "svelte-a8769z");
    			add_location(p, file$d, 40, 8, 1261);
    			attr_dev(div0, "class", "percent percent-1 svelte-a8769z");
    			set_style(div0, "width", /*$value1*/ ctx[2] + "%");
    			add_location(div0, file$d, 42, 12, 1379);
    			attr_dev(span0, "class", "svelte-a8769z");
    			add_location(span0, file$d, 43, 12, 1456);
    			attr_dev(div1, "class", "answer svelte-a8769z");
    			add_location(div1, file$d, 41, 8, 1301);
    			attr_dev(div2, "class", "percent percent-2 svelte-a8769z");
    			set_style(div2, "width", /*$value2*/ ctx[3] + "%");
    			add_location(div2, file$d, 46, 12, 1598);
    			attr_dev(span1, "class", "svelte-a8769z");
    			add_location(span1, file$d, 47, 12, 1675);
    			attr_dev(div3, "class", "answer svelte-a8769z");
    			add_location(div3, file$d, 45, 8, 1524);
    			attr_dev(div4, "class", "delete svelte-a8769z");
    			add_location(div4, file$d, 49, 8, 1755);
    			attr_dev(div5, "class", "poll");
    			add_location(div5, file$d, 38, 4, 1199);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, h3);
    			append_dev(h3, t0);
    			append_dev(div5, t1);
    			append_dev(div5, p);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(div5, t4);
    			append_dev(div5, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t5);
    			append_dev(div1, span0);
    			append_dev(span0, t6);
    			append_dev(span0, t7);
    			append_dev(span0, t8);
    			append_dev(span0, t9);
    			append_dev(div5, t10);
    			append_dev(div5, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t11);
    			append_dev(div3, span1);
    			append_dev(span1, t12);
    			append_dev(span1, t13);
    			append_dev(span1, t14);
    			append_dev(span1, t15);
    			append_dev(div5, t16);
    			append_dev(div5, div4);
    			mount_component(button, div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[10], false, false, false),
    					listen_dev(
    						div3,
    						"click",
    						function () {
    							if (is_function(/*voteHandeller*/ ctx[6]("2", /*poll*/ ctx[0].id))) /*voteHandeller*/ ctx[6]("2", /*poll*/ ctx[0].id).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*poll*/ 1) && t0_value !== (t0_value = /*poll*/ ctx[0].question + "")) set_data_dev(t0, t0_value);
    			if (!current || dirty & /*totalVote*/ 2) set_data_dev(t3, /*totalVote*/ ctx[1]);

    			if (!current || dirty & /*$value1*/ 4) {
    				set_style(div0, "width", /*$value1*/ ctx[2] + "%");
    			}

    			if ((!current || dirty & /*poll*/ 1) && t6_value !== (t6_value = /*poll*/ ctx[0].answer1 + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*poll*/ 1) && t8_value !== (t8_value = /*poll*/ ctx[0].vote1 + "")) set_data_dev(t8, t8_value);

    			if (!current || dirty & /*$value2*/ 8) {
    				set_style(div2, "width", /*$value2*/ ctx[3] + "%");
    			}

    			if ((!current || dirty & /*poll*/ 1) && t12_value !== (t12_value = /*poll*/ ctx[0].answer2 + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*poll*/ 1) && t14_value !== (t14_value = /*poll*/ ctx[0].vote2 + "")) set_data_dev(t14, t14_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 4096) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(38:0) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, poll, $value2, $value1, totalVote*/ 4111) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let totalVote;
    	let percent1;
    	let percent2;
    	let $value1;
    	let $value2;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PollDetails', slots, []);
    	let { poll } = $$props;
    	let value1 = tweened(0);
    	validate_store(value1, 'value1');
    	component_subscribe($$self, value1, value => $$invalidate(2, $value1 = value));
    	let value2 = tweened(0);
    	validate_store(value2, 'value2');
    	component_subscribe($$self, value2, value => $$invalidate(3, $value2 = value));

    	const voteHandeller = (option, id) => {
    		PollStore.update(currentData => {
    			let copiedPolls = [...currentData];
    			let updatablePoll = copiedPolls.find(poll => poll.id == id);

    			if (option == "1") {
    				updatablePoll.vote1++;
    			} else {
    				updatablePoll.vote2++;
    			}

    			return copiedPolls;
    		});
    	};

    	const deleteHandeller = id => {
    		PollStore.update(currentData => {
    			currentData = currentData.filter(node => node.id != id);
    			return currentData;
    		});
    	};

    	const writable_props = ['poll'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PollDetails> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => voteHandeller("1", poll.id);
    	const click_handler_1 = () => deleteHandeller(poll.id);

    	$$self.$$set = $$props => {
    		if ('poll' in $$props) $$invalidate(0, poll = $$props.poll);
    	};

    	$$self.$capture_state = () => ({
    		Card,
    		PollStore,
    		Button,
    		fade,
    		slide,
    		scale,
    		tweened,
    		poll,
    		value1,
    		value2,
    		voteHandeller,
    		deleteHandeller,
    		percent2,
    		percent1,
    		totalVote,
    		$value1,
    		$value2
    	});

    	$$self.$inject_state = $$props => {
    		if ('poll' in $$props) $$invalidate(0, poll = $$props.poll);
    		if ('value1' in $$props) $$invalidate(4, value1 = $$props.value1);
    		if ('value2' in $$props) $$invalidate(5, value2 = $$props.value2);
    		if ('percent2' in $$props) $$invalidate(8, percent2 = $$props.percent2);
    		if ('percent1' in $$props) $$invalidate(9, percent1 = $$props.percent1);
    		if ('totalVote' in $$props) $$invalidate(1, totalVote = $$props.totalVote);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*poll*/ 1) {
    			$$invalidate(1, totalVote = poll.vote1 + poll.vote2);
    		}

    		if ($$self.$$.dirty & /*poll, totalVote*/ 3) {
    			$$invalidate(9, percent1 = poll.vote1 / totalVote * 100 || 0);
    		}

    		if ($$self.$$.dirty & /*poll, totalVote*/ 3) {
    			$$invalidate(8, percent2 = poll.vote2 / totalVote * 100 || 0);
    		}

    		if ($$self.$$.dirty & /*percent1*/ 512) {
    			value1.set(percent1);
    		}

    		if ($$self.$$.dirty & /*percent2*/ 256) {
    			value2.set(percent2);
    		}
    	};

    	return [
    		poll,
    		totalVote,
    		$value1,
    		$value2,
    		value1,
    		value2,
    		voteHandeller,
    		deleteHandeller,
    		percent2,
    		percent1,
    		click_handler,
    		click_handler_1
    	];
    }

    class PollDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { poll: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PollDetails",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*poll*/ ctx[0] === undefined && !('poll' in props)) {
    			console.warn("<PollDetails> was created without expected prop 'poll'");
    		}
    	}

    	get poll() {
    		throw new Error("<PollDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set poll(value) {
    		throw new Error("<PollDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function flip$2(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* src\pollevent\PollList.svelte generated by Svelte v3.44.3 */
    const file$c = "src\\pollevent\\PollList.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (9:4) {#each $PollStore as poll (poll.id)}
    function create_each_block$2(key_1, ctx) {
    	let div;
    	let polldetails;
    	let t;
    	let div_intro;
    	let div_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	polldetails = new PollDetails({
    			props: { poll: /*poll*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(polldetails.$$.fragment);
    			t = space();
    			add_location(div, file$c, 9, 4, 297);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(polldetails, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const polldetails_changes = {};
    			if (dirty & /*$PollStore*/ 1) polldetails_changes.poll = /*poll*/ ctx[1];
    			polldetails.$set(polldetails_changes);
    		},
    		r: function measure() {
    			rect = div.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div);
    			stop_animation();
    			add_transform(div, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div, rect, flip$2, { duration: 2000 });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(polldetails.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fly, { y: 200, duration: 2000 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(polldetails.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();

    			if (local) {
    				div_outro = create_out_transition(div, scale, {});
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(polldetails);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(9:4) {#each $PollStore as poll (poll.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$PollStore*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*poll*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "poll-list svelte-1yuzuh4");
    			add_location(div, file$c, 7, 0, 226);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$PollStore*/ 1) {
    				each_value = /*$PollStore*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, fix_and_outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $PollStore;
    	validate_store(PollStore, 'PollStore');
    	component_subscribe($$self, PollStore, $$value => $$invalidate(0, $PollStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PollList', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PollList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		PollDetails,
    		PollStore,
    		fade,
    		slide,
    		scale,
    		fly,
    		flip: flip$2,
    		$PollStore
    	});

    	return [$PollStore];
    }

    class PollList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PollList",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\pollevent\AppPoll.svelte generated by Svelte v3.44.3 */
    const file$b = "src\\pollevent\\AppPoll.svelte";

    // (19:41) 
    function create_if_block_1$1(ctx) {
    	let createpollform;
    	let current;
    	createpollform = new CreatePollForm({ $$inline: true });
    	createpollform.$on("add", /*handleAdd*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(createpollform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(createpollform, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(createpollform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(createpollform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(createpollform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(19:41) ",
    		ctx
    	});

    	return block;
    }

    // (17:2) {#if activeItem=="Current Polls"}
    function create_if_block$3(ctx) {
    	let polllist;
    	let current;
    	polllist = new PollList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(polllist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(polllist, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(polllist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(polllist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(polllist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(17:2) {#if activeItem==\\\"Current Polls\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let header;
    	let t0;
    	let main;
    	let tabs;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });

    	tabs = new Tabs({
    			props: {
    				items: /*items*/ ctx[1],
    				activeItem: /*activeItem*/ ctx[0]
    			},
    			$$inline: true
    		});

    	tabs.$on("tabChange", /*tabChange_handler*/ ctx[3]);
    	const if_block_creators = [create_if_block$3, create_if_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*activeItem*/ ctx[0] == "Current Polls") return 0;
    		if (/*activeItem*/ ctx[0] == "Add a new poll") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(tabs.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(main, "class", "svelte-wab5tg");
    			add_location(main, file$b, 14, 0, 419);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(tabs, main, null);
    			append_dev(main, t1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			insert_dev(target, t2, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tabs_changes = {};
    			if (dirty & /*activeItem*/ 1) tabs_changes.activeItem = /*activeItem*/ ctx[0];
    			tabs.$set(tabs_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
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
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(tabs.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(tabs.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(tabs);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching) detach_dev(t2);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AppPoll', slots, []);
    	let items = ["Current Polls", "Add a new poll"];
    	let activeItem = "Current Polls";

    	const handleAdd = () => {
    		$$invalidate(0, activeItem = "Current Polls");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AppPoll> was created with unknown prop '${key}'`);
    	});

    	const tabChange_handler = e => {
    		$$invalidate(0, activeItem = e.detail);
    	};

    	$$self.$capture_state = () => ({
    		Header,
    		Footer,
    		Tabs,
    		CreatePollForm,
    		PollList,
    		onMount,
    		items,
    		activeItem,
    		handleAdd
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('activeItem' in $$props) $$invalidate(0, activeItem = $$props.activeItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeItem, items, handleAdd, tabChange_handler];
    }

    class AppPoll extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AppPoll",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\QuoteGenerator.svelte generated by Svelte v3.44.3 */

    const { console: console_1$4 } = globals;
    const file$a = "src\\components\\QuoteGenerator.svelte";

    function create_fragment$a(ctx) {
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
    			attr_dev(h5, "class", "card-title transition text-center svelte-1xrmoqj");
    			set_style(h5, "color", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(h5, file$a, 33, 6, 1187);
    			attr_dev(p0, "class", "card-text float-end");
    			set_style(p0, "color", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(p0, file$a, 34, 6, 1292);
    			attr_dev(div0, "class", "card-body transition svelte-1xrmoqj");
    			add_location(div0, file$a, 32, 4, 1145);
    			attr_dev(i0, "class", "bi bi-twitter p-2 rounded transition svelte-1xrmoqj");
    			set_style(i0, "cursor", "pointer");
    			set_style(i0, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(i0, file$a, 38, 6, 1509);
    			attr_dev(i1, "class", "bi bi-whatsapp p-2 rounded transition svelte-1xrmoqj");
    			set_style(i1, "cursor", "pointer");
    			set_style(i1, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(i1, file$a, 39, 6, 1627);
    			attr_dev(div1, "class", "float-start mt-2 te");
    			add_location(div1, file$a, 37, 6, 1467);
    			attr_dev(p1, "class", "rounded p-2 transition svelte-1xrmoqj");
    			set_style(p1, "cursor", "pointer");
    			set_style(p1, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(p1, file$a, 43, 8, 1843);
    			attr_dev(div2, "class", "float-end");
    			add_location(div2, file$a, 42, 6, 1810);
    			attr_dev(div3, "class", "card-footer text-white mt-2 border-top-0 bg-transparent");
    			add_location(div3, file$a, 36, 4, 1390);
    			attr_dev(div4, "class", "card transition border-success py-4 px-2 mb-3 svelte-1xrmoqj");
    			add_location(div4, file$a, 31, 2, 1080);
    			attr_dev(div5, "class", "container mother transition d-flex justify-content-center svelte-1xrmoqj");
    			set_style(div5, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(div5, file$a, 30, 0, 964);
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
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<QuoteGenerator> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuoteGenerator",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\elements\Toggle.svelte generated by Svelte v3.44.3 */

    const file$9 = "src\\elements\\Toggle.svelte";

    function create_fragment$9(ctx) {
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
    			add_location(input, file$9, 8, 4, 217);
    			attr_dev(p0, "class", "svelte-kbm3bv");
    			add_location(p0, file$9, 11, 32, 419);
    			attr_dev(div0, "class", "on col");
    			add_location(div0, file$9, 11, 12, 399);
    			attr_dev(p1, "class", "svelte-kbm3bv");
    			add_location(p1, file$9, 12, 33, 476);
    			attr_dev(div1, "class", "off col");
    			add_location(div1, file$9, 12, 12, 455);
    			attr_dev(div2, "class", "row g-0 h-100 mw-50 text-center");
    			add_location(div2, file$9, 10, 8, 340);
    			attr_dev(div3, "class", "toggle__fill  svelte-kbm3bv");
    			add_location(div3, file$9, 9, 4, 303);
    			attr_dev(label, "class", "toggle svelte-kbm3bv");
    			attr_dev(label, "for", "mytoggle");
    			set_style(label, "--width", /*width*/ ctx[3]);
    			add_location(label, file$9, 7, 0, 149);
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
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toggle', slots, []);
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

    	$$self.$capture_state = () => ({ onText, offText, width, value });

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

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			onText: 1,
    			offText: 2,
    			width: 3,
    			value: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toggle",
    			options,
    			id: create_fragment$9.name
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

    const file$8 = "src\\components\\Circle.svelte";

    function create_fragment$8(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let div5;
    	let div3;
    	let t1;
    	let div4;
    	let t2;
    	let div8;
    	let div7;
    	let div6;
    	let t3;
    	let div11;
    	let div9;
    	let t4;
    	let div10;
    	let t5;
    	let div14;
    	let div13;
    	let div12;
    	let t6;
    	let div17;
    	let div15;
    	let t7;
    	let div16;
    	let t8;
    	let div20;
    	let div19;
    	let div18;
    	let t9;
    	let div23;
    	let div21;
    	let t10;
    	let div22;
    	let t11;
    	let div26;
    	let div25;
    	let div24;
    	let t12;
    	let div29;
    	let div27;
    	let t13;
    	let div28;
    	let t14;
    	let div32;
    	let div31;
    	let div30;
    	let t15;
    	let div35;
    	let div33;
    	let t16;
    	let div34;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div5 = element("div");
    			div3 = element("div");
    			t1 = space();
    			div4 = element("div");
    			t2 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			t3 = space();
    			div11 = element("div");
    			div9 = element("div");
    			t4 = space();
    			div10 = element("div");
    			t5 = space();
    			div14 = element("div");
    			div13 = element("div");
    			div12 = element("div");
    			t6 = space();
    			div17 = element("div");
    			div15 = element("div");
    			t7 = space();
    			div16 = element("div");
    			t8 = space();
    			div20 = element("div");
    			div19 = element("div");
    			div18 = element("div");
    			t9 = space();
    			div23 = element("div");
    			div21 = element("div");
    			t10 = space();
    			div22 = element("div");
    			t11 = space();
    			div26 = element("div");
    			div25 = element("div");
    			div24 = element("div");
    			t12 = space();
    			div29 = element("div");
    			div27 = element("div");
    			t13 = space();
    			div28 = element("div");
    			t14 = space();
    			div32 = element("div");
    			div31 = element("div");
    			div30 = element("div");
    			t15 = space();
    			div35 = element("div");
    			div33 = element("div");
    			t16 = space();
    			div34 = element("div");
    			attr_dev(div0, "class", "circle2 svelte-g5ikdr");
    			add_location(div0, file$8, 2, 8, 59);
    			attr_dev(div1, "class", "circle svelte-g5ikdr");
    			add_location(div1, file$8, 1, 4, 29);
    			attr_dev(div2, "class", "circlediv");
    			add_location(div2, file$8, 0, 0, 0);
    			attr_dev(div3, "class", "div2 svelte-g5ikdr");
    			attr_dev(div3, "style", "");
    			add_location(div3, file$8, 7, 2, 149);
    			attr_dev(div4, "class", "div3 svelte-g5ikdr");
    			attr_dev(div4, "style", "");
    			add_location(div4, file$8, 8, 2, 186);
    			attr_dev(div5, "class", "div1 svelte-g5ikdr");
    			attr_dev(div5, "style", "");
    			add_location(div5, file$8, 6, 0, 118);
    			attr_dev(div6, "class", "circle2 svelte-g5ikdr");
    			add_location(div6, file$8, 12, 8, 288);
    			attr_dev(div7, "class", "circle svelte-g5ikdr");
    			add_location(div7, file$8, 11, 4, 258);
    			attr_dev(div8, "class", "circlediv");
    			add_location(div8, file$8, 10, 0, 229);
    			attr_dev(div9, "class", "div2 svelte-g5ikdr");
    			attr_dev(div9, "style", "");
    			add_location(div9, file$8, 17, 2, 378);
    			attr_dev(div10, "class", "div3 svelte-g5ikdr");
    			attr_dev(div10, "style", "");
    			add_location(div10, file$8, 18, 2, 415);
    			attr_dev(div11, "class", "div1 svelte-g5ikdr");
    			attr_dev(div11, "style", "");
    			add_location(div11, file$8, 16, 0, 347);
    			attr_dev(div12, "class", "circle2 svelte-g5ikdr");
    			add_location(div12, file$8, 22, 8, 517);
    			attr_dev(div13, "class", "circle svelte-g5ikdr");
    			add_location(div13, file$8, 21, 4, 487);
    			attr_dev(div14, "class", "circlediv");
    			add_location(div14, file$8, 20, 0, 458);
    			attr_dev(div15, "class", "div2 svelte-g5ikdr");
    			attr_dev(div15, "style", "");
    			add_location(div15, file$8, 27, 2, 607);
    			attr_dev(div16, "class", "div3 svelte-g5ikdr");
    			attr_dev(div16, "style", "");
    			add_location(div16, file$8, 28, 2, 644);
    			attr_dev(div17, "class", "div1 svelte-g5ikdr");
    			attr_dev(div17, "style", "");
    			add_location(div17, file$8, 26, 0, 576);
    			attr_dev(div18, "class", "circle2 svelte-g5ikdr");
    			add_location(div18, file$8, 32, 8, 746);
    			attr_dev(div19, "class", "circle svelte-g5ikdr");
    			add_location(div19, file$8, 31, 4, 716);
    			attr_dev(div20, "class", "circlediv");
    			add_location(div20, file$8, 30, 0, 687);
    			attr_dev(div21, "class", "div2 svelte-g5ikdr");
    			attr_dev(div21, "style", "");
    			add_location(div21, file$8, 37, 2, 836);
    			attr_dev(div22, "class", "div3 svelte-g5ikdr");
    			attr_dev(div22, "style", "");
    			add_location(div22, file$8, 38, 2, 873);
    			attr_dev(div23, "class", "div1 svelte-g5ikdr");
    			attr_dev(div23, "style", "");
    			add_location(div23, file$8, 36, 0, 805);
    			attr_dev(div24, "class", "circle2 svelte-g5ikdr");
    			add_location(div24, file$8, 42, 8, 975);
    			attr_dev(div25, "class", "circle svelte-g5ikdr");
    			add_location(div25, file$8, 41, 4, 945);
    			attr_dev(div26, "class", "circlediv");
    			add_location(div26, file$8, 40, 0, 916);
    			attr_dev(div27, "class", "div2 svelte-g5ikdr");
    			attr_dev(div27, "style", "");
    			add_location(div27, file$8, 47, 2, 1065);
    			attr_dev(div28, "class", "div3 svelte-g5ikdr");
    			attr_dev(div28, "style", "");
    			add_location(div28, file$8, 48, 2, 1102);
    			attr_dev(div29, "class", "div1 svelte-g5ikdr");
    			attr_dev(div29, "style", "");
    			add_location(div29, file$8, 46, 0, 1034);
    			attr_dev(div30, "class", "circle2 svelte-g5ikdr");
    			add_location(div30, file$8, 52, 8, 1204);
    			attr_dev(div31, "class", "circle svelte-g5ikdr");
    			add_location(div31, file$8, 51, 4, 1174);
    			attr_dev(div32, "class", "circlediv");
    			add_location(div32, file$8, 50, 0, 1145);
    			attr_dev(div33, "class", "div2 svelte-g5ikdr");
    			attr_dev(div33, "style", "");
    			add_location(div33, file$8, 57, 2, 1294);
    			attr_dev(div34, "class", "div3 svelte-g5ikdr");
    			attr_dev(div34, "style", "");
    			add_location(div34, file$8, 58, 2, 1331);
    			attr_dev(div35, "class", "div1 svelte-g5ikdr");
    			attr_dev(div35, "style", "");
    			add_location(div35, file$8, 56, 0, 1263);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div9);
    			append_dev(div11, t4);
    			append_dev(div11, div10);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div14, anchor);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div17, anchor);
    			append_dev(div17, div15);
    			append_dev(div17, t7);
    			append_dev(div17, div16);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div20, anchor);
    			append_dev(div20, div19);
    			append_dev(div19, div18);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div23, anchor);
    			append_dev(div23, div21);
    			append_dev(div23, t10);
    			append_dev(div23, div22);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div26, anchor);
    			append_dev(div26, div25);
    			append_dev(div25, div24);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, div29, anchor);
    			append_dev(div29, div27);
    			append_dev(div29, t13);
    			append_dev(div29, div28);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, div32, anchor);
    			append_dev(div32, div31);
    			append_dev(div31, div30);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div35, anchor);
    			append_dev(div35, div33);
    			append_dev(div35, t16);
    			append_dev(div35, div34);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div8);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div11);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div14);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div17);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div20);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div23);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div26);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div29);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(div32);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div35);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Circle",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\Calculator.svelte generated by Svelte v3.44.3 */

    const file$7 = "src\\components\\Calculator.svelte";

    function create_fragment$7(ctx) {
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
    			add_location(span0, file$7, 26, 10, 640);
    			attr_dev(div0, "class", "col-md-2");
    			add_location(div0, file$7, 25, 8, 606);
    			attr_dev(p, "class", "svelte-17go6fw");
    			add_location(p, file$7, 29, 10, 761);
    			attr_dev(div1, "class", "col-md-8");
    			add_location(div1, file$7, 28, 8, 727);
    			attr_dev(span1, "class", "glyphicon glyphicon glyphicon-cog svelte-17go6fw");
    			add_location(span1, file$7, 32, 10, 838);
    			attr_dev(div2, "class", "col-md-2");
    			add_location(div2, file$7, 31, 8, 804);
    			attr_dev(div3, "class", "row header svelte-17go6fw");
    			add_location(div3, file$7, 24, 6, 572);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "");
    			attr_dev(input0, "class", "svelte-17go6fw");
    			add_location(input0, file$7, 40, 10, 1109);
    			attr_dev(div4, "class", "col-md-12 padding-reset svelte-17go6fw");
    			add_location(div4, file$7, 39, 8, 1060);
    			attr_dev(div5, "class", "row teaxtbox svelte-17go6fw");
    			add_location(div5, file$7, 38, 6, 1024);
    			attr_dev(input1, "type", "submit");
    			attr_dev(input1, "name", "");
    			input1.value = "√";
    			attr_dev(input1, "class", " svelte-17go6fw");
    			add_location(input1, file$7, 49, 10, 1369);
    			attr_dev(div6, "class", "col-3");
    			add_location(div6, file$7, 48, 8, 1338);
    			attr_dev(input2, "type", "submit");
    			attr_dev(input2, "name", "");
    			input2.value = "(";
    			attr_dev(input2, "class", " svelte-17go6fw");
    			add_location(input2, file$7, 52, 10, 1482);
    			attr_dev(div7, "class", "col-3");
    			add_location(div7, file$7, 51, 8, 1451);
    			attr_dev(input3, "type", "submit");
    			attr_dev(input3, "name", "");
    			input3.value = ")";
    			attr_dev(input3, "class", " svelte-17go6fw");
    			add_location(input3, file$7, 55, 10, 1589);
    			attr_dev(div8, "class", "col-3");
    			add_location(div8, file$7, 54, 8, 1558);
    			attr_dev(input4, "type", "submit");
    			attr_dev(input4, "name", "");
    			input4.value = "%";
    			attr_dev(input4, "class", " svelte-17go6fw");
    			add_location(input4, file$7, 58, 10, 1696);
    			attr_dev(div9, "class", "col-3");
    			add_location(div9, file$7, 57, 8, 1665);
    			attr_dev(input5, "type", "submit");
    			attr_dev(input5, "name", "");
    			attr_dev(input5, "class", "svelte-17go6fw");
    			add_location(input5, file$7, 62, 10, 1832);
    			attr_dev(div10, "class", "col-3");
    			add_location(div10, file$7, 61, 8, 1801);
    			attr_dev(input6, "type", "submit");
    			attr_dev(input6, "name", "");
    			attr_dev(input6, "class", "svelte-17go6fw");
    			add_location(input6, file$7, 65, 10, 1966);
    			attr_dev(div11, "class", "col-3");
    			add_location(div11, file$7, 64, 8, 1935);
    			attr_dev(input7, "type", "submit");
    			attr_dev(input7, "name", "");
    			attr_dev(input7, "class", "svelte-17go6fw");
    			add_location(input7, file$7, 68, 10, 2099);
    			attr_dev(div12, "class", "col-3");
    			add_location(div12, file$7, 67, 8, 2068);
    			attr_dev(input8, "type", "submit");
    			attr_dev(input8, "name", "");
    			attr_dev(input8, "class", " svelte-17go6fw");
    			add_location(input8, file$7, 71, 10, 2232);
    			attr_dev(div13, "class", "col-3");
    			add_location(div13, file$7, 70, 8, 2201);
    			attr_dev(input9, "type", "submit");
    			attr_dev(input9, "name", "");
    			input9.value = "4";
    			attr_dev(input9, "class", " svelte-17go6fw");
    			add_location(input9, file$7, 75, 10, 2407);
    			attr_dev(div14, "class", "col-3");
    			add_location(div14, file$7, 74, 8, 2376);
    			attr_dev(input10, "type", "submit");
    			attr_dev(input10, "name", "");
    			input10.value = "5";
    			attr_dev(input10, "class", " svelte-17go6fw");
    			add_location(input10, file$7, 78, 10, 2542);
    			attr_dev(div15, "class", "col-3");
    			add_location(div15, file$7, 77, 8, 2511);
    			attr_dev(input11, "type", "submit");
    			attr_dev(input11, "name", "");
    			input11.value = "6";
    			attr_dev(input11, "class", " svelte-17go6fw");
    			add_location(input11, file$7, 81, 10, 2676);
    			attr_dev(div16, "class", "col-3");
    			add_location(div16, file$7, 80, 8, 2645);
    			attr_dev(input12, "type", "submit");
    			attr_dev(input12, "name", "");
    			input12.value = "X";
    			attr_dev(input12, "class", " svelte-17go6fw");
    			add_location(input12, file$7, 84, 10, 2810);
    			attr_dev(div17, "class", "col-3");
    			add_location(div17, file$7, 83, 8, 2779);
    			attr_dev(input13, "type", "submit");
    			attr_dev(input13, "name", "");
    			input13.value = "1";
    			attr_dev(input13, "class", " svelte-17go6fw");
    			add_location(input13, file$7, 88, 10, 2973);
    			attr_dev(div18, "class", "col-3");
    			add_location(div18, file$7, 87, 8, 2942);
    			attr_dev(input14, "type", "submit");
    			attr_dev(input14, "name", "");
    			input14.value = "2";
    			attr_dev(input14, "class", " svelte-17go6fw");
    			add_location(input14, file$7, 91, 10, 3107);
    			attr_dev(div19, "class", "col-3");
    			add_location(div19, file$7, 90, 8, 3076);
    			attr_dev(input15, "type", "submit");
    			attr_dev(input15, "name", "");
    			input15.value = "3";
    			attr_dev(input15, "class", " svelte-17go6fw");
    			add_location(input15, file$7, 94, 10, 3241);
    			attr_dev(div20, "class", "col-3");
    			add_location(div20, file$7, 93, 8, 3210);
    			attr_dev(input16, "type", "submit");
    			attr_dev(input16, "name", "");
    			input16.value = "-";
    			attr_dev(input16, "class", " svelte-17go6fw");
    			add_location(input16, file$7, 97, 10, 3375);
    			attr_dev(div21, "class", "col-3");
    			add_location(div21, file$7, 96, 8, 3344);
    			attr_dev(div22, "class", "row commonbutton svelte-17go6fw");
    			add_location(div22, file$7, 46, 6, 1270);
    			attr_dev(input17, "type", "submit");
    			attr_dev(input17, "name", "");
    			input17.value = "0";
    			attr_dev(input17, "class", " svelte-17go6fw");
    			add_location(input17, file$7, 107, 14, 3727);
    			attr_dev(div23, "class", "col-md-8");
    			add_location(div23, file$7, 106, 12, 3689);
    			attr_dev(input18, "type", "submit");
    			attr_dev(input18, "name", "");
    			input18.value = ".";
    			attr_dev(input18, "class", " svelte-17go6fw");
    			add_location(input18, file$7, 110, 14, 3849);
    			attr_dev(div24, "class", "col-md-4");
    			add_location(div24, file$7, 109, 12, 3811);
    			attr_dev(input19, "type", "submit");
    			attr_dev(input19, "name", "");
    			input19.value = "Del";
    			attr_dev(input19, "id", "del");
    			attr_dev(input19, "class", "svelte-17go6fw");
    			add_location(input19, file$7, 113, 14, 3971);
    			attr_dev(div25, "class", "col-md-4");
    			add_location(div25, file$7, 112, 12, 3933);
    			attr_dev(input20, "type", "submit");
    			attr_dev(input20, "name", "");
    			input20.value = "=";
    			attr_dev(input20, "id", "equal");
    			attr_dev(input20, "class", "svelte-17go6fw");
    			add_location(input20, file$7, 116, 14, 4095);
    			attr_dev(div26, "class", "col-md-8");
    			add_location(div26, file$7, 115, 12, 4057);
    			attr_dev(div27, "class", "row");
    			add_location(div27, file$7, 105, 10, 3658);
    			attr_dev(div28, "class", "col-md-9");
    			add_location(div28, file$7, 104, 8, 3624);
    			attr_dev(input21, "type", "submit");
    			attr_dev(input21, "name", "");
    			input21.value = "+";
    			attr_dev(input21, "id", "plus");
    			attr_dev(input21, "class", "svelte-17go6fw");
    			add_location(input21, file$7, 122, 10, 4302);
    			attr_dev(div29, "class", "col-md-3");
    			add_location(div29, file$7, 121, 8, 4268);
    			attr_dev(div30, "class", "row conflict svelte-17go6fw");
    			add_location(div30, file$7, 103, 6, 3588);
    			attr_dev(div31, "class", "col-md-4 col-md-offset-4");
    			add_location(div31, file$7, 22, 4, 486);
    			attr_dev(div32, "class", "row g-0 justify-content-center");
    			add_location(div32, file$7, 21, 2, 436);
    			attr_dev(div33, "class", "container-fluid");
    			add_location(div33, file$7, 20, 0, 403);
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
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calculator",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\ActionTest.svelte generated by Svelte v3.44.3 */

    const { console: console_1$3 } = globals;
    const file$6 = "src\\components\\ActionTest.svelte";

    // (15:0) {#if show}
    function create_if_block$2(ctx) {
    	let h1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "hello";
    			add_location(h1, file$6, 15, 0, 298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);

    			if (!mounted) {
    				dispose = action_destroyer(/*test*/ ctx[1].call(null, h1, "hi"));
    				mounted = true;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(15:0) {#if show}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let input;
    	let t;
    	let if_block_anchor;
    	let mounted;
    	let dispose;
    	let if_block = /*show*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			input = element("input");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(input, "type", "checkbox");
    			add_location(input, file$6, 12, 0, 238);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = /*show*/ ctx[0];
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*show*/ 1) {
    				input.checked = /*show*/ ctx[0];
    			}

    			if (/*show*/ ctx[0]) {
    				if (if_block) ; else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	validate_slots('ActionTest', slots, []);
    	let show = false;

    	const test = (node, params) => {
    		console.log(node, params);

    		return {
    			destroy() {
    				console.log("node destroyed");
    			}
    		};
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<ActionTest> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		show = this.checked;
    		$$invalidate(0, show);
    	}

    	$$self.$capture_state = () => ({ show, test });

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [show, test, input_change_handler];
    }

    class ActionTest extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ActionTest",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

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

    /*!
     * 
     * litepicker.umd.js
     * Litepicker v2.0.12 (https://github.com/wakirin/Litepicker)
     * Package: litepicker (https://www.npmjs.com/package/litepicker)
     * License: MIT (https://github.com/wakirin/Litepicker/blob/master/LICENCE.md)
     * Copyright 2019-2021 Rinat G.
     *     
     * Hash: 504eef9c08cb42543660
     * 
     */

    var litepicker_umd = createCommonjsModule(function (module, exports) {
    !function(t,e){module.exports=e();}(window,(function(){return function(t){var e={};function i(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}return i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n});},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0});},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=4)}([function(t,e,i){Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(e,i,n){void 0===e&&(e=null),void 0===i&&(i=null),void 0===n&&(n="en-US"),this.dateInstance="object"==typeof i&&null!==i?i.parse(e instanceof t?e.clone().toJSDate():e):"string"==typeof i?t.parseDateTime(e,i,n):e?t.parseDateTime(e):t.parseDateTime(new Date),this.lang=n;}return t.parseDateTime=function(e,i,n){if(void 0===i&&(i="YYYY-MM-DD"),void 0===n&&(n="en-US"),!e)return new Date(NaN);if(e instanceof Date)return new Date(e);if(e instanceof t)return e.clone().toJSDate();if(/^-?\d{10,}$/.test(e))return t.getDateZeroTime(new Date(Number(e)));if("string"==typeof e){for(var o=[],s=null;null!=(s=t.regex.exec(i));)"\\"!==s[1]&&o.push(s);if(o.length){var r={year:null,month:null,shortMonth:null,longMonth:null,day:null,value:""};o[0].index>0&&(r.value+=".*?");for(var a=0,l=Object.entries(o);a<l.length;a++){var c=l[a],h=c[0],p=c[1],d=Number(h),u=t.formatPatterns(p[0],n),m=u.group,f=u.pattern;r[m]=d+1,r.value+=f,r.value+=".*?";}var g=new RegExp("^"+r.value+"$");if(g.test(e)){var v=g.exec(e),y=Number(v[r.year]),b=null;r.month?b=Number(v[r.month])-1:r.shortMonth?b=t.shortMonths(n).indexOf(v[r.shortMonth]):r.longMonth&&(b=t.longMonths(n).indexOf(v[r.longMonth]));var k=Number(v[r.day])||1;return new Date(y,b,k,0,0,0,0)}}}return t.getDateZeroTime(new Date(e))},t.convertArray=function(e,i){return e.map((function(e){return e instanceof Array?e.map((function(e){return new t(e,i)})):new t(e,i)}))},t.getDateZeroTime=function(t){return new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,0,0,0)},t.shortMonths=function(e){return t.MONTH_JS.map((function(t){return new Date(2019,t).toLocaleString(e,{month:"short"})}))},t.longMonths=function(e){return t.MONTH_JS.map((function(t){return new Date(2019,t).toLocaleString(e,{month:"long"})}))},t.formatPatterns=function(e,i){switch(e){case"YY":case"YYYY":return {group:"year",pattern:"(\\d{"+e.length+"})"};case"M":return {group:"month",pattern:"(\\d{1,2})"};case"MM":return {group:"month",pattern:"(\\d{2})"};case"MMM":return {group:"shortMonth",pattern:"("+t.shortMonths(i).join("|")+")"};case"MMMM":return {group:"longMonth",pattern:"("+t.longMonths(i).join("|")+")"};case"D":return {group:"day",pattern:"(\\d{1,2})"};case"DD":return {group:"day",pattern:"(\\d{2})"}}},t.prototype.toJSDate=function(){return this.dateInstance},t.prototype.toLocaleString=function(t,e){return this.dateInstance.toLocaleString(t,e)},t.prototype.toDateString=function(){return this.dateInstance.toDateString()},t.prototype.getSeconds=function(){return this.dateInstance.getSeconds()},t.prototype.getDay=function(){return this.dateInstance.getDay()},t.prototype.getTime=function(){return this.dateInstance.getTime()},t.prototype.getDate=function(){return this.dateInstance.getDate()},t.prototype.getMonth=function(){return this.dateInstance.getMonth()},t.prototype.getFullYear=function(){return this.dateInstance.getFullYear()},t.prototype.setMonth=function(t){return this.dateInstance.setMonth(t)},t.prototype.setHours=function(t,e,i,n){void 0===t&&(t=0),void 0===e&&(e=0),void 0===i&&(i=0),void 0===n&&(n=0),this.dateInstance.setHours(t,e,i,n);},t.prototype.setSeconds=function(t){return this.dateInstance.setSeconds(t)},t.prototype.setDate=function(t){return this.dateInstance.setDate(t)},t.prototype.setFullYear=function(t){return this.dateInstance.setFullYear(t)},t.prototype.getWeek=function(t){var e=new Date(this.timestamp()),i=(this.getDay()+(7-t))%7;e.setDate(e.getDate()-i);var n=e.getTime();return e.setMonth(0,1),e.getDay()!==t&&e.setMonth(0,1+(4-e.getDay()+7)%7),1+Math.ceil((n-e.getTime())/6048e5)},t.prototype.clone=function(){return new t(this.toJSDate())},t.prototype.isBetween=function(t,e,i){switch(void 0===i&&(i="()"),i){default:case"()":return this.timestamp()>t.getTime()&&this.timestamp()<e.getTime();case"[)":return this.timestamp()>=t.getTime()&&this.timestamp()<e.getTime();case"(]":return this.timestamp()>t.getTime()&&this.timestamp()<=e.getTime();case"[]":return this.timestamp()>=t.getTime()&&this.timestamp()<=e.getTime()}},t.prototype.isBefore=function(t,e){switch(void 0===e&&(e="seconds"),e){case"second":case"seconds":return t.getTime()>this.getTime();case"day":case"days":return new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()>new Date(this.getFullYear(),this.getMonth(),this.getDate()).getTime();case"month":case"months":return new Date(t.getFullYear(),t.getMonth(),1).getTime()>new Date(this.getFullYear(),this.getMonth(),1).getTime();case"year":case"years":return t.getFullYear()>this.getFullYear()}throw new Error("isBefore: Invalid unit!")},t.prototype.isSameOrBefore=function(t,e){switch(void 0===e&&(e="seconds"),e){case"second":case"seconds":return t.getTime()>=this.getTime();case"day":case"days":return new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()>=new Date(this.getFullYear(),this.getMonth(),this.getDate()).getTime();case"month":case"months":return new Date(t.getFullYear(),t.getMonth(),1).getTime()>=new Date(this.getFullYear(),this.getMonth(),1).getTime()}throw new Error("isSameOrBefore: Invalid unit!")},t.prototype.isAfter=function(t,e){switch(void 0===e&&(e="seconds"),e){case"second":case"seconds":return this.getTime()>t.getTime();case"day":case"days":return new Date(this.getFullYear(),this.getMonth(),this.getDate()).getTime()>new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime();case"month":case"months":return new Date(this.getFullYear(),this.getMonth(),1).getTime()>new Date(t.getFullYear(),t.getMonth(),1).getTime();case"year":case"years":return this.getFullYear()>t.getFullYear()}throw new Error("isAfter: Invalid unit!")},t.prototype.isSameOrAfter=function(t,e){switch(void 0===e&&(e="seconds"),e){case"second":case"seconds":return this.getTime()>=t.getTime();case"day":case"days":return new Date(this.getFullYear(),this.getMonth(),this.getDate()).getTime()>=new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime();case"month":case"months":return new Date(this.getFullYear(),this.getMonth(),1).getTime()>=new Date(t.getFullYear(),t.getMonth(),1).getTime()}throw new Error("isSameOrAfter: Invalid unit!")},t.prototype.isSame=function(t,e){switch(void 0===e&&(e="seconds"),e){case"second":case"seconds":return this.getTime()===t.getTime();case"day":case"days":return new Date(this.getFullYear(),this.getMonth(),this.getDate()).getTime()===new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime();case"month":case"months":return new Date(this.getFullYear(),this.getMonth(),1).getTime()===new Date(t.getFullYear(),t.getMonth(),1).getTime()}throw new Error("isSame: Invalid unit!")},t.prototype.add=function(t,e){switch(void 0===e&&(e="seconds"),e){case"second":case"seconds":this.setSeconds(this.getSeconds()+t);break;case"day":case"days":this.setDate(this.getDate()+t);break;case"month":case"months":this.setMonth(this.getMonth()+t);}return this},t.prototype.subtract=function(t,e){switch(void 0===e&&(e="seconds"),e){case"second":case"seconds":this.setSeconds(this.getSeconds()-t);break;case"day":case"days":this.setDate(this.getDate()-t);break;case"month":case"months":this.setMonth(this.getMonth()-t);}return this},t.prototype.diff=function(t,e){void 0===e&&(e="seconds");switch(e){default:case"second":case"seconds":return this.getTime()-t.getTime();case"day":case"days":return Math.round((this.timestamp()-t.getTime())/864e5);case"month":case"months":}},t.prototype.format=function(e,i){if(void 0===i&&(i="en-US"),"object"==typeof e)return e.output(this.clone().toJSDate());for(var n="",o=[],s=null;null!=(s=t.regex.exec(e));)"\\"!==s[1]&&o.push(s);if(o.length){o[0].index>0&&(n+=e.substring(0,o[0].index));for(var r=0,a=Object.entries(o);r<a.length;r++){var l=a[r],c=l[0],h=l[1],p=Number(c);n+=this.formatTokens(h[0],i),o[p+1]&&(n+=e.substring(h.index+h[0].length,o[p+1].index)),p===o.length-1&&(n+=e.substring(h.index+h[0].length));}}return n.replace(/\\/g,"")},t.prototype.timestamp=function(){return new Date(this.getFullYear(),this.getMonth(),this.getDate(),0,0,0,0).getTime()},t.prototype.formatTokens=function(e,i){switch(e){case"YY":return String(this.getFullYear()).slice(-2);case"YYYY":return String(this.getFullYear());case"M":return String(this.getMonth()+1);case"MM":return ("0"+(this.getMonth()+1)).slice(-2);case"MMM":return t.shortMonths(i)[this.getMonth()];case"MMMM":return t.longMonths(i)[this.getMonth()];case"D":return String(this.getDate());case"DD":return ("0"+this.getDate()).slice(-2);default:return ""}},t.regex=/(\\)?(Y{2,4}|M{1,4}|D{1,2}|d{1,4})/g,t.MONTH_JS=[0,1,2,3,4,5,6,7,8,9,10,11],t}();e.DateTime=n;},function(t,e,i){var n,o=this&&this.__extends||(n=function(t,e){return (n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);})(t,e)},function(t,e){function i(){this.constructor=t;}n(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i);}),s=this&&this.__spreadArrays||function(){for(var t=0,e=0,i=arguments.length;e<i;e++)t+=arguments[e].length;var n=Array(t),o=0;for(e=0;e<i;e++)for(var s=arguments[e],r=0,a=s.length;r<a;r++,o++)n[o]=s[r];return n};Object.defineProperty(e,"__esModule",{value:!0});var r=i(5),a=i(0),l=i(3),c=i(2),h=function(t){function e(e){var i=t.call(this,e)||this;return i.preventClick=!1,i.bindEvents(),i}return o(e,t),e.prototype.scrollToDate=function(t){if(this.options.scrollToDate){var e=this.options.startDate instanceof a.DateTime?this.options.startDate.clone():null,i=this.options.endDate instanceof a.DateTime?this.options.endDate.clone():null;!this.options.startDate||t&&t!==this.options.element?t&&this.options.endDate&&t===this.options.elementEnd&&(i.setDate(1),this.options.numberOfMonths>1&&i.isAfter(e)&&i.setMonth(i.getMonth()-(this.options.numberOfMonths-1)),this.calendars[0]=i.clone()):(e.setDate(1),this.calendars[0]=e.clone());}},e.prototype.bindEvents=function(){document.addEventListener("click",this.onClick.bind(this),!0),this.ui=document.createElement("div"),this.ui.className=l.litepicker,this.ui.style.display="none",this.ui.addEventListener("mouseenter",this.onMouseEnter.bind(this),!0),this.ui.addEventListener("mouseleave",this.onMouseLeave.bind(this),!1),this.options.autoRefresh?(this.options.element instanceof HTMLElement&&this.options.element.addEventListener("keyup",this.onInput.bind(this),!0),this.options.elementEnd instanceof HTMLElement&&this.options.elementEnd.addEventListener("keyup",this.onInput.bind(this),!0)):(this.options.element instanceof HTMLElement&&this.options.element.addEventListener("change",this.onInput.bind(this),!0),this.options.elementEnd instanceof HTMLElement&&this.options.elementEnd.addEventListener("change",this.onInput.bind(this),!0)),this.options.parentEl?this.options.parentEl instanceof HTMLElement?this.options.parentEl.appendChild(this.ui):document.querySelector(this.options.parentEl).appendChild(this.ui):this.options.inlineMode?this.options.element instanceof HTMLInputElement?this.options.element.parentNode.appendChild(this.ui):this.options.element.appendChild(this.ui):document.body.appendChild(this.ui),this.updateInput(),this.init(),"function"==typeof this.options.setup&&this.options.setup.call(this,this),this.render(),this.options.inlineMode&&this.show();},e.prototype.updateInput=function(){if(this.options.element instanceof HTMLInputElement){var t=this.options.startDate,e=this.options.endDate;if(this.options.singleMode&&t)this.options.element.value=t.format(this.options.format,this.options.lang);else if(!this.options.singleMode&&t&&e){var i=t.format(this.options.format,this.options.lang),n=e.format(this.options.format,this.options.lang);this.options.elementEnd instanceof HTMLInputElement?(this.options.element.value=i,this.options.elementEnd.value=n):this.options.element.value=""+i+this.options.delimiter+n;}t||e||(this.options.element.value="",this.options.elementEnd instanceof HTMLInputElement&&(this.options.elementEnd.value=""));}},e.prototype.isSamePicker=function(t){return t.closest("."+l.litepicker)===this.ui},e.prototype.shouldShown=function(t){return !t.disabled&&(t===this.options.element||this.options.elementEnd&&t===this.options.elementEnd)},e.prototype.shouldResetDatePicked=function(){return this.options.singleMode||2===this.datePicked.length},e.prototype.shouldSwapDatePicked=function(){return 2===this.datePicked.length&&this.datePicked[0].getTime()>this.datePicked[1].getTime()},e.prototype.shouldCheckLockDays=function(){return this.options.disallowLockDaysInRange&&2===this.datePicked.length},e.prototype.onClick=function(t){var e=t.target;if(t.target.shadowRoot&&(e=t.composedPath()[0]),e&&this.ui)if(this.shouldShown(e))this.show(e);else if(e.closest("."+l.litepicker)||!this.isShowning()){if(this.isSamePicker(e))if(this.emit("before:click",e),this.preventClick)this.preventClick=!1;else {if(e.classList.contains(l.dayItem)){if(t.preventDefault(),e.classList.contains(l.isLocked))return;if(this.shouldResetDatePicked()&&(this.datePicked.length=0),this.datePicked[this.datePicked.length]=new a.DateTime(e.dataset.time),this.shouldSwapDatePicked()){var i=this.datePicked[1].clone();this.datePicked[1]=this.datePicked[0].clone(),this.datePicked[0]=i.clone();}if(this.shouldCheckLockDays())c.rangeIsLocked(this.datePicked,this.options)&&(this.emit("error:range",this.datePicked),this.datePicked.length=0);return this.render(),this.emit.apply(this,s(["preselect"],s(this.datePicked).map((function(t){return t.clone()})))),void(this.options.autoApply&&(this.options.singleMode&&this.datePicked.length?(this.setDate(this.datePicked[0]),this.hide()):this.options.singleMode||2!==this.datePicked.length||(this.setDateRange(this.datePicked[0],this.datePicked[1]),this.hide())))}if(e.classList.contains(l.buttonPreviousMonth)){t.preventDefault();var n=0,o=this.options.switchingMonths||this.options.numberOfMonths;if(this.options.splitView){var r=e.closest("."+l.monthItem);n=c.findNestedMonthItem(r),o=1;}return this.calendars[n].setMonth(this.calendars[n].getMonth()-o),this.gotoDate(this.calendars[n],n),void this.emit("change:month",this.calendars[n],n)}if(e.classList.contains(l.buttonNextMonth)){t.preventDefault();n=0,o=this.options.switchingMonths||this.options.numberOfMonths;if(this.options.splitView){r=e.closest("."+l.monthItem);n=c.findNestedMonthItem(r),o=1;}return this.calendars[n].setMonth(this.calendars[n].getMonth()+o),this.gotoDate(this.calendars[n],n),void this.emit("change:month",this.calendars[n],n)}e.classList.contains(l.buttonCancel)&&(t.preventDefault(),this.hide(),this.emit("button:cancel")),e.classList.contains(l.buttonApply)&&(t.preventDefault(),this.options.singleMode&&this.datePicked.length?this.setDate(this.datePicked[0]):this.options.singleMode||2!==this.datePicked.length||this.setDateRange(this.datePicked[0],this.datePicked[1]),this.hide(),this.emit("button:apply",this.options.startDate,this.options.endDate));}}else this.hide();},e.prototype.showTooltip=function(t,e){var i=this.ui.querySelector("."+l.containerTooltip);i.style.visibility="visible",i.innerHTML=e;var n=this.ui.getBoundingClientRect(),o=i.getBoundingClientRect(),s=t.getBoundingClientRect(),r=s.top,a=s.left;if(this.options.inlineMode&&this.options.parentEl){var c=this.ui.parentNode.getBoundingClientRect();r-=c.top,a-=c.left;}else r-=n.top,a-=n.left;r-=o.height,a-=o.width/2,a+=s.width/2,i.style.top=r+"px",i.style.left=a+"px",this.emit("tooltip",i,t);},e.prototype.hideTooltip=function(){this.ui.querySelector("."+l.containerTooltip).style.visibility="hidden";},e.prototype.shouldAllowMouseEnter=function(t){return !this.options.singleMode&&!t.classList.contains(l.isLocked)},e.prototype.shouldAllowRepick=function(){return this.options.elementEnd&&this.options.allowRepick&&this.options.startDate&&this.options.endDate},e.prototype.isDayItem=function(t){return t.classList.contains(l.dayItem)},e.prototype.onMouseEnter=function(t){var e=this,i=t.target;if(this.isDayItem(i)&&this.shouldAllowMouseEnter(i)){if(this.shouldAllowRepick()&&(this.triggerElement===this.options.element?this.datePicked[0]=this.options.endDate.clone():this.triggerElement===this.options.elementEnd&&(this.datePicked[0]=this.options.startDate.clone())),1!==this.datePicked.length)return;var n=this.ui.querySelector("."+l.dayItem+'[data-time="'+this.datePicked[0].getTime()+'"]'),o=this.datePicked[0].clone(),s=new a.DateTime(i.dataset.time),r=!1;if(o.getTime()>s.getTime()){var c=o.clone();o=s.clone(),s=c.clone(),r=!0;}if(Array.prototype.slice.call(this.ui.querySelectorAll("."+l.dayItem)).forEach((function(t){var i=new a.DateTime(t.dataset.time),n=e.renderDay(i);i.isBetween(o,s)&&n.classList.add(l.isInRange),t.className=n.className;})),i.classList.add(l.isEndDate),r?(n&&n.classList.add(l.isFlipped),i.classList.add(l.isFlipped)):(n&&n.classList.remove(l.isFlipped),i.classList.remove(l.isFlipped)),this.options.showTooltip){var h=s.diff(o,"day")+1;if("function"==typeof this.options.tooltipNumber&&(h=this.options.tooltipNumber.call(this,h)),h>0){var p=this.pluralSelector(h),d=h+" "+(this.options.tooltipText[p]?this.options.tooltipText[p]:"["+p+"]");this.showTooltip(i,d);var u=window.navigator.userAgent,m=/(iphone|ipad)/i.test(u),f=/OS 1([0-2])/i.test(u);m&&f&&i.dispatchEvent(new Event("click"));}else this.hideTooltip();}}},e.prototype.onMouseLeave=function(t){t.target;this.options.allowRepick&&(!this.options.allowRepick||this.options.startDate||this.options.endDate)&&(this.datePicked.length=0,this.render());},e.prototype.onInput=function(t){var e=this.parseInput(),i=e[0],n=e[1],o=this.options.format;if(this.options.elementEnd?i instanceof a.DateTime&&n instanceof a.DateTime&&i.format(o)===this.options.element.value&&n.format(o)===this.options.elementEnd.value:this.options.singleMode?i instanceof a.DateTime&&i.format(o)===this.options.element.value:i instanceof a.DateTime&&n instanceof a.DateTime&&""+i.format(o)+this.options.delimiter+n.format(o)===this.options.element.value){if(n&&i.getTime()>n.getTime()){var s=i.clone();i=n.clone(),n=s.clone();}this.options.startDate=new a.DateTime(i,this.options.format,this.options.lang),n&&(this.options.endDate=new a.DateTime(n,this.options.format,this.options.lang)),this.updateInput(),this.render();var r=i.clone(),l=0;(this.options.elementEnd?i.format(o)===t.target.value:t.target.value.startsWith(i.format(o)))||(r=n.clone(),l=this.options.numberOfMonths-1),this.emit("selected",this.getStartDate(),this.getEndDate()),this.gotoDate(r,l);}},e}(r.Calendar);e.Litepicker=h;},function(t,e,i){Object.defineProperty(e,"__esModule",{value:!0}),e.findNestedMonthItem=function(t){for(var e=t.parentNode.childNodes,i=0;i<e.length;i+=1){if(e.item(i)===t)return i}return 0},e.dateIsLocked=function(t,e,i){var n=!1;return e.lockDays.length&&(n=e.lockDays.filter((function(i){return i instanceof Array?t.isBetween(i[0],i[1],e.lockDaysInclusivity):i.isSame(t,"day")})).length),n||"function"!=typeof e.lockDaysFilter||(n=e.lockDaysFilter.call(this,t.clone(),null,i)),n},e.rangeIsLocked=function(t,e){var i=!1;return e.lockDays.length&&(i=e.lockDays.filter((function(i){if(i instanceof Array){var n=t[0].toDateString()===i[0].toDateString()&&t[1].toDateString()===i[1].toDateString();return i[0].isBetween(t[0],t[1],e.lockDaysInclusivity)||i[1].isBetween(t[0],t[1],e.lockDaysInclusivity)||n}return i.isBetween(t[0],t[1],e.lockDaysInclusivity)})).length),i||"function"!=typeof e.lockDaysFilter||(i=e.lockDaysFilter.call(this,t[0].clone(),t[1].clone(),t)),i};},function(t,e,i){var n=i(8);"string"==typeof n&&(n=[[t.i,n,""]]);var o={insert:function(t){var e=document.querySelector("head"),i=window._lastElementInsertedByStyleLoader;window.disableLitepickerStyles||(i?i.nextSibling?e.insertBefore(t,i.nextSibling):e.appendChild(t):e.insertBefore(t,e.firstChild),window._lastElementInsertedByStyleLoader=t);},singleton:!1};i(10)(n,o);n.locals&&(t.exports=n.locals);},function(t,e,i){Object.defineProperty(e,"__esModule",{value:!0});var n=i(1);e.Litepicker=n.Litepicker,i(11),window.Litepicker=n.Litepicker,e.default=n.Litepicker;},function(t,e,i){var n,o=this&&this.__extends||(n=function(t,e){return (n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);})(t,e)},function(t,e){function i(){this.constructor=t;}n(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i);});Object.defineProperty(e,"__esModule",{value:!0});var s=i(6),r=i(0),a=i(3),l=i(2),c=function(t){function e(e){return t.call(this,e)||this}return o(e,t),e.prototype.render=function(){var t=this;this.emit("before:render",this.ui);var e=document.createElement("div");e.className=a.containerMain;var i=document.createElement("div");i.className=a.containerMonths,a["columns"+this.options.numberOfColumns]&&(i.classList.remove(a.columns2,a.columns3,a.columns4),i.classList.add(a["columns"+this.options.numberOfColumns])),this.options.splitView&&i.classList.add(a.splitView),this.options.showWeekNumbers&&i.classList.add(a.showWeekNumbers);for(var n=this.calendars[0].clone(),o=n.getMonth(),s=n.getMonth()+this.options.numberOfMonths,r=0,l=o;l<s;l+=1){var c=n.clone();c.setDate(1),c.setHours(0,0,0,0),this.options.splitView?c=this.calendars[r].clone():c.setMonth(l),i.appendChild(this.renderMonth(c,r)),r+=1;}if(this.ui.innerHTML="",e.appendChild(i),this.options.resetButton){var h=void 0;"function"==typeof this.options.resetButton?h=this.options.resetButton.call(this):((h=document.createElement("button")).type="button",h.className=a.resetButton,h.innerHTML=this.options.buttonText.reset),h.addEventListener("click",(function(e){e.preventDefault(),t.clearSelection();})),e.querySelector("."+a.monthItem+":last-child").querySelector("."+a.monthItemHeader).appendChild(h);}this.ui.appendChild(e),this.options.autoApply&&!this.options.footerHTML||this.ui.appendChild(this.renderFooter()),this.options.showTooltip&&this.ui.appendChild(this.renderTooltip()),this.ui.dataset.plugins=(this.options.plugins||[]).join("|"),this.emit("render",this.ui);},e.prototype.renderMonth=function(t,e){var i=this,n=t.clone(),o=32-new Date(n.getFullYear(),n.getMonth(),32).getDate(),s=document.createElement("div");s.className=a.monthItem;var c=document.createElement("div");c.className=a.monthItemHeader;var h=document.createElement("div");if(this.options.dropdowns.months){var p=document.createElement("select");p.className=a.monthItemName;for(var d=0;d<12;d+=1){var u=document.createElement("option"),m=new r.DateTime(new Date(t.getFullYear(),d,2,0,0,0)),f=new r.DateTime(new Date(t.getFullYear(),d,1,0,0,0));u.value=String(d),u.text=m.toLocaleString(this.options.lang,{month:"long"}),u.disabled=this.options.minDate&&f.isBefore(new r.DateTime(this.options.minDate),"month")||this.options.maxDate&&f.isAfter(new r.DateTime(this.options.maxDate),"month"),u.selected=f.getMonth()===t.getMonth(),p.appendChild(u);}p.addEventListener("change",(function(t){var e=t.target,n=0;if(i.options.splitView){var o=e.closest("."+a.monthItem);n=l.findNestedMonthItem(o);}i.calendars[n].setMonth(Number(e.value)),i.render(),i.emit("change:month",i.calendars[n],n,t);})),h.appendChild(p);}else {(m=document.createElement("strong")).className=a.monthItemName,m.innerHTML=t.toLocaleString(this.options.lang,{month:"long"}),h.appendChild(m);}if(this.options.dropdowns.years){var g=document.createElement("select");g.className=a.monthItemYear;var v=this.options.dropdowns.minYear,y=this.options.dropdowns.maxYear?this.options.dropdowns.maxYear:(new Date).getFullYear();if(t.getFullYear()>y)(u=document.createElement("option")).value=String(t.getFullYear()),u.text=String(t.getFullYear()),u.selected=!0,u.disabled=!0,g.appendChild(u);for(d=y;d>=v;d-=1){var u=document.createElement("option"),b=new r.DateTime(new Date(d,0,1,0,0,0));u.value=String(d),u.text=String(d),u.disabled=this.options.minDate&&b.isBefore(new r.DateTime(this.options.minDate),"year")||this.options.maxDate&&b.isAfter(new r.DateTime(this.options.maxDate),"year"),u.selected=t.getFullYear()===d,g.appendChild(u);}if(t.getFullYear()<v)(u=document.createElement("option")).value=String(t.getFullYear()),u.text=String(t.getFullYear()),u.selected=!0,u.disabled=!0,g.appendChild(u);if("asc"===this.options.dropdowns.years){var k=Array.prototype.slice.call(g.childNodes).reverse();g.innerHTML="",k.forEach((function(t){t.innerHTML=t.value,g.appendChild(t);}));}g.addEventListener("change",(function(t){var e=t.target,n=0;if(i.options.splitView){var o=e.closest("."+a.monthItem);n=l.findNestedMonthItem(o);}i.calendars[n].setFullYear(Number(e.value)),i.render(),i.emit("change:year",i.calendars[n],n,t);})),h.appendChild(g);}else {var w=document.createElement("span");w.className=a.monthItemYear,w.innerHTML=String(t.getFullYear()),h.appendChild(w);}var D=document.createElement("button");D.type="button",D.className=a.buttonPreviousMonth,D.innerHTML=this.options.buttonText.previousMonth;var x=document.createElement("button");x.type="button",x.className=a.buttonNextMonth,x.innerHTML=this.options.buttonText.nextMonth,c.appendChild(D),c.appendChild(h),c.appendChild(x),this.options.minDate&&n.isSameOrBefore(new r.DateTime(this.options.minDate),"month")&&s.classList.add(a.noPreviousMonth),this.options.maxDate&&n.isSameOrAfter(new r.DateTime(this.options.maxDate),"month")&&s.classList.add(a.noNextMonth);var M=document.createElement("div");M.className=a.monthItemWeekdaysRow,this.options.showWeekNumbers&&(M.innerHTML="<div>W</div>");for(var _=1;_<=7;_+=1){var T=3+this.options.firstDay+_,L=document.createElement("div");L.innerHTML=this.weekdayName(T),L.title=this.weekdayName(T,"long"),M.appendChild(L);}var E=document.createElement("div");E.className=a.containerDays;var S=this.calcSkipDays(n);this.options.showWeekNumbers&&S&&E.appendChild(this.renderWeekNumber(n));for(var I=0;I<S;I+=1){var P=document.createElement("div");E.appendChild(P);}for(I=1;I<=o;I+=1)n.setDate(I),this.options.showWeekNumbers&&n.getDay()===this.options.firstDay&&E.appendChild(this.renderWeekNumber(n)),E.appendChild(this.renderDay(n));return s.appendChild(c),s.appendChild(M),s.appendChild(E),this.emit("render:month",s,t),s},e.prototype.renderDay=function(t){t.setHours();var e=document.createElement("div");if(e.className=a.dayItem,e.innerHTML=String(t.getDate()),e.dataset.time=String(t.getTime()),t.toDateString()===(new Date).toDateString()&&e.classList.add(a.isToday),this.datePicked.length)this.datePicked[0].toDateString()===t.toDateString()&&(e.classList.add(a.isStartDate),this.options.singleMode&&e.classList.add(a.isEndDate)),2===this.datePicked.length&&this.datePicked[1].toDateString()===t.toDateString()&&e.classList.add(a.isEndDate),2===this.datePicked.length&&t.isBetween(this.datePicked[0],this.datePicked[1])&&e.classList.add(a.isInRange);else if(this.options.startDate){var i=this.options.startDate,n=this.options.endDate;i.toDateString()===t.toDateString()&&(e.classList.add(a.isStartDate),this.options.singleMode&&e.classList.add(a.isEndDate)),n&&n.toDateString()===t.toDateString()&&e.classList.add(a.isEndDate),i&&n&&t.isBetween(i,n)&&e.classList.add(a.isInRange);}if(this.options.minDate&&t.isBefore(new r.DateTime(this.options.minDate))&&e.classList.add(a.isLocked),this.options.maxDate&&t.isAfter(new r.DateTime(this.options.maxDate))&&e.classList.add(a.isLocked),this.options.minDays>1&&1===this.datePicked.length){var o=this.options.minDays-1,s=this.datePicked[0].clone().subtract(o,"day"),c=this.datePicked[0].clone().add(o,"day");t.isBetween(s,this.datePicked[0],"(]")&&e.classList.add(a.isLocked),t.isBetween(this.datePicked[0],c,"[)")&&e.classList.add(a.isLocked);}if(this.options.maxDays&&1===this.datePicked.length){var h=this.options.maxDays;s=this.datePicked[0].clone().subtract(h,"day"),c=this.datePicked[0].clone().add(h,"day");t.isSameOrBefore(s)&&e.classList.add(a.isLocked),t.isSameOrAfter(c)&&e.classList.add(a.isLocked);}(this.options.selectForward&&1===this.datePicked.length&&t.isBefore(this.datePicked[0])&&e.classList.add(a.isLocked),this.options.selectBackward&&1===this.datePicked.length&&t.isAfter(this.datePicked[0])&&e.classList.add(a.isLocked),l.dateIsLocked(t,this.options,this.datePicked)&&e.classList.add(a.isLocked),this.options.highlightedDays.length)&&(this.options.highlightedDays.filter((function(e){return e instanceof Array?t.isBetween(e[0],e[1],"[]"):e.isSame(t,"day")})).length&&e.classList.add(a.isHighlighted));return e.tabIndex=e.classList.contains("is-locked")?-1:0,this.emit("render:day",e,t),e},e.prototype.renderFooter=function(){var t=document.createElement("div");if(t.className=a.containerFooter,this.options.footerHTML?t.innerHTML=this.options.footerHTML:t.innerHTML='\n      <span class="'+a.previewDateRange+'"></span>\n      <button type="button" class="'+a.buttonCancel+'">'+this.options.buttonText.cancel+'</button>\n      <button type="button" class="'+a.buttonApply+'">'+this.options.buttonText.apply+"</button>\n      ",this.options.singleMode){if(1===this.datePicked.length){var e=this.datePicked[0].format(this.options.format,this.options.lang);t.querySelector("."+a.previewDateRange).innerHTML=e;}}else if(1===this.datePicked.length&&t.querySelector("."+a.buttonApply).setAttribute("disabled",""),2===this.datePicked.length){e=this.datePicked[0].format(this.options.format,this.options.lang);var i=this.datePicked[1].format(this.options.format,this.options.lang);t.querySelector("."+a.previewDateRange).innerHTML=""+e+this.options.delimiter+i;}return this.emit("render:footer",t),t},e.prototype.renderWeekNumber=function(t){var e=document.createElement("div"),i=t.getWeek(this.options.firstDay);return e.className=a.weekNumber,e.innerHTML=53===i&&0===t.getMonth()?"53 / 1":i,e},e.prototype.renderTooltip=function(){var t=document.createElement("div");return t.className=a.containerTooltip,t},e.prototype.weekdayName=function(t,e){return void 0===e&&(e="short"),new Date(1970,0,t,12,0,0,0).toLocaleString(this.options.lang,{weekday:e})},e.prototype.calcSkipDays=function(t){var e=t.getDay()-this.options.firstDay;return e<0&&(e+=7),e},e}(s.LPCore);e.Calendar=c;},function(t,e,i){var n,o=this&&this.__extends||(n=function(t,e){return (n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);})(t,e)},function(t,e){function i(){this.constructor=t;}n(t,e),t.prototype=null===e?Object.create(e):(i.prototype=e.prototype,new i);}),s=this&&this.__assign||function(){return (s=Object.assign||function(t){for(var e,i=1,n=arguments.length;i<n;i++)for(var o in e=arguments[i])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};Object.defineProperty(e,"__esModule",{value:!0});var r=i(7),a=i(0),l=i(1),c=function(t){function e(e){var i=t.call(this)||this;i.datePicked=[],i.calendars=[],i.options={element:null,elementEnd:null,parentEl:null,firstDay:1,format:"YYYY-MM-DD",lang:"en-US",delimiter:" - ",numberOfMonths:1,numberOfColumns:1,startDate:null,endDate:null,zIndex:9999,position:"auto",selectForward:!1,selectBackward:!1,splitView:!1,inlineMode:!1,singleMode:!0,autoApply:!0,allowRepick:!1,showWeekNumbers:!1,showTooltip:!0,scrollToDate:!0,mobileFriendly:!0,resetButton:!1,autoRefresh:!1,lockDaysFormat:"YYYY-MM-DD",lockDays:[],disallowLockDaysInRange:!1,lockDaysInclusivity:"[]",highlightedDaysFormat:"YYYY-MM-DD",highlightedDays:[],dropdowns:{minYear:1990,maxYear:null,months:!1,years:!1},buttonText:{apply:"Apply",cancel:"Cancel",previousMonth:'<svg width="11" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M7.919 0l2.748 2.667L5.333 8l5.334 5.333L7.919 16 0 8z" fill-rule="nonzero"/></svg>',nextMonth:'<svg width="11" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M2.748 16L0 13.333 5.333 8 0 2.667 2.748 0l7.919 8z" fill-rule="nonzero"/></svg>',reset:'<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">\n        <path d="M0 0h24v24H0z" fill="none"/>\n        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>\n      </svg>'},tooltipText:{one:"day",other:"days"}},i.options=s(s({},i.options),e.element.dataset),Object.keys(i.options).forEach((function(t){"true"!==i.options[t]&&"false"!==i.options[t]||(i.options[t]="true"===i.options[t]);}));var n=s(s({},i.options.dropdowns),e.dropdowns),o=s(s({},i.options.buttonText),e.buttonText),r=s(s({},i.options.tooltipText),e.tooltipText);i.options=s(s({},i.options),e),i.options.dropdowns=s({},n),i.options.buttonText=s({},o),i.options.tooltipText=s({},r),i.options.elementEnd||(i.options.allowRepick=!1),i.options.lockDays.length&&(i.options.lockDays=a.DateTime.convertArray(i.options.lockDays,i.options.lockDaysFormat)),i.options.highlightedDays.length&&(i.options.highlightedDays=a.DateTime.convertArray(i.options.highlightedDays,i.options.highlightedDaysFormat));var l=i.parseInput(),c=l[0],h=l[1];i.options.startDate&&(i.options.singleMode||i.options.endDate)&&(c=new a.DateTime(i.options.startDate,i.options.format,i.options.lang)),c&&i.options.endDate&&(h=new a.DateTime(i.options.endDate,i.options.format,i.options.lang)),c instanceof a.DateTime&&!isNaN(c.getTime())&&(i.options.startDate=c),i.options.startDate&&h instanceof a.DateTime&&!isNaN(h.getTime())&&(i.options.endDate=h),!i.options.singleMode||i.options.startDate instanceof a.DateTime||(i.options.startDate=null),i.options.singleMode||i.options.startDate instanceof a.DateTime&&i.options.endDate instanceof a.DateTime||(i.options.startDate=null,i.options.endDate=null);for(var p=0;p<i.options.numberOfMonths;p+=1){var d=i.options.startDate instanceof a.DateTime?i.options.startDate.clone():new a.DateTime;if(!i.options.startDate&&(0===p||i.options.splitView)){var u=i.options.maxDate?new a.DateTime(i.options.maxDate):null,m=i.options.minDate?new a.DateTime(i.options.minDate):null,f=i.options.numberOfMonths-1;m&&u&&d.isAfter(u)?(d=m.clone()).setDate(1):!m&&u&&d.isAfter(u)&&((d=u.clone()).setDate(1),d.setMonth(d.getMonth()-f));}d.setDate(1),d.setMonth(d.getMonth()+p),i.calendars[p]=d;}if(i.options.showTooltip)if(i.options.tooltipPluralSelector)i.pluralSelector=i.options.tooltipPluralSelector;else try{var g=new Intl.PluralRules(i.options.lang);i.pluralSelector=g.select.bind(g);}catch(t){i.pluralSelector=function(t){return 0===Math.abs(t)?"one":"other"};}return i}return o(e,t),e.add=function(t,e){l.Litepicker.prototype[t]=e;},e.prototype.DateTime=function(t,e){return t?new a.DateTime(t,e):new a.DateTime},e.prototype.init=function(){var t=this;this.options.plugins&&this.options.plugins.length&&this.options.plugins.forEach((function(e){l.Litepicker.prototype.hasOwnProperty(e)?l.Litepicker.prototype[e].init.call(t,t):console.warn("Litepicker: plugin «"+e+"» not found.");}));},e.prototype.parseInput=function(){var t=this.options.delimiter,e=new RegExp(""+t),i=this.options.element instanceof HTMLInputElement?this.options.element.value.split(t):[];if(this.options.elementEnd){if(this.options.element instanceof HTMLInputElement&&this.options.element.value.length&&this.options.elementEnd instanceof HTMLInputElement&&this.options.elementEnd.value.length)return [new a.DateTime(this.options.element.value,this.options.format),new a.DateTime(this.options.elementEnd.value,this.options.format)]}else if(this.options.singleMode){if(this.options.element instanceof HTMLInputElement&&this.options.element.value.length)return [new a.DateTime(this.options.element.value,this.options.format)]}else if(this.options.element instanceof HTMLInputElement&&e.test(this.options.element.value)&&i.length&&i.length%2==0){var n=i.slice(0,i.length/2).join(t),o=i.slice(i.length/2).join(t);return [new a.DateTime(n,this.options.format),new a.DateTime(o,this.options.format)]}return []},e.prototype.isShowning=function(){return this.ui&&"none"!==this.ui.style.display},e.prototype.findPosition=function(t){var e=t.getBoundingClientRect(),i=this.ui.getBoundingClientRect(),n=this.options.position.split(" "),o=window.scrollX||window.pageXOffset,s=window.scrollY||window.pageYOffset,r=0,a=0;if("auto"!==n[0]&&/top|bottom/.test(n[0]))r=e[n[0]]+s,"top"===n[0]&&(r-=i.height);else {r=e.bottom+s;var l=e.bottom+i.height>window.innerHeight,c=e.top+s-i.height>=i.height;l&&c&&(r=e.top+s-i.height);}if(/left|right/.test(n[0])||n[1]&&"auto"!==n[1]&&/left|right/.test(n[1]))a=/left|right/.test(n[0])?e[n[0]]+o:e[n[1]]+o,"right"!==n[0]&&"right"!==n[1]||(a-=i.width);else {a=e.left+o;l=e.left+i.width>window.innerWidth;var h=e.right+o-i.width>=0;l&&h&&(a=e.right+o-i.width);}return {left:a,top:r}},e}(r.EventEmitter);e.LPCore=c;},function(t,e,i){var n,o="object"==typeof Reflect?Reflect:null,s=o&&"function"==typeof o.apply?o.apply:function(t,e,i){return Function.prototype.apply.call(t,e,i)};n=o&&"function"==typeof o.ownKeys?o.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var r=Number.isNaN||function(t){return t!=t};function a(){a.init.call(this);}t.exports=a,a.EventEmitter=a,a.prototype._events=void 0,a.prototype._eventsCount=0,a.prototype._maxListeners=void 0;var l=10;function c(t){return void 0===t._maxListeners?a.defaultMaxListeners:t._maxListeners}function h(t,e,i,n){var o,s,r,a;if("function"!=typeof i)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof i);if(void 0===(s=t._events)?(s=t._events=Object.create(null),t._eventsCount=0):(void 0!==s.newListener&&(t.emit("newListener",e,i.listener?i.listener:i),s=t._events),r=s[e]),void 0===r)r=s[e]=i,++t._eventsCount;else if("function"==typeof r?r=s[e]=n?[i,r]:[r,i]:n?r.unshift(i):r.push(i),(o=c(t))>0&&r.length>o&&!r.warned){r.warned=!0;var l=new Error("Possible EventEmitter memory leak detected. "+r.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");l.name="MaxListenersExceededWarning",l.emitter=t,l.type=e,l.count=r.length,a=l,console&&console.warn&&console.warn(a);}return t}function p(){for(var t=[],e=0;e<arguments.length;e++)t.push(arguments[e]);this.fired||(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,s(this.listener,this.target,t));}function d(t,e,i){var n={fired:!1,wrapFn:void 0,target:t,type:e,listener:i},o=p.bind(n);return o.listener=i,n.wrapFn=o,o}function u(t,e,i){var n=t._events;if(void 0===n)return [];var o=n[e];return void 0===o?[]:"function"==typeof o?i?[o.listener||o]:[o]:i?function(t){for(var e=new Array(t.length),i=0;i<e.length;++i)e[i]=t[i].listener||t[i];return e}(o):f(o,o.length)}function m(t){var e=this._events;if(void 0!==e){var i=e[t];if("function"==typeof i)return 1;if(void 0!==i)return i.length}return 0}function f(t,e){for(var i=new Array(e),n=0;n<e;++n)i[n]=t[n];return i}Object.defineProperty(a,"defaultMaxListeners",{enumerable:!0,get:function(){return l},set:function(t){if("number"!=typeof t||t<0||r(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");l=t;}}),a.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0;},a.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||r(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},a.prototype.getMaxListeners=function(){return c(this)},a.prototype.emit=function(t){for(var e=[],i=1;i<arguments.length;i++)e.push(arguments[i]);var n="error"===t,o=this._events;if(void 0!==o)n=n&&void 0===o.error;else if(!n)return !1;if(n){var r;if(e.length>0&&(r=e[0]),r instanceof Error)throw r;var a=new Error("Unhandled error."+(r?" ("+r.message+")":""));throw a.context=r,a}var l=o[t];if(void 0===l)return !1;if("function"==typeof l)s(l,this,e);else {var c=l.length,h=f(l,c);for(i=0;i<c;++i)s(h[i],this,e);}return !0},a.prototype.addListener=function(t,e){return h(this,t,e,!1)},a.prototype.on=a.prototype.addListener,a.prototype.prependListener=function(t,e){return h(this,t,e,!0)},a.prototype.once=function(t,e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e);return this.on(t,d(this,t,e)),this},a.prototype.prependOnceListener=function(t,e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e);return this.prependListener(t,d(this,t,e)),this},a.prototype.removeListener=function(t,e){var i,n,o,s,r;if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e);if(void 0===(n=this._events))return this;if(void 0===(i=n[t]))return this;if(i===e||i.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete n[t],n.removeListener&&this.emit("removeListener",t,i.listener||e));else if("function"!=typeof i){for(o=-1,s=i.length-1;s>=0;s--)if(i[s]===e||i[s].listener===e){r=i[s].listener,o=s;break}if(o<0)return this;0===o?i.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop();}(i,o),1===i.length&&(n[t]=i[0]),void 0!==n.removeListener&&this.emit("removeListener",t,r||e);}return this},a.prototype.off=a.prototype.removeListener,a.prototype.removeAllListeners=function(t){var e,i,n;if(void 0===(i=this._events))return this;if(void 0===i.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==i[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete i[t]),this;if(0===arguments.length){var o,s=Object.keys(i);for(n=0;n<s.length;++n)"removeListener"!==(o=s[n])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=i[t]))this.removeListener(t,e);else if(void 0!==e)for(n=e.length-1;n>=0;n--)this.removeListener(t,e[n]);return this},a.prototype.listeners=function(t){return u(this,t,!0)},a.prototype.rawListeners=function(t){return u(this,t,!1)},a.listenerCount=function(t,e){return "function"==typeof t.listenerCount?t.listenerCount(e):m.call(t,e)},a.prototype.listenerCount=m,a.prototype.eventNames=function(){return this._eventsCount>0?n(this._events):[]};},function(t,e,i){(e=i(9)(!1)).push([t.i,':root{--litepicker-container-months-color-bg: #fff;--litepicker-container-months-box-shadow-color: #ddd;--litepicker-footer-color-bg: #fafafa;--litepicker-footer-box-shadow-color: #ddd;--litepicker-tooltip-color-bg: #fff;--litepicker-month-header-color: #333;--litepicker-button-prev-month-color: #9e9e9e;--litepicker-button-next-month-color: #9e9e9e;--litepicker-button-prev-month-color-hover: #2196f3;--litepicker-button-next-month-color-hover: #2196f3;--litepicker-month-width: calc(var(--litepicker-day-width) * 7);--litepicker-month-weekday-color: #9e9e9e;--litepicker-month-week-number-color: #9e9e9e;--litepicker-day-width: 38px;--litepicker-day-color: #333;--litepicker-day-color-hover: #2196f3;--litepicker-is-today-color: #f44336;--litepicker-is-in-range-color: #bbdefb;--litepicker-is-locked-color: #9e9e9e;--litepicker-is-start-color: #fff;--litepicker-is-start-color-bg: #2196f3;--litepicker-is-end-color: #fff;--litepicker-is-end-color-bg: #2196f3;--litepicker-button-cancel-color: #fff;--litepicker-button-cancel-color-bg: #9e9e9e;--litepicker-button-apply-color: #fff;--litepicker-button-apply-color-bg: #2196f3;--litepicker-button-reset-color: #909090;--litepicker-button-reset-color-hover: #2196f3;--litepicker-highlighted-day-color: #333;--litepicker-highlighted-day-color-bg: #ffeb3b}.show-week-numbers{--litepicker-month-width: calc(var(--litepicker-day-width) * 8)}.litepicker{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;font-size:0.8em;display:none}.litepicker button{border:none;background:none}.litepicker .container__main{display:-webkit-box;display:-ms-flexbox;display:flex}.litepicker .container__months{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;background-color:var(--litepicker-container-months-color-bg);border-radius:5px;-webkit-box-shadow:0 0 5px var(--litepicker-container-months-box-shadow-color);box-shadow:0 0 5px var(--litepicker-container-months-box-shadow-color);width:calc(var(--litepicker-month-width) + 10px);-webkit-box-sizing:content-box;box-sizing:content-box}.litepicker .container__months.columns-2{width:calc((var(--litepicker-month-width) * 2) + 20px)}.litepicker .container__months.columns-3{width:calc((var(--litepicker-month-width) * 3) + 30px)}.litepicker .container__months.columns-4{width:calc((var(--litepicker-month-width) * 4) + 40px)}.litepicker .container__months.split-view .month-item-header .button-previous-month,.litepicker .container__months.split-view .month-item-header .button-next-month{visibility:visible}.litepicker .container__months .month-item{padding:5px;width:var(--litepicker-month-width);-webkit-box-sizing:content-box;box-sizing:content-box}.litepicker .container__months .month-item-header{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;font-weight:500;padding:10px 5px;text-align:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:var(--litepicker-month-header-color)}.litepicker .container__months .month-item-header div{-webkit-box-flex:1;-ms-flex:1;flex:1}.litepicker .container__months .month-item-header div>.month-item-name{margin-right:5px}.litepicker .container__months .month-item-header div>.month-item-year{padding:0}.litepicker .container__months .month-item-header .reset-button{color:var(--litepicker-button-reset-color)}.litepicker .container__months .month-item-header .reset-button>svg{fill:var(--litepicker-button-reset-color)}.litepicker .container__months .month-item-header .reset-button *{pointer-events:none}.litepicker .container__months .month-item-header .reset-button:hover{color:var(--litepicker-button-reset-color-hover)}.litepicker .container__months .month-item-header .reset-button:hover>svg{fill:var(--litepicker-button-reset-color-hover)}.litepicker .container__months .month-item-header .button-previous-month,.litepicker .container__months .month-item-header .button-next-month{visibility:hidden;text-decoration:none;padding:3px 5px;border-radius:3px;-webkit-transition:color 0.3s, border 0.3s;transition:color 0.3s, border 0.3s;cursor:default}.litepicker .container__months .month-item-header .button-previous-month *,.litepicker .container__months .month-item-header .button-next-month *{pointer-events:none}.litepicker .container__months .month-item-header .button-previous-month{color:var(--litepicker-button-prev-month-color)}.litepicker .container__months .month-item-header .button-previous-month>svg,.litepicker .container__months .month-item-header .button-previous-month>img{fill:var(--litepicker-button-prev-month-color)}.litepicker .container__months .month-item-header .button-previous-month:hover{color:var(--litepicker-button-prev-month-color-hover)}.litepicker .container__months .month-item-header .button-previous-month:hover>svg{fill:var(--litepicker-button-prev-month-color-hover)}.litepicker .container__months .month-item-header .button-next-month{color:var(--litepicker-button-next-month-color)}.litepicker .container__months .month-item-header .button-next-month>svg,.litepicker .container__months .month-item-header .button-next-month>img{fill:var(--litepicker-button-next-month-color)}.litepicker .container__months .month-item-header .button-next-month:hover{color:var(--litepicker-button-next-month-color-hover)}.litepicker .container__months .month-item-header .button-next-month:hover>svg{fill:var(--litepicker-button-next-month-color-hover)}.litepicker .container__months .month-item-weekdays-row{display:-webkit-box;display:-ms-flexbox;display:flex;justify-self:center;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;color:var(--litepicker-month-weekday-color)}.litepicker .container__months .month-item-weekdays-row>div{padding:5px 0;font-size:85%;-webkit-box-flex:1;-ms-flex:1;flex:1;width:var(--litepicker-day-width);text-align:center}.litepicker .container__months .month-item:first-child .button-previous-month{visibility:visible}.litepicker .container__months .month-item:last-child .button-next-month{visibility:visible}.litepicker .container__months .month-item.no-previous-month .button-previous-month{visibility:hidden}.litepicker .container__months .month-item.no-next-month .button-next-month{visibility:hidden}.litepicker .container__days{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;justify-self:center;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;text-align:center;-webkit-box-sizing:content-box;box-sizing:content-box}.litepicker .container__days>div,.litepicker .container__days>a{padding:5px 0;width:var(--litepicker-day-width)}.litepicker .container__days .day-item{color:var(--litepicker-day-color);text-align:center;text-decoration:none;border-radius:3px;-webkit-transition:color 0.3s, border 0.3s;transition:color 0.3s, border 0.3s;cursor:default}.litepicker .container__days .day-item:hover{color:var(--litepicker-day-color-hover);-webkit-box-shadow:inset 0 0 0 1px var(--litepicker-day-color-hover);box-shadow:inset 0 0 0 1px var(--litepicker-day-color-hover)}.litepicker .container__days .day-item.is-today{color:var(--litepicker-is-today-color)}.litepicker .container__days .day-item.is-locked{color:var(--litepicker-is-locked-color)}.litepicker .container__days .day-item.is-locked:hover{color:var(--litepicker-is-locked-color);-webkit-box-shadow:none;box-shadow:none;cursor:default}.litepicker .container__days .day-item.is-in-range{background-color:var(--litepicker-is-in-range-color);border-radius:0}.litepicker .container__days .day-item.is-start-date{color:var(--litepicker-is-start-color);background-color:var(--litepicker-is-start-color-bg);border-top-left-radius:5px;border-bottom-left-radius:5px;border-top-right-radius:0;border-bottom-right-radius:0}.litepicker .container__days .day-item.is-start-date.is-flipped{border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:5px;border-bottom-right-radius:5px}.litepicker .container__days .day-item.is-end-date{color:var(--litepicker-is-end-color);background-color:var(--litepicker-is-end-color-bg);border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:5px;border-bottom-right-radius:5px}.litepicker .container__days .day-item.is-end-date.is-flipped{border-top-left-radius:5px;border-bottom-left-radius:5px;border-top-right-radius:0;border-bottom-right-radius:0}.litepicker .container__days .day-item.is-start-date.is-end-date{border-top-left-radius:5px;border-bottom-left-radius:5px;border-top-right-radius:5px;border-bottom-right-radius:5px}.litepicker .container__days .day-item.is-highlighted{color:var(--litepicker-highlighted-day-color);background-color:var(--litepicker-highlighted-day-color-bg)}.litepicker .container__days .week-number{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;color:var(--litepicker-month-week-number-color);font-size:85%}.litepicker .container__footer{text-align:right;padding:10px 5px;margin:0 5px;background-color:var(--litepicker-footer-color-bg);-webkit-box-shadow:inset 0px 3px 3px 0px var(--litepicker-footer-box-shadow-color);box-shadow:inset 0px 3px 3px 0px var(--litepicker-footer-box-shadow-color);border-bottom-left-radius:5px;border-bottom-right-radius:5px}.litepicker .container__footer .preview-date-range{margin-right:10px;font-size:90%}.litepicker .container__footer .button-cancel{background-color:var(--litepicker-button-cancel-color-bg);color:var(--litepicker-button-cancel-color);border:0;padding:3px 7px 4px;border-radius:3px}.litepicker .container__footer .button-cancel *{pointer-events:none}.litepicker .container__footer .button-apply{background-color:var(--litepicker-button-apply-color-bg);color:var(--litepicker-button-apply-color);border:0;padding:3px 7px 4px;border-radius:3px;margin-left:10px;margin-right:10px}.litepicker .container__footer .button-apply:disabled{opacity:0.7}.litepicker .container__footer .button-apply *{pointer-events:none}.litepicker .container__tooltip{position:absolute;margin-top:-4px;padding:4px 8px;border-radius:4px;background-color:var(--litepicker-tooltip-color-bg);-webkit-box-shadow:0 1px 3px rgba(0,0,0,0.25);box-shadow:0 1px 3px rgba(0,0,0,0.25);white-space:nowrap;font-size:11px;pointer-events:none;visibility:hidden}.litepicker .container__tooltip:before{position:absolute;bottom:-5px;left:calc(50% - 5px);border-top:5px solid rgba(0,0,0,0.12);border-right:5px solid transparent;border-left:5px solid transparent;content:""}.litepicker .container__tooltip:after{position:absolute;bottom:-4px;left:calc(50% - 4px);border-top:4px solid var(--litepicker-tooltip-color-bg);border-right:4px solid transparent;border-left:4px solid transparent;content:""}\n',""]),e.locals={showWeekNumbers:"show-week-numbers",litepicker:"litepicker",containerMain:"container__main",containerMonths:"container__months",columns2:"columns-2",columns3:"columns-3",columns4:"columns-4",splitView:"split-view",monthItemHeader:"month-item-header",buttonPreviousMonth:"button-previous-month",buttonNextMonth:"button-next-month",monthItem:"month-item",monthItemName:"month-item-name",monthItemYear:"month-item-year",resetButton:"reset-button",monthItemWeekdaysRow:"month-item-weekdays-row",noPreviousMonth:"no-previous-month",noNextMonth:"no-next-month",containerDays:"container__days",dayItem:"day-item",isToday:"is-today",isLocked:"is-locked",isInRange:"is-in-range",isStartDate:"is-start-date",isFlipped:"is-flipped",isEndDate:"is-end-date",isHighlighted:"is-highlighted",weekNumber:"week-number",containerFooter:"container__footer",previewDateRange:"preview-date-range",buttonCancel:"button-cancel",buttonApply:"button-apply",containerTooltip:"container__tooltip"},t.exports=e;},function(t,e,i){t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var i=function(t,e){var i=t[1]||"",n=t[3];if(!n)return i;if(e&&"function"==typeof btoa){var o=(r=n,a=btoa(unescape(encodeURIComponent(JSON.stringify(r)))),l="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(a),"/*# ".concat(l," */")),s=n.sources.map((function(t){return "/*# sourceURL=".concat(n.sourceRoot||"").concat(t," */")}));return [i].concat(s).concat([o]).join("\n")}var r,a,l;return [i].join("\n")}(e,t);return e[2]?"@media ".concat(e[2]," {").concat(i,"}"):i})).join("")},e.i=function(t,i,n){"string"==typeof t&&(t=[[null,t,""]]);var o={};if(n)for(var s=0;s<this.length;s++){var r=this[s][0];null!=r&&(o[r]=!0);}for(var a=0;a<t.length;a++){var l=[].concat(t[a]);n&&o[l[0]]||(i&&(l[2]?l[2]="".concat(i," and ").concat(l[2]):l[2]=i),e.push(l));}},e};},function(t,e,i){var n,o={},s=function(){return void 0===n&&(n=Boolean(window&&document&&document.all&&!window.atob)),n},r=function(){var t={};return function(e){if(void 0===t[e]){var i=document.querySelector(e);if(window.HTMLIFrameElement&&i instanceof window.HTMLIFrameElement)try{i=i.contentDocument.head;}catch(t){i=null;}t[e]=i;}return t[e]}}();function a(t,e){for(var i=[],n={},o=0;o<t.length;o++){var s=t[o],r=e.base?s[0]+e.base:s[0],a={css:s[1],media:s[2],sourceMap:s[3]};n[r]?n[r].parts.push(a):i.push(n[r]={id:r,parts:[a]});}return i}function l(t,e){for(var i=0;i<t.length;i++){var n=t[i],s=o[n.id],r=0;if(s){for(s.refs++;r<s.parts.length;r++)s.parts[r](n.parts[r]);for(;r<n.parts.length;r++)s.parts.push(g(n.parts[r],e));}else {for(var a=[];r<n.parts.length;r++)a.push(g(n.parts[r],e));o[n.id]={id:n.id,refs:1,parts:a};}}}function c(t){var e=document.createElement("style");if(void 0===t.attributes.nonce){var n=i.nc;n&&(t.attributes.nonce=n);}if(Object.keys(t.attributes).forEach((function(i){e.setAttribute(i,t.attributes[i]);})),"function"==typeof t.insert)t.insert(e);else {var o=r(t.insert||"head");if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");o.appendChild(e);}return e}var h,p=(h=[],function(t,e){return h[t]=e,h.filter(Boolean).join("\n")});function d(t,e,i,n){var o=i?"":n.css;if(t.styleSheet)t.styleSheet.cssText=p(e,o);else {var s=document.createTextNode(o),r=t.childNodes;r[e]&&t.removeChild(r[e]),r.length?t.insertBefore(s,r[e]):t.appendChild(s);}}function u(t,e,i){var n=i.css,o=i.media,s=i.sourceMap;if(o&&t.setAttribute("media",o),s&&btoa&&(n+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(s))))," */")),t.styleSheet)t.styleSheet.cssText=n;else {for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n));}}var m=null,f=0;function g(t,e){var i,n,o;if(e.singleton){var s=f++;i=m||(m=c(e)),n=d.bind(null,i,s,!1),o=d.bind(null,i,s,!0);}else i=c(e),n=u.bind(null,i,e),o=function(){!function(t){if(null===t.parentNode)return !1;t.parentNode.removeChild(t);}(i);};return n(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;n(t=e);}else o();}}t.exports=function(t,e){(e=e||{}).attributes="object"==typeof e.attributes?e.attributes:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=s());var i=a(t,e);return l(i,e),function(t){for(var n=[],s=0;s<i.length;s++){var r=i[s],c=o[r.id];c&&(c.refs--,n.push(c));}t&&l(a(t,e),e);for(var h=0;h<n.length;h++){var p=n[h];if(0===p.refs){for(var d=0;d<p.parts.length;d++)p.parts[d]();delete o[p.id];}}}};},function(t,e,i){var n=this&&this.__assign||function(){return (n=Object.assign||function(t){for(var e,i=1,n=arguments.length;i<n;i++)for(var o in e=arguments[i])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)};Object.defineProperty(e,"__esModule",{value:!0});var o=i(0),s=i(1),r=i(2);s.Litepicker.prototype.show=function(t){void 0===t&&(t=null),this.emit("before:show",t);var e=t||this.options.element;if(this.triggerElement=e,!this.isShowning()){if(this.options.inlineMode)return this.ui.style.position="relative",this.ui.style.display="inline-block",this.ui.style.top=null,this.ui.style.left=null,this.ui.style.bottom=null,void(this.ui.style.right=null);this.scrollToDate(t),this.render(),this.ui.style.position="absolute",this.ui.style.display="block",this.ui.style.zIndex=this.options.zIndex;var i=this.findPosition(e);this.ui.style.top=i.top+"px",this.ui.style.left=i.left+"px",this.ui.style.right=null,this.ui.style.bottom=null,this.emit("show",t);}},s.Litepicker.prototype.hide=function(){this.isShowning()&&(this.datePicked.length=0,this.updateInput(),this.options.inlineMode?this.render():(this.ui.style.display="none",this.emit("hide")));},s.Litepicker.prototype.getDate=function(){return this.getStartDate()},s.Litepicker.prototype.getStartDate=function(){return this.options.startDate?this.options.startDate.clone():null},s.Litepicker.prototype.getEndDate=function(){return this.options.endDate?this.options.endDate.clone():null},s.Litepicker.prototype.setDate=function(t,e){void 0===e&&(e=!1);var i=new o.DateTime(t,this.options.format,this.options.lang);r.dateIsLocked(i,this.options,[i])&&!e?this.emit("error:date",i):(this.setStartDate(t),this.options.inlineMode&&this.render(),this.emit("selected",this.getDate()));},s.Litepicker.prototype.setStartDate=function(t){t&&(this.options.startDate=new o.DateTime(t,this.options.format,this.options.lang),this.updateInput());},s.Litepicker.prototype.setEndDate=function(t){t&&(this.options.endDate=new o.DateTime(t,this.options.format,this.options.lang),this.options.startDate.getTime()>this.options.endDate.getTime()&&(this.options.endDate=this.options.startDate.clone(),this.options.startDate=new o.DateTime(t,this.options.format,this.options.lang)),this.updateInput());},s.Litepicker.prototype.setDateRange=function(t,e,i){void 0===i&&(i=!1),this.triggerElement=void 0;var n=new o.DateTime(t,this.options.format,this.options.lang),s=new o.DateTime(e,this.options.format,this.options.lang);(this.options.disallowLockDaysInRange?r.rangeIsLocked([n,s],this.options):r.dateIsLocked(n,this.options,[n,s])||r.dateIsLocked(s,this.options,[n,s]))&&!i?this.emit("error:range",[n,s]):(this.setStartDate(n),this.setEndDate(s),this.options.inlineMode&&this.render(),this.updateInput(),this.emit("selected",this.getStartDate(),this.getEndDate()));},s.Litepicker.prototype.gotoDate=function(t,e){void 0===e&&(e=0);var i=new o.DateTime(t);i.setDate(1),this.calendars[e]=i.clone(),this.render();},s.Litepicker.prototype.setLockDays=function(t){this.options.lockDays=o.DateTime.convertArray(t,this.options.lockDaysFormat),this.render();},s.Litepicker.prototype.setHighlightedDays=function(t){this.options.highlightedDays=o.DateTime.convertArray(t,this.options.highlightedDaysFormat),this.render();},s.Litepicker.prototype.setOptions=function(t){delete t.element,delete t.elementEnd,delete t.parentEl,t.startDate&&(t.startDate=new o.DateTime(t.startDate,this.options.format,this.options.lang)),t.endDate&&(t.endDate=new o.DateTime(t.endDate,this.options.format,this.options.lang));var e=n(n({},this.options.dropdowns),t.dropdowns),i=n(n({},this.options.buttonText),t.buttonText),s=n(n({},this.options.tooltipText),t.tooltipText);this.options=n(n({},this.options),t),this.options.dropdowns=n({},e),this.options.buttonText=n({},i),this.options.tooltipText=n({},s),!this.options.singleMode||this.options.startDate instanceof o.DateTime||(this.options.startDate=null,this.options.endDate=null),this.options.singleMode||this.options.startDate instanceof o.DateTime&&this.options.endDate instanceof o.DateTime||(this.options.startDate=null,this.options.endDate=null);for(var r=0;r<this.options.numberOfMonths;r+=1){var a=this.options.startDate?this.options.startDate.clone():new o.DateTime;a.setDate(1),a.setMonth(a.getMonth()+r),this.calendars[r]=a;}this.options.lockDays.length&&(this.options.lockDays=o.DateTime.convertArray(this.options.lockDays,this.options.lockDaysFormat)),this.options.highlightedDays.length&&(this.options.highlightedDays=o.DateTime.convertArray(this.options.highlightedDays,this.options.highlightedDaysFormat)),this.render(),this.options.inlineMode&&this.show(),this.updateInput();},s.Litepicker.prototype.clearSelection=function(){this.options.startDate=null,this.options.endDate=null,this.datePicked.length=0,this.updateInput(),this.isShowning()&&this.render(),this.emit("clear:selection");},s.Litepicker.prototype.destroy=function(){this.ui&&this.ui.parentNode&&(this.ui.parentNode.removeChild(this.ui),this.ui=null),this.emit("destroy");};}])}));
    });

    var Litepicker = /*@__PURE__*/getDefaultExportFromCjs(litepicker_umd);

    /* src\components\DateRange.svelte generated by Svelte v3.44.3 */
    const file$5 = "src\\components\\DateRange.svelte";

    function create_fragment$5(ctx) {
    	let p;
    	let t1;
    	let input;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "hi";
    			t1 = space();
    			input = element("input");
    			add_location(p, file$5, 11, 0, 245);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "litepicker");
    			add_location(input, file$5, 12, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
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
    	validate_slots('DateRange', slots, []);

    	onMount(() => {
    		new Litepicker({
    				element: document.getElementById('litepicker')
    			});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DateRange> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Litepicker, onMount });
    	return [];
    }

    class DateRange extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DateRange",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\InfiniteScroll.svelte generated by Svelte v3.44.3 */

    const { console: console_1$2 } = globals;
    const file$4 = "src\\components\\InfiniteScroll.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (60:12) {#if data.length>0}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*data*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data, onLoadFun*/ 20) {
    				each_value = /*data*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(60:12) {#if data.length>0}",
    		ctx
    	});

    	return block;
    }

    // (61:16) {#each data as image}
    function create_each_block$1(ctx) {
    	let div;
    	let a;
    	let img_1;
    	let img_1_src_value;
    	let img_1_alt_value;
    	let img_1_title_value;
    	let img_1_intro;
    	let a_href_value;
    	let t;
    	let div_intro;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			img_1 = element("img");
    			t = space();
    			attr_dev(img_1, "id", "img");
    			attr_dev(img_1, "class", "img-thumbnail svelte-1e171vo");
    			if (!src_url_equal(img_1.src, img_1_src_value = /*image*/ ctx[11].urls.regular)) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", img_1_alt_value = /*image*/ ctx[11].alt_description);
    			attr_dev(img_1, "title", img_1_title_value = /*image*/ ctx[11].alt_description);
    			add_location(img_1, file$4, 63, 16, 1997);
    			attr_dev(a, "href", a_href_value = /*image*/ ctx[11].links.html);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$4, 62, 16, 1936);
    			add_location(div, file$4, 61, 16, 1887);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, img_1);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(img_1, "load", /*onLoadFun*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 4 && !src_url_equal(img_1.src, img_1_src_value = /*image*/ ctx[11].urls.regular)) {
    				attr_dev(img_1, "src", img_1_src_value);
    			}

    			if (dirty & /*data*/ 4 && img_1_alt_value !== (img_1_alt_value = /*image*/ ctx[11].alt_description)) {
    				attr_dev(img_1, "alt", img_1_alt_value);
    			}

    			if (dirty & /*data*/ 4 && img_1_title_value !== (img_1_title_value = /*image*/ ctx[11].alt_description)) {
    				attr_dev(img_1, "title", img_1_title_value);
    			}

    			if (dirty & /*data*/ 4 && a_href_value !== (a_href_value = /*image*/ ctx[11].links.html)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		i: function intro(local) {
    			if (!img_1_intro) {
    				add_render_callback(() => {
    					img_1_intro = create_in_transition(img_1, fade, { duration: 2000 });
    					img_1_intro.start();
    				});
    			}

    			if (!div_intro) {
    				add_render_callback(() => {
    					div_intro = create_in_transition(div, fade, { duration: 2000 });
    					div_intro.start();
    				});
    			}
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(61:16) {#each data as image}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let t1;
    	let div1;
    	let img_1;
    	let img_1_src_value;
    	let div1_class_value;
    	let t2;
    	let div2;
    	let mounted;
    	let dispose;
    	let if_block = /*data*/ ctx[2].length > 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			div0.textContent = "UNSPLASH API-INFINITE SCROLL";
    			t1 = space();
    			div1 = element("div");
    			img_1 = element("img");
    			t2 = space();
    			div2 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "title svelte-1e171vo");
    			add_location(div0, file$4, 54, 8, 1585);
    			if (!src_url_equal(img_1.src, img_1_src_value = "./images/loader.svg")) attr_dev(img_1, "src", img_1_src_value);
    			attr_dev(img_1, "alt", "loader img");
    			attr_dev(img_1, "class", "svelte-1e171vo");
    			add_location(img_1, file$4, 56, 12, 1692);
    			attr_dev(div1, "class", div1_class_value = "loader " + /*loader*/ ctx[0] + " svelte-1e171vo");
    			add_location(div1, file$4, 55, 8, 1649);
    			attr_dev(div2, "class", "image-container svelte-1e171vo");
    			add_location(div2, file$4, 58, 8, 1767);
    			attr_dev(div3, "class", "elements svelte-1e171vo");
    			attr_dev(div3, "id", "elements");
    			set_style(div3, "height", /*height*/ ctx[1]);
    			add_location(div3, file$4, 53, 4, 1513);
    			attr_dev(div4, "class", "body");
    			attr_dev(div4, "id", "body");
    			set_style(div4, "height", "100vh");
    			set_style(div4, "overflow-x", "auto");
    			add_location(div4, file$4, 52, 0, 1415);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, img_1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			if (if_block) if_block.m(div2, null);

    			if (!mounted) {
    				dispose = listen_dev(div4, "scroll", /*scrollFun*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*loader*/ 1 && div1_class_value !== (div1_class_value = "loader " + /*loader*/ ctx[0] + " svelte-1e171vo")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (/*data*/ ctx[2].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*height*/ 2) {
    				set_style(div3, "height", /*height*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			transition_in(if_block);
    		},
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block) if_block.d();
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

    const api_key = 'WWsBOsSnXbn9GJv3gucUMHYWJ3YHryd2uZMN1wWlIHk';
    const count = 10;

    function instance$4($$self, $$props, $$invalidate) {
    	let data;
    	let height;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InfiniteScroll', slots, []);
    	const link = `https://api.unsplash.com/photos/random/?client_id=${api_key}&count=${count}`;
    	let loader = '';
    	let imageCount = 0;

    	const getPhotoes = async () => {
    		try {
    			const response = await fetch(link);
    			let datas = await response.json();
    			$$invalidate(2, data = [...data, ...datas]);
    			console.log(data);
    		} catch(error) {
    			console.log(error);
    		}
    	};

    	getPhotoes();
    	let body;
    	let elements;
    	let img;

    	onMount(() => {
    		body = document.getElementById('body');
    		elements = document.getElementById('elements');
    		img = document.getElementById('img');
    	});

    	const scrollFun = () => {
    		if (window.innerHeight + body.scrollTop >= elements.offsetHeight - 700 && imageCount == 10) {
    			$$invalidate(5, imageCount = 0);
    			getPhotoes();
    			console.log(elements.offsetHeight);
    			console.log(imageCount);
    		}
    	};

    	const onLoadFun = () => {
    		$$invalidate(5, imageCount++, imageCount);
    		console.log(imageCount);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<InfiniteScroll> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		fade,
    		api_key,
    		count,
    		link,
    		loader,
    		imageCount,
    		getPhotoes,
    		body,
    		elements,
    		img,
    		scrollFun,
    		onLoadFun,
    		height,
    		data
    	});

    	$$self.$inject_state = $$props => {
    		if ('loader' in $$props) $$invalidate(0, loader = $$props.loader);
    		if ('imageCount' in $$props) $$invalidate(5, imageCount = $$props.imageCount);
    		if ('body' in $$props) body = $$props.body;
    		if ('elements' in $$props) elements = $$props.elements;
    		if ('img' in $$props) img = $$props.img;
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*imageCount*/ 32) {
    			if (imageCount > 0) {
    				$$invalidate(0, loader = 'd-none');
    				$$invalidate(1, height = 'auto');
    			}
    		}
    	};

    	$$invalidate(2, data = []);
    	$$invalidate(1, height = '100%');
    	return [loader, height, data, scrollFun, onLoadFun, imageCount];
    }

    class InfiniteScroll extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfiniteScroll",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\TestCode.svelte generated by Svelte v3.44.3 */
    const file$3 = "src\\components\\TestCode.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (12:0) {#each list as item}
    function create_each_block(ctx) {
    	let div2;
    	let div0;
    	let i;
    	let i_class_value;
    	let t0;
    	let div1;

    	let t1_value = (/*item*/ ctx[3].name
    	? /*item*/ ctx[3].name
    	: /*item*/ ctx[3].component.name) + "";

    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[2](/*item*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			i = element("i");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(i, "class", i_class_value = "" + (/*item*/ ctx[3].icon + " icon" + " svelte-k6yf5z"));
    			add_location(i, file$3, 14, 8, 702);
    			attr_dev(div0, "class", "col-lg-4 col-md-12 d-flex justify-content-center");
    			add_location(div0, file$3, 13, 4, 630);
    			attr_dev(div1, "class", "col-lg-8 col-md-12 d-sm-none d-md-block d-flex text-lg-start text-md-center title svelte-k6yf5z");
    			add_location(div1, file$3, 16, 4, 753);
    			attr_dev(div2, "class", "row g-0 shadow-sm item svelte-k6yf5z");
    			attr_dev(div2, "tabindex", "1");
    			add_location(div2, file$3, 12, 0, 513);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, i);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			append_dev(div2, t2);

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*list*/ 1 && i_class_value !== (i_class_value = "" + (/*item*/ ctx[3].icon + " icon" + " svelte-k6yf5z"))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*list*/ 1 && t1_value !== (t1_value = (/*item*/ ctx[3].name
    			? /*item*/ ctx[3].name
    			: /*item*/ ctx[3].component.name) + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(12:0) {#each list as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*list*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dispatch, list*/ 3) {
    				each_value = /*list*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TestCode', slots, []);
    	let { list = [] } = $$props; // {name: 'TestCode',icon: 'fas fa-tachometer-alt', component: AppPoll},
    	const dispatch = createEventDispatcher();
    	const writable_props = ['list'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TestCode> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => {
    		dispatch('activeTab', { activeTab: item.name });
    	};

    	$$self.$$set = $$props => {
    		if ('list' in $$props) $$invalidate(0, list = $$props.list);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		list,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) $$invalidate(0, list = $$props.list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [list, dispatch, click_handler];
    }

    class TestCode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { list: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TestCode",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get list() {
    		throw new Error("<TestCode>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<TestCode>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\JockTeller.svelte generated by Svelte v3.44.3 */

    const { console: console_1$1 } = globals;
    const file$2 = "src\\components\\JockTeller.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let button_1;
    	let t1;
    	let audio;
    	let t2;
    	let div0;
    	let img;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button_1 = element("button");
    			button_1.textContent = "tell me a Jock";
    			t1 = space();
    			audio = element("audio");
    			t2 = space();
    			div0 = element("div");
    			img = element("img");
    			attr_dev(button_1, "id", "button");
    			attr_dev(button_1, "class", "svelte-136ekeo");
    			add_location(button_1, file$2, 132, 4, 5498);
    			attr_dev(audio, "id", "audio");
    			audio.controls = true;
    			add_location(audio, file$2, 133, 4, 5547);
    			if (!src_url_equal(img.src, img_src_value = "images/spinner.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$2, 134, 22, 5692);
    			attr_dev(div0, "id", "loading");
    			add_location(div0, file$2, 134, 4, 5674);
    			attr_dev(div1, "class", "container svelte-136ekeo");
    			add_location(div1, file$2, 131, 0, 5469);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button_1);
    			append_dev(div1, t1);
    			append_dev(div1, audio);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, img);

    			if (!mounted) {
    				dispose = listen_dev(audio, "loadeddata", /*loadeddata_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
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

    const jockAudioAPIkey = '06d028ad85324cd89d340dfd22ace56b';

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('JockTeller', slots, []);
    	let button = null;
    	let audioElement = null;
    	let loading = null;
    	const jockTextURL = `https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,sexist,explicit`;

    	const VoiceRSS = {
    		speech(e) {
    			console.log(e);
    			(this._validate(e), this._request(e));
    		},
    		_validate(e) {
    			if (!e) throw "The settings are undefined";
    			if (!e.key) throw "The API key is undefined";
    			if (!e.src) throw "The text is undefined";
    			if (!e.hl) throw "The language is undefined";

    			if (e.c && "auto" != e.c.toLowerCase()) {
    				var a = !1;

    				switch (e.c.toLowerCase()) {
    					case "mp3":
    						a = new Audio().canPlayType("audio/mpeg").replace("no", "");
    						break;
    					case "wav":
    						a = new Audio().canPlayType("audio/wav").replace("no", "");
    						break;
    					case "aac":
    						a = new Audio().canPlayType("audio/aac").replace("no", "");
    						break;
    					case "ogg":
    						a = new Audio().canPlayType("audio/ogg").replace("no", "");
    						break;
    					case "caf":
    						a = new Audio().canPlayType("audio/x-caf").replace("no", "");
    				}

    				if (!a) throw "The browser does not support the audio codec " + e.c;
    			}
    		},
    		_request(e) {
    			var a = this._buildRequest(e), t = this._getXHR();

    			(t.onreadystatechange = function () {
    				if (4 == t.readyState && 200 == t.status) {
    					if (0 == t.responseText.indexOf("ERROR")) throw t.responseText;

    					($$invalidate(0, audioElement.src = t.responseText, audioElement), // audioElement.play()
    					audioElement.play());

    					console.log(e.audioElement);
    				}
    			}, t.open("POST", "https://api.voicerss.org/", !0), t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"), t.send(a));
    		},
    		_buildRequest(e) {
    			var a = e.c && "auto" != e.c.toLowerCase()
    			? e.c
    			: this._detectCodec();

    			return "key=" + (e.key || "") + "&src=" + (e.src || "") + "&hl=" + (e.hl || "") + "&r=" + (e.r || "") + "&c=" + (a || "") + "&f=" + (e.f || "") + "&ssml=" + (e.ssml || "") + "&b64=true";
    		},
    		_detectCodec() {
    			var e = new Audio();

    			return e.canPlayType("audio/mpeg").replace("no", "")
    			? "mp3"
    			: e.canPlayType("audio/wav").replace("no", "")
    				? "wav"
    				: e.canPlayType("audio/aac").replace("no", "")
    					? "aac"
    					: e.canPlayType("audio/ogg").replace("no", "")
    						? "ogg"
    						: e.canPlayType("audio/x-caf").replace("no", "")
    							? "caf"
    							: "";
    		},
    		_getXHR() {
    			try {
    				return new XMLHttpRequest();
    			} catch(e) {
    				
    			}

    			try {
    				return new ActiveXObject("Msxml3.XMLHTTP");
    			} catch(e) {
    				
    			}

    			try {
    				return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    			} catch(e) {
    				
    			}

    			try {
    				return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    			} catch(e) {
    				
    			}

    			try {
    				return new ActiveXObject("Msxml2.XMLHTTP");
    			} catch(e) {
    				
    			}

    			try {
    				return new ActiveXObject("Microsoft.XMLHTTP");
    			} catch(e) {
    				
    			}

    			throw "The browser does not support HTTP request";
    		}
    	};

    	let jockText = 'hello';

    	const getJock = async () => {
    		try {
    			const response = await fetch(jockTextURL);
    			const data = await response.json();
    			console.log(data);

    			if (data.type == 'twopart') {
    				jockText = `${data.setup} ... ${data.delivery}`;
    			} else {
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
    				audioElement
    			});

    			toggle(button);
    		} catch(error) {
    			console.log(error);
    		}
    	};

    	const toggle = a => {
    		a.disabled = !a.disabled;
    		console.log(a.disabled);
    	};

    	onMount(() => {
    		// audioElement = document.getElementById('audio');
    		$$invalidate(0, audioElement = document.getElementById('audio'));

    		button = document.getElementById('button');
    		$$invalidate(1, loading = document.getElementById('loading'));
    		$$invalidate(1, loading.style.display = 'none', loading);
    		$$invalidate(0, audioElement.style.display = 'none', audioElement);
    		console.log(loading.style.display);
    		console.log('loading:' + loading.visible);

    		button.addEventListener('click', () => {
    			getJock();
    			$$invalidate(1, loading.hidded = true, loading);
    			$$invalidate(1, loading.style.display = 'block', loading);
    		});

    		audioElement.addEventListener('ended', () => {
    			(toggle(button), $$invalidate(0, audioElement.style.display = 'none', audioElement));
    		});
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<JockTeller> was created with unknown prop '${key}'`);
    	});

    	const loadeddata_handler = () => {
    		($$invalidate(1, loading.style.display = 'none', loading), $$invalidate(0, audioElement.style.display = 'block', audioElement));
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		button,
    		audioElement,
    		loading,
    		jockTextURL,
    		jockAudioAPIkey,
    		VoiceRSS,
    		jockText,
    		getJock,
    		toggle
    	});

    	$$self.$inject_state = $$props => {
    		if ('button' in $$props) button = $$props.button;
    		if ('audioElement' in $$props) $$invalidate(0, audioElement = $$props.audioElement);
    		if ('loading' in $$props) $$invalidate(1, loading = $$props.loading);
    		if ('jockText' in $$props) jockText = $$props.jockText;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [audioElement, loading, loadeddata_handler];
    }

    class JockTeller extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "JockTeller",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\Sidebar.svelte generated by Svelte v3.44.3 */

    const { console: console_1 } = globals;

    const file$1 = "src\\components\\Sidebar.svelte";

    // (81:47) 
    function create_if_block_10(ctx) {
    	let daterange;
    	let current;
    	daterange = new DateRange({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(daterange.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(daterange, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(daterange.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(daterange.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(daterange, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(81:47) ",
    		ctx
    	});

    	return block;
    }

    // (79:48) 
    function create_if_block_9(ctx) {
    	let actiontest;
    	let current;
    	actiontest = new ActionTest({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(actiontest.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(actiontest, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(actiontest.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(actiontest.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(actiontest, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(79:48) ",
    		ctx
    	});

    	return block;
    }

    // (77:44) 
    function create_if_block_8(ctx) {
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
    		p: noop,
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
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(77:44) ",
    		ctx
    	});

    	return block;
    }

    // (75:44) 
    function create_if_block_7(ctx) {
    	let toggle;
    	let updating_value;
    	let current;

    	function toggle_value_binding(value) {
    		/*toggle_value_binding*/ ctx[5](value);
    	}

    	let toggle_props = {
    		width: "10rem",
    		onText: "on",
    		offText: "off"
    	};

    	if (/*value*/ ctx[0] !== void 0) {
    		toggle_props.value = /*value*/ ctx[0];
    	}

    	toggle = new Toggle({ props: toggle_props, $$inline: true });
    	binding_callbacks.push(() => bind(toggle, 'value', toggle_value_binding));

    	const block = {
    		c: function create() {
    			create_component(toggle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toggle, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const toggle_changes = {};

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				toggle_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			toggle.$set(toggle_changes);
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
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(75:44) ",
    		ctx
    	});

    	return block;
    }

    // (73:48) 
    function create_if_block_6(ctx) {
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
    		p: noop,
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
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(73:48) ",
    		ctx
    	});

    	return block;
    }

    // (71:45) 
    function create_if_block_5(ctx) {
    	let apppoll;
    	let current;
    	apppoll = new AppPoll({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(apppoll.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(apppoll, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(apppoll.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(apppoll.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(apppoll, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(71:45) ",
    		ctx
    	});

    	return block;
    }

    // (69:52) 
    function create_if_block_4(ctx) {
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
    		p: noop,
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(69:52) ",
    		ctx
    	});

    	return block;
    }

    // (67:52) 
    function create_if_block_3(ctx) {
    	let infinitescroll;
    	let current;
    	infinitescroll = new InfiniteScroll({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(infinitescroll.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(infinitescroll, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infinitescroll.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infinitescroll.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(infinitescroll, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(67:52) ",
    		ctx
    	});

    	return block;
    }

    // (65:51) 
    function create_if_block_2(ctx) {
    	let loadingcircle;
    	let current;
    	loadingcircle = new LoadingCircle({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingcircle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingcircle, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingcircle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingcircle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingcircle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(65:51) ",
    		ctx
    	});

    	return block;
    }

    // (63:48) 
    function create_if_block_1(ctx) {
    	let jockteller;
    	let current;
    	jockteller = new JockTeller({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(jockteller.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(jockteller, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(jockteller.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(jockteller.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(jockteller, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(63:48) ",
    		ctx
    	});

    	return block;
    }

    // (61:12) {#if activeTab == 'TestCode'}
    function create_if_block(ctx) {
    	let testcode;
    	let current;
    	testcode = new TestCode({ $$inline: true });
    	testcode.$on("click", /*click_handler*/ ctx[4]);

    	const block = {
    		c: function create() {
    			create_component(testcode.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(testcode, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(testcode.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(testcode.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(testcode, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(61:12) {#if activeTab == 'TestCode'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div4;
    	let div1;
    	let div0;
    	let testcode;
    	let t;
    	let div3;
    	let div2;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	testcode = new TestCode({
    			props: { list: /*sidebarItems*/ ctx[2] },
    			$$inline: true
    		});

    	testcode.$on("activeTab", /*activeTab_handler*/ ctx[3]);

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4,
    		create_if_block_5,
    		create_if_block_6,
    		create_if_block_7,
    		create_if_block_8,
    		create_if_block_9,
    		create_if_block_10
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*activeTab*/ ctx[1] == 'TestCode') return 0;
    		if (/*activeTab*/ ctx[1] == 'JockTeller') return 1;
    		if (/*activeTab*/ ctx[1] == 'LoadingCircle') return 2;
    		if (/*activeTab*/ ctx[1] == 'InfiniteScroll') return 3;
    		if (/*activeTab*/ ctx[1] == 'QuoteGenerator') return 4;
    		if (/*activeTab*/ ctx[1] == 'AppPoll') return 5;
    		if (/*activeTab*/ ctx[1] == "Calculator") return 6;
    		if (/*activeTab*/ ctx[1] == 'Toggle') return 7;
    		if (/*activeTab*/ ctx[1] == 'Circle') return 8;
    		if (/*activeTab*/ ctx[1] == 'ActionTest') return 9;
    		if (/*activeTab*/ ctx[1] == 'DateRange') return 10;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(testcode.$$.fragment);
    			t = space();
    			div3 = element("div");
    			div2 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "parent svelte-1x0mfv1");
    			add_location(div0, file$1, 44, 12, 2321);
    			attr_dev(div1, "class", "col-2");
    			add_location(div1, file$1, 43, 8, 2288);
    			attr_dev(div2, "class", "content svelte-1x0mfv1");
    			add_location(div2, file$1, 59, 8, 2986);
    			attr_dev(div3, "class", "col");
    			add_location(div3, file$1, 57, 4, 2946);
    			attr_dev(div4, "class", "row g-0 m-0");
    			add_location(div4, file$1, 41, 0, 2246);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			mount_component(testcode, div0, null);
    			append_dev(div4, t);
    			append_dev(div4, div3);
    			append_dev(div3, div2);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
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
    					} else {
    						if_block.p(ctx, dirty);
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
    			transition_in(testcode.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(testcode.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(testcode);

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
    	let value = false;

    	// let list = ['TestCode','InfiniteScroll','QuoteGenerator','Calculator',
    	// 'Circle','Toggle','AppPoll','LoadingCircle','InfiniteScroll','QuoteGenerator','Calculator',
    	// 'Circle','Toggle','AppPoll',];
    	let sidebarItems = [
    		{
    			name: 'TestCode',
    			icon: 'fas fa-tachometer-alt',
    			component: 'TestCode'
    		},
    		{
    			name: 'LoadingCircle',
    			icon: 'fas fa-tachometer-alt',
    			component: 'JockTeller'
    		},
    		{
    			name: 'JockTeller',
    			icon: 'fas fa-tachometer-alt',
    			component: 'LoadingCircle'
    		},
    		{
    			name: 'QuoteGenerator',
    			icon: 'fas fa-tachometer-alt',
    			component: 'QuoteGenerator'
    		},
    		{
    			name: 'InfiniteScroll',
    			icon: 'fas fa-tachometer-alt',
    			component: 'InfiniteScroll'
    		},
    		{
    			name: 'Calculator',
    			icon: 'fas fa-tachometer-alt',
    			component: 'Calculator'
    		},
    		{
    			name: 'Circle',
    			icon: 'fas fa-tachometer-alt',
    			component: 'Circle'
    		},
    		{
    			name: 'Toggle',
    			icon: 'fas fa-tachometer-alt',
    			component: 'Toggle'
    		},
    		{
    			name: 'AppPoll',
    			icon: 'fas fa-tachometer-alt',
    			component: 'AppPoll'
    		},
    		{
    			name: 'ActionTest',
    			icon: 'fas fa-tachometer-alt',
    			component: 'ActionTest'
    		},
    		{
    			name: 'DateRange',
    			icon: 'fas fa-tachometer-alt',
    			component: 'DateRange'
    		},
    		{
    			name: 'TestCode',
    			icon: 'fas fa-tachometer-alt',
    			component: 'TestCode'
    		},
    		{
    			name: 'QuoteGenerator',
    			icon: 'fas fa-tachometer-alt',
    			component: 'QuoteGenerator'
    		},
    		{
    			name: 'InfiniteScroll',
    			icon: 'fas fa-tachometer-alt',
    			component: 'InfiniteScroll'
    		},
    		{
    			name: 'Calculator',
    			icon: 'fas fa-tachometer-alt',
    			component: 'Calculator'
    		},
    		{
    			name: 'Circle',
    			icon: 'fas fa-tachometer-alt',
    			component: 'Circle'
    		},
    		{
    			name: 'Toggle',
    			icon: 'fas fa-tachometer-alt',
    			component: 'Toggle'
    		},
    		{
    			name: 'AppPoll',
    			icon: 'fas fa-tachometer-alt',
    			component: 'AppPoll'
    		},
    		{
    			name: 'ActionTest',
    			icon: 'fas fa-tachometer-alt',
    			component: 'ActionTest'
    		},
    		{
    			name: 'DateRange',
    			icon: 'fas fa-tachometer-alt',
    			component: 'DateRange'
    		}
    	];

    	let activeTab = 'LoadingCircle';
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Sidebar> was created with unknown prop '${key}'`);
    	});

    	const activeTab_handler = event => {
    		$$invalidate(1, activeTab = event.detail.activeTab);
    	};

    	const click_handler = () => {
    		console.log(activeTab);
    	};

    	function toggle_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	$$self.$capture_state = () => ({
    		AppPoll,
    		QuoteGenerator,
    		Toggle,
    		Circle,
    		Calculator,
    		ActionTest,
    		DateRange,
    		InfiniteScroll,
    		TestCode,
    		LoadingCircle,
    		JockTeller,
    		value,
    		sidebarItems,
    		activeTab
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('sidebarItems' in $$props) $$invalidate(2, sidebarItems = $$props.sidebarItems);
    		if ('activeTab' in $$props) $$invalidate(1, activeTab = $$props.activeTab);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 1) {
    			if (value) {
    				console.log(value);
    			}
    		}
    	};

    	return [
    		value,
    		activeTab,
    		sidebarItems,
    		activeTab_handler,
    		click_handler,
    		toggle_value_binding
    	];
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
