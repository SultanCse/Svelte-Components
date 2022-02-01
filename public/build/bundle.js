
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
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
            return noop$1;
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
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now$2 = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty$1() {
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
            return noop$1;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop$1;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now$2() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop$1, css } = fn(node, { from, to }, params);
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
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
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
                update$1(component.$$);
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
    function update$1($$) {
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
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now$2() + delay;
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
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now$2() + delay;
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

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind$2(component, name, callback) {
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
            update: noop$1,
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
            this.$destroy = noop$1;
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

    /* src\elements\SideBar.svelte generated by Svelte v3.44.3 */

    const { console: console_1$8 } = globals;
    const file$v = "src\\elements\\SideBar.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (18:0) {#each list as item}
    function create_each_block$9(ctx) {
    	let div2;
    	let div0;
    	let i;
    	let i_class_value;
    	let t0;
    	let div1;

    	let t1_value = (/*item*/ ctx[4].name
    	? /*item*/ ctx[4].name
    	: /*item*/ ctx[4].component.name) + "";

    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*item*/ ctx[4]);
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
    			attr_dev(i, "class", i_class_value = "" + (/*item*/ ctx[4].icon + " icon" + " svelte-vtqfxs"));
    			add_location(i, file$v, 27, 6, 928);
    			attr_dev(div0, "class", "col-lg-4 col-md-12 d-flex justify-content-center");
    			add_location(div0, file$v, 26, 4, 858);
    			attr_dev(div1, "class", "col-lg-8 col-md-12 d-sm-none d-md-block d-flex text-lg-start text-md-center title svelte-vtqfxs");
    			add_location(div1, file$v, 29, 4, 976);
    			attr_dev(div2, "class", "row g-0 shadow-sm item svelte-vtqfxs");
    			attr_dev(div2, "tabindex", "1");

    			toggle_class(div2, "select", /*selected*/ ctx[1] == /*item*/ ctx[4].name
    			? true
    			: false);

    			add_location(div2, file$v, 18, 2, 647);
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

    			if (dirty & /*list*/ 1 && i_class_value !== (i_class_value = "" + (/*item*/ ctx[4].icon + " icon" + " svelte-vtqfxs"))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*list*/ 1 && t1_value !== (t1_value = (/*item*/ ctx[4].name
    			? /*item*/ ctx[4].name
    			: /*item*/ ctx[4].component.name) + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*selected, list*/ 3) {
    				toggle_class(div2, "select", /*selected*/ ctx[1] == /*item*/ ctx[4].name
    				? true
    				: false);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(18:0) {#each list as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let each_1_anchor;
    	let each_value = /*list*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
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
    			if (dirty & /*selected, list, dispatch*/ 7) {
    				each_value = /*list*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$9(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$9(child_ctx);
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
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SideBar', slots, []);
    	let { list = [] } = $$props; // {name: 'TestCode',icon: 'fas fa-tachometer-alt', component: AppPoll},
    	let { selected = '' } = $$props;
    	const dispatch = createEventDispatcher();

    	onMount(() => {
    		
    	}); // console.log(activeClass);

    	const writable_props = ['list', 'selected'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<SideBar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => {
    		dispatch('activeTab', { activeTab: item.name });
    	};

    	$$self.$$set = $$props => {
    		if ('list' in $$props) $$invalidate(0, list = $$props.list);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		list,
    		selected,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) $$invalidate(0, list = $$props.list);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selected*/ 2) {
    			console.log(selected);
    		}
    	};

    	return [list, selected, dispatch, click_handler];
    }

    class SideBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$v, create_fragment$v, safe_not_equal, { list: 0, selected: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SideBar",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get list() {
    		throw new Error("<SideBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<SideBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<SideBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<SideBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\BounchingHeadline.svelte generated by Svelte v3.44.3 */

    const file$u = "src\\components\\BounchingHeadline.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (8:4) {#each arr as item, index}
    function create_each_block$8(ctx) {
    	let span;
    	let t_value = /*item*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			set_style(span, "--i", /*index*/ ctx[4] + 1);
    			attr_dev(span, "class", "svelte-1gxxbkg");
    			add_location(span, file$u, 8, 6, 161);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(8:4) {#each arr as item, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let div;
    	let p;
    	let each_value = /*arr*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(p, "class", "svelte-1gxxbkg");
    			add_location(p, file$u, 6, 2, 118);
    			attr_dev(div, "class", "parent svelte-1gxxbkg");
    			add_location(div, file$u, 5, 0, 94);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(p, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*arr*/ 1) {
    				each_value = /*arr*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(p, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BounchingHeadline', slots, []);
    	let { header = '...welcome...' } = $$props;
    	let arr = header.split('');
    	const writable_props = ['header'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BounchingHeadline> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('header' in $$props) $$invalidate(1, header = $$props.header);
    	};

    	$$self.$capture_state = () => ({ header, arr });

    	$$self.$inject_state = $$props => {
    		if ('header' in $$props) $$invalidate(1, header = $$props.header);
    		if ('arr' in $$props) $$invalidate(0, arr = $$props.arr);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [arr, header];
    }

    class BounchingHeadline extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$u, create_fragment$u, safe_not_equal, { header: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BounchingHeadline",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get header() {
    		throw new Error("<BounchingHeadline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<BounchingHeadline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\NavBar.svelte generated by Svelte v3.44.3 */
    const file$t = "src\\components\\NavBar.svelte";

    function create_fragment$t(ctx) {
    	let div5;
    	let div1;
    	let nav;
    	let div0;
    	let a0;
    	let img;
    	let img_src_value;
    	let div1_class_value;
    	let t0;
    	let div4;
    	let div3;
    	let a1;
    	let i;
    	let i_class_value;
    	let t1;
    	let bounchingheadline;
    	let t2;
    	let div2;
    	let current;
    	let mounted;
    	let dispose;
    	const bounchingheadline_spread_levels = [/*$$restProps*/ ctx[3]];
    	let bounchingheadline_props = {};

    	for (let i = 0; i < bounchingheadline_spread_levels.length; i += 1) {
    		bounchingheadline_props = assign(bounchingheadline_props, bounchingheadline_spread_levels[i]);
    	}

    	bounchingheadline = new BounchingHeadline({
    			props: bounchingheadline_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div1 = element("div");
    			nav = element("nav");
    			div0 = element("div");
    			a0 = element("a");
    			img = element("img");
    			t0 = space();
    			div4 = element("div");
    			div3 = element("div");
    			a1 = element("a");
    			i = element("i");
    			t1 = space();
    			create_component(bounchingheadline.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			if (!src_url_equal(img.src, img_src_value = "images/svelte.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "width", "30px");
    			attr_dev(img, "height", "24px");
    			attr_dev(img, "class", "img-thumbnail");
    			add_location(img, file$t, 25, 10, 629);
    			attr_dev(a0, "class", "navbar-brand");
    			attr_dev(a0, "href", "https://www.google.com");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$t, 24, 8, 547);
    			attr_dev(div0, "class", "container-fluid justify-content-center");
    			add_location(div0, file$t, 23, 6, 485);
    			attr_dev(nav, "class", "navbar navbar-light bg-danger");
    			add_location(nav, file$t, 22, 4, 434);
    			attr_dev(div1, "class", div1_class_value = "col-" + /*navColSize*/ ctx[1] + " p-0" + " svelte-ad0p5z");
    			attr_dev(div1, "id", "col");
    			add_location(div1, file$t, 21, 2, 385);
    			attr_dev(i, "class", i_class_value = "fas fa-arrow-" + /*arrow*/ ctx[0] + " px-3");
    			add_location(i, file$t, 39, 8, 971);
    			attr_dev(a1, "class", "navbar-brand");
    			attr_dev(a1, "href", "#");
    			add_location(a1, file$t, 38, 6, 928);
    			add_location(div2, file$t, 42, 6, 1099);
    			attr_dev(div3, "class", "navbar navbar-light bg-light p-0");
    			add_location(div3, file$t, 37, 4, 874);
    			attr_dev(div4, "class", "col p-0");
    			add_location(div4, file$t, 36, 2, 847);
    			attr_dev(div5, "class", "row g-0 m-0 sticky-top");
    			add_location(div5, file$t, 20, 0, 345);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, nav);
    			append_dev(nav, div0);
    			append_dev(div0, a0);
    			append_dev(a0, img);
    			append_dev(div5, t0);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div3, a1);
    			append_dev(a1, i);
    			append_dev(div3, t1);
    			mount_component(bounchingheadline, div3, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(i, "click", /*toggleArrow*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*navColSize*/ 2 && div1_class_value !== (div1_class_value = "col-" + /*navColSize*/ ctx[1] + " p-0" + " svelte-ad0p5z")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty & /*arrow*/ 1 && i_class_value !== (i_class_value = "fas fa-arrow-" + /*arrow*/ ctx[0] + " px-3")) {
    				attr_dev(i, "class", i_class_value);
    			}

    			const bounchingheadline_changes = (dirty & /*$$restProps*/ 8)
    			? get_spread_update(bounchingheadline_spread_levels, [get_spread_object(/*$$restProps*/ ctx[3])])
    			: {};

    			bounchingheadline.$set(bounchingheadline_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bounchingheadline.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bounchingheadline.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(bounchingheadline);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	const omit_props_names = [];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavBar', slots, []);
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

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    	};

    	$$self.$capture_state = () => ({
    		BounchingHeadline,
    		arrow,
    		navColSize,
    		toggleArrow
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('arrow' in $$props) $$invalidate(0, arrow = $$new_props.arrow);
    		if ('navColSize' in $$props) $$invalidate(1, navColSize = $$new_props.navColSize);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [arrow, navColSize, toggleArrow, $$restProps];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$t.name
    		});
    	}
    }

    /* src\pollevent\Header.svelte generated by Svelte v3.44.3 */

    const file$s = "src\\pollevent\\Header.svelte";

    function create_fragment$s(ctx) {
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
    			add_location(img, file$s, 2, 8, 28);
    			attr_dev(h1, "class", "svelte-fu2kfn");
    			add_location(h1, file$s, 1, 4, 14);
    			attr_dev(header, "class", "svelte-fu2kfn");
    			add_location(header, file$s, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(h1, img);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props) {
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
    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$s.name
    		});
    	}
    }

    /* src\pollevent\Footer.svelte generated by Svelte v3.44.3 */

    const file$r = "src\\pollevent\\Footer.svelte";

    function create_fragment$r(ctx) {
    	let footer;
    	let div;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			div.textContent = "@Copyright 2021 Poll";
    			attr_dev(div, "class", "copyright svelte-15ik3qo");
    			add_location(div, file$r, 1, 4, 14);
    			attr_dev(footer, "class", "svelte-15ik3qo");
    			add_location(footer, file$r, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props) {
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
    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$r.name
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
    const file$q = "src\\elements\\Tabs.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (11:8) {#each items as item}
    function create_each_block$7(ctx) {
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
    			add_location(div, file$q, 12, 16, 351);
    			attr_dev(li, "class", "svelte-7s9uir");
    			add_location(li, file$q, 11, 12, 286);
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
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(11:8) {#each items as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$q(ctx) {
    	let div;
    	let ul;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-7s9uir");
    			add_location(ul, file$q, 9, 4, 237);
    			add_location(div, file$q, 8, 0, 226);
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
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
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
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { items: 0, activeItem: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$q.name
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
    function writable(value, start = noop$1) {
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
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
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

    const file$p = "src\\elements\\Button.svelte";

    function create_fragment$p(ctx) {
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
    			add_location(button, file$p, 7, 0, 121);
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
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { type: 0, flat: 1, inverse: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$p.name
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

    const { console: console_1$7 } = globals;
    const file$o = "src\\pollevent\\CreatePollForm.svelte";

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

    function create_fragment$o(ctx) {
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
    			add_location(label0, file$o, 53, 12, 1797);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "question");
    			attr_dev(input0, "class", "svelte-ed1edj");
    			toggle_class(input0, "valid", /*invalid*/ ctx[2]);
    			add_location(input0, file$o, 54, 12, 1855);
    			attr_dev(div0, "class", "error svelte-ed1edj");
    			add_location(div0, file$o, 55, 12, 1953);
    			attr_dev(div1, "class", "form-field svelte-ed1edj");
    			add_location(div1, file$o, 52, 8, 1759);
    			attr_dev(label1, "for", "answer1");
    			attr_dev(label1, "class", "svelte-ed1edj");
    			add_location(label1, file$o, 58, 12, 2059);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "answer1");
    			attr_dev(input1, "class", "svelte-ed1edj");
    			toggle_class(input1, "valid", /*invalid*/ ctx[2]);
    			add_location(input1, file$o, 59, 12, 2111);
    			attr_dev(div2, "class", "error svelte-ed1edj");
    			add_location(div2, file$o, 60, 12, 2207);
    			attr_dev(div3, "class", "form-field svelte-ed1edj");
    			add_location(div3, file$o, 57, 8, 2021);
    			attr_dev(label2, "for", "answer2");
    			attr_dev(label2, "class", "svelte-ed1edj");
    			add_location(label2, file$o, 63, 12, 2312);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "answer2");
    			attr_dev(input2, "class", "svelte-ed1edj");
    			toggle_class(input2, "valid", /*invalid*/ ctx[2]);
    			add_location(input2, file$o, 64, 12, 2364);
    			attr_dev(div4, "class", "error svelte-ed1edj");
    			add_location(div4, file$o, 65, 12, 2460);
    			attr_dev(div5, "class", "form-field svelte-ed1edj");
    			add_location(div5, file$o, 62, 8, 2274);
    			attr_dev(form, "class", "svelte-ed1edj");
    			add_location(form, file$o, 51, 4, 1698);
    			add_location(div6, file$o, 50, 0, 1662);
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
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$o($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<CreatePollForm> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CreatePollForm",
    			options,
    			id: create_fragment$o.name
    		});
    	}
    }

    /* src\elements\Card.svelte generated by Svelte v3.44.3 */

    const file$n = "src\\elements\\Card.svelte";

    function create_fragment$n(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "card svelte-cdnta8");
    			add_location(div, file$n, 2, 0, 21);
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
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$n.name
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
            const start = now$2() + delay;
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
    const file$m = "src\\pollevent\\PollDetails.svelte";

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
    			add_location(h3, file$m, 39, 8, 1227);
    			attr_dev(p, "class", "svelte-a8769z");
    			add_location(p, file$m, 40, 8, 1261);
    			attr_dev(div0, "class", "percent percent-1 svelte-a8769z");
    			set_style(div0, "width", /*$value1*/ ctx[2] + "%");
    			add_location(div0, file$m, 42, 12, 1379);
    			attr_dev(span0, "class", "svelte-a8769z");
    			add_location(span0, file$m, 43, 12, 1456);
    			attr_dev(div1, "class", "answer svelte-a8769z");
    			add_location(div1, file$m, 41, 8, 1301);
    			attr_dev(div2, "class", "percent percent-2 svelte-a8769z");
    			set_style(div2, "width", /*$value2*/ ctx[3] + "%");
    			add_location(div2, file$m, 46, 12, 1598);
    			attr_dev(span1, "class", "svelte-a8769z");
    			add_location(span1, file$m, 47, 12, 1675);
    			attr_dev(div3, "class", "answer svelte-a8769z");
    			add_location(div3, file$m, 45, 8, 1524);
    			attr_dev(div4, "class", "delete svelte-a8769z");
    			add_location(div4, file$m, 49, 8, 1755);
    			attr_dev(div5, "class", "poll");
    			add_location(div5, file$m, 38, 4, 1199);
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

    function create_fragment$m(ctx) {
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
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { poll: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PollDetails",
    			options,
    			id: create_fragment$m.name
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
    const file$l = "src\\pollevent\\PollList.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (9:4) {#each $PollStore as poll (poll.id)}
    function create_each_block$6(key_1, ctx) {
    	let div;
    	let polldetails;
    	let t;
    	let div_intro;
    	let div_outro;
    	let rect;
    	let stop_animation = noop$1;
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
    			add_location(div, file$l, 9, 4, 297);
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
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(9:4) {#each $PollStore as poll (poll.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$PollStore*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*poll*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context$6, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$6(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "poll-list svelte-1yuzuh4");
    			add_location(div, file$l, 7, 0, 226);
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
    				validate_each_keys(ctx, each_value, get_each_context$6, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, fix_and_outro_and_destroy_block, create_each_block$6, null, get_each_context$6);
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
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PollList",
    			options,
    			id: create_fragment$l.name
    		});
    	}
    }

    /* src\pollevent\AppPoll.svelte generated by Svelte v3.44.3 */
    const file$k = "src\\pollevent\\AppPoll.svelte";

    // (19:41) 
    function create_if_block_1$2(ctx) {
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
    		p: noop$1,
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
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(19:41) ",
    		ctx
    	});

    	return block;
    }

    // (17:2) {#if activeItem=="Current Polls"}
    function create_if_block$4(ctx) {
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
    		p: noop$1,
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
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(17:2) {#if activeItem==\\\"Current Polls\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
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
    	const if_block_creators = [create_if_block$4, create_if_block_1$2];
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
    			add_location(main, file$k, 14, 0, 419);
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
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
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
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AppPoll",
    			options,
    			id: create_fragment$k.name
    		});
    	}
    }

    /* src\components\QuoteGenerator.svelte generated by Svelte v3.44.3 */

    const { console: console_1$6 } = globals;
    const file$j = "src\\components\\QuoteGenerator.svelte";

    function create_fragment$j(ctx) {
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
    			add_location(h5, file$j, 33, 6, 1187);
    			attr_dev(p0, "class", "card-text float-end");
    			set_style(p0, "color", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(p0, file$j, 34, 6, 1292);
    			attr_dev(div0, "class", "card-body transition svelte-1xrmoqj");
    			add_location(div0, file$j, 32, 4, 1145);
    			attr_dev(i0, "class", "bi bi-twitter p-2 rounded transition svelte-1xrmoqj");
    			set_style(i0, "cursor", "pointer");
    			set_style(i0, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(i0, file$j, 38, 6, 1509);
    			attr_dev(i1, "class", "bi bi-whatsapp p-2 rounded transition svelte-1xrmoqj");
    			set_style(i1, "cursor", "pointer");
    			set_style(i1, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(i1, file$j, 39, 6, 1627);
    			attr_dev(div1, "class", "float-start mt-2 te");
    			add_location(div1, file$j, 37, 6, 1467);
    			attr_dev(p1, "class", "rounded p-2 transition svelte-1xrmoqj");
    			set_style(p1, "cursor", "pointer");
    			set_style(p1, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(p1, file$j, 43, 8, 1843);
    			attr_dev(div2, "class", "float-end");
    			add_location(div2, file$j, 42, 6, 1810);
    			attr_dev(div3, "class", "card-footer text-white mt-2 border-top-0 bg-transparent");
    			add_location(div3, file$j, 36, 4, 1390);
    			attr_dev(div4, "class", "card transition border-success py-4 px-2 mb-3 svelte-1xrmoqj");
    			add_location(div4, file$j, 31, 2, 1080);
    			attr_dev(div5, "class", "container mother transition d-flex justify-content-center svelte-1xrmoqj");
    			set_style(div5, "background", /*colors*/ ctx[3][/*colorIndex*/ ctx[0]]);
    			add_location(div5, file$j, 30, 0, 964);
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
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			dispose();
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

    function instance$j($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<QuoteGenerator> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QuoteGenerator",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    /* src\elements\Toggle.svelte generated by Svelte v3.44.3 */

    const file$i = "src\\elements\\Toggle.svelte";

    function create_fragment$i(ctx) {
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
    			add_location(input, file$i, 8, 4, 224);
    			attr_dev(p0, "class", "svelte-kbm3bv");
    			add_location(p0, file$i, 11, 32, 433);
    			attr_dev(div0, "class", "on col");
    			add_location(div0, file$i, 11, 12, 413);
    			attr_dev(p1, "class", "svelte-kbm3bv");
    			add_location(p1, file$i, 12, 33, 490);
    			attr_dev(div1, "class", "off col");
    			add_location(div1, file$i, 12, 12, 469);
    			attr_dev(div2, "class", "row g-0 h-100 mw-50 text-center");
    			add_location(div2, file$i, 10, 8, 354);
    			attr_dev(div3, "class", "toggle__fill  svelte-kbm3bv");
    			add_location(div3, file$i, 9, 4, 317);
    			attr_dev(label, "class", "toggle svelte-kbm3bv");
    			attr_dev(label, "for", "mytoggle");
    			set_style(label, "--width", /*width*/ ctx[3]);
    			add_location(label, file$i, 7, 0, 156);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			input.checked = /*checkedValue*/ ctx[0];
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
    			if (dirty & /*checkedValue*/ 1) {
    				input.checked = /*checkedValue*/ ctx[0];
    			}

    			if (dirty & /*onText*/ 2) set_data_dev(t1, /*onText*/ ctx[1]);
    			if (dirty & /*offText*/ 4) set_data_dev(t3, /*offText*/ ctx[2]);

    			if (dirty & /*width*/ 8) {
    				set_style(label, "--width", /*width*/ ctx[3]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
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

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toggle', slots, []);
    	let { onText = '' } = $$props;
    	let { offText = '' } = $$props;
    	let { width = '80px' } = $$props;
    	let { checkedValue = false } = $$props;
    	const writable_props = ['onText', 'offText', 'width', 'checkedValue'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toggle> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		checkedValue = this.checked;
    		$$invalidate(0, checkedValue);
    	}

    	$$self.$$set = $$props => {
    		if ('onText' in $$props) $$invalidate(1, onText = $$props.onText);
    		if ('offText' in $$props) $$invalidate(2, offText = $$props.offText);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('checkedValue' in $$props) $$invalidate(0, checkedValue = $$props.checkedValue);
    	};

    	$$self.$capture_state = () => ({ onText, offText, width, checkedValue });

    	$$self.$inject_state = $$props => {
    		if ('onText' in $$props) $$invalidate(1, onText = $$props.onText);
    		if ('offText' in $$props) $$invalidate(2, offText = $$props.offText);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('checkedValue' in $$props) $$invalidate(0, checkedValue = $$props.checkedValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [checkedValue, onText, offText, width, input_change_handler];
    }

    class Toggle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			onText: 1,
    			offText: 2,
    			width: 3,
    			checkedValue: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toggle",
    			options,
    			id: create_fragment$i.name
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

    	get checkedValue() {
    		throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checkedValue(value) {
    		throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Calculator.svelte generated by Svelte v3.44.3 */

    const file$h = "src\\components\\Calculator.svelte";

    function create_fragment$h(ctx) {
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
    			add_location(span0, file$h, 26, 10, 640);
    			attr_dev(div0, "class", "col-md-2");
    			add_location(div0, file$h, 25, 8, 606);
    			attr_dev(p, "class", "svelte-17go6fw");
    			add_location(p, file$h, 29, 10, 761);
    			attr_dev(div1, "class", "col-md-8");
    			add_location(div1, file$h, 28, 8, 727);
    			attr_dev(span1, "class", "glyphicon glyphicon glyphicon-cog svelte-17go6fw");
    			add_location(span1, file$h, 32, 10, 838);
    			attr_dev(div2, "class", "col-md-2");
    			add_location(div2, file$h, 31, 8, 804);
    			attr_dev(div3, "class", "row header svelte-17go6fw");
    			add_location(div3, file$h, 24, 6, 572);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "");
    			attr_dev(input0, "class", "svelte-17go6fw");
    			add_location(input0, file$h, 40, 10, 1109);
    			attr_dev(div4, "class", "col-md-12 padding-reset svelte-17go6fw");
    			add_location(div4, file$h, 39, 8, 1060);
    			attr_dev(div5, "class", "row teaxtbox svelte-17go6fw");
    			add_location(div5, file$h, 38, 6, 1024);
    			attr_dev(input1, "type", "submit");
    			attr_dev(input1, "name", "");
    			input1.value = "√";
    			attr_dev(input1, "class", " svelte-17go6fw");
    			add_location(input1, file$h, 49, 10, 1369);
    			attr_dev(div6, "class", "col-3");
    			add_location(div6, file$h, 48, 8, 1338);
    			attr_dev(input2, "type", "submit");
    			attr_dev(input2, "name", "");
    			input2.value = "(";
    			attr_dev(input2, "class", " svelte-17go6fw");
    			add_location(input2, file$h, 52, 10, 1482);
    			attr_dev(div7, "class", "col-3");
    			add_location(div7, file$h, 51, 8, 1451);
    			attr_dev(input3, "type", "submit");
    			attr_dev(input3, "name", "");
    			input3.value = ")";
    			attr_dev(input3, "class", " svelte-17go6fw");
    			add_location(input3, file$h, 55, 10, 1589);
    			attr_dev(div8, "class", "col-3");
    			add_location(div8, file$h, 54, 8, 1558);
    			attr_dev(input4, "type", "submit");
    			attr_dev(input4, "name", "");
    			input4.value = "%";
    			attr_dev(input4, "class", " svelte-17go6fw");
    			add_location(input4, file$h, 58, 10, 1696);
    			attr_dev(div9, "class", "col-3");
    			add_location(div9, file$h, 57, 8, 1665);
    			attr_dev(input5, "type", "submit");
    			attr_dev(input5, "name", "");
    			attr_dev(input5, "class", "svelte-17go6fw");
    			add_location(input5, file$h, 62, 10, 1832);
    			attr_dev(div10, "class", "col-3");
    			add_location(div10, file$h, 61, 8, 1801);
    			attr_dev(input6, "type", "submit");
    			attr_dev(input6, "name", "");
    			attr_dev(input6, "class", "svelte-17go6fw");
    			add_location(input6, file$h, 65, 10, 1966);
    			attr_dev(div11, "class", "col-3");
    			add_location(div11, file$h, 64, 8, 1935);
    			attr_dev(input7, "type", "submit");
    			attr_dev(input7, "name", "");
    			attr_dev(input7, "class", "svelte-17go6fw");
    			add_location(input7, file$h, 68, 10, 2099);
    			attr_dev(div12, "class", "col-3");
    			add_location(div12, file$h, 67, 8, 2068);
    			attr_dev(input8, "type", "submit");
    			attr_dev(input8, "name", "");
    			attr_dev(input8, "class", " svelte-17go6fw");
    			add_location(input8, file$h, 71, 10, 2232);
    			attr_dev(div13, "class", "col-3");
    			add_location(div13, file$h, 70, 8, 2201);
    			attr_dev(input9, "type", "submit");
    			attr_dev(input9, "name", "");
    			input9.value = "4";
    			attr_dev(input9, "class", " svelte-17go6fw");
    			add_location(input9, file$h, 75, 10, 2407);
    			attr_dev(div14, "class", "col-3");
    			add_location(div14, file$h, 74, 8, 2376);
    			attr_dev(input10, "type", "submit");
    			attr_dev(input10, "name", "");
    			input10.value = "5";
    			attr_dev(input10, "class", " svelte-17go6fw");
    			add_location(input10, file$h, 78, 10, 2542);
    			attr_dev(div15, "class", "col-3");
    			add_location(div15, file$h, 77, 8, 2511);
    			attr_dev(input11, "type", "submit");
    			attr_dev(input11, "name", "");
    			input11.value = "6";
    			attr_dev(input11, "class", " svelte-17go6fw");
    			add_location(input11, file$h, 81, 10, 2676);
    			attr_dev(div16, "class", "col-3");
    			add_location(div16, file$h, 80, 8, 2645);
    			attr_dev(input12, "type", "submit");
    			attr_dev(input12, "name", "");
    			input12.value = "X";
    			attr_dev(input12, "class", " svelte-17go6fw");
    			add_location(input12, file$h, 84, 10, 2810);
    			attr_dev(div17, "class", "col-3");
    			add_location(div17, file$h, 83, 8, 2779);
    			attr_dev(input13, "type", "submit");
    			attr_dev(input13, "name", "");
    			input13.value = "1";
    			attr_dev(input13, "class", " svelte-17go6fw");
    			add_location(input13, file$h, 88, 10, 2973);
    			attr_dev(div18, "class", "col-3");
    			add_location(div18, file$h, 87, 8, 2942);
    			attr_dev(input14, "type", "submit");
    			attr_dev(input14, "name", "");
    			input14.value = "2";
    			attr_dev(input14, "class", " svelte-17go6fw");
    			add_location(input14, file$h, 91, 10, 3107);
    			attr_dev(div19, "class", "col-3");
    			add_location(div19, file$h, 90, 8, 3076);
    			attr_dev(input15, "type", "submit");
    			attr_dev(input15, "name", "");
    			input15.value = "3";
    			attr_dev(input15, "class", " svelte-17go6fw");
    			add_location(input15, file$h, 94, 10, 3241);
    			attr_dev(div20, "class", "col-3");
    			add_location(div20, file$h, 93, 8, 3210);
    			attr_dev(input16, "type", "submit");
    			attr_dev(input16, "name", "");
    			input16.value = "-";
    			attr_dev(input16, "class", " svelte-17go6fw");
    			add_location(input16, file$h, 97, 10, 3375);
    			attr_dev(div21, "class", "col-3");
    			add_location(div21, file$h, 96, 8, 3344);
    			attr_dev(div22, "class", "row commonbutton svelte-17go6fw");
    			add_location(div22, file$h, 46, 6, 1270);
    			attr_dev(input17, "type", "submit");
    			attr_dev(input17, "name", "");
    			input17.value = "0";
    			attr_dev(input17, "class", " svelte-17go6fw");
    			add_location(input17, file$h, 107, 14, 3727);
    			attr_dev(div23, "class", "col-md-8");
    			add_location(div23, file$h, 106, 12, 3689);
    			attr_dev(input18, "type", "submit");
    			attr_dev(input18, "name", "");
    			input18.value = ".";
    			attr_dev(input18, "class", " svelte-17go6fw");
    			add_location(input18, file$h, 110, 14, 3849);
    			attr_dev(div24, "class", "col-md-4");
    			add_location(div24, file$h, 109, 12, 3811);
    			attr_dev(input19, "type", "submit");
    			attr_dev(input19, "name", "");
    			input19.value = "Del";
    			attr_dev(input19, "id", "del");
    			attr_dev(input19, "class", "svelte-17go6fw");
    			add_location(input19, file$h, 113, 14, 3971);
    			attr_dev(div25, "class", "col-md-4");
    			add_location(div25, file$h, 112, 12, 3933);
    			attr_dev(input20, "type", "submit");
    			attr_dev(input20, "name", "");
    			input20.value = "=";
    			attr_dev(input20, "id", "equal");
    			attr_dev(input20, "class", "svelte-17go6fw");
    			add_location(input20, file$h, 116, 14, 4095);
    			attr_dev(div26, "class", "col-md-8");
    			add_location(div26, file$h, 115, 12, 4057);
    			attr_dev(div27, "class", "row");
    			add_location(div27, file$h, 105, 10, 3658);
    			attr_dev(div28, "class", "col-md-9");
    			add_location(div28, file$h, 104, 8, 3624);
    			attr_dev(input21, "type", "submit");
    			attr_dev(input21, "name", "");
    			input21.value = "+";
    			attr_dev(input21, "id", "plus");
    			attr_dev(input21, "class", "svelte-17go6fw");
    			add_location(input21, file$h, 122, 10, 4302);
    			attr_dev(div29, "class", "col-md-3");
    			add_location(div29, file$h, 121, 8, 4268);
    			attr_dev(div30, "class", "row conflict svelte-17go6fw");
    			add_location(div30, file$h, 103, 6, 3588);
    			attr_dev(div31, "class", "col-md-4 col-md-offset-4");
    			add_location(div31, file$h, 22, 4, 486);
    			attr_dev(div32, "class", "row g-0 justify-content-center");
    			add_location(div32, file$h, 21, 2, 436);
    			attr_dev(div33, "class", "container-fluid");
    			add_location(div33, file$h, 20, 0, 403);
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
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div33);
    			mounted = false;
    			run_all(dispose);
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
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calculator",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\components\LoadingCircle.svelte generated by Svelte v3.44.3 */

    const file$g = "src\\components\\LoadingCircle.svelte";

    function create_fragment$g(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			p = element("p");
    			p.textContent = "Loading...";
    			attr_dev(div0, "class", "child svelte-u230tr");
    			add_location(div0, file$g, 1, 2, 24);
    			attr_dev(div1, "class", "child svelte-u230tr");
    			add_location(div1, file$g, 2, 2, 53);
    			attr_dev(div2, "class", "child svelte-u230tr");
    			add_location(div2, file$g, 3, 2, 82);
    			attr_dev(p, "class", "loadingLabel svelte-u230tr");
    			add_location(p, file$g, 4, 2, 111);
    			attr_dev(div3, "class", "parent svelte-u230tr");
    			add_location(div3, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div3, t2);
    			append_dev(div3, p);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
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

    function instance$g($$self, $$props) {
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
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingCircle",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\InfiniteScroll.svelte generated by Svelte v3.44.3 */

    const { console: console_1$5 } = globals;
    const file$f = "src\\components\\InfiniteScroll.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (61:12) {#if data.length>0}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*data*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty$1();
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
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
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
    		o: noop$1,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(61:12) {#if data.length>0}",
    		ctx
    	});

    	return block;
    }

    // (62:16) {#each data as image}
    function create_each_block$5(ctx) {
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
    			add_location(img_1, file$f, 64, 16, 2017);
    			attr_dev(a, "href", a_href_value = /*image*/ ctx[11].links.html);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$f, 63, 16, 1956);
    			add_location(div, file$f, 62, 16, 1907);
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
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(62:16) {#each data as image}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let t1;
    	let div1;
    	let loadingcircle;
    	let div1_class_value;
    	let t2;
    	let div2;
    	let current;
    	let mounted;
    	let dispose;
    	loadingcircle = new LoadingCircle({ $$inline: true });
    	let if_block = /*data*/ ctx[2].length > 0 && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			div0.textContent = "UNSPLASH API-INFINITE SCROLL";
    			t1 = space();
    			div1 = element("div");
    			create_component(loadingcircle.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "title svelte-1e171vo");
    			add_location(div0, file$f, 55, 8, 1638);
    			attr_dev(div1, "class", div1_class_value = "loader " + /*loader*/ ctx[0] + " svelte-1e171vo");
    			add_location(div1, file$f, 56, 8, 1702);
    			attr_dev(div2, "class", "image-container svelte-1e171vo");
    			add_location(div2, file$f, 59, 8, 1787);
    			attr_dev(div3, "class", "elements svelte-1e171vo");
    			attr_dev(div3, "id", "elements");
    			set_style(div3, "height", /*height*/ ctx[1]);
    			add_location(div3, file$f, 54, 4, 1566);
    			attr_dev(div4, "class", "body");
    			attr_dev(div4, "id", "body");
    			set_style(div4, "height", "100vh");
    			set_style(div4, "overflow-x", "auto");
    			add_location(div4, file$f, 53, 0, 1468);
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
    			mount_component(loadingcircle, div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			if (if_block) if_block.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div4, "scroll", /*scrollFun*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*loader*/ 1 && div1_class_value !== (div1_class_value = "loader " + /*loader*/ ctx[0] + " svelte-1e171vo")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (/*data*/ ctx[2].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*data*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*height*/ 2) {
    				set_style(div3, "height", /*height*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingcircle.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingcircle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(loadingcircle);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
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

    const api_key = 'WWsBOsSnXbn9GJv3gucUMHYWJ3YHryd2uZMN1wWlIHk';
    const count = 10;

    function instance$f($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<InfiniteScroll> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		LoadingCircle,
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
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfiniteScroll",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\TestCode.svelte generated by Svelte v3.44.3 */

    const { console: console_1$4 } = globals;
    const file$e = "src\\components\\TestCode.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (52:6) {#each word as item, i}
    function create_each_block_1(ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*item*/ ctx[11] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div0, "class", "p-1 border h-2 w-100 d-flex justify-content-center svelte-1uacw1b");
    			set_style(div0, "background-color", /*colors*/ ctx[1][/*i*/ ctx[15]]);
    			add_location(div0, file$e, 53, 10, 1330);
    			attr_dev(div1, "class", "col my-1");
    			add_location(div1, file$e, 52, 8, 1296);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*word*/ 1 && t0_value !== (t0_value = /*item*/ ctx[11] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*colors*/ 2) {
    				set_style(div0, "background-color", /*colors*/ ctx[1][/*i*/ ctx[15]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(52:6) {#each word as item, i}",
    		ctx
    	});

    	return block;
    }

    // (66:6) {#each falseArray as item}
    function create_each_block$4(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let div3;
    	let div2;
    	let t1;
    	let div5;
    	let div4;
    	let t2;
    	let div7;
    	let div6;
    	let t3;
    	let div9;
    	let div8;
    	let t4;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t1 = space();
    			div5 = element("div");
    			div4 = element("div");
    			t2 = space();
    			div7 = element("div");
    			div6 = element("div");
    			t3 = space();
    			div9 = element("div");
    			div8 = element("div");
    			t4 = space();
    			attr_dev(div0, "class", "p-1 border h-2 w-100 d-flex justify-content-center svelte-1uacw1b");
    			add_location(div0, file$e, 67, 10, 1729);
    			attr_dev(div1, "class", "col my-1");
    			add_location(div1, file$e, 66, 8, 1695);
    			attr_dev(div2, "class", "p-1 border h-2 w-100 d-flex justify-content-center svelte-1uacw1b");
    			add_location(div2, file$e, 70, 10, 1855);
    			attr_dev(div3, "class", "col my-1");
    			add_location(div3, file$e, 69, 8, 1821);
    			attr_dev(div4, "class", "p-1 border h-2 w-100 d-flex justify-content-center svelte-1uacw1b");
    			add_location(div4, file$e, 73, 10, 1981);
    			attr_dev(div5, "class", "col my-1");
    			add_location(div5, file$e, 72, 8, 1947);
    			attr_dev(div6, "class", "p-1 border h-2 w-100 d-flex justify-content-center svelte-1uacw1b");
    			add_location(div6, file$e, 76, 10, 2107);
    			attr_dev(div7, "class", "col my-1");
    			add_location(div7, file$e, 75, 8, 2073);
    			attr_dev(div8, "class", "p-1 border h-2 w-100 d-flex justify-content-center svelte-1uacw1b");
    			add_location(div8, file$e, 79, 10, 2233);
    			attr_dev(div9, "class", "col my-1");
    			add_location(div9, file$e, 78, 8, 2199);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div4);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div9, t4);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div5);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div7);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div9);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(66:6) {#each falseArray as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div4;
    	let div1;
    	let div0;
    	let t0;
    	let div3;
    	let div2;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*word*/ ctx[0];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*falseArray*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			div3 = element("div");
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			button = element("button");
    			button.textContent = "reset";
    			attr_dev(div0, "class", "row mb-1 row-cols-5 gx-2");
    			add_location(div0, file$e, 50, 4, 1217);
    			attr_dev(div1, "class", "w-50 mt-2 position-absolute");
    			add_location(div1, file$e, 49, 2, 1170);
    			attr_dev(div2, "class", "row mb-1 row-cols-5 gx-2");
    			add_location(div2, file$e, 64, 4, 1613);
    			add_location(button, file$e, 84, 4, 2350);
    			attr_dev(div3, "class", "w-50 mt-2 position-absolute");
    			add_location(div3, file$e, 63, 2, 1566);
    			attr_dev(div4, "class", "position-relative");
    			set_style(div4, "left", "30%");
    			add_location(div4, file$e, 48, 0, 1117);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div0, null);
    			}

    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			append_dev(div3, t1);
    			append_dev(div3, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*keydown_handler*/ ctx[4], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*colors, word*/ 3) {
    				each_value_1 = /*word*/ ctx[0];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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
    	validate_slots('TestCode', slots, []);
    	let word = "";
    	let rightWord = "light";
    	const falseArray = ['a', 'b', 'c', 'd', 'e', 'f'];

    	const wordHandeler = event => {
    		if (word.length < 6 && event.keyCode >= 65 && event.keyCode <= 90) {
    			$$invalidate(0, word = word + event.key);
    		}

    		if (event.key == 'Enter') {
    			checkWord();
    		}

    		if (event.key == 'Backspace') {
    			$$invalidate(0, word = word.substring(0, word.length - 1));
    		}

    		if (word.length == 5) {
    			wordList.push(word);
    			$$invalidate(0, word = "");
    		}
    	};

    	let colors = [];
    	let wordList = [];
    	let colorList = [];
    	let counter = 0;

    	const checkWord = () => {
    		for (let i = 0; i < word.length; i++) {
    			if (rightWord[i % 5] == word[i]) {
    				colors.push('green');
    			} else if (rightWord.includes(word[i])) {
    				colors.push('yellow');
    			} else {
    				colors.push('red');
    			}
    		}

    		$$invalidate(1, colors);

    		if (colors.length == 5) {
    			colorList.push(colors);
    			$$invalidate(1, colors = '');
    			console.log(colorList, wordList);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<TestCode> was created with unknown prop '${key}'`);
    	});

    	const keydown_handler = event => wordHandeler(event);
    	const click_handler = () => console.log('reset');

    	$$self.$capture_state = () => ({
    		word,
    		rightWord,
    		falseArray,
    		wordHandeler,
    		colors,
    		wordList,
    		colorList,
    		counter,
    		checkWord
    	});

    	$$self.$inject_state = $$props => {
    		if ('word' in $$props) $$invalidate(0, word = $$props.word);
    		if ('rightWord' in $$props) rightWord = $$props.rightWord;
    		if ('colors' in $$props) $$invalidate(1, colors = $$props.colors);
    		if ('wordList' in $$props) wordList = $$props.wordList;
    		if ('colorList' in $$props) colorList = $$props.colorList;
    		if ('counter' in $$props) counter = $$props.counter;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [word, colors, falseArray, wordHandeler, keydown_handler, click_handler];
    }

    class TestCode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TestCode",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\components\JockTeller.svelte generated by Svelte v3.44.3 */

    const { console: console_1$3 } = globals;
    const file$d = "src\\components\\JockTeller.svelte";

    function create_fragment$d(ctx) {
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
    			attr_dev(button_1, "class", "svelte-1dudb4e");
    			add_location(button_1, file$d, 133, 2, 5494);
    			attr_dev(audio, "id", "audio");
    			audio.controls = true;
    			add_location(audio, file$d, 134, 2, 5541);
    			if (!src_url_equal(img.src, img_src_value = "images/spinner.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$d, 141, 20, 5722);
    			attr_dev(div0, "id", "loading");
    			add_location(div0, file$d, 141, 2, 5704);
    			attr_dev(div1, "class", "container svelte-1dudb4e");
    			add_location(div1, file$d, 132, 0, 5467);
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
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
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

    const jockAudioAPIkey = '06d028ad85324cd89d340dfd22ace56b';

    function instance$d($$self, $$props, $$invalidate) {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<JockTeller> was created with unknown prop '${key}'`);
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
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "JockTeller",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\components\AnimatedButton.svelte generated by Svelte v3.44.3 */

    const { console: console_1$2 } = globals;
    const file$c = "src\\components\\AnimatedButton.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let a0;
    	let span0;
    	let t1;
    	let a1;
    	let span1;
    	let t3;
    	let a2;
    	let span2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a0 = element("a");
    			span0 = element("span");
    			span0.textContent = "button1";
    			t1 = space();
    			a1 = element("a");
    			span1 = element("span");
    			span1.textContent = "button2";
    			t3 = space();
    			a2 = element("a");
    			span2 = element("span");
    			span2.textContent = "button3";
    			attr_dev(span0, "class", "svelte-1kpy2ll");
    			add_location(span0, file$c, 9, 48, 197);
    			attr_dev(a0, "href", "#");
    			set_style(a0, "--color", "#ff22bb");
    			set_style(a0, "--i", "0");
    			attr_dev(a0, "class", "svelte-1kpy2ll");
    			add_location(a0, file$c, 9, 4, 153);
    			attr_dev(span1, "class", "svelte-1kpy2ll");
    			add_location(span1, file$c, 10, 48, 271);
    			attr_dev(a1, "href", "#");
    			set_style(a1, "--color", "#00ccff");
    			set_style(a1, "--i", "1");
    			attr_dev(a1, "class", "svelte-1kpy2ll");
    			add_location(a1, file$c, 10, 4, 227);
    			attr_dev(span2, "class", "svelte-1kpy2ll");
    			add_location(span2, file$c, 11, 48, 345);
    			attr_dev(a2, "href", "#");
    			set_style(a2, "--color", "#22e622");
    			set_style(a2, "--i", "2");
    			attr_dev(a2, "class", "svelte-1kpy2ll");
    			add_location(a2, file$c, 11, 4, 301);
    			attr_dev(div, "class", "parent svelte-1kpy2ll");
    			add_location(div, file$c, 8, 0, 118);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			append_dev(a0, span0);
    			append_dev(div, t1);
    			append_dev(div, a1);
    			append_dev(a1, span1);
    			append_dev(div, t3);
    			append_dev(div, a2);
    			append_dev(a2, span2);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AnimatedButton', slots, []);

    	onMount(() => {
    		console.log('called');
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<AnimatedButton> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$capture_state = () => ({ onMount });
    	return [click_handler];
    }

    class AnimatedButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AnimatedButton",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\components\LightDarkTheme.svelte generated by Svelte v3.44.3 */

    const { console: console_1$1 } = globals;
    const file$b = "src\\components\\LightDarkTheme.svelte";

    function create_fragment$b(ctx) {
    	let div11;
    	let div2;
    	let div0;
    	let span;
    	let t1;
    	let i0;
    	let t2;
    	let label;
    	let input;
    	let t3;
    	let div1;
    	let t4;
    	let nav_1;
    	let a0;
    	let t6;
    	let a1;
    	let t8;
    	let a2;
    	let t10;
    	let a3;
    	let t12;
    	let section0;
    	let div3;
    	let h10;
    	let t14;
    	let h20;
    	let t16;
    	let section1;
    	let h11;
    	let t18;
    	let div7;
    	let div4;
    	let h21;
    	let t20;
    	let img0;
    	let img0_src_value;
    	let t21;
    	let div5;
    	let h22;
    	let t23;
    	let img1;
    	let img1_src_value;
    	let t24;
    	let div6;
    	let h23;
    	let t26;
    	let img2;
    	let img2_src_value;
    	let t27;
    	let section2;
    	let h12;
    	let t29;
    	let div8;
    	let button0;
    	let t31;
    	let button1;
    	let t33;
    	let button2;
    	let t35;
    	let button3;
    	let t37;
    	let button4;
    	let t39;
    	let button5;
    	let t41;
    	let div9;
    	let p;
    	let t43;
    	let section3;
    	let div10;
    	let i1;
    	let t44;
    	let i2;
    	let t45;
    	let i3;
    	let t46;
    	let i4;
    	let t47;
    	let i5;
    	let t48;
    	let i6;

    	const block = {
    		c: function create() {
    			div11 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "Light Mode";
    			t1 = space();
    			i0 = element("i");
    			t2 = space();
    			label = element("label");
    			input = element("input");
    			t3 = space();
    			div1 = element("div");
    			t4 = space();
    			nav_1 = element("nav");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t6 = space();
    			a1 = element("a");
    			a1.textContent = "About";
    			t8 = space();
    			a2 = element("a");
    			a2.textContent = "Projects";
    			t10 = space();
    			a3 = element("a");
    			a3.textContent = "CONTACT";
    			t12 = space();
    			section0 = element("section");
    			div3 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Welcome To Freedom";
    			t14 = space();
    			h20 = element("h2");
    			h20.textContent = "Here you are free to buy anyting without custom";
    			t16 = space();
    			section1 = element("section");
    			h11 = element("h1");
    			h11.textContent = "Undraw Illustration";
    			t18 = space();
    			div7 = element("div");
    			div4 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Web Inovation";
    			t20 = space();
    			img0 = element("img");
    			t21 = space();
    			div5 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Problem Solving";
    			t23 = space();
    			img1 = element("img");
    			t24 = space();
    			div6 = element("div");
    			h23 = element("h2");
    			h23.textContent = "High Concept";
    			t26 = space();
    			img2 = element("img");
    			t27 = space();
    			section2 = element("section");
    			h12 = element("h1");
    			h12.textContent = "Buttons";
    			t29 = space();
    			div8 = element("div");
    			button0 = element("button");
    			button0.textContent = "Primary";
    			t31 = space();
    			button1 = element("button");
    			button1.textContent = "Secondary";
    			t33 = space();
    			button2 = element("button");
    			button2.textContent = "disabled";
    			t35 = space();
    			button3 = element("button");
    			button3.textContent = "Outline";
    			t37 = space();
    			button4 = element("button");
    			button4.textContent = "Alt outline";
    			t39 = space();
    			button5 = element("button");
    			button5.textContent = "Disabled";
    			t41 = space();
    			div9 = element("div");
    			p = element("p");
    			p.textContent = "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus velit dolorum quod laboriosam inventore tempore ex commodi. Quas consequatur quod laudantium amet? Tempore, quidem. Sapiente voluptate nemo saepe, reiciendis adipisci aperiam ut aut sequi suscipit, in perferendis earum quia libero ratione nisi, distinctio voluptates. Optio, distinctio omnis! Similique, molestias perferendis.";
    			t43 = space();
    			section3 = element("section");
    			div10 = element("div");
    			i1 = element("i");
    			t44 = space();
    			i2 = element("i");
    			t45 = space();
    			i3 = element("i");
    			t46 = space();
    			i4 = element("i");
    			t47 = space();
    			i5 = element("i");
    			t48 = space();
    			i6 = element("i");
    			attr_dev(span, "class", "toggle-text svelte-1gtn153");
    			attr_dev(span, "id", "toggle-text");
    			add_location(span, file$b, 68, 12, 2914);
    			attr_dev(i0, "class", "fas fa-sun svelte-1gtn153");
    			attr_dev(i0, "id", "toggle-icon");
    			add_location(i0, file$b, 69, 12, 2988);
    			add_location(div0, file$b, 67, 8, 2895);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "class", "svelte-1gtn153");
    			add_location(input, file$b, 72, 12, 3099);
    			attr_dev(div1, "class", "slider round svelte-1gtn153");
    			add_location(div1, file$b, 73, 12, 3136);
    			attr_dev(label, "class", "theme-switch svelte-1gtn153");
    			add_location(label, file$b, 71, 8, 3057);
    			attr_dev(div2, "class", "theme-switch-wrapper svelte-1gtn153");
    			add_location(div2, file$b, 66, 4, 2851);
    			attr_dev(a0, "href", "#home");
    			attr_dev(a0, "class", "svelte-1gtn153");
    			add_location(a0, file$b, 78, 8, 3254);
    			attr_dev(a1, "href", "#about");
    			attr_dev(a1, "class", "svelte-1gtn153");
    			add_location(a1, file$b, 79, 8, 3288);
    			attr_dev(a2, "href", "#projects");
    			attr_dev(a2, "class", "svelte-1gtn153");
    			add_location(a2, file$b, 80, 8, 3324);
    			attr_dev(a3, "href", "#contact");
    			attr_dev(a3, "class", "svelte-1gtn153");
    			add_location(a3, file$b, 81, 8, 3366);
    			attr_dev(nav_1, "id", "nav");
    			attr_dev(nav_1, "class", "svelte-1gtn153");
    			add_location(nav_1, file$b, 77, 4, 3230);
    			attr_dev(h10, "class", "svelte-1gtn153");
    			add_location(h10, file$b, 86, 12, 3509);
    			attr_dev(h20, "class", "svelte-1gtn153");
    			add_location(h20, file$b, 87, 12, 3550);
    			attr_dev(div3, "class", "title-group svelte-1gtn153");
    			add_location(div3, file$b, 85, 8, 3470);
    			attr_dev(section0, "id", "home");
    			attr_dev(section0, "class", "svelte-1gtn153");
    			add_location(section0, file$b, 84, 4, 3441);
    			attr_dev(h11, "class", "svelte-1gtn153");
    			add_location(h11, file$b, 91, 8, 3679);
    			attr_dev(h21, "class", "svelte-1gtn153");
    			add_location(h21, file$b, 94, 16, 3810);
    			if (!src_url_equal(img0.src, img0_src_value = "images/undraw_proud_coder_light.svg")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "proud coder");
    			attr_dev(img0, "id", "image1");
    			attr_dev(img0, "class", "svelte-1gtn153");
    			add_location(img0, file$b, 95, 16, 3850);
    			attr_dev(div4, "class", "image-container svelte-1gtn153");
    			add_location(div4, file$b, 93, 12, 3763);
    			attr_dev(h22, "class", "svelte-1gtn153");
    			add_location(h22, file$b, 99, 16, 4025);
    			if (!src_url_equal(img1.src, img1_src_value = "images/undraw_feeling_proud_light.svg")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "proud coder");
    			attr_dev(img1, "id", "image2");
    			attr_dev(img1, "class", "svelte-1gtn153");
    			add_location(img1, file$b, 100, 16, 4067);
    			attr_dev(div5, "class", "image-container svelte-1gtn153");
    			add_location(div5, file$b, 98, 12, 3978);
    			attr_dev(h23, "class", "svelte-1gtn153");
    			add_location(h23, file$b, 104, 16, 4245);
    			if (!src_url_equal(img2.src, img2_src_value = "images/undraw_conceptual_idea_light.svg")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "proud coder");
    			attr_dev(img2, "id", "image3");
    			attr_dev(img2, "class", "svelte-1gtn153");
    			add_location(img2, file$b, 105, 16, 4284);
    			attr_dev(div6, "class", "image-container svelte-1gtn153");
    			add_location(div6, file$b, 103, 12, 4198);
    			attr_dev(div7, "class", "about-container svelte-1gtn153");
    			add_location(div7, file$b, 92, 8, 3720);
    			attr_dev(section1, "id", "about");
    			attr_dev(section1, "class", "svelte-1gtn153");
    			add_location(section1, file$b, 90, 4, 3648);
    			attr_dev(h12, "class", "svelte-1gtn153");
    			add_location(h12, file$b, 111, 8, 4474);
    			attr_dev(button0, "class", "primary svelte-1gtn153");
    			add_location(button0, file$b, 113, 12, 4539);
    			attr_dev(button1, "class", "secondary svelte-1gtn153");
    			add_location(button1, file$b, 114, 12, 4593);
    			attr_dev(button2, "class", "primary svelte-1gtn153");
    			button2.disabled = true;
    			add_location(button2, file$b, 115, 12, 4651);
    			attr_dev(button3, "class", "outline svelte-1gtn153");
    			add_location(button3, file$b, 116, 12, 4715);
    			attr_dev(button4, "class", "secondary outline svelte-1gtn153");
    			add_location(button4, file$b, 117, 12, 4769);
    			attr_dev(button5, "class", "outline svelte-1gtn153");
    			button5.disabled = true;
    			add_location(button5, file$b, 118, 12, 4837);
    			attr_dev(div8, "class", "buttons svelte-1gtn153");
    			add_location(div8, file$b, 112, 8, 4504);
    			attr_dev(p, "class", "svelte-1gtn153");
    			add_location(p, file$b, 121, 12, 4963);
    			attr_dev(div9, "class", "text-box svelte-1gtn153");
    			attr_dev(div9, "id", "text-box");
    			add_location(div9, file$b, 120, 8, 4913);
    			attr_dev(section2, "id", "projects");
    			attr_dev(section2, "class", "svelte-1gtn153");
    			add_location(section2, file$b, 110, 4, 4441);
    			attr_dev(i1, "class", "fab fa-github svelte-1gtn153");
    			add_location(i1, file$b, 126, 12, 5481);
    			attr_dev(i2, "class", "fab fa-codepen svelte-1gtn153");
    			add_location(i2, file$b, 127, 12, 5524);
    			attr_dev(i3, "class", "fab fa-linkedin svelte-1gtn153");
    			add_location(i3, file$b, 128, 12, 5568);
    			attr_dev(i4, "class", "fab fa-medium svelte-1gtn153");
    			add_location(i4, file$b, 129, 12, 5613);
    			attr_dev(i5, "class", "fab fa-instagram svelte-1gtn153");
    			add_location(i5, file$b, 130, 12, 5656);
    			attr_dev(i6, "class", "fab fa-youtube svelte-1gtn153");
    			add_location(i6, file$b, 131, 12, 5702);
    			attr_dev(div10, "class", "social-icons");
    			add_location(div10, file$b, 125, 8, 5441);
    			attr_dev(section3, "id", "contact");
    			attr_dev(section3, "class", "svelte-1gtn153");
    			add_location(section3, file$b, 124, 4, 5407);
    			attr_dev(div11, "class", "parent svelte-1gtn153");
    			attr_dev(div11, "style", /*dark*/ ctx[0]);
    			attr_dev(div11, "id", "parent");
    			add_location(div11, file$b, 65, 0, 2797);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div11, anchor);
    			append_dev(div11, div2);
    			append_dev(div2, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			append_dev(div0, i0);
    			append_dev(div2, t2);
    			append_dev(div2, label);
    			append_dev(label, input);
    			append_dev(label, t3);
    			append_dev(label, div1);
    			append_dev(div11, t4);
    			append_dev(div11, nav_1);
    			append_dev(nav_1, a0);
    			append_dev(nav_1, t6);
    			append_dev(nav_1, a1);
    			append_dev(nav_1, t8);
    			append_dev(nav_1, a2);
    			append_dev(nav_1, t10);
    			append_dev(nav_1, a3);
    			append_dev(div11, t12);
    			append_dev(div11, section0);
    			append_dev(section0, div3);
    			append_dev(div3, h10);
    			append_dev(div3, t14);
    			append_dev(div3, h20);
    			append_dev(div11, t16);
    			append_dev(div11, section1);
    			append_dev(section1, h11);
    			append_dev(section1, t18);
    			append_dev(section1, div7);
    			append_dev(div7, div4);
    			append_dev(div4, h21);
    			append_dev(div4, t20);
    			append_dev(div4, img0);
    			append_dev(div7, t21);
    			append_dev(div7, div5);
    			append_dev(div5, h22);
    			append_dev(div5, t23);
    			append_dev(div5, img1);
    			append_dev(div7, t24);
    			append_dev(div7, div6);
    			append_dev(div6, h23);
    			append_dev(div6, t26);
    			append_dev(div6, img2);
    			append_dev(div11, t27);
    			append_dev(div11, section2);
    			append_dev(section2, h12);
    			append_dev(section2, t29);
    			append_dev(section2, div8);
    			append_dev(div8, button0);
    			append_dev(div8, t31);
    			append_dev(div8, button1);
    			append_dev(div8, t33);
    			append_dev(div8, button2);
    			append_dev(div8, t35);
    			append_dev(div8, button3);
    			append_dev(div8, t37);
    			append_dev(div8, button4);
    			append_dev(div8, t39);
    			append_dev(div8, button5);
    			append_dev(section2, t41);
    			append_dev(section2, div9);
    			append_dev(div9, p);
    			append_dev(div11, t43);
    			append_dev(div11, section3);
    			append_dev(section3, div10);
    			append_dev(div10, i1);
    			append_dev(div10, t44);
    			append_dev(div10, i2);
    			append_dev(div10, t45);
    			append_dev(div10, i3);
    			append_dev(div10, t46);
    			append_dev(div10, i4);
    			append_dev(div10, t47);
    			append_dev(div10, i5);
    			append_dev(div10, t48);
    			append_dev(div10, i6);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dark*/ 1) {
    				attr_dev(div11, "style", /*dark*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div11);
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
    	validate_slots('LightDarkTheme', slots, []);
    	let dark = null;
    	let themeName;

    	let parent,
    		toggleSwitch,
    		nav,
    		toggleIcon,
    		image1,
    		image2,
    		image3,
    		textbox,
    		home,
    		toggleText;

    	const darkMode = () => {
    		nav.style.backgroundColor = 'rgb(0 0 0 / 5%)';
    		textbox.style.backgroundColor = 'rgb(255 255 255 / 50%)';
    		toggleIcon.classList.replace('fa-sun', 'fa-moon');
    		toggleText.textContent = 'Dark Mode';
    		image1.src = 'images/undraw_proud_coder_dark.svg';
    		image2.src = 'images/undraw_feeling_proud_dark.svg';
    		image3.src = 'images/undraw_conceptual_idea_dark.svg';
    		localStorage.setItem('themeName', 'dark');
    		themeName = 'dark';
    		$$invalidate(0, dark = "transition: 2s; --primary-color: rgb(150, 65, 255); --primary-variant: #6c63ff; --secondary-color: #03dac5; --on-primary: #000; --on-background: rgba(255, 255, 255, 0.9); --on-background-alt: rgba(255, 255, 255, 0.7); --background: #121212;");
    	};

    	const lightMode = () => {
    		nav.style.backgroundColor = 'rgb(255 255 255 / 50%)';
    		textbox.style.backgroundColor = 'rgb(0 0 0 / 50%)';
    		toggleIcon.classList.replace('fa-moon', 'fa-sun');
    		toggleText.textContent = 'Light Mode';
    		image1.src = 'images/undraw_proud_coder_light.svg';
    		image2.src = 'images/undraw_feeling_proud_light.svg';
    		image3.src = 'images/undraw_conceptual_idea_light.svg';
    		localStorage.setItem('themeName', 'light');
    		themeName = 'light';
    		$$invalidate(0, dark = 'transition: 2s;');
    	};

    	const switchTheme = event => {
    		if (event.target.checked) {
    			darkMode();
    		} else {
    			lightMode();
    		}
    	};

    	onMount(() => {
    		toggleSwitch = document.querySelector("input[type='checkbox']");
    		home = document.getElementById('home');
    		nav = document.getElementById('nav');
    		image1 = document.getElementById('image1');
    		image2 = document.getElementById('image2');
    		image3 = document.getElementById('image3');
    		textbox = document.getElementById('text-box');
    		toggleIcon = document.getElementById('toggle-icon');
    		toggleText = document.getElementById('toggle-text');
    		parent = document.getElementById('parent');
    		toggleSwitch.addEventListener('change', switchTheme);
    		themeName = localStorage.getItem('themeName');
    		console.log(themeName);

    		if (themeName) {
    			if (themeName == 'dark') {
    				toggleSwitch.checked = true;
    				darkMode();
    				console.log('dark called');
    			} else {
    				lightMode();
    				console.log('light called');
    			}
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<LightDarkTheme> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		dark,
    		themeName,
    		parent,
    		toggleSwitch,
    		nav,
    		toggleIcon,
    		image1,
    		image2,
    		image3,
    		textbox,
    		home,
    		toggleText,
    		darkMode,
    		lightMode,
    		switchTheme
    	});

    	$$self.$inject_state = $$props => {
    		if ('dark' in $$props) $$invalidate(0, dark = $$props.dark);
    		if ('themeName' in $$props) themeName = $$props.themeName;
    		if ('parent' in $$props) parent = $$props.parent;
    		if ('toggleSwitch' in $$props) toggleSwitch = $$props.toggleSwitch;
    		if ('nav' in $$props) nav = $$props.nav;
    		if ('toggleIcon' in $$props) toggleIcon = $$props.toggleIcon;
    		if ('image1' in $$props) image1 = $$props.image1;
    		if ('image2' in $$props) image2 = $$props.image2;
    		if ('image3' in $$props) image3 = $$props.image3;
    		if ('textbox' in $$props) textbox = $$props.textbox;
    		if ('home' in $$props) home = $$props.home;
    		if ('toggleText' in $$props) toggleText = $$props.toggleText;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dark];
    }

    class LightDarkTheme extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LightDarkTheme",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\elements\LoadingInfinityBar.svelte generated by Svelte v3.44.3 */

    const file$a = "src\\elements\\LoadingInfinityBar.svelte";

    function create_fragment$a(ctx) {
    	let div24;
    	let div23;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let t3;
    	let div4;
    	let t4;
    	let div5;
    	let t5;
    	let div6;
    	let t6;
    	let div7;
    	let t7;
    	let div8;
    	let t8;
    	let div9;
    	let t9;
    	let div10;
    	let t10;
    	let div11;
    	let t11;
    	let div12;
    	let t12;
    	let div13;
    	let t13;
    	let div14;
    	let t14;
    	let div15;
    	let t15;
    	let div16;
    	let t16;
    	let div17;
    	let t17;
    	let div18;
    	let t18;
    	let div19;
    	let t19;
    	let div20;
    	let t20;
    	let div21;
    	let t21;
    	let div22;

    	const block = {
    		c: function create() {
    			div24 = element("div");
    			div23 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			div3 = element("div");
    			t3 = space();
    			div4 = element("div");
    			t4 = space();
    			div5 = element("div");
    			t5 = space();
    			div6 = element("div");
    			t6 = space();
    			div7 = element("div");
    			t7 = space();
    			div8 = element("div");
    			t8 = space();
    			div9 = element("div");
    			t9 = space();
    			div10 = element("div");
    			t10 = space();
    			div11 = element("div");
    			t11 = space();
    			div12 = element("div");
    			t12 = space();
    			div13 = element("div");
    			t13 = space();
    			div14 = element("div");
    			t14 = space();
    			div15 = element("div");
    			t15 = space();
    			div16 = element("div");
    			t16 = space();
    			div17 = element("div");
    			t17 = space();
    			div18 = element("div");
    			t18 = space();
    			div19 = element("div");
    			t19 = space();
    			div20 = element("div");
    			t20 = space();
    			div21 = element("div");
    			t21 = space();
    			div22 = element("div");
    			attr_dev(div0, "class", "circle svelte-rtwa2i");
    			add_location(div0, file$a, 2, 2, 45);
    			attr_dev(div1, "class", "circle svelte-rtwa2i");
    			add_location(div1, file$a, 3, 2, 75);
    			attr_dev(div2, "class", "dot svelte-rtwa2i");
    			set_style(div2, "--i", "0");
    			add_location(div2, file$a, 4, 2, 105);
    			attr_dev(div3, "class", "dot svelte-rtwa2i");
    			set_style(div3, "--i", "1");
    			add_location(div3, file$a, 5, 2, 146);
    			attr_dev(div4, "class", "dot svelte-rtwa2i");
    			set_style(div4, "--i", "2");
    			add_location(div4, file$a, 6, 2, 187);
    			attr_dev(div5, "class", "dot svelte-rtwa2i");
    			set_style(div5, "--i", "3");
    			add_location(div5, file$a, 7, 2, 228);
    			attr_dev(div6, "class", "dot svelte-rtwa2i");
    			set_style(div6, "--i", "4");
    			add_location(div6, file$a, 8, 2, 269);
    			attr_dev(div7, "class", "dot svelte-rtwa2i");
    			set_style(div7, "--i", "5");
    			add_location(div7, file$a, 9, 2, 310);
    			attr_dev(div8, "class", "dot svelte-rtwa2i");
    			set_style(div8, "--i", "6");
    			add_location(div8, file$a, 10, 2, 351);
    			attr_dev(div9, "class", "dot svelte-rtwa2i");
    			set_style(div9, "--i", "7");
    			add_location(div9, file$a, 11, 2, 392);
    			attr_dev(div10, "class", "dot svelte-rtwa2i");
    			set_style(div10, "--i", "8");
    			add_location(div10, file$a, 12, 2, 433);
    			attr_dev(div11, "class", "dot svelte-rtwa2i");
    			set_style(div11, "--i", "9");
    			add_location(div11, file$a, 13, 2, 474);
    			attr_dev(div12, "class", "dot svelte-rtwa2i");
    			set_style(div12, "--i", "10");
    			add_location(div12, file$a, 14, 2, 515);
    			attr_dev(div13, "class", "dot svelte-rtwa2i");
    			set_style(div13, "--i", "11");
    			add_location(div13, file$a, 15, 2, 557);
    			attr_dev(div14, "class", "dot svelte-rtwa2i");
    			set_style(div14, "--i", "12");
    			add_location(div14, file$a, 16, 2, 599);
    			attr_dev(div15, "class", "dot svelte-rtwa2i");
    			set_style(div15, "--i", "13");
    			add_location(div15, file$a, 17, 2, 641);
    			attr_dev(div16, "class", "dot svelte-rtwa2i");
    			set_style(div16, "--i", "14");
    			add_location(div16, file$a, 18, 2, 683);
    			attr_dev(div17, "class", "dot svelte-rtwa2i");
    			set_style(div17, "--i", "15");
    			add_location(div17, file$a, 19, 2, 725);
    			attr_dev(div18, "class", "dot svelte-rtwa2i");
    			set_style(div18, "--i", "16");
    			add_location(div18, file$a, 20, 2, 767);
    			attr_dev(div19, "class", "dot svelte-rtwa2i");
    			set_style(div19, "--i", "17");
    			add_location(div19, file$a, 21, 2, 809);
    			attr_dev(div20, "class", "dot svelte-rtwa2i");
    			set_style(div20, "--i", "18");
    			add_location(div20, file$a, 22, 2, 851);
    			attr_dev(div21, "class", "dot svelte-rtwa2i");
    			set_style(div21, "--i", "19");
    			add_location(div21, file$a, 23, 2, 893);
    			attr_dev(div22, "class", "dot svelte-rtwa2i");
    			set_style(div22, "--i", "20");
    			add_location(div22, file$a, 24, 2, 935);
    			attr_dev(div23, "class", "parent svelte-rtwa2i");
    			add_location(div23, file$a, 1, 1, 21);
    			attr_dev(div24, "class", "body svelte-rtwa2i");
    			add_location(div24, file$a, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div24, anchor);
    			append_dev(div24, div23);
    			append_dev(div23, div0);
    			append_dev(div23, t0);
    			append_dev(div23, div1);
    			append_dev(div23, t1);
    			append_dev(div23, div2);
    			append_dev(div23, t2);
    			append_dev(div23, div3);
    			append_dev(div23, t3);
    			append_dev(div23, div4);
    			append_dev(div23, t4);
    			append_dev(div23, div5);
    			append_dev(div23, t5);
    			append_dev(div23, div6);
    			append_dev(div23, t6);
    			append_dev(div23, div7);
    			append_dev(div23, t7);
    			append_dev(div23, div8);
    			append_dev(div23, t8);
    			append_dev(div23, div9);
    			append_dev(div23, t9);
    			append_dev(div23, div10);
    			append_dev(div23, t10);
    			append_dev(div23, div11);
    			append_dev(div23, t11);
    			append_dev(div23, div12);
    			append_dev(div23, t12);
    			append_dev(div23, div13);
    			append_dev(div23, t13);
    			append_dev(div23, div14);
    			append_dev(div23, t14);
    			append_dev(div23, div15);
    			append_dev(div23, t15);
    			append_dev(div23, div16);
    			append_dev(div23, t16);
    			append_dev(div23, div17);
    			append_dev(div23, t17);
    			append_dev(div23, div18);
    			append_dev(div23, t18);
    			append_dev(div23, div19);
    			append_dev(div23, t19);
    			append_dev(div23, div20);
    			append_dev(div23, t20);
    			append_dev(div23, div21);
    			append_dev(div23, t21);
    			append_dev(div23, div22);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div24);
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

    function instance$a($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LoadingInfinityBar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingInfinityBar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class LoadingInfinityBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingInfinityBar",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
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

    var check = function (it) {
      return it && it.Math == Math && it;
    };

    // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
    var global$1 =
      // eslint-disable-next-line es/no-global-this -- safe
      check(typeof globalThis == 'object' && globalThis) ||
      check(typeof window == 'object' && window) ||
      // eslint-disable-next-line no-restricted-globals -- safe
      check(typeof self == 'object' && self) ||
      check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
      // eslint-disable-next-line no-new-func -- fallback
      (function () { return this; })() || Function('return this')();

    var fails = function (exec) {
      try {
        return !!exec();
      } catch (error) {
        return true;
      }
    };

    var functionBindNative = !fails(function () {
      var test = (function () { /* empty */ }).bind();
      // eslint-disable-next-line no-prototype-builtins -- safe
      return typeof test != 'function' || test.hasOwnProperty('prototype');
    });

    var FunctionPrototype$1 = Function.prototype;
    var bind$1 = FunctionPrototype$1.bind;
    var call$1 = FunctionPrototype$1.call;
    var uncurryThis = functionBindNative && bind$1.bind(call$1, call$1);

    var functionUncurryThis = functionBindNative ? function (fn) {
      return fn && uncurryThis(fn);
    } : function (fn) {
      return fn && function () {
        return call$1.apply(fn, arguments);
      };
    };

    var toString$2 = functionUncurryThis({}.toString);
    var stringSlice$1 = functionUncurryThis(''.slice);

    var classofRaw = function (it) {
      return stringSlice$1(toString$2(it), 8, -1);
    };

    var Object$5 = global$1.Object;
    var split = functionUncurryThis(''.split);

    // fallback for non-array-like ES3 and non-enumerable old V8 strings
    var indexedObject = fails(function () {
      // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
      // eslint-disable-next-line no-prototype-builtins -- safe
      return !Object$5('z').propertyIsEnumerable(0);
    }) ? function (it) {
      return classofRaw(it) == 'String' ? split(it, '') : Object$5(it);
    } : Object$5;

    var TypeError$b = global$1.TypeError;

    // `RequireObjectCoercible` abstract operation
    // https://tc39.es/ecma262/#sec-requireobjectcoercible
    var requireObjectCoercible = function (it) {
      if (it == undefined) throw TypeError$b("Can't call method on " + it);
      return it;
    };

    // toObject with fallback for non-array-like ES3 strings



    var toIndexedObject = function (it) {
      return indexedObject(requireObjectCoercible(it));
    };

    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var defineProperty$4 = Object.defineProperty;

    var setGlobal = function (key, value) {
      try {
        defineProperty$4(global$1, key, { value: value, configurable: true, writable: true });
      } catch (error) {
        global$1[key] = value;
      } return value;
    };

    var SHARED = '__core-js_shared__';
    var store$2 = global$1[SHARED] || setGlobal(SHARED, {});

    var sharedStore = store$2;

    var shared = createCommonjsModule(function (module) {
    (module.exports = function (key, value) {
      return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
    })('versions', []).push({
      version: '3.20.3',
      mode: 'global',
      copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
      license: 'https://github.com/zloirock/core-js/blob/v3.20.3/LICENSE',
      source: 'https://github.com/zloirock/core-js'
    });
    });

    var Object$4 = global$1.Object;

    // `ToObject` abstract operation
    // https://tc39.es/ecma262/#sec-toobject
    var toObject = function (argument) {
      return Object$4(requireObjectCoercible(argument));
    };

    var hasOwnProperty$1 = functionUncurryThis({}.hasOwnProperty);

    // `HasOwnProperty` abstract operation
    // https://tc39.es/ecma262/#sec-hasownproperty
    var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
      return hasOwnProperty$1(toObject(it), key);
    };

    var id$1 = 0;
    var postfix = Math.random();
    var toString$1 = functionUncurryThis(1.0.toString);

    var uid = function (key) {
      return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$1(++id$1 + postfix, 36);
    };

    // `IsCallable` abstract operation
    // https://tc39.es/ecma262/#sec-iscallable
    var isCallable = function (argument) {
      return typeof argument == 'function';
    };

    var aFunction = function (argument) {
      return isCallable(argument) ? argument : undefined;
    };

    var getBuiltIn = function (namespace, method) {
      return arguments.length < 2 ? aFunction(global$1[namespace]) : global$1[namespace] && global$1[namespace][method];
    };

    var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

    var process$1 = global$1.process;
    var Deno = global$1.Deno;
    var versions = process$1 && process$1.versions || Deno && Deno.version;
    var v8 = versions && versions.v8;
    var match, version;

    if (v8) {
      match = v8.split('.');
      // in old Chrome, versions of V8 isn't V8 = Chrome / 10
      // but their correct versions are not interesting for us
      version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
    }

    // BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
    // so check `userAgent` even if `.v8` exists, but 0
    if (!version && engineUserAgent) {
      match = engineUserAgent.match(/Edge\/(\d+)/);
      if (!match || match[1] >= 74) {
        match = engineUserAgent.match(/Chrome\/(\d+)/);
        if (match) version = +match[1];
      }
    }

    var engineV8Version = version;

    /* eslint-disable es/no-symbol -- required for testing */

    // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
    var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
      var symbol = Symbol();
      // Chrome 38 Symbol has incorrect toString conversion
      // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
      return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
        // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
        !Symbol.sham && engineV8Version && engineV8Version < 41;
    });

    /* eslint-disable es/no-symbol -- required for testing */

    var useSymbolAsUid = nativeSymbol
      && !Symbol.sham
      && typeof Symbol.iterator == 'symbol';

    var WellKnownSymbolsStore = shared('wks');
    var Symbol$3 = global$1.Symbol;
    var symbolFor = Symbol$3 && Symbol$3['for'];
    var createWellKnownSymbol = useSymbolAsUid ? Symbol$3 : Symbol$3 && Symbol$3.withoutSetter || uid;

    var wellKnownSymbol = function (name) {
      if (!hasOwnProperty_1(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
        var description = 'Symbol.' + name;
        if (nativeSymbol && hasOwnProperty_1(Symbol$3, name)) {
          WellKnownSymbolsStore[name] = Symbol$3[name];
        } else if (useSymbolAsUid && symbolFor) {
          WellKnownSymbolsStore[name] = symbolFor(description);
        } else {
          WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
        }
      } return WellKnownSymbolsStore[name];
    };

    var isObject$1 = function (it) {
      return typeof it == 'object' ? it !== null : isCallable(it);
    };

    var String$4 = global$1.String;
    var TypeError$a = global$1.TypeError;

    // `Assert: Type(argument) is Object`
    var anObject = function (argument) {
      if (isObject$1(argument)) return argument;
      throw TypeError$a(String$4(argument) + ' is not an object');
    };

    // Detect IE8's incomplete defineProperty implementation
    var descriptors = !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
    });

    // V8 ~ Chrome 36-
    // https://bugs.chromium.org/p/v8/issues/detail?id=3334
    var v8PrototypeDefineBug = descriptors && fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty(function () { /* empty */ }, 'prototype', {
        value: 42,
        writable: false
      }).prototype != 42;
    });

    var document$1 = global$1.document;
    // typeof document.createElement is 'object' in old IE
    var EXISTS$1 = isObject$1(document$1) && isObject$1(document$1.createElement);

    var documentCreateElement = function (it) {
      return EXISTS$1 ? document$1.createElement(it) : {};
    };

    // Thanks to IE8 for its funny defineProperty
    var ie8DomDefine = !descriptors && !fails(function () {
      // eslint-disable-next-line es/no-object-defineproperty -- required for testing
      return Object.defineProperty(documentCreateElement('div'), 'a', {
        get: function () { return 7; }
      }).a != 7;
    });

    var call = Function.prototype.call;

    var functionCall = functionBindNative ? call.bind(call) : function () {
      return call.apply(call, arguments);
    };

    var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

    var Object$3 = global$1.Object;

    var isSymbol$1 = useSymbolAsUid ? function (it) {
      return typeof it == 'symbol';
    } : function (it) {
      var $Symbol = getBuiltIn('Symbol');
      return isCallable($Symbol) && objectIsPrototypeOf($Symbol.prototype, Object$3(it));
    };

    var String$3 = global$1.String;

    var tryToString = function (argument) {
      try {
        return String$3(argument);
      } catch (error) {
        return 'Object';
      }
    };

    var TypeError$9 = global$1.TypeError;

    // `Assert: IsCallable(argument) is true`
    var aCallable = function (argument) {
      if (isCallable(argument)) return argument;
      throw TypeError$9(tryToString(argument) + ' is not a function');
    };

    // `GetMethod` abstract operation
    // https://tc39.es/ecma262/#sec-getmethod
    var getMethod = function (V, P) {
      var func = V[P];
      return func == null ? undefined : aCallable(func);
    };

    var TypeError$8 = global$1.TypeError;

    // `OrdinaryToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-ordinarytoprimitive
    var ordinaryToPrimitive = function (input, pref) {
      var fn, val;
      if (pref === 'string' && isCallable(fn = input.toString) && !isObject$1(val = functionCall(fn, input))) return val;
      if (isCallable(fn = input.valueOf) && !isObject$1(val = functionCall(fn, input))) return val;
      if (pref !== 'string' && isCallable(fn = input.toString) && !isObject$1(val = functionCall(fn, input))) return val;
      throw TypeError$8("Can't convert object to primitive value");
    };

    var TypeError$7 = global$1.TypeError;
    var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

    // `ToPrimitive` abstract operation
    // https://tc39.es/ecma262/#sec-toprimitive
    var toPrimitive = function (input, pref) {
      if (!isObject$1(input) || isSymbol$1(input)) return input;
      var exoticToPrim = getMethod(input, TO_PRIMITIVE);
      var result;
      if (exoticToPrim) {
        if (pref === undefined) pref = 'default';
        result = functionCall(exoticToPrim, input, pref);
        if (!isObject$1(result) || isSymbol$1(result)) return result;
        throw TypeError$7("Can't convert object to primitive value");
      }
      if (pref === undefined) pref = 'number';
      return ordinaryToPrimitive(input, pref);
    };

    // `ToPropertyKey` abstract operation
    // https://tc39.es/ecma262/#sec-topropertykey
    var toPropertyKey = function (argument) {
      var key = toPrimitive(argument, 'string');
      return isSymbol$1(key) ? key : key + '';
    };

    var TypeError$6 = global$1.TypeError;
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    var $defineProperty = Object.defineProperty;
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
    var ENUMERABLE = 'enumerable';
    var CONFIGURABLE$1 = 'configurable';
    var WRITABLE = 'writable';

    // `Object.defineProperty` method
    // https://tc39.es/ecma262/#sec-object.defineproperty
    var f$6 = descriptors ? v8PrototypeDefineBug ? function defineProperty(O, P, Attributes) {
      anObject(O);
      P = toPropertyKey(P);
      anObject(Attributes);
      if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
        var current = $getOwnPropertyDescriptor$1(O, P);
        if (current && current[WRITABLE]) {
          O[P] = Attributes.value;
          Attributes = {
            configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
            enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
            writable: false
          };
        }
      } return $defineProperty(O, P, Attributes);
    } : $defineProperty : function defineProperty(O, P, Attributes) {
      anObject(O);
      P = toPropertyKey(P);
      anObject(Attributes);
      if (ie8DomDefine) try {
        return $defineProperty(O, P, Attributes);
      } catch (error) { /* empty */ }
      if ('get' in Attributes || 'set' in Attributes) throw TypeError$6('Accessors not supported');
      if ('value' in Attributes) O[P] = Attributes.value;
      return O;
    };

    var objectDefineProperty = {
    	f: f$6
    };

    var ceil = Math.ceil;
    var floor = Math.floor;

    // `ToIntegerOrInfinity` abstract operation
    // https://tc39.es/ecma262/#sec-tointegerorinfinity
    var toIntegerOrInfinity = function (argument) {
      var number = +argument;
      // eslint-disable-next-line no-self-compare -- safe
      return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
    };

    var max$2 = Math.max;
    var min$2 = Math.min;

    // Helper for a popular repeating case of the spec:
    // Let integer be ? ToInteger(index).
    // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
    var toAbsoluteIndex = function (index, length) {
      var integer = toIntegerOrInfinity(index);
      return integer < 0 ? max$2(integer + length, 0) : min$2(integer, length);
    };

    var min$1 = Math.min;

    // `ToLength` abstract operation
    // https://tc39.es/ecma262/#sec-tolength
    var toLength = function (argument) {
      return argument > 0 ? min$1(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
    };

    // `LengthOfArrayLike` abstract operation
    // https://tc39.es/ecma262/#sec-lengthofarraylike
    var lengthOfArrayLike = function (obj) {
      return toLength(obj.length);
    };

    // `Array.prototype.{ indexOf, includes }` methods implementation
    var createMethod$2 = function (IS_INCLUDES) {
      return function ($this, el, fromIndex) {
        var O = toIndexedObject($this);
        var length = lengthOfArrayLike(O);
        var index = toAbsoluteIndex(fromIndex, length);
        var value;
        // Array#includes uses SameValueZero equality algorithm
        // eslint-disable-next-line no-self-compare -- NaN check
        if (IS_INCLUDES && el != el) while (length > index) {
          value = O[index++];
          // eslint-disable-next-line no-self-compare -- NaN check
          if (value != value) return true;
        // Array#indexOf ignores holes, Array#includes - not
        } else for (;length > index; index++) {
          if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
        } return !IS_INCLUDES && -1;
      };
    };

    var arrayIncludes = {
      // `Array.prototype.includes` method
      // https://tc39.es/ecma262/#sec-array.prototype.includes
      includes: createMethod$2(true),
      // `Array.prototype.indexOf` method
      // https://tc39.es/ecma262/#sec-array.prototype.indexof
      indexOf: createMethod$2(false)
    };

    var hiddenKeys$1 = {};

    var indexOf = arrayIncludes.indexOf;


    var push$1 = functionUncurryThis([].push);

    var objectKeysInternal = function (object, names) {
      var O = toIndexedObject(object);
      var i = 0;
      var result = [];
      var key;
      for (key in O) !hasOwnProperty_1(hiddenKeys$1, key) && hasOwnProperty_1(O, key) && push$1(result, key);
      // Don't enum bug & hidden keys
      while (names.length > i) if (hasOwnProperty_1(O, key = names[i++])) {
        ~indexOf(result, key) || push$1(result, key);
      }
      return result;
    };

    // IE8- don't enum bug keys
    var enumBugKeys = [
      'constructor',
      'hasOwnProperty',
      'isPrototypeOf',
      'propertyIsEnumerable',
      'toLocaleString',
      'toString',
      'valueOf'
    ];

    // `Object.keys` method
    // https://tc39.es/ecma262/#sec-object.keys
    // eslint-disable-next-line es/no-object-keys -- safe
    var objectKeys = Object.keys || function keys(O) {
      return objectKeysInternal(O, enumBugKeys);
    };

    // `Object.defineProperties` method
    // https://tc39.es/ecma262/#sec-object.defineproperties
    // eslint-disable-next-line es/no-object-defineproperties -- safe
    var f$5 = descriptors && !v8PrototypeDefineBug ? Object.defineProperties : function defineProperties(O, Properties) {
      anObject(O);
      var props = toIndexedObject(Properties);
      var keys = objectKeys(Properties);
      var length = keys.length;
      var index = 0;
      var key;
      while (length > index) objectDefineProperty.f(O, key = keys[index++], props[key]);
      return O;
    };

    var objectDefineProperties = {
    	f: f$5
    };

    var html = getBuiltIn('document', 'documentElement');

    var keys$1 = shared('keys');

    var sharedKey = function (key) {
      return keys$1[key] || (keys$1[key] = uid(key));
    };

    /* global ActiveXObject -- old IE, WSH */

    var GT = '>';
    var LT = '<';
    var PROTOTYPE = 'prototype';
    var SCRIPT = 'script';
    var IE_PROTO$1 = sharedKey('IE_PROTO');

    var EmptyConstructor = function () { /* empty */ };

    var scriptTag = function (content) {
      return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
    };

    // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
    var NullProtoObjectViaActiveX = function (activeXDocument) {
      activeXDocument.write(scriptTag(''));
      activeXDocument.close();
      var temp = activeXDocument.parentWindow.Object;
      activeXDocument = null; // avoid memory leak
      return temp;
    };

    // Create object with fake `null` prototype: use iframe Object with cleared prototype
    var NullProtoObjectViaIFrame = function () {
      // Thrash, waste and sodomy: IE GC bug
      var iframe = documentCreateElement('iframe');
      var JS = 'java' + SCRIPT + ':';
      var iframeDocument;
      iframe.style.display = 'none';
      html.appendChild(iframe);
      // https://github.com/zloirock/core-js/issues/475
      iframe.src = String(JS);
      iframeDocument = iframe.contentWindow.document;
      iframeDocument.open();
      iframeDocument.write(scriptTag('document.F=Object'));
      iframeDocument.close();
      return iframeDocument.F;
    };

    // Check for document.domain and active x support
    // No need to use active x approach when document.domain is not set
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    // avoid IE GC bug
    var activeXDocument;
    var NullProtoObject = function () {
      try {
        activeXDocument = new ActiveXObject('htmlfile');
      } catch (error) { /* ignore */ }
      NullProtoObject = typeof document != 'undefined'
        ? document.domain && activeXDocument
          ? NullProtoObjectViaActiveX(activeXDocument) // old IE
          : NullProtoObjectViaIFrame()
        : NullProtoObjectViaActiveX(activeXDocument); // WSH
      var length = enumBugKeys.length;
      while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
      return NullProtoObject();
    };

    hiddenKeys$1[IE_PROTO$1] = true;

    // `Object.create` method
    // https://tc39.es/ecma262/#sec-object.create
    var objectCreate = Object.create || function create(O, Properties) {
      var result;
      if (O !== null) {
        EmptyConstructor[PROTOTYPE] = anObject(O);
        result = new EmptyConstructor();
        EmptyConstructor[PROTOTYPE] = null;
        // add "__proto__" for Object.getPrototypeOf polyfill
        result[IE_PROTO$1] = O;
      } else result = NullProtoObject();
      return Properties === undefined ? result : objectDefineProperties.f(result, Properties);
    };

    var UNSCOPABLES = wellKnownSymbol('unscopables');
    var ArrayPrototype$1 = Array.prototype;

    // Array.prototype[@@unscopables]
    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
      objectDefineProperty.f(ArrayPrototype$1, UNSCOPABLES, {
        configurable: true,
        value: objectCreate(null)
      });
    }

    // add a key to Array.prototype[@@unscopables]
    var addToUnscopables = function (key) {
      ArrayPrototype$1[UNSCOPABLES][key] = true;
    };

    var iterators = {};

    var functionToString = functionUncurryThis(Function.toString);

    // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
    if (!isCallable(sharedStore.inspectSource)) {
      sharedStore.inspectSource = function (it) {
        return functionToString(it);
      };
    }

    var inspectSource = sharedStore.inspectSource;

    var WeakMap$2 = global$1.WeakMap;

    var nativeWeakMap = isCallable(WeakMap$2) && /native code/.test(inspectSource(WeakMap$2));

    var createPropertyDescriptor = function (bitmap, value) {
      return {
        enumerable: !(bitmap & 1),
        configurable: !(bitmap & 2),
        writable: !(bitmap & 4),
        value: value
      };
    };

    var createNonEnumerableProperty = descriptors ? function (object, key, value) {
      return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
    } : function (object, key, value) {
      object[key] = value;
      return object;
    };

    var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
    var TypeError$5 = global$1.TypeError;
    var WeakMap$1 = global$1.WeakMap;
    var set$2, get$2, has;

    var enforce = function (it) {
      return has(it) ? get$2(it) : set$2(it, {});
    };

    var getterFor = function (TYPE) {
      return function (it) {
        var state;
        if (!isObject$1(it) || (state = get$2(it)).type !== TYPE) {
          throw TypeError$5('Incompatible receiver, ' + TYPE + ' required');
        } return state;
      };
    };

    if (nativeWeakMap || sharedStore.state) {
      var store$1 = sharedStore.state || (sharedStore.state = new WeakMap$1());
      var wmget = functionUncurryThis(store$1.get);
      var wmhas = functionUncurryThis(store$1.has);
      var wmset = functionUncurryThis(store$1.set);
      set$2 = function (it, metadata) {
        if (wmhas(store$1, it)) throw new TypeError$5(OBJECT_ALREADY_INITIALIZED);
        metadata.facade = it;
        wmset(store$1, it, metadata);
        return metadata;
      };
      get$2 = function (it) {
        return wmget(store$1, it) || {};
      };
      has = function (it) {
        return wmhas(store$1, it);
      };
    } else {
      var STATE = sharedKey('state');
      hiddenKeys$1[STATE] = true;
      set$2 = function (it, metadata) {
        if (hasOwnProperty_1(it, STATE)) throw new TypeError$5(OBJECT_ALREADY_INITIALIZED);
        metadata.facade = it;
        createNonEnumerableProperty(it, STATE, metadata);
        return metadata;
      };
      get$2 = function (it) {
        return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
      };
      has = function (it) {
        return hasOwnProperty_1(it, STATE);
      };
    }

    var internalState = {
      set: set$2,
      get: get$2,
      has: has,
      enforce: enforce,
      getterFor: getterFor
    };

    var $propertyIsEnumerable = {}.propertyIsEnumerable;
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

    // Nashorn ~ JDK8 bug
    var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

    // `Object.prototype.propertyIsEnumerable` method implementation
    // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
    var f$4 = NASHORN_BUG ? function propertyIsEnumerable(V) {
      var descriptor = getOwnPropertyDescriptor$1(this, V);
      return !!descriptor && descriptor.enumerable;
    } : $propertyIsEnumerable;

    var objectPropertyIsEnumerable = {
    	f: f$4
    };

    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

    // `Object.getOwnPropertyDescriptor` method
    // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
    var f$3 = descriptors ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
      O = toIndexedObject(O);
      P = toPropertyKey(P);
      if (ie8DomDefine) try {
        return $getOwnPropertyDescriptor(O, P);
      } catch (error) { /* empty */ }
      if (hasOwnProperty_1(O, P)) return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]);
    };

    var objectGetOwnPropertyDescriptor = {
    	f: f$3
    };

    var FunctionPrototype = Function.prototype;
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

    var EXISTS = hasOwnProperty_1(FunctionPrototype, 'name');
    // additional protection from minified / mangled / dropped function names
    var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
    var CONFIGURABLE = EXISTS && (!descriptors || (descriptors && getDescriptor(FunctionPrototype, 'name').configurable));

    var functionName = {
      EXISTS: EXISTS,
      PROPER: PROPER,
      CONFIGURABLE: CONFIGURABLE
    };

    var redefine = createCommonjsModule(function (module) {
    var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;

    var getInternalState = internalState.get;
    var enforceInternalState = internalState.enforce;
    var TEMPLATE = String(String).split('String');

    (module.exports = function (O, key, value, options) {
      var unsafe = options ? !!options.unsafe : false;
      var simple = options ? !!options.enumerable : false;
      var noTargetGet = options ? !!options.noTargetGet : false;
      var name = options && options.name !== undefined ? options.name : key;
      var state;
      if (isCallable(value)) {
        if (String(name).slice(0, 7) === 'Symbol(') {
          name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
        }
        if (!hasOwnProperty_1(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
          createNonEnumerableProperty(value, 'name', name);
        }
        state = enforceInternalState(value);
        if (!state.source) {
          state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
        }
      }
      if (O === global$1) {
        if (simple) O[key] = value;
        else setGlobal(key, value);
        return;
      } else if (!unsafe) {
        delete O[key];
      } else if (!noTargetGet && O[key]) {
        simple = true;
      }
      if (simple) O[key] = value;
      else createNonEnumerableProperty(O, key, value);
    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
    })(Function.prototype, 'toString', function toString() {
      return isCallable(this) && getInternalState(this).source || inspectSource(this);
    });
    });

    var hiddenKeys = enumBugKeys.concat('length', 'prototype');

    // `Object.getOwnPropertyNames` method
    // https://tc39.es/ecma262/#sec-object.getownpropertynames
    // eslint-disable-next-line es/no-object-getownpropertynames -- safe
    var f$2 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
      return objectKeysInternal(O, hiddenKeys);
    };

    var objectGetOwnPropertyNames = {
    	f: f$2
    };

    // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
    var f$1 = Object.getOwnPropertySymbols;

    var objectGetOwnPropertySymbols = {
    	f: f$1
    };

    var concat$1 = functionUncurryThis([].concat);

    // all object keys, includes non-enumerable and symbols
    var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
      var keys = objectGetOwnPropertyNames.f(anObject(it));
      var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
      return getOwnPropertySymbols ? concat$1(keys, getOwnPropertySymbols(it)) : keys;
    };

    var copyConstructorProperties = function (target, source, exceptions) {
      var keys = ownKeys(source);
      var defineProperty = objectDefineProperty.f;
      var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!hasOwnProperty_1(target, key) && !(exceptions && hasOwnProperty_1(exceptions, key))) {
          defineProperty(target, key, getOwnPropertyDescriptor(source, key));
        }
      }
    };

    var replacement = /#|\.prototype\./;

    var isForced = function (feature, detection) {
      var value = data[normalize(feature)];
      return value == POLYFILL ? true
        : value == NATIVE ? false
        : isCallable(detection) ? fails(detection)
        : !!detection;
    };

    var normalize = isForced.normalize = function (string) {
      return String(string).replace(replacement, '.').toLowerCase();
    };

    var data = isForced.data = {};
    var NATIVE = isForced.NATIVE = 'N';
    var POLYFILL = isForced.POLYFILL = 'P';

    var isForced_1 = isForced;

    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;






    /*
      options.target      - name of the target object
      options.global      - target is the global object
      options.stat        - export as static methods of target
      options.proto       - export as prototype methods of target
      options.real        - real prototype method for the `pure` version
      options.forced      - export even if the native feature is available
      options.bind        - bind methods to the target, required for the `pure` version
      options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
      options.unsafe      - use the simple assignment of property instead of delete + defineProperty
      options.sham        - add a flag to not completely full polyfills
      options.enumerable  - export as enumerable property
      options.noTargetGet - prevent calling a getter on target
      options.name        - the .name of the function if it does not match the key
    */
    var _export = function (options, source) {
      var TARGET = options.target;
      var GLOBAL = options.global;
      var STATIC = options.stat;
      var FORCED, target, key, targetProperty, sourceProperty, descriptor;
      if (GLOBAL) {
        target = global$1;
      } else if (STATIC) {
        target = global$1[TARGET] || setGlobal(TARGET, {});
      } else {
        target = (global$1[TARGET] || {}).prototype;
      }
      if (target) for (key in source) {
        sourceProperty = source[key];
        if (options.noTargetGet) {
          descriptor = getOwnPropertyDescriptor(target, key);
          targetProperty = descriptor && descriptor.value;
        } else targetProperty = target[key];
        FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
        // contained in target
        if (!FORCED && targetProperty !== undefined) {
          if (typeof sourceProperty == typeof targetProperty) continue;
          copyConstructorProperties(sourceProperty, targetProperty);
        }
        // add a flag to not completely full polyfills
        if (options.sham || (targetProperty && targetProperty.sham)) {
          createNonEnumerableProperty(sourceProperty, 'sham', true);
        }
        // extend global
        redefine(target, key, sourceProperty, options);
      }
    };

    var correctPrototypeGetter = !fails(function () {
      function F() { /* empty */ }
      F.prototype.constructor = null;
      // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
      return Object.getPrototypeOf(new F()) !== F.prototype;
    });

    var IE_PROTO = sharedKey('IE_PROTO');
    var Object$2 = global$1.Object;
    var ObjectPrototype = Object$2.prototype;

    // `Object.getPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.getprototypeof
    var objectGetPrototypeOf = correctPrototypeGetter ? Object$2.getPrototypeOf : function (O) {
      var object = toObject(O);
      if (hasOwnProperty_1(object, IE_PROTO)) return object[IE_PROTO];
      var constructor = object.constructor;
      if (isCallable(constructor) && object instanceof constructor) {
        return constructor.prototype;
      } return object instanceof Object$2 ? ObjectPrototype : null;
    };

    var ITERATOR$4 = wellKnownSymbol('iterator');
    var BUGGY_SAFARI_ITERATORS$1 = false;

    // `%IteratorPrototype%` object
    // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
    var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

    /* eslint-disable es/no-array-prototype-keys -- safe */
    if ([].keys) {
      arrayIterator = [].keys();
      // Safari 8 has buggy iterators w/o `next`
      if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
      else {
        PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
        if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
      }
    }

    var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails(function () {
      var test = {};
      // FF44- legacy iterators case
      return IteratorPrototype$2[ITERATOR$4].call(test) !== test;
    });

    if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

    // `%IteratorPrototype%[@@iterator]()` method
    // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
    if (!isCallable(IteratorPrototype$2[ITERATOR$4])) {
      redefine(IteratorPrototype$2, ITERATOR$4, function () {
        return this;
      });
    }

    var iteratorsCore = {
      IteratorPrototype: IteratorPrototype$2,
      BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
    };

    var defineProperty$3 = objectDefineProperty.f;



    var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

    var setToStringTag = function (target, TAG, STATIC) {
      if (target && !STATIC) target = target.prototype;
      if (target && !hasOwnProperty_1(target, TO_STRING_TAG$2)) {
        defineProperty$3(target, TO_STRING_TAG$2, { configurable: true, value: TAG });
      }
    };

    var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





    var returnThis$1 = function () { return this; };

    var createIteratorConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
      var TO_STRING_TAG = NAME + ' Iterator';
      IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
      setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
      iterators[TO_STRING_TAG] = returnThis$1;
      return IteratorConstructor;
    };

    var String$2 = global$1.String;
    var TypeError$4 = global$1.TypeError;

    var aPossiblePrototype = function (argument) {
      if (typeof argument == 'object' || isCallable(argument)) return argument;
      throw TypeError$4("Can't set " + String$2(argument) + ' as a prototype');
    };

    /* eslint-disable no-proto -- safe */

    // `Object.setPrototypeOf` method
    // https://tc39.es/ecma262/#sec-object.setprototypeof
    // Works with __proto__ only. Old v8 can't work with null proto objects.
    // eslint-disable-next-line es/no-object-setprototypeof -- safe
    var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
      var CORRECT_SETTER = false;
      var test = {};
      var setter;
      try {
        // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
        setter = functionUncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
        setter(test, []);
        CORRECT_SETTER = test instanceof Array;
      } catch (error) { /* empty */ }
      return function setPrototypeOf(O, proto) {
        anObject(O);
        aPossiblePrototype(proto);
        if (CORRECT_SETTER) setter(O, proto);
        else O.__proto__ = proto;
        return O;
      };
    }() : undefined);

    var PROPER_FUNCTION_NAME = functionName.PROPER;
    var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
    var IteratorPrototype = iteratorsCore.IteratorPrototype;
    var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
    var ITERATOR$3 = wellKnownSymbol('iterator');
    var KEYS = 'keys';
    var VALUES = 'values';
    var ENTRIES = 'entries';

    var returnThis = function () { return this; };

    var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
      createIteratorConstructor(IteratorConstructor, NAME, next);

      var getIterationMethod = function (KIND) {
        if (KIND === DEFAULT && defaultIterator) return defaultIterator;
        if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
        switch (KIND) {
          case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
          case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
          case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
        } return function () { return new IteratorConstructor(this); };
      };

      var TO_STRING_TAG = NAME + ' Iterator';
      var INCORRECT_VALUES_NAME = false;
      var IterablePrototype = Iterable.prototype;
      var nativeIterator = IterablePrototype[ITERATOR$3]
        || IterablePrototype['@@iterator']
        || DEFAULT && IterablePrototype[DEFAULT];
      var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
      var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
      var CurrentIteratorPrototype, methods, KEY;

      // fix native
      if (anyNativeIterator) {
        CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
        if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
          if (objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
            if (objectSetPrototypeOf) {
              objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
            } else if (!isCallable(CurrentIteratorPrototype[ITERATOR$3])) {
              redefine(CurrentIteratorPrototype, ITERATOR$3, returnThis);
            }
          }
          // Set @@toStringTag to native iterators
          setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
        }
      }

      // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
      if (PROPER_FUNCTION_NAME && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
        if (CONFIGURABLE_FUNCTION_NAME) {
          createNonEnumerableProperty(IterablePrototype, 'name', VALUES);
        } else {
          INCORRECT_VALUES_NAME = true;
          defaultIterator = function values() { return functionCall(nativeIterator, this); };
        }
      }

      // export additional methods
      if (DEFAULT) {
        methods = {
          values: getIterationMethod(VALUES),
          keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
          entries: getIterationMethod(ENTRIES)
        };
        if (FORCED) for (KEY in methods) {
          if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
            redefine(IterablePrototype, KEY, methods[KEY]);
          }
        } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
      }

      // define iterator
      if (IterablePrototype[ITERATOR$3] !== defaultIterator) {
        redefine(IterablePrototype, ITERATOR$3, defaultIterator, { name: DEFAULT });
      }
      iterators[NAME] = defaultIterator;

      return methods;
    };

    var defineProperty$2 = objectDefineProperty.f;




    var ARRAY_ITERATOR = 'Array Iterator';
    var setInternalState$3 = internalState.set;
    var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

    // `Array.prototype.entries` method
    // https://tc39.es/ecma262/#sec-array.prototype.entries
    // `Array.prototype.keys` method
    // https://tc39.es/ecma262/#sec-array.prototype.keys
    // `Array.prototype.values` method
    // https://tc39.es/ecma262/#sec-array.prototype.values
    // `Array.prototype[@@iterator]` method
    // https://tc39.es/ecma262/#sec-array.prototype-@@iterator
    // `CreateArrayIterator` internal method
    // https://tc39.es/ecma262/#sec-createarrayiterator
    defineIterator(Array, 'Array', function (iterated, kind) {
      setInternalState$3(this, {
        type: ARRAY_ITERATOR,
        target: toIndexedObject(iterated), // target
        index: 0,                          // next index
        kind: kind                         // kind
      });
    // `%ArrayIteratorPrototype%.next` method
    // https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
    }, function () {
      var state = getInternalState$1(this);
      var target = state.target;
      var kind = state.kind;
      var index = state.index++;
      if (!target || index >= target.length) {
        state.target = undefined;
        return { value: undefined, done: true };
      }
      if (kind == 'keys') return { value: index, done: false };
      if (kind == 'values') return { value: target[index], done: false };
      return { value: [index, target[index]], done: false };
    }, 'values');

    // argumentsList[@@iterator] is %ArrayProto_values%
    // https://tc39.es/ecma262/#sec-createunmappedargumentsobject
    // https://tc39.es/ecma262/#sec-createmappedargumentsobject
    var values = iterators.Arguments = iterators.Array;

    // https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
    addToUnscopables('keys');
    addToUnscopables('values');
    addToUnscopables('entries');

    // V8 ~ Chrome 45- bug
    if (descriptors && values.name !== 'values') try {
      defineProperty$2(values, 'name', { value: 'values' });
    } catch (error) { /* empty */ }

    var createProperty = function (object, key, value) {
      var propertyKey = toPropertyKey(key);
      if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
      else object[propertyKey] = value;
    };

    var Array$3 = global$1.Array;
    var max$1 = Math.max;

    var arraySliceSimple = function (O, start, end) {
      var length = lengthOfArrayLike(O);
      var k = toAbsoluteIndex(start, length);
      var fin = toAbsoluteIndex(end === undefined ? length : end, length);
      var result = Array$3(max$1(fin - k, 0));
      for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
      result.length = n;
      return result;
    };

    /* eslint-disable es/no-object-getownpropertynames -- safe */

    var $getOwnPropertyNames = objectGetOwnPropertyNames.f;


    var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
      ? Object.getOwnPropertyNames(window) : [];

    var getWindowNames = function (it) {
      try {
        return $getOwnPropertyNames(it);
      } catch (error) {
        return arraySliceSimple(windowNames);
      }
    };

    // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
    var f = function getOwnPropertyNames(it) {
      return windowNames && classofRaw(it) == 'Window'
        ? getWindowNames(it)
        : $getOwnPropertyNames(toIndexedObject(it));
    };

    var objectGetOwnPropertyNamesExternal = {
    	f: f
    };

    // FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it


    var arrayBufferNonExtensible = fails(function () {
      if (typeof ArrayBuffer == 'function') {
        var buffer = new ArrayBuffer(8);
        // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
        if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
      }
    });

    // eslint-disable-next-line es/no-object-isextensible -- safe
    var $isExtensible = Object.isExtensible;
    var FAILS_ON_PRIMITIVES = fails(function () { $isExtensible(1); });

    // `Object.isExtensible` method
    // https://tc39.es/ecma262/#sec-object.isextensible
    var objectIsExtensible = (FAILS_ON_PRIMITIVES || arrayBufferNonExtensible) ? function isExtensible(it) {
      if (!isObject$1(it)) return false;
      if (arrayBufferNonExtensible && classofRaw(it) == 'ArrayBuffer') return false;
      return $isExtensible ? $isExtensible(it) : true;
    } : $isExtensible;

    var freezing = !fails(function () {
      // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
      return Object.isExtensible(Object.preventExtensions({}));
    });

    var internalMetadata = createCommonjsModule(function (module) {
    var defineProperty = objectDefineProperty.f;






    var REQUIRED = false;
    var METADATA = uid('meta');
    var id = 0;

    var setMetadata = function (it) {
      defineProperty(it, METADATA, { value: {
        objectID: 'O' + id++, // object ID
        weakData: {}          // weak collections IDs
      } });
    };

    var fastKey = function (it, create) {
      // return a primitive with prefix
      if (!isObject$1(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
      if (!hasOwnProperty_1(it, METADATA)) {
        // can't set metadata to uncaught frozen object
        if (!objectIsExtensible(it)) return 'F';
        // not necessary to add metadata
        if (!create) return 'E';
        // add missing metadata
        setMetadata(it);
      // return object ID
      } return it[METADATA].objectID;
    };

    var getWeakData = function (it, create) {
      if (!hasOwnProperty_1(it, METADATA)) {
        // can't set metadata to uncaught frozen object
        if (!objectIsExtensible(it)) return true;
        // not necessary to add metadata
        if (!create) return false;
        // add missing metadata
        setMetadata(it);
      // return the store of weak collections IDs
      } return it[METADATA].weakData;
    };

    // add metadata on freeze-family methods calling
    var onFreeze = function (it) {
      if (freezing && REQUIRED && objectIsExtensible(it) && !hasOwnProperty_1(it, METADATA)) setMetadata(it);
      return it;
    };

    var enable = function () {
      meta.enable = function () { /* empty */ };
      REQUIRED = true;
      var getOwnPropertyNames = objectGetOwnPropertyNames.f;
      var splice = functionUncurryThis([].splice);
      var test = {};
      test[METADATA] = 1;

      // prevent exposing of metadata key
      if (getOwnPropertyNames(test).length) {
        objectGetOwnPropertyNames.f = function (it) {
          var result = getOwnPropertyNames(it);
          for (var i = 0, length = result.length; i < length; i++) {
            if (result[i] === METADATA) {
              splice(result, i, 1);
              break;
            }
          } return result;
        };

        _export({ target: 'Object', stat: true, forced: true }, {
          getOwnPropertyNames: objectGetOwnPropertyNamesExternal.f
        });
      }
    };

    var meta = module.exports = {
      enable: enable,
      fastKey: fastKey,
      getWeakData: getWeakData,
      onFreeze: onFreeze
    };

    hiddenKeys$1[METADATA] = true;
    });

    var bind = functionUncurryThis(functionUncurryThis.bind);

    // optional / simple context binding
    var functionBindContext = function (fn, that) {
      aCallable(fn);
      return that === undefined ? fn : functionBindNative ? bind(fn, that) : function (/* ...args */) {
        return fn.apply(that, arguments);
      };
    };

    var ITERATOR$2 = wellKnownSymbol('iterator');
    var ArrayPrototype = Array.prototype;

    // check on default Array iterator
    var isArrayIteratorMethod = function (it) {
      return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR$2] === it);
    };

    var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
    var test = {};

    test[TO_STRING_TAG$1] = 'z';

    var toStringTagSupport = String(test) === '[object z]';

    var TO_STRING_TAG = wellKnownSymbol('toStringTag');
    var Object$1 = global$1.Object;

    // ES3 wrong here
    var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

    // fallback for IE11 Script Access Denied error
    var tryGet = function (it, key) {
      try {
        return it[key];
      } catch (error) { /* empty */ }
    };

    // getting tag from ES6+ `Object.prototype.toString`
    var classof = toStringTagSupport ? classofRaw : function (it) {
      var O, tag, result;
      return it === undefined ? 'Undefined' : it === null ? 'Null'
        // @@toStringTag case
        : typeof (tag = tryGet(O = Object$1(it), TO_STRING_TAG)) == 'string' ? tag
        // builtinTag case
        : CORRECT_ARGUMENTS ? classofRaw(O)
        // ES3 arguments fallback
        : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
    };

    var ITERATOR$1 = wellKnownSymbol('iterator');

    var getIteratorMethod = function (it) {
      if (it != undefined) return getMethod(it, ITERATOR$1)
        || getMethod(it, '@@iterator')
        || iterators[classof(it)];
    };

    var TypeError$3 = global$1.TypeError;

    var getIterator = function (argument, usingIterator) {
      var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
      if (aCallable(iteratorMethod)) return anObject(functionCall(iteratorMethod, argument));
      throw TypeError$3(tryToString(argument) + ' is not iterable');
    };

    var iteratorClose = function (iterator, kind, value) {
      var innerResult, innerError;
      anObject(iterator);
      try {
        innerResult = getMethod(iterator, 'return');
        if (!innerResult) {
          if (kind === 'throw') throw value;
          return value;
        }
        innerResult = functionCall(innerResult, iterator);
      } catch (error) {
        innerError = true;
        innerResult = error;
      }
      if (kind === 'throw') throw value;
      if (innerError) throw innerResult;
      anObject(innerResult);
      return value;
    };

    var TypeError$2 = global$1.TypeError;

    var Result = function (stopped, result) {
      this.stopped = stopped;
      this.result = result;
    };

    var ResultPrototype = Result.prototype;

    var iterate = function (iterable, unboundFunction, options) {
      var that = options && options.that;
      var AS_ENTRIES = !!(options && options.AS_ENTRIES);
      var IS_ITERATOR = !!(options && options.IS_ITERATOR);
      var INTERRUPTED = !!(options && options.INTERRUPTED);
      var fn = functionBindContext(unboundFunction, that);
      var iterator, iterFn, index, length, result, next, step;

      var stop = function (condition) {
        if (iterator) iteratorClose(iterator, 'normal', condition);
        return new Result(true, condition);
      };

      var callFn = function (value) {
        if (AS_ENTRIES) {
          anObject(value);
          return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
        } return INTERRUPTED ? fn(value, stop) : fn(value);
      };

      if (IS_ITERATOR) {
        iterator = iterable;
      } else {
        iterFn = getIteratorMethod(iterable);
        if (!iterFn) throw TypeError$2(tryToString(iterable) + ' is not iterable');
        // optimisation for array iterators
        if (isArrayIteratorMethod(iterFn)) {
          for (index = 0, length = lengthOfArrayLike(iterable); length > index; index++) {
            result = callFn(iterable[index]);
            if (result && objectIsPrototypeOf(ResultPrototype, result)) return result;
          } return new Result(false);
        }
        iterator = getIterator(iterable, iterFn);
      }

      next = iterator.next;
      while (!(step = functionCall(next, iterator)).done) {
        try {
          result = callFn(step.value);
        } catch (error) {
          iteratorClose(iterator, 'throw', error);
        }
        if (typeof result == 'object' && result && objectIsPrototypeOf(ResultPrototype, result)) return result;
      } return new Result(false);
    };

    var TypeError$1 = global$1.TypeError;

    var anInstance = function (it, Prototype) {
      if (objectIsPrototypeOf(Prototype, it)) return it;
      throw TypeError$1('Incorrect invocation');
    };

    var ITERATOR = wellKnownSymbol('iterator');
    var SAFE_CLOSING = false;

    try {
      var called = 0;
      var iteratorWithReturn = {
        next: function () {
          return { done: !!called++ };
        },
        'return': function () {
          SAFE_CLOSING = true;
        }
      };
      iteratorWithReturn[ITERATOR] = function () {
        return this;
      };
      // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
      Array.from(iteratorWithReturn, function () { throw 2; });
    } catch (error) { /* empty */ }

    var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
      if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
      var ITERATION_SUPPORT = false;
      try {
        var object = {};
        object[ITERATOR] = function () {
          return {
            next: function () {
              return { done: ITERATION_SUPPORT = true };
            }
          };
        };
        exec(object);
      } catch (error) { /* empty */ }
      return ITERATION_SUPPORT;
    };

    // makes subclassing work correct for wrapped built-ins
    var inheritIfRequired = function ($this, dummy, Wrapper) {
      var NewTarget, NewTargetPrototype;
      if (
        // it can work only with native `setPrototypeOf`
        objectSetPrototypeOf &&
        // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
        isCallable(NewTarget = dummy.constructor) &&
        NewTarget !== Wrapper &&
        isObject$1(NewTargetPrototype = NewTarget.prototype) &&
        NewTargetPrototype !== Wrapper.prototype
      ) objectSetPrototypeOf($this, NewTargetPrototype);
      return $this;
    };

    var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
      var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
      var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
      var ADDER = IS_MAP ? 'set' : 'add';
      var NativeConstructor = global$1[CONSTRUCTOR_NAME];
      var NativePrototype = NativeConstructor && NativeConstructor.prototype;
      var Constructor = NativeConstructor;
      var exported = {};

      var fixMethod = function (KEY) {
        var uncurriedNativeMethod = functionUncurryThis(NativePrototype[KEY]);
        redefine(NativePrototype, KEY,
          KEY == 'add' ? function add(value) {
            uncurriedNativeMethod(this, value === 0 ? 0 : value);
            return this;
          } : KEY == 'delete' ? function (key) {
            return IS_WEAK && !isObject$1(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
          } : KEY == 'get' ? function get(key) {
            return IS_WEAK && !isObject$1(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
          } : KEY == 'has' ? function has(key) {
            return IS_WEAK && !isObject$1(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
          } : function set(key, value) {
            uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
            return this;
          }
        );
      };

      var REPLACE = isForced_1(
        CONSTRUCTOR_NAME,
        !isCallable(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
          new NativeConstructor().entries().next();
        }))
      );

      if (REPLACE) {
        // create collection constructor
        Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
        internalMetadata.enable();
      } else if (isForced_1(CONSTRUCTOR_NAME, true)) {
        var instance = new Constructor();
        // early implementations not supports chaining
        var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
        // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
        var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
        // most early implementations doesn't supports iterables, most modern - not close it correctly
        // eslint-disable-next-line no-new -- required for testing
        var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
        // for early implementations -0 and +0 not the same
        var BUGGY_ZERO = !IS_WEAK && fails(function () {
          // V8 ~ Chromium 42- fails only with 5+ elements
          var $instance = new NativeConstructor();
          var index = 5;
          while (index--) $instance[ADDER](index, index);
          return !$instance.has(-0);
        });

        if (!ACCEPT_ITERABLES) {
          Constructor = wrapper(function (dummy, iterable) {
            anInstance(dummy, NativePrototype);
            var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
            if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
            return that;
          });
          Constructor.prototype = NativePrototype;
          NativePrototype.constructor = Constructor;
        }

        if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
          fixMethod('delete');
          fixMethod('has');
          IS_MAP && fixMethod('get');
        }

        if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

        // weak collections should not contains .clear method
        if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
      }

      exported[CONSTRUCTOR_NAME] = Constructor;
      _export({ global: true, forced: Constructor != NativeConstructor }, exported);

      setToStringTag(Constructor, CONSTRUCTOR_NAME);

      if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

      return Constructor;
    };

    var redefineAll = function (target, src, options) {
      for (var key in src) redefine(target, key, src[key], options);
      return target;
    };

    var SPECIES$1 = wellKnownSymbol('species');

    var setSpecies = function (CONSTRUCTOR_NAME) {
      var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
      var defineProperty = objectDefineProperty.f;

      if (descriptors && Constructor && !Constructor[SPECIES$1]) {
        defineProperty(Constructor, SPECIES$1, {
          configurable: true,
          get: function () { return this; }
        });
      }
    };

    var defineProperty$1 = objectDefineProperty.f;








    var fastKey = internalMetadata.fastKey;


    var setInternalState$2 = internalState.set;
    var internalStateGetterFor$1 = internalState.getterFor;

    var collectionStrong = {
      getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
        var Constructor = wrapper(function (that, iterable) {
          anInstance(that, Prototype);
          setInternalState$2(that, {
            type: CONSTRUCTOR_NAME,
            index: objectCreate(null),
            first: undefined,
            last: undefined,
            size: 0
          });
          if (!descriptors) that.size = 0;
          if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
        });

        var Prototype = Constructor.prototype;

        var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

        var define = function (that, key, value) {
          var state = getInternalState(that);
          var entry = getEntry(that, key);
          var previous, index;
          // change existing entry
          if (entry) {
            entry.value = value;
          // create new entry
          } else {
            state.last = entry = {
              index: index = fastKey(key, true),
              key: key,
              value: value,
              previous: previous = state.last,
              next: undefined,
              removed: false
            };
            if (!state.first) state.first = entry;
            if (previous) previous.next = entry;
            if (descriptors) state.size++;
            else that.size++;
            // add to index
            if (index !== 'F') state.index[index] = entry;
          } return that;
        };

        var getEntry = function (that, key) {
          var state = getInternalState(that);
          // fast case
          var index = fastKey(key);
          var entry;
          if (index !== 'F') return state.index[index];
          // frozen object case
          for (entry = state.first; entry; entry = entry.next) {
            if (entry.key == key) return entry;
          }
        };

        redefineAll(Prototype, {
          // `{ Map, Set }.prototype.clear()` methods
          // https://tc39.es/ecma262/#sec-map.prototype.clear
          // https://tc39.es/ecma262/#sec-set.prototype.clear
          clear: function clear() {
            var that = this;
            var state = getInternalState(that);
            var data = state.index;
            var entry = state.first;
            while (entry) {
              entry.removed = true;
              if (entry.previous) entry.previous = entry.previous.next = undefined;
              delete data[entry.index];
              entry = entry.next;
            }
            state.first = state.last = undefined;
            if (descriptors) state.size = 0;
            else that.size = 0;
          },
          // `{ Map, Set }.prototype.delete(key)` methods
          // https://tc39.es/ecma262/#sec-map.prototype.delete
          // https://tc39.es/ecma262/#sec-set.prototype.delete
          'delete': function (key) {
            var that = this;
            var state = getInternalState(that);
            var entry = getEntry(that, key);
            if (entry) {
              var next = entry.next;
              var prev = entry.previous;
              delete state.index[entry.index];
              entry.removed = true;
              if (prev) prev.next = next;
              if (next) next.previous = prev;
              if (state.first == entry) state.first = next;
              if (state.last == entry) state.last = prev;
              if (descriptors) state.size--;
              else that.size--;
            } return !!entry;
          },
          // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
          // https://tc39.es/ecma262/#sec-map.prototype.foreach
          // https://tc39.es/ecma262/#sec-set.prototype.foreach
          forEach: function forEach(callbackfn /* , that = undefined */) {
            var state = getInternalState(this);
            var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
            var entry;
            while (entry = entry ? entry.next : state.first) {
              boundFunction(entry.value, entry.key, this);
              // revert to the last existing entry
              while (entry && entry.removed) entry = entry.previous;
            }
          },
          // `{ Map, Set}.prototype.has(key)` methods
          // https://tc39.es/ecma262/#sec-map.prototype.has
          // https://tc39.es/ecma262/#sec-set.prototype.has
          has: function has(key) {
            return !!getEntry(this, key);
          }
        });

        redefineAll(Prototype, IS_MAP ? {
          // `Map.prototype.get(key)` method
          // https://tc39.es/ecma262/#sec-map.prototype.get
          get: function get(key) {
            var entry = getEntry(this, key);
            return entry && entry.value;
          },
          // `Map.prototype.set(key, value)` method
          // https://tc39.es/ecma262/#sec-map.prototype.set
          set: function set(key, value) {
            return define(this, key === 0 ? 0 : key, value);
          }
        } : {
          // `Set.prototype.add(value)` method
          // https://tc39.es/ecma262/#sec-set.prototype.add
          add: function add(value) {
            return define(this, value = value === 0 ? 0 : value, value);
          }
        });
        if (descriptors) defineProperty$1(Prototype, 'size', {
          get: function () {
            return getInternalState(this).size;
          }
        });
        return Constructor;
      },
      setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
        var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
        var getInternalCollectionState = internalStateGetterFor$1(CONSTRUCTOR_NAME);
        var getInternalIteratorState = internalStateGetterFor$1(ITERATOR_NAME);
        // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
        // https://tc39.es/ecma262/#sec-map.prototype.entries
        // https://tc39.es/ecma262/#sec-map.prototype.keys
        // https://tc39.es/ecma262/#sec-map.prototype.values
        // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
        // https://tc39.es/ecma262/#sec-set.prototype.entries
        // https://tc39.es/ecma262/#sec-set.prototype.keys
        // https://tc39.es/ecma262/#sec-set.prototype.values
        // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
        defineIterator(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
          setInternalState$2(this, {
            type: ITERATOR_NAME,
            target: iterated,
            state: getInternalCollectionState(iterated),
            kind: kind,
            last: undefined
          });
        }, function () {
          var state = getInternalIteratorState(this);
          var kind = state.kind;
          var entry = state.last;
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
          // get next entry
          if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
            // or finish the iteration
            state.target = undefined;
            return { value: undefined, done: true };
          }
          // return step by kind
          if (kind == 'keys') return { value: entry.key, done: false };
          if (kind == 'values') return { value: entry.value, done: false };
          return { value: [entry.key, entry.value], done: false };
        }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

        // `{ Map, Set }.prototype[@@species]` accessors
        // https://tc39.es/ecma262/#sec-get-map-@@species
        // https://tc39.es/ecma262/#sec-get-set-@@species
        setSpecies(CONSTRUCTOR_NAME);
      }
    };

    // `Map` constructor
    // https://tc39.es/ecma262/#sec-map-objects
    collection('Map', function (init) {
      return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
    }, collectionStrong);

    // `Object.prototype.toString` method implementation
    // https://tc39.es/ecma262/#sec-object.prototype.tostring
    var objectToString$1 = toStringTagSupport ? {}.toString : function toString() {
      return '[object ' + classof(this) + ']';
    };

    // `Object.prototype.toString` method
    // https://tc39.es/ecma262/#sec-object.prototype.tostring
    if (!toStringTagSupport) {
      redefine(Object.prototype, 'toString', objectToString$1, { unsafe: true });
    }

    var String$1 = global$1.String;

    var toString = function (argument) {
      if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
      return String$1(argument);
    };

    var charAt$1 = functionUncurryThis(''.charAt);
    var charCodeAt = functionUncurryThis(''.charCodeAt);
    var stringSlice = functionUncurryThis(''.slice);

    var createMethod$1 = function (CONVERT_TO_STRING) {
      return function ($this, pos) {
        var S = toString(requireObjectCoercible($this));
        var position = toIntegerOrInfinity(pos);
        var size = S.length;
        var first, second;
        if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
        first = charCodeAt(S, position);
        return first < 0xD800 || first > 0xDBFF || position + 1 === size
          || (second = charCodeAt(S, position + 1)) < 0xDC00 || second > 0xDFFF
            ? CONVERT_TO_STRING
              ? charAt$1(S, position)
              : first
            : CONVERT_TO_STRING
              ? stringSlice(S, position, position + 2)
              : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
      };
    };

    var stringMultibyte = {
      // `String.prototype.codePointAt` method
      // https://tc39.es/ecma262/#sec-string.prototype.codepointat
      codeAt: createMethod$1(false),
      // `String.prototype.at` method
      // https://github.com/mathiasbynens/String.prototype.at
      charAt: createMethod$1(true)
    };

    var charAt = stringMultibyte.charAt;




    var STRING_ITERATOR = 'String Iterator';
    var setInternalState$1 = internalState.set;
    var getInternalState = internalState.getterFor(STRING_ITERATOR);

    // `String.prototype[@@iterator]` method
    // https://tc39.es/ecma262/#sec-string.prototype-@@iterator
    defineIterator(String, 'String', function (iterated) {
      setInternalState$1(this, {
        type: STRING_ITERATOR,
        string: toString(iterated),
        index: 0
      });
    // `%StringIteratorPrototype%.next` method
    // https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
    }, function next() {
      var state = getInternalState(this);
      var string = state.string;
      var index = state.index;
      var point;
      if (index >= string.length) return { value: undefined, done: true };
      point = charAt(string, index);
      state.index += point.length;
      return { value: point, done: false };
    });

    var path = global$1;

    path.Map;

    // `Set` constructor
    // https://tc39.es/ecma262/#sec-set-objects
    collection('Set', function (init) {
      return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
    }, collectionStrong);

    path.Set;

    // `IsArray` abstract operation
    // https://tc39.es/ecma262/#sec-isarray
    // eslint-disable-next-line es/no-array-isarray -- safe
    var isArray = Array.isArray || function isArray(argument) {
      return classofRaw(argument) == 'Array';
    };

    var noop = function () { /* empty */ };
    var empty = [];
    var construct = getBuiltIn('Reflect', 'construct');
    var constructorRegExp = /^\s*(?:class|function)\b/;
    var exec = functionUncurryThis(constructorRegExp.exec);
    var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

    var isConstructorModern = function isConstructor(argument) {
      if (!isCallable(argument)) return false;
      try {
        construct(noop, empty, argument);
        return true;
      } catch (error) {
        return false;
      }
    };

    var isConstructorLegacy = function isConstructor(argument) {
      if (!isCallable(argument)) return false;
      switch (classof(argument)) {
        case 'AsyncFunction':
        case 'GeneratorFunction':
        case 'AsyncGeneratorFunction': return false;
      }
      try {
        // we can't check .prototype since constructors produced by .bind haven't it
        // `Function#toString` throws on some built-it function in some legacy engines
        // (for example, `DOMQuad` and similar in FF41-)
        return INCORRECT_TO_STRING || !!exec(constructorRegExp, inspectSource(argument));
      } catch (error) {
        return true;
      }
    };

    isConstructorLegacy.sham = true;

    // `IsConstructor` abstract operation
    // https://tc39.es/ecma262/#sec-isconstructor
    var isConstructor = !construct || fails(function () {
      var called;
      return isConstructorModern(isConstructorModern.call)
        || !isConstructorModern(Object)
        || !isConstructorModern(function () { called = true; })
        || called;
    }) ? isConstructorLegacy : isConstructorModern;

    var SPECIES = wellKnownSymbol('species');
    var Array$2 = global$1.Array;

    // a part of `ArraySpeciesCreate` abstract operation
    // https://tc39.es/ecma262/#sec-arrayspeciescreate
    var arraySpeciesConstructor = function (originalArray) {
      var C;
      if (isArray(originalArray)) {
        C = originalArray.constructor;
        // cross-realm fallback
        if (isConstructor(C) && (C === Array$2 || isArray(C.prototype))) C = undefined;
        else if (isObject$1(C)) {
          C = C[SPECIES];
          if (C === null) C = undefined;
        }
      } return C === undefined ? Array$2 : C;
    };

    // `ArraySpeciesCreate` abstract operation
    // https://tc39.es/ecma262/#sec-arrayspeciescreate
    var arraySpeciesCreate = function (originalArray, length) {
      return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
    };

    var push = functionUncurryThis([].push);

    // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
    var createMethod = function (TYPE) {
      var IS_MAP = TYPE == 1;
      var IS_FILTER = TYPE == 2;
      var IS_SOME = TYPE == 3;
      var IS_EVERY = TYPE == 4;
      var IS_FIND_INDEX = TYPE == 6;
      var IS_FILTER_REJECT = TYPE == 7;
      var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
      return function ($this, callbackfn, that, specificCreate) {
        var O = toObject($this);
        var self = indexedObject(O);
        var boundFunction = functionBindContext(callbackfn, that);
        var length = lengthOfArrayLike(self);
        var index = 0;
        var create = specificCreate || arraySpeciesCreate;
        var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
        var value, result;
        for (;length > index; index++) if (NO_HOLES || index in self) {
          value = self[index];
          result = boundFunction(value, index, O);
          if (TYPE) {
            if (IS_MAP) target[index] = result; // map
            else if (result) switch (TYPE) {
              case 3: return true;              // some
              case 5: return value;             // find
              case 6: return index;             // findIndex
              case 2: push(target, value);      // filter
            } else switch (TYPE) {
              case 4: return false;             // every
              case 7: push(target, value);      // filterReject
            }
          }
        }
        return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
      };
    };

    var arrayIteration = {
      // `Array.prototype.forEach` method
      // https://tc39.es/ecma262/#sec-array.prototype.foreach
      forEach: createMethod(0),
      // `Array.prototype.map` method
      // https://tc39.es/ecma262/#sec-array.prototype.map
      map: createMethod(1),
      // `Array.prototype.filter` method
      // https://tc39.es/ecma262/#sec-array.prototype.filter
      filter: createMethod(2),
      // `Array.prototype.some` method
      // https://tc39.es/ecma262/#sec-array.prototype.some
      some: createMethod(3),
      // `Array.prototype.every` method
      // https://tc39.es/ecma262/#sec-array.prototype.every
      every: createMethod(4),
      // `Array.prototype.find` method
      // https://tc39.es/ecma262/#sec-array.prototype.find
      find: createMethod(5),
      // `Array.prototype.findIndex` method
      // https://tc39.es/ecma262/#sec-array.prototype.findIndex
      findIndex: createMethod(6),
      // `Array.prototype.filterReject` method
      // https://github.com/tc39/proposal-array-filtering
      filterReject: createMethod(7)
    };

    var getWeakData = internalMetadata.getWeakData;








    var setInternalState = internalState.set;
    var internalStateGetterFor = internalState.getterFor;
    var find = arrayIteration.find;
    var findIndex = arrayIteration.findIndex;
    var splice = functionUncurryThis([].splice);
    var id = 0;

    // fallback for uncaught frozen keys
    var uncaughtFrozenStore = function (store) {
      return store.frozen || (store.frozen = new UncaughtFrozenStore());
    };

    var UncaughtFrozenStore = function () {
      this.entries = [];
    };

    var findUncaughtFrozen = function (store, key) {
      return find(store.entries, function (it) {
        return it[0] === key;
      });
    };

    UncaughtFrozenStore.prototype = {
      get: function (key) {
        var entry = findUncaughtFrozen(this, key);
        if (entry) return entry[1];
      },
      has: function (key) {
        return !!findUncaughtFrozen(this, key);
      },
      set: function (key, value) {
        var entry = findUncaughtFrozen(this, key);
        if (entry) entry[1] = value;
        else this.entries.push([key, value]);
      },
      'delete': function (key) {
        var index = findIndex(this.entries, function (it) {
          return it[0] === key;
        });
        if (~index) splice(this.entries, index, 1);
        return !!~index;
      }
    };

    var collectionWeak = {
      getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
        var Constructor = wrapper(function (that, iterable) {
          anInstance(that, Prototype);
          setInternalState(that, {
            type: CONSTRUCTOR_NAME,
            id: id++,
            frozen: undefined
          });
          if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
        });

        var Prototype = Constructor.prototype;

        var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

        var define = function (that, key, value) {
          var state = getInternalState(that);
          var data = getWeakData(anObject(key), true);
          if (data === true) uncaughtFrozenStore(state).set(key, value);
          else data[state.id] = value;
          return that;
        };

        redefineAll(Prototype, {
          // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
          // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
          // https://tc39.es/ecma262/#sec-weakset.prototype.delete
          'delete': function (key) {
            var state = getInternalState(this);
            if (!isObject$1(key)) return false;
            var data = getWeakData(key);
            if (data === true) return uncaughtFrozenStore(state)['delete'](key);
            return data && hasOwnProperty_1(data, state.id) && delete data[state.id];
          },
          // `{ WeakMap, WeakSet }.prototype.has(key)` methods
          // https://tc39.es/ecma262/#sec-weakmap.prototype.has
          // https://tc39.es/ecma262/#sec-weakset.prototype.has
          has: function has(key) {
            var state = getInternalState(this);
            if (!isObject$1(key)) return false;
            var data = getWeakData(key);
            if (data === true) return uncaughtFrozenStore(state).has(key);
            return data && hasOwnProperty_1(data, state.id);
          }
        });

        redefineAll(Prototype, IS_MAP ? {
          // `WeakMap.prototype.get(key)` method
          // https://tc39.es/ecma262/#sec-weakmap.prototype.get
          get: function get(key) {
            var state = getInternalState(this);
            if (isObject$1(key)) {
              var data = getWeakData(key);
              if (data === true) return uncaughtFrozenStore(state).get(key);
              return data ? data[state.id] : undefined;
            }
          },
          // `WeakMap.prototype.set(key, value)` method
          // https://tc39.es/ecma262/#sec-weakmap.prototype.set
          set: function set(key, value) {
            return define(this, key, value);
          }
        } : {
          // `WeakSet.prototype.add(value)` method
          // https://tc39.es/ecma262/#sec-weakset.prototype.add
          add: function add(value) {
            return define(this, value, true);
          }
        });

        return Constructor;
      }
    };

    var enforceInternalState = internalState.enforce;


    var IS_IE11 = !global$1.ActiveXObject && 'ActiveXObject' in global$1;
    var InternalWeakMap;

    var wrapper = function (init) {
      return function WeakMap() {
        return init(this, arguments.length ? arguments[0] : undefined);
      };
    };

    // `WeakMap` constructor
    // https://tc39.es/ecma262/#sec-weakmap-constructor
    var $WeakMap = collection('WeakMap', wrapper, collectionWeak);

    // IE11 WeakMap frozen keys fix
    // We can't use feature detection because it crash some old IE builds
    // https://github.com/zloirock/core-js/issues/485
    if (nativeWeakMap && IS_IE11) {
      InternalWeakMap = collectionWeak.getConstructor(wrapper, 'WeakMap', true);
      internalMetadata.enable();
      var WeakMapPrototype = $WeakMap.prototype;
      var nativeDelete = functionUncurryThis(WeakMapPrototype['delete']);
      var nativeHas = functionUncurryThis(WeakMapPrototype.has);
      var nativeGet = functionUncurryThis(WeakMapPrototype.get);
      var nativeSet = functionUncurryThis(WeakMapPrototype.set);
      redefineAll(WeakMapPrototype, {
        'delete': function (key) {
          if (isObject$1(key) && !objectIsExtensible(key)) {
            var state = enforceInternalState(this);
            if (!state.frozen) state.frozen = new InternalWeakMap();
            return nativeDelete(this, key) || state.frozen['delete'](key);
          } return nativeDelete(this, key);
        },
        has: function has(key) {
          if (isObject$1(key) && !objectIsExtensible(key)) {
            var state = enforceInternalState(this);
            if (!state.frozen) state.frozen = new InternalWeakMap();
            return nativeHas(this, key) || state.frozen.has(key);
          } return nativeHas(this, key);
        },
        get: function get(key) {
          if (isObject$1(key) && !objectIsExtensible(key)) {
            var state = enforceInternalState(this);
            if (!state.frozen) state.frozen = new InternalWeakMap();
            return nativeHas(this, key) ? nativeGet(this, key) : state.frozen.get(key);
          } return nativeGet(this, key);
        },
        set: function set(key, value) {
          if (isObject$1(key) && !objectIsExtensible(key)) {
            var state = enforceInternalState(this);
            if (!state.frozen) state.frozen = new InternalWeakMap();
            nativeHas(this, key) ? nativeSet(this, key, value) : state.frozen.set(key, value);
          } else nativeSet(this, key, value);
          return this;
        }
      });
    }

    path.WeakMap;

    // call something on iterator step with safe closing on error
    var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
      try {
        return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
      } catch (error) {
        iteratorClose(iterator, 'throw', error);
      }
    };

    var Array$1 = global$1.Array;

    // `Array.from` method implementation
    // https://tc39.es/ecma262/#sec-array.from
    var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
      var O = toObject(arrayLike);
      var IS_CONSTRUCTOR = isConstructor(this);
      var argumentsLength = arguments.length;
      var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
      var mapping = mapfn !== undefined;
      if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
      var iteratorMethod = getIteratorMethod(O);
      var index = 0;
      var length, result, step, iterator, next, value;
      // if the target is not iterable or it's an array with the default iterator - use a simple case
      if (iteratorMethod && !(this == Array$1 && isArrayIteratorMethod(iteratorMethod))) {
        iterator = getIterator(O, iteratorMethod);
        next = iterator.next;
        result = IS_CONSTRUCTOR ? new this() : [];
        for (;!(step = functionCall(next, iterator)).done; index++) {
          value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
          createProperty(result, index, value);
        }
      } else {
        length = lengthOfArrayLike(O);
        result = IS_CONSTRUCTOR ? new this(length) : Array$1(length);
        for (;length > index; index++) {
          value = mapping ? mapfn(O[index], index) : O[index];
          createProperty(result, index, value);
        }
      }
      result.length = index;
      return result;
    };

    var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
      // eslint-disable-next-line es/no-array-from -- required for testing
      Array.from(iterable);
    });

    // `Array.from` method
    // https://tc39.es/ecma262/#sec-array.from
    _export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
      from: arrayFrom
    });

    path.Array.from;

    // eslint-disable-next-line es/no-object-assign -- safe
    var $assign = Object.assign;
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    var defineProperty = Object.defineProperty;
    var concat = functionUncurryThis([].concat);

    // `Object.assign` method
    // https://tc39.es/ecma262/#sec-object.assign
    var objectAssign = !$assign || fails(function () {
      // should have correct order of operations (Edge bug)
      if (descriptors && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
        enumerable: true,
        get: function () {
          defineProperty(this, 'b', {
            value: 3,
            enumerable: false
          });
        }
      }), { b: 2 })).b !== 1) return true;
      // should work with symbols and should have deterministic property order (V8 bug)
      var A = {};
      var B = {};
      // eslint-disable-next-line es/no-symbol -- safe
      var symbol = Symbol();
      var alphabet = 'abcdefghijklmnopqrst';
      A[symbol] = 7;
      alphabet.split('').forEach(function (chr) { B[chr] = chr; });
      return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
    }) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
      var T = toObject(target);
      var argumentsLength = arguments.length;
      var index = 1;
      var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
      var propertyIsEnumerable = objectPropertyIsEnumerable.f;
      while (argumentsLength > index) {
        var S = indexedObject(arguments[index++]);
        var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
        var length = keys.length;
        var j = 0;
        var key;
        while (length > j) {
          key = keys[j++];
          if (!descriptors || functionCall(propertyIsEnumerable, S, key)) T[key] = S[key];
        }
      } return T;
    } : $assign;

    // `Object.assign` method
    // https://tc39.es/ecma262/#sec-object.assign
    // eslint-disable-next-line es/no-object-assign -- required for testing
    _export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
      assign: objectAssign
    });

    path.Object.assign;

    /**
     * The base implementation of `_.clamp` which doesn't coerce arguments.
     *
     * @private
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     */
    function baseClamp(number, lower, upper) {
      if (number === number) {
        if (upper !== undefined) {
          number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
          number = number >= lower ? number : lower;
        }
      }
      return number;
    }

    /** Used to match a single whitespace character. */
    var reWhitespace = /\s/;

    /**
     * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
     * character of `string`.
     *
     * @private
     * @param {string} string The string to inspect.
     * @returns {number} Returns the index of the last non-whitespace character.
     */
    function trimmedEndIndex(string) {
      var index = string.length;

      while (index-- && reWhitespace.test(string.charAt(index))) {}
      return index;
    }

    /** Used to match leading whitespace. */
    var reTrimStart = /^\s+/;

    /**
     * The base implementation of `_.trim`.
     *
     * @private
     * @param {string} string The string to trim.
     * @returns {string} Returns the trimmed string.
     */
    function baseTrim(string) {
      return string
        ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
        : string;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

    var freeGlobal$1 = freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal$1 || freeSelf || Function('return this')();

    var root$1 = root;

    /** Built-in value references. */
    var Symbol$1 = root$1.Symbol;

    var Symbol$2 = Symbol$1;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto$1.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$1.toString;

    /** Built-in value references. */
    var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag$1),
          tag = value[symToStringTag$1];

      try {
        value[symToStringTag$1] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString$1.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag$1] = tag;
        } else {
          delete value[symToStringTag$1];
        }
      }
      return result;
    }

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
    }

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    /** `Object#toString` result references. */
    var symbolTag = '[object Symbol]';

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
    }

    /** Used as references for various `Number` constants. */
    var NAN = 0 / 0;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = baseTrim(value);
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }

    /**
     * Clamps `number` within the inclusive `lower` and `upper` bounds.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Number
     * @param {number} number The number to clamp.
     * @param {number} [lower] The lower bound.
     * @param {number} upper The upper bound.
     * @returns {number} Returns the clamped number.
     * @example
     *
     * _.clamp(-10, -5, 5);
     * // => -5
     *
     * _.clamp(10, -5, 5);
     * // => 5
     */
    function clamp(number, lower, upper) {
      if (upper === undefined) {
        upper = lower;
        lower = undefined;
      }
      if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
      }
      if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
      }
      return baseClamp(toNumber(number), lower, upper);
    }

    function range(min, max) {
        if (min === void 0) { min = -Infinity; }
        if (max === void 0) { max = Infinity; }
        return function (proto, key) {
            var alias = "_" + key;
            Object.defineProperty(proto, key, {
                get: function () {
                    return this[alias];
                },
                set: function (val) {
                    Object.defineProperty(this, alias, {
                        value: clamp(val, min, max),
                        enumerable: false,
                        writable: true,
                        configurable: true,
                    });
                },
                enumerable: true,
                configurable: true,
            });
        };
    }

    function boolean(proto, key) {
        var alias = "_" + key;
        Object.defineProperty(proto, key, {
            get: function () {
                return this[alias];
            },
            set: function (val) {
                Object.defineProperty(this, alias, {
                    value: !!val,
                    enumerable: false,
                    writable: true,
                    configurable: true,
                });
            },
            enumerable: true,
            configurable: true,
        });
    }

    /**
     * Gets the timestamp of the number of milliseconds that have elapsed since
     * the Unix epoch (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @since 2.4.0
     * @category Date
     * @returns {number} Returns the timestamp.
     * @example
     *
     * _.defer(function(stamp) {
     *   console.log(_.now() - stamp);
     * }, _.now());
     * // => Logs the number of milliseconds it took for the deferred invocation.
     */
    var now = function() {
      return root$1.Date.now();
    };

    var now$1 = now;

    /** Error message constants. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeMax = Math.max,
        nativeMin = Math.min;

    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked. The debounced function comes with a `cancel` method to cancel
     * delayed `func` invocations and a `flush` method to immediately invoke them.
     * Provide `options` to indicate whether `func` should be invoked on the
     * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
     * with the last arguments provided to the debounced function. Subsequent
     * calls to the debounced function return the result of the last `func`
     * invocation.
     *
     * **Note:** If `leading` and `trailing` options are `true`, `func` is
     * invoked on the trailing edge of the timeout only if the debounced function
     * is invoked more than once during the `wait` timeout.
     *
     * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
     * until to the next tick, similar to `setTimeout` with a timeout of `0`.
     *
     * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
     * for details over the differences between `_.debounce` and `_.throttle`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to debounce.
     * @param {number} [wait=0] The number of milliseconds to delay.
     * @param {Object} [options={}] The options object.
     * @param {boolean} [options.leading=false]
     *  Specify invoking on the leading edge of the timeout.
     * @param {number} [options.maxWait]
     *  The maximum time `func` is allowed to be delayed before it's invoked.
     * @param {boolean} [options.trailing=true]
     *  Specify invoking on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // Avoid costly calculations while the window size is in flux.
     * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
     *
     * // Invoke `sendMail` when clicked, debouncing subsequent calls.
     * jQuery(element).on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * }));
     *
     * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
     * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
     * var source = new EventSource('/stream');
     * jQuery(source).on('message', debounced);
     *
     * // Cancel the trailing debounced invocation.
     * jQuery(window).on('popstate', debounced.cancel);
     */
    function debounce$2(func, wait, options) {
      var lastArgs,
          lastThis,
          maxWait,
          result,
          timerId,
          lastCallTime,
          lastInvokeTime = 0,
          leading = false,
          maxing = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = 'maxWait' in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function invokeFunc(time) {
        var args = lastArgs,
            thisArg = lastThis;

        lastArgs = lastThis = undefined;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }

      function leadingEdge(time) {
        // Reset any `maxWait` timer.
        lastInvokeTime = time;
        // Start the timer for the trailing edge.
        timerId = setTimeout(timerExpired, wait);
        // Invoke the leading edge.
        return leading ? invokeFunc(time) : result;
      }

      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime,
            timeWaiting = wait - timeSinceLastCall;

        return maxing
          ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
          : timeWaiting;
      }

      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime,
            timeSinceLastInvoke = time - lastInvokeTime;

        // Either this is the first call, activity has stopped and we're at the
        // trailing edge, the system time has gone backwards and we're treating
        // it as the trailing edge, or we've hit the `maxWait` limit.
        return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
          (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
      }

      function timerExpired() {
        var time = now$1();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        // Restart the timer.
        timerId = setTimeout(timerExpired, remainingWait(time));
      }

      function trailingEdge(time) {
        timerId = undefined;

        // Only invoke if we have `lastArgs` which means `func` has been
        // debounced at least once.
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = undefined;
        return result;
      }

      function cancel() {
        if (timerId !== undefined) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = undefined;
      }

      function flush() {
        return timerId === undefined ? result : trailingEdge(now$1());
      }

      function debounced() {
        var time = now$1(),
            isInvoking = shouldInvoke(time);

        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;

        if (isInvoking) {
          if (timerId === undefined) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            // Handle invocations in a tight loop.
            clearTimeout(timerId);
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === undefined) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }

    function debounce$1() {
        var options = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            options[_i] = arguments[_i];
        }
        return function (_proto, key, descriptor) {
            var fn = descriptor.value;
            return {
                get: function () {
                    if (!this.hasOwnProperty(key)) {
                        Object.defineProperty(this, key, {
                            value: debounce$2.apply(void 0, __spreadArrays([fn], options)),
                        });
                    }
                    return this[key];
                },
            };
        };
    }

    var Options = /** @class */ (function () {
        function Options(config) {
            var _this = this;
            if (config === void 0) { config = {}; }
            /**
             * Momentum reduction damping factor, a float value between `(0, 1)`.
             * The lower the value is, the more smooth the scrolling will be
             * (also the more paint frames).
             */
            this.damping = 0.1;
            /**
             * Minimal size for scrollbar thumbs.
             */
            this.thumbMinSize = 20;
            /**
             * Render every frame in integer pixel values
             * set to `true` to improve scrolling performance.
             */
            this.renderByPixels = true;
            /**
             * Keep scrollbar tracks visible
             */
            this.alwaysShowTracks = false;
            /**
             * Set to `true` to allow outer scrollbars continue scrolling
             * when current scrollbar reaches edge.
             */
            this.continuousScrolling = true;
            /**
             * Delegate wheel events and touch events to the given element.
             * By default, the container element is used.
             * This option will be useful for dealing with fixed elements.
             */
            this.delegateTo = null;
            /**
             * Options for plugins. Syntax:
             *   plugins[pluginName] = pluginOptions: any
             */
            this.plugins = {};
            Object.keys(config).forEach(function (prop) {
                _this[prop] = config[prop];
            });
        }
        Object.defineProperty(Options.prototype, "wheelEventTarget", {
            get: function () {
                return this.delegateTo;
            },
            set: function (el) {
                console.warn('[smooth-scrollbar]: `options.wheelEventTarget` is deprecated and will be removed in the future, use `options.delegateTo` instead.');
                this.delegateTo = el;
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            range(0, 1)
        ], Options.prototype, "damping", void 0);
        __decorate([
            range(0, Infinity)
        ], Options.prototype, "thumbMinSize", void 0);
        __decorate([
            boolean
        ], Options.prototype, "renderByPixels", void 0);
        __decorate([
            boolean
        ], Options.prototype, "alwaysShowTracks", void 0);
        __decorate([
            boolean
        ], Options.prototype, "continuousScrolling", void 0);
        return Options;
    }());

    var eventListenerOptions;
    var eventMap = new WeakMap();
    function getOptions() {
        if (eventListenerOptions !== undefined) {
            return eventListenerOptions;
        }
        var supportPassiveEvent = false;
        try {
            var noop = function () { };
            var options = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportPassiveEvent = true;
                },
            });
            window.addEventListener('testPassive', noop, options);
            window.removeEventListener('testPassive', noop, options);
        }
        catch (e) { }
        eventListenerOptions = supportPassiveEvent ? { passive: false } : false;
        return eventListenerOptions;
    }
    function eventScope(scrollbar) {
        var configs = eventMap.get(scrollbar) || [];
        eventMap.set(scrollbar, configs);
        return function addEvent(elem, events, fn) {
            function handler(event) {
                // ignore default prevented events
                if (event.defaultPrevented) {
                    return;
                }
                fn(event);
            }
            events.split(/\s+/g).forEach(function (eventName) {
                configs.push({ elem: elem, eventName: eventName, handler: handler });
                elem.addEventListener(eventName, handler, getOptions());
            });
        };
    }
    function clearEventsOn(scrollbar) {
        var configs = eventMap.get(scrollbar);
        if (!configs) {
            return;
        }
        configs.forEach(function (_a) {
            var elem = _a.elem, eventName = _a.eventName, handler = _a.handler;
            elem.removeEventListener(eventName, handler, getOptions());
        });
        eventMap.delete(scrollbar);
    }

    /**
     * Get pointer/touch data
     */
    function getPointerData(evt) {
        // if is touch event, return last item in touchList
        // else return original event
        return evt.touches ? evt.touches[evt.touches.length - 1] : evt;
    }

    /**
     * Get pointer/finger position
     */
    function getPosition(evt) {
        var data = getPointerData(evt);
        return {
            x: data.clientX,
            y: data.clientY,
        };
    }

    /**
     * Check if `a` is one of `[...b]`
     */
    function isOneOf(a, b) {
        if (b === void 0) { b = []; }
        return b.some(function (v) { return a === v; });
    }

    var VENDOR_PREFIX = [
        'webkit',
        'moz',
        'ms',
        'o',
    ];
    var RE = new RegExp("^-(?!(?:" + VENDOR_PREFIX.join('|') + ")-)");
    function autoPrefix(styles) {
        var res = {};
        Object.keys(styles).forEach(function (prop) {
            if (!RE.test(prop)) {
                res[prop] = styles[prop];
                return;
            }
            var val = styles[prop];
            prop = prop.replace(/^-/, '');
            res[prop] = val;
            VENDOR_PREFIX.forEach(function (prefix) {
                res["-" + prefix + "-" + prop] = val;
            });
        });
        return res;
    }
    function setStyle(elem, styles) {
        styles = autoPrefix(styles);
        Object.keys(styles).forEach(function (prop) {
            var cssProp = prop.replace(/^-/, '').replace(/-([a-z])/g, function (_, $1) { return $1.toUpperCase(); });
            elem.style[cssProp] = styles[prop];
        });
    }

    var Tracker = /** @class */ (function () {
        function Tracker(touch) {
            this.velocityMultiplier = /Android/.test(navigator.userAgent) ? window.devicePixelRatio : 1;
            this.updateTime = Date.now();
            this.delta = { x: 0, y: 0 };
            this.velocity = { x: 0, y: 0 };
            this.lastPosition = { x: 0, y: 0 };
            this.lastPosition = getPosition(touch);
        }
        Tracker.prototype.update = function (touch) {
            var _a = this, velocity = _a.velocity, updateTime = _a.updateTime, lastPosition = _a.lastPosition;
            var now = Date.now();
            var position = getPosition(touch);
            var delta = {
                x: -(position.x - lastPosition.x),
                y: -(position.y - lastPosition.y),
            };
            var duration = (now - updateTime) || 16.7;
            var vx = delta.x / duration * 16.7;
            var vy = delta.y / duration * 16.7;
            velocity.x = vx * this.velocityMultiplier;
            velocity.y = vy * this.velocityMultiplier;
            this.delta = delta;
            this.updateTime = now;
            this.lastPosition = position;
        };
        return Tracker;
    }());
    var TouchRecord = /** @class */ (function () {
        function TouchRecord() {
            this._touchList = {};
        }
        Object.defineProperty(TouchRecord.prototype, "_primitiveValue", {
            get: function () {
                return { x: 0, y: 0 };
            },
            enumerable: true,
            configurable: true
        });
        TouchRecord.prototype.isActive = function () {
            return this._activeTouchID !== undefined;
        };
        TouchRecord.prototype.getDelta = function () {
            var tracker = this._getActiveTracker();
            if (!tracker) {
                return this._primitiveValue;
            }
            return __assign({}, tracker.delta);
        };
        TouchRecord.prototype.getVelocity = function () {
            var tracker = this._getActiveTracker();
            if (!tracker) {
                return this._primitiveValue;
            }
            return __assign({}, tracker.velocity);
        };
        TouchRecord.prototype.getEasingDistance = function (damping) {
            var deAcceleration = 1 - damping;
            var distance = {
                x: 0,
                y: 0,
            };
            var vel = this.getVelocity();
            Object.keys(vel).forEach(function (dir) {
                // ignore small velocity
                var v = Math.abs(vel[dir]) <= 10 ? 0 : vel[dir];
                while (v !== 0) {
                    distance[dir] += v;
                    v = (v * deAcceleration) | 0;
                }
            });
            return distance;
        };
        TouchRecord.prototype.track = function (evt) {
            var _this = this;
            var targetTouches = evt.targetTouches;
            Array.from(targetTouches).forEach(function (touch) {
                _this._add(touch);
            });
            return this._touchList;
        };
        TouchRecord.prototype.update = function (evt) {
            var _this = this;
            var touches = evt.touches, changedTouches = evt.changedTouches;
            Array.from(touches).forEach(function (touch) {
                _this._renew(touch);
            });
            this._setActiveID(changedTouches);
            return this._touchList;
        };
        TouchRecord.prototype.release = function (evt) {
            var _this = this;
            delete this._activeTouchID;
            Array.from(evt.changedTouches).forEach(function (touch) {
                _this._delete(touch);
            });
        };
        TouchRecord.prototype._add = function (touch) {
            if (this._has(touch)) {
                return;
            }
            var tracker = new Tracker(touch);
            this._touchList[touch.identifier] = tracker;
        };
        TouchRecord.prototype._renew = function (touch) {
            if (!this._has(touch)) {
                return;
            }
            var tracker = this._touchList[touch.identifier];
            tracker.update(touch);
        };
        TouchRecord.prototype._delete = function (touch) {
            delete this._touchList[touch.identifier];
        };
        TouchRecord.prototype._has = function (touch) {
            return this._touchList.hasOwnProperty(touch.identifier);
        };
        TouchRecord.prototype._setActiveID = function (touches) {
            this._activeTouchID = touches[touches.length - 1].identifier;
        };
        TouchRecord.prototype._getActiveTracker = function () {
            var _a = this, _touchList = _a._touchList, _activeTouchID = _a._activeTouchID;
            return _touchList[_activeTouchID];
        };
        return TouchRecord;
    }());

    var TrackDirection;
    (function (TrackDirection) {
        TrackDirection["X"] = "x";
        TrackDirection["Y"] = "y";
    })(TrackDirection || (TrackDirection = {}));

    var ScrollbarThumb = /** @class */ (function () {
        function ScrollbarThumb(_direction, _minSize) {
            if (_minSize === void 0) { _minSize = 0; }
            this._direction = _direction;
            this._minSize = _minSize;
            /**
             * Thumb element
             */
            this.element = document.createElement('div');
            /**
             * Display size of the thumb
             * will always be greater than `scrollbar.options.thumbMinSize`
             */
            this.displaySize = 0;
            /**
             * Actual size of the thumb
             */
            this.realSize = 0;
            /**
             * Thumb offset to the top
             */
            this.offset = 0;
            this.element.className = "scrollbar-thumb scrollbar-thumb-" + _direction;
        }
        /**
         * Attach to track element
         *
         * @param trackEl Track element
         */
        ScrollbarThumb.prototype.attachTo = function (trackEl) {
            trackEl.appendChild(this.element);
        };
        ScrollbarThumb.prototype.update = function (scrollOffset, containerSize, pageSize) {
            // calculate thumb size
            // pageSize > containerSize -> scrollable
            this.realSize = Math.min(containerSize / pageSize, 1) * containerSize;
            this.displaySize = Math.max(this.realSize, this._minSize);
            // calculate thumb offset
            this.offset = scrollOffset / pageSize * (containerSize + (this.realSize - this.displaySize));
            setStyle(this.element, this._getStyle());
        };
        ScrollbarThumb.prototype._getStyle = function () {
            switch (this._direction) {
                case TrackDirection.X:
                    return {
                        width: this.displaySize + "px",
                        '-transform': "translate3d(" + this.offset + "px, 0, 0)",
                    };
                case TrackDirection.Y:
                    return {
                        height: this.displaySize + "px",
                        '-transform': "translate3d(0, " + this.offset + "px, 0)",
                    };
                default:
                    return null;
            }
        };
        return ScrollbarThumb;
    }());

    var ScrollbarTrack = /** @class */ (function () {
        function ScrollbarTrack(direction, thumbMinSize) {
            if (thumbMinSize === void 0) { thumbMinSize = 0; }
            /**
             * Track element
             */
            this.element = document.createElement('div');
            this._isShown = false;
            this.element.className = "scrollbar-track scrollbar-track-" + direction;
            this.thumb = new ScrollbarThumb(direction, thumbMinSize);
            this.thumb.attachTo(this.element);
        }
        /**
         * Attach to scrollbar container element
         *
         * @param scrollbarContainer Scrollbar container element
         */
        ScrollbarTrack.prototype.attachTo = function (scrollbarContainer) {
            scrollbarContainer.appendChild(this.element);
        };
        /**
         * Show track immediately
         */
        ScrollbarTrack.prototype.show = function () {
            if (this._isShown) {
                return;
            }
            this._isShown = true;
            this.element.classList.add('show');
        };
        /**
         * Hide track immediately
         */
        ScrollbarTrack.prototype.hide = function () {
            if (!this._isShown) {
                return;
            }
            this._isShown = false;
            this.element.classList.remove('show');
        };
        ScrollbarTrack.prototype.update = function (scrollOffset, containerSize, pageSize) {
            setStyle(this.element, {
                display: pageSize <= containerSize ? 'none' : 'block',
            });
            this.thumb.update(scrollOffset, containerSize, pageSize);
        };
        return ScrollbarTrack;
    }());

    var TrackController = /** @class */ (function () {
        function TrackController(_scrollbar) {
            this._scrollbar = _scrollbar;
            var thumbMinSize = _scrollbar.options.thumbMinSize;
            this.xAxis = new ScrollbarTrack(TrackDirection.X, thumbMinSize);
            this.yAxis = new ScrollbarTrack(TrackDirection.Y, thumbMinSize);
            this.xAxis.attachTo(_scrollbar.containerEl);
            this.yAxis.attachTo(_scrollbar.containerEl);
            if (_scrollbar.options.alwaysShowTracks) {
                this.xAxis.show();
                this.yAxis.show();
            }
        }
        /**
         * Updates track appearance
         */
        TrackController.prototype.update = function () {
            var _a = this._scrollbar, size = _a.size, offset = _a.offset;
            this.xAxis.update(offset.x, size.container.width, size.content.width);
            this.yAxis.update(offset.y, size.container.height, size.content.height);
        };
        /**
         * Automatically hide tracks when scrollbar is in idle state
         */
        TrackController.prototype.autoHideOnIdle = function () {
            if (this._scrollbar.options.alwaysShowTracks) {
                return;
            }
            this.xAxis.hide();
            this.yAxis.hide();
        };
        __decorate([
            debounce$1(300)
        ], TrackController.prototype, "autoHideOnIdle", null);
        return TrackController;
    }());

    function getSize(scrollbar) {
        var containerEl = scrollbar.containerEl, contentEl = scrollbar.contentEl;
        var containerStyles = getComputedStyle(containerEl);
        var paddings = [
            'paddingTop',
            'paddingBottom',
            'paddingLeft',
            'paddingRight',
        ].map(function (prop) {
            return containerStyles[prop] ? parseFloat(containerStyles[prop]) : 0;
        });
        var verticalPadding = paddings[0] + paddings[1];
        var horizontalPadding = paddings[2] + paddings[3];
        return {
            container: {
                // requires `overflow: hidden`
                width: containerEl.clientWidth,
                height: containerEl.clientHeight,
            },
            content: {
                // border width and paddings should be included
                width: contentEl.offsetWidth - contentEl.clientWidth + contentEl.scrollWidth + horizontalPadding,
                height: contentEl.offsetHeight - contentEl.clientHeight + contentEl.scrollHeight + verticalPadding,
            },
        };
    }

    function isVisible(scrollbar, elem) {
        var bounding = scrollbar.bounding;
        var targetBounding = elem.getBoundingClientRect();
        // check overlapping
        var top = Math.max(bounding.top, targetBounding.top);
        var left = Math.max(bounding.left, targetBounding.left);
        var right = Math.min(bounding.right, targetBounding.right);
        var bottom = Math.min(bounding.bottom, targetBounding.bottom);
        return top < bottom && left < right;
    }

    function update(scrollbar) {
        var newSize = scrollbar.getSize();
        var limit = {
            x: Math.max(newSize.content.width - newSize.container.width, 0),
            y: Math.max(newSize.content.height - newSize.container.height, 0),
        };
        // metrics
        var containerBounding = scrollbar.containerEl.getBoundingClientRect();
        var bounding = {
            top: Math.max(containerBounding.top, 0),
            right: Math.min(containerBounding.right, window.innerWidth),
            bottom: Math.min(containerBounding.bottom, window.innerHeight),
            left: Math.max(containerBounding.left, 0),
        };
        // assign props
        scrollbar.size = newSize;
        scrollbar.limit = limit;
        scrollbar.bounding = bounding;
        // update tracks
        scrollbar.track.update();
        // re-positioning
        scrollbar.setPosition();
    }

    function setPosition(scrollbar, x, y) {
        var options = scrollbar.options, offset = scrollbar.offset, limit = scrollbar.limit, track = scrollbar.track, contentEl = scrollbar.contentEl;
        if (options.renderByPixels) {
            x = Math.round(x);
            y = Math.round(y);
        }
        x = clamp(x, 0, limit.x);
        y = clamp(y, 0, limit.y);
        // position changed -> show track for 300ms
        if (x !== offset.x)
            track.xAxis.show();
        if (y !== offset.y)
            track.yAxis.show();
        if (!options.alwaysShowTracks) {
            track.autoHideOnIdle();
        }
        if (x === offset.x && y === offset.y) {
            return null;
        }
        offset.x = x;
        offset.y = y;
        setStyle(contentEl, {
            '-transform': "translate3d(" + -x + "px, " + -y + "px, 0)",
        });
        track.update();
        return {
            offset: __assign({}, offset),
            limit: __assign({}, limit),
        };
    }

    var animationIDStorage = new WeakMap();
    function scrollTo(scrollbar, x, y, duration, _a) {
        if (duration === void 0) { duration = 0; }
        var _b = _a === void 0 ? {} : _a, _c = _b.easing, easing = _c === void 0 ? defaultEasing : _c, callback = _b.callback;
        var options = scrollbar.options, offset = scrollbar.offset, limit = scrollbar.limit;
        if (options.renderByPixels) {
            // ensure resolved with integer
            x = Math.round(x);
            y = Math.round(y);
        }
        var startX = offset.x;
        var startY = offset.y;
        var disX = clamp(x, 0, limit.x) - startX;
        var disY = clamp(y, 0, limit.y) - startY;
        var start = Date.now();
        function scroll() {
            var elapse = Date.now() - start;
            var progress = duration ? easing(Math.min(elapse / duration, 1)) : 1;
            scrollbar.setPosition(startX + disX * progress, startY + disY * progress);
            if (elapse >= duration) {
                if (typeof callback === 'function') {
                    callback.call(scrollbar);
                }
            }
            else {
                var animationID = requestAnimationFrame(scroll);
                animationIDStorage.set(scrollbar, animationID);
            }
        }
        cancelAnimationFrame(animationIDStorage.get(scrollbar));
        scroll();
    }
    /**
     * easeOutCubic
     */
    function defaultEasing(t) {
        return Math.pow((t - 1), 3) + 1;
    }

    function scrollIntoView(scrollbar, elem, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.alignToTop, alignToTop = _c === void 0 ? true : _c, _d = _b.onlyScrollIfNeeded, onlyScrollIfNeeded = _d === void 0 ? false : _d, _e = _b.offsetTop, offsetTop = _e === void 0 ? 0 : _e, _f = _b.offsetLeft, offsetLeft = _f === void 0 ? 0 : _f, _g = _b.offsetBottom, offsetBottom = _g === void 0 ? 0 : _g;
        var containerEl = scrollbar.containerEl, bounding = scrollbar.bounding, offset = scrollbar.offset, limit = scrollbar.limit;
        if (!elem || !containerEl.contains(elem))
            return;
        var targetBounding = elem.getBoundingClientRect();
        if (onlyScrollIfNeeded && scrollbar.isVisible(elem))
            return;
        var delta = alignToTop ? targetBounding.top - bounding.top - offsetTop : targetBounding.bottom - bounding.bottom + offsetBottom;
        scrollbar.setMomentum(targetBounding.left - bounding.left - offsetLeft, clamp(delta, -offset.y, limit.y - offset.y));
    }

    var ScrollbarPlugin = /** @class */ (function () {
        function ScrollbarPlugin(scrollbar, options) {
            var _newTarget = this.constructor;
            this.scrollbar = scrollbar;
            this.name = _newTarget.pluginName;
            this.options = __assign(__assign({}, _newTarget.defaultOptions), options);
        }
        ScrollbarPlugin.prototype.onInit = function () { };
        ScrollbarPlugin.prototype.onDestroy = function () { };
        ScrollbarPlugin.prototype.onUpdate = function () { };
        ScrollbarPlugin.prototype.onRender = function (_remainMomentum) { };
        ScrollbarPlugin.prototype.transformDelta = function (delta, _evt) {
            return __assign({}, delta);
        };
        ScrollbarPlugin.pluginName = '';
        ScrollbarPlugin.defaultOptions = {};
        return ScrollbarPlugin;
    }());
    var globalPlugins = {
        order: new Set(),
        constructors: {},
    };
    function addPlugins() {
        var Plugins = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            Plugins[_i] = arguments[_i];
        }
        Plugins.forEach(function (P) {
            var pluginName = P.pluginName;
            if (!pluginName) {
                throw new TypeError("plugin name is required");
            }
            globalPlugins.order.add(pluginName);
            globalPlugins.constructors[pluginName] = P;
        });
    }
    function initPlugins(scrollbar, options) {
        return Array.from(globalPlugins.order)
            .filter(function (pluginName) {
            return options[pluginName] !== false;
        })
            .map(function (pluginName) {
            var Plugin = globalPlugins.constructors[pluginName];
            var instance = new Plugin(scrollbar, options[pluginName]);
            // bind plugin options to `scrollbar.options`
            options[pluginName] = instance.options;
            return instance;
        });
    }

    var KEY_CODE;
    (function (KEY_CODE) {
        KEY_CODE[KEY_CODE["TAB"] = 9] = "TAB";
        KEY_CODE[KEY_CODE["SPACE"] = 32] = "SPACE";
        KEY_CODE[KEY_CODE["PAGE_UP"] = 33] = "PAGE_UP";
        KEY_CODE[KEY_CODE["PAGE_DOWN"] = 34] = "PAGE_DOWN";
        KEY_CODE[KEY_CODE["END"] = 35] = "END";
        KEY_CODE[KEY_CODE["HOME"] = 36] = "HOME";
        KEY_CODE[KEY_CODE["LEFT"] = 37] = "LEFT";
        KEY_CODE[KEY_CODE["UP"] = 38] = "UP";
        KEY_CODE[KEY_CODE["RIGHT"] = 39] = "RIGHT";
        KEY_CODE[KEY_CODE["DOWN"] = 40] = "DOWN";
    })(KEY_CODE || (KEY_CODE = {}));
    function keyboardHandler(scrollbar) {
        var addEvent = eventScope(scrollbar);
        var container = scrollbar.containerEl;
        addEvent(container, 'keydown', function (evt) {
            var activeElement = document.activeElement;
            if (activeElement !== container && !container.contains(activeElement)) {
                return;
            }
            if (isEditable(activeElement)) {
                return;
            }
            var delta = getKeyDelta(scrollbar, evt.keyCode || evt.which);
            if (!delta) {
                return;
            }
            var x = delta[0], y = delta[1];
            scrollbar.addTransformableMomentum(x, y, evt, function (willScroll) {
                if (willScroll) {
                    evt.preventDefault();
                }
                else {
                    scrollbar.containerEl.blur();
                    if (scrollbar.parent) {
                        scrollbar.parent.containerEl.focus();
                    }
                }
            });
        });
    }
    function getKeyDelta(scrollbar, keyCode) {
        var size = scrollbar.size, limit = scrollbar.limit, offset = scrollbar.offset;
        switch (keyCode) {
            case KEY_CODE.TAB:
                return handleTabKey(scrollbar);
            case KEY_CODE.SPACE:
                return [0, 200];
            case KEY_CODE.PAGE_UP:
                return [0, -size.container.height + 40];
            case KEY_CODE.PAGE_DOWN:
                return [0, size.container.height - 40];
            case KEY_CODE.END:
                return [0, limit.y - offset.y];
            case KEY_CODE.HOME:
                return [0, -offset.y];
            case KEY_CODE.LEFT:
                return [-40, 0];
            case KEY_CODE.UP:
                return [0, -40];
            case KEY_CODE.RIGHT:
                return [40, 0];
            case KEY_CODE.DOWN:
                return [0, 40];
            default:
                return null;
        }
    }
    function handleTabKey(scrollbar) {
        // handle in next frame
        requestAnimationFrame(function () {
            scrollbar.scrollIntoView(document.activeElement, {
                offsetTop: scrollbar.size.container.height / 2,
                onlyScrollIfNeeded: true,
            });
        });
    }
    function isEditable(elem) {
        if (elem.tagName === 'INPUT' ||
            elem.tagName === 'SELECT' ||
            elem.tagName === 'TEXTAREA' ||
            elem.isContentEditable) {
            return !elem.disabled;
        }
        return false;
    }

    var Direction;
    (function (Direction) {
        Direction[Direction["X"] = 0] = "X";
        Direction[Direction["Y"] = 1] = "Y";
    })(Direction || (Direction = {}));
    function mouseHandler(scrollbar) {
        var addEvent = eventScope(scrollbar);
        var container = scrollbar.containerEl;
        var _a = scrollbar.track, xAxis = _a.xAxis, yAxis = _a.yAxis;
        function calcMomentum(direction, clickPosition) {
            var size = scrollbar.size, limit = scrollbar.limit, offset = scrollbar.offset;
            if (direction === Direction.X) {
                var totalWidth = size.container.width + (xAxis.thumb.realSize - xAxis.thumb.displaySize);
                return clamp(clickPosition / totalWidth * size.content.width, 0, limit.x) - offset.x;
            }
            if (direction === Direction.Y) {
                var totalHeight = size.container.height + (yAxis.thumb.realSize - yAxis.thumb.displaySize);
                return clamp(clickPosition / totalHeight * size.content.height, 0, limit.y) - offset.y;
            }
            return 0;
        }
        function getTrackDirection(elem) {
            if (isOneOf(elem, [xAxis.element, xAxis.thumb.element])) {
                return Direction.X;
            }
            if (isOneOf(elem, [yAxis.element, yAxis.thumb.element])) {
                return Direction.Y;
            }
            return void 0;
        }
        var isMouseDown;
        var isMouseMoving;
        var startOffsetToThumb;
        var trackDirection;
        var containerRect;
        addEvent(container, 'click', function (evt) {
            if (isMouseMoving || !isOneOf(evt.target, [xAxis.element, yAxis.element])) {
                return;
            }
            var track = evt.target;
            var direction = getTrackDirection(track);
            var rect = track.getBoundingClientRect();
            var clickPos = getPosition(evt);
            if (direction === Direction.X) {
                var offsetOnTrack = clickPos.x - rect.left - xAxis.thumb.displaySize / 2;
                scrollbar.setMomentum(calcMomentum(direction, offsetOnTrack), 0);
            }
            if (direction === Direction.Y) {
                var offsetOnTrack = clickPos.y - rect.top - yAxis.thumb.displaySize / 2;
                scrollbar.setMomentum(0, calcMomentum(direction, offsetOnTrack));
            }
        });
        addEvent(container, 'mousedown', function (evt) {
            if (!isOneOf(evt.target, [xAxis.thumb.element, yAxis.thumb.element])) {
                return;
            }
            isMouseDown = true;
            var thumb = evt.target;
            var cursorPos = getPosition(evt);
            var thumbRect = thumb.getBoundingClientRect();
            trackDirection = getTrackDirection(thumb);
            // pointer offset to thumb
            startOffsetToThumb = {
                x: cursorPos.x - thumbRect.left,
                y: cursorPos.y - thumbRect.top,
            };
            // container bounding rectangle
            containerRect = container.getBoundingClientRect();
            // prevent selection, see:
            // https://github.com/idiotWu/smooth-scrollbar/issues/48
            setStyle(scrollbar.containerEl, {
                '-user-select': 'none',
            });
        });
        addEvent(window, 'mousemove', function (evt) {
            if (!isMouseDown)
                return;
            isMouseMoving = true;
            var cursorPos = getPosition(evt);
            if (trackDirection === Direction.X) {
                // get percentage of pointer position in track
                // then tranform to px
                // don't need easing
                var offsetOnTrack = cursorPos.x - startOffsetToThumb.x - containerRect.left;
                scrollbar.setMomentum(calcMomentum(trackDirection, offsetOnTrack), 0);
            }
            if (trackDirection === Direction.Y) {
                var offsetOnTrack = cursorPos.y - startOffsetToThumb.y - containerRect.top;
                scrollbar.setMomentum(0, calcMomentum(trackDirection, offsetOnTrack));
            }
        });
        addEvent(window, 'mouseup blur', function () {
            isMouseDown = isMouseMoving = false;
            setStyle(scrollbar.containerEl, {
                '-user-select': '',
            });
        });
    }

    function resizeHandler(scrollbar) {
        var addEvent = eventScope(scrollbar);
        addEvent(window, 'resize', debounce$2(scrollbar.update.bind(scrollbar), 300));
    }

    function selectHandler(scrollbar) {
        var addEvent = eventScope(scrollbar);
        var containerEl = scrollbar.containerEl, contentEl = scrollbar.contentEl;
        var isSelected = false;
        var animationID;
        function scroll(_a) {
            var x = _a.x, y = _a.y;
            if (!x && !y)
                return;
            var offset = scrollbar.offset, limit = scrollbar.limit;
            // DISALLOW delta transformation
            scrollbar.setMomentum(clamp(offset.x + x, 0, limit.x) - offset.x, clamp(offset.y + y, 0, limit.y) - offset.y);
            animationID = requestAnimationFrame(function () {
                scroll({ x: x, y: y });
            });
        }
        addEvent(window, 'mousemove', function (evt) {
            if (!isSelected)
                return;
            cancelAnimationFrame(animationID);
            var dir = calcMomentum(scrollbar, evt);
            scroll(dir);
        });
        addEvent(contentEl, 'selectstart', function (evt) {
            evt.stopPropagation();
            cancelAnimationFrame(animationID);
            isSelected = true;
        });
        addEvent(window, 'mouseup blur', function () {
            cancelAnimationFrame(animationID);
            isSelected = false;
        });
        // patch for touch devices
        addEvent(containerEl, 'scroll', function (evt) {
            evt.preventDefault();
            containerEl.scrollTop = containerEl.scrollLeft = 0;
        });
    }
    function calcMomentum(scrollbar, evt) {
        var _a = scrollbar.bounding, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left;
        var _b = getPosition(evt), x = _b.x, y = _b.y;
        var res = {
            x: 0,
            y: 0,
        };
        var padding = 20;
        if (x === 0 && y === 0)
            return res;
        if (x > right - padding) {
            res.x = (x - right + padding);
        }
        else if (x < left + padding) {
            res.x = (x - left - padding);
        }
        if (y > bottom - padding) {
            res.y = (y - bottom + padding);
        }
        else if (y < top + padding) {
            res.y = (y - top - padding);
        }
        res.x *= 2;
        res.y *= 2;
        return res;
    }

    var activeScrollbar;
    function touchHandler(scrollbar) {
        var target = scrollbar.options.delegateTo || scrollbar.containerEl;
        var touchRecord = new TouchRecord();
        var addEvent = eventScope(scrollbar);
        var damping;
        var pointerCount = 0;
        addEvent(target, 'touchstart', function (evt) {
            // start records
            touchRecord.track(evt);
            // stop scrolling
            scrollbar.setMomentum(0, 0);
            // save damping
            if (pointerCount === 0) {
                damping = scrollbar.options.damping;
                scrollbar.options.damping = Math.max(damping, 0.5); // less frames on touchmove
            }
            pointerCount++;
        });
        addEvent(target, 'touchmove', function (evt) {
            if (activeScrollbar && activeScrollbar !== scrollbar)
                return;
            touchRecord.update(evt);
            var _a = touchRecord.getDelta(), x = _a.x, y = _a.y;
            scrollbar.addTransformableMomentum(x, y, evt, function (willScroll) {
                if (willScroll && evt.cancelable) {
                    evt.preventDefault();
                    activeScrollbar = scrollbar;
                }
            });
        });
        addEvent(target, 'touchcancel touchend', function (evt) {
            var delta = touchRecord.getEasingDistance(damping);
            scrollbar.addTransformableMomentum(delta.x, delta.y, evt);
            pointerCount--;
            // restore damping
            if (pointerCount === 0) {
                scrollbar.options.damping = damping;
            }
            touchRecord.release(evt);
            activeScrollbar = null;
        });
    }

    function wheelHandler(scrollbar) {
        var addEvent = eventScope(scrollbar);
        var target = scrollbar.options.delegateTo || scrollbar.containerEl;
        var eventName = ('onwheel' in window || document.implementation.hasFeature('Events.wheel', '3.0')) ? 'wheel' : 'mousewheel';
        addEvent(target, eventName, function (evt) {
            var _a = normalizeDelta(evt), x = _a.x, y = _a.y;
            scrollbar.addTransformableMomentum(x, y, evt, function (willScroll) {
                if (willScroll) {
                    evt.preventDefault();
                }
            });
        });
    }
    // Normalizing wheel delta
    var DELTA_SCALE = {
        STANDARD: 1,
        OTHERS: -3,
    };
    var DELTA_MODE = [1.0, 28.0, 500.0];
    var getDeltaMode = function (mode) { return DELTA_MODE[mode] || DELTA_MODE[0]; };
    function normalizeDelta(evt) {
        if ('deltaX' in evt) {
            var mode = getDeltaMode(evt.deltaMode);
            return {
                x: evt.deltaX / DELTA_SCALE.STANDARD * mode,
                y: evt.deltaY / DELTA_SCALE.STANDARD * mode,
            };
        }
        if ('wheelDeltaX' in evt) {
            return {
                x: evt.wheelDeltaX / DELTA_SCALE.OTHERS,
                y: evt.wheelDeltaY / DELTA_SCALE.OTHERS,
            };
        }
        // ie with touchpad
        return {
            x: 0,
            y: evt.wheelDelta / DELTA_SCALE.OTHERS,
        };
    }

    var eventHandlers = /*#__PURE__*/Object.freeze({
        __proto__: null,
        keyboardHandler: keyboardHandler,
        mouseHandler: mouseHandler,
        resizeHandler: resizeHandler,
        selectHandler: selectHandler,
        touchHandler: touchHandler,
        wheelHandler: wheelHandler
    });

    // DO NOT use WeakMap here
    // .getAll() methods requires `scrollbarMap.values()`
    var scrollbarMap = new Map();
    var Scrollbar = /** @class */ (function () {
        function Scrollbar(containerEl, options) {
            var _this = this;
            /**
             * Current scrolling offsets
             */
            this.offset = {
                x: 0,
                y: 0,
            };
            /**
             * Max-allowed scrolling offsets
             */
            this.limit = {
                x: Infinity,
                y: Infinity,
            };
            /**
             * Container bounding rect
             */
            this.bounding = {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            };
            // private _observer: ResizeObserver;
            this._plugins = [];
            this._momentum = { x: 0, y: 0 };
            this._listeners = new Set();
            this.containerEl = containerEl;
            var contentEl = this.contentEl = document.createElement('div');
            this.options = new Options(options);
            // mark as a scroll element
            containerEl.setAttribute('data-scrollbar', 'true');
            // make container focusable
            containerEl.setAttribute('tabindex', '-1');
            setStyle(containerEl, {
                overflow: 'hidden',
                outline: 'none',
            });
            // enable touch event capturing in IE, see:
            // https://github.com/idiotWu/smooth-scrollbar/issues/39
            if (window.navigator.msPointerEnabled) {
                containerEl.style.msTouchAction = 'none';
            }
            // mount content
            contentEl.className = 'scroll-content';
            Array.from(containerEl.childNodes).forEach(function (node) {
                contentEl.appendChild(node);
            });
            containerEl.appendChild(contentEl);
            // attach track
            this.track = new TrackController(this);
            // initial measuring
            this.size = this.getSize();
            // init plugins
            this._plugins = initPlugins(this, this.options.plugins);
            // preserve scroll offset
            var scrollLeft = containerEl.scrollLeft, scrollTop = containerEl.scrollTop;
            containerEl.scrollLeft = containerEl.scrollTop = 0;
            this.setPosition(scrollLeft, scrollTop, {
                withoutCallbacks: true,
            });
            // FIXME: update typescript
            var ResizeObserver = window.ResizeObserver;
            // observe
            if (typeof ResizeObserver === 'function') {
                this._observer = new ResizeObserver(function () {
                    _this.update();
                });
                this._observer.observe(contentEl);
            }
            scrollbarMap.set(containerEl, this);
            // wait for DOM ready
            requestAnimationFrame(function () {
                _this._init();
            });
        }
        Object.defineProperty(Scrollbar.prototype, "parent", {
            /**
             * Parent scrollbar
             */
            get: function () {
                var elem = this.containerEl.parentElement;
                while (elem) {
                    var parentScrollbar = scrollbarMap.get(elem);
                    if (parentScrollbar) {
                        return parentScrollbar;
                    }
                    elem = elem.parentElement;
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scrollbar.prototype, "scrollTop", {
            /**
             * Gets or sets `scrollbar.offset.y`
             */
            get: function () {
                return this.offset.y;
            },
            set: function (y) {
                this.setPosition(this.scrollLeft, y);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scrollbar.prototype, "scrollLeft", {
            /**
             * Gets or sets `scrollbar.offset.x`
             */
            get: function () {
                return this.offset.x;
            },
            set: function (x) {
                this.setPosition(x, this.scrollTop);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the size of the scrollbar container element
         * and the content wrapper element
         */
        Scrollbar.prototype.getSize = function () {
            return getSize(this);
        };
        /**
         * Forces scrollbar to update geometry infomation.
         *
         * By default, scrollbars are automatically updated with `100ms` debounce (or `MutationObserver` fires).
         * You can call this method to force an update when you modified contents
         */
        Scrollbar.prototype.update = function () {
            update(this);
            this._plugins.forEach(function (plugin) {
                plugin.onUpdate();
            });
        };
        /**
         * Checks if an element is visible in the current view area
         */
        Scrollbar.prototype.isVisible = function (elem) {
            return isVisible(this, elem);
        };
        /**
         * Sets the scrollbar to the given offset without easing
         */
        Scrollbar.prototype.setPosition = function (x, y, options) {
            var _this = this;
            if (x === void 0) { x = this.offset.x; }
            if (y === void 0) { y = this.offset.y; }
            if (options === void 0) { options = {}; }
            var status = setPosition(this, x, y);
            if (!status || options.withoutCallbacks) {
                return;
            }
            this._listeners.forEach(function (fn) {
                fn.call(_this, status);
            });
        };
        /**
         * Scrolls to given position with easing function
         */
        Scrollbar.prototype.scrollTo = function (x, y, duration, options) {
            if (x === void 0) { x = this.offset.x; }
            if (y === void 0) { y = this.offset.y; }
            if (duration === void 0) { duration = 0; }
            if (options === void 0) { options = {}; }
            scrollTo(this, x, y, duration, options);
        };
        /**
         * Scrolls the target element into visible area of scrollbar,
         * likes the DOM method `element.scrollIntoView().
         */
        Scrollbar.prototype.scrollIntoView = function (elem, options) {
            if (options === void 0) { options = {}; }
            scrollIntoView(this, elem, options);
        };
        /**
         * Adds scrolling listener
         */
        Scrollbar.prototype.addListener = function (fn) {
            if (typeof fn !== 'function') {
                throw new TypeError('[smooth-scrollbar] scrolling listener should be a function');
            }
            this._listeners.add(fn);
        };
        /**
         * Removes listener previously registered with `scrollbar.addListener()`
         */
        Scrollbar.prototype.removeListener = function (fn) {
            this._listeners.delete(fn);
        };
        /**
         * Adds momentum and applys delta transformers.
         */
        Scrollbar.prototype.addTransformableMomentum = function (x, y, fromEvent, callback) {
            this._updateDebounced();
            var finalDelta = this._plugins.reduce(function (delta, plugin) {
                return plugin.transformDelta(delta, fromEvent) || delta;
            }, { x: x, y: y });
            var willScroll = !this._shouldPropagateMomentum(finalDelta.x, finalDelta.y);
            if (willScroll) {
                this.addMomentum(finalDelta.x, finalDelta.y);
            }
            if (callback) {
                callback.call(this, willScroll);
            }
        };
        /**
         * Increases scrollbar's momentum
         */
        Scrollbar.prototype.addMomentum = function (x, y) {
            this.setMomentum(this._momentum.x + x, this._momentum.y + y);
        };
        /**
         * Sets scrollbar's momentum to given value
         */
        Scrollbar.prototype.setMomentum = function (x, y) {
            if (this.limit.x === 0) {
                x = 0;
            }
            if (this.limit.y === 0) {
                y = 0;
            }
            if (this.options.renderByPixels) {
                x = Math.round(x);
                y = Math.round(y);
            }
            this._momentum.x = x;
            this._momentum.y = y;
        };
        /**
         * Update options for specific plugin
         *
         * @param pluginName Name of the plugin
         * @param [options] An object includes the properties that you want to update
         */
        Scrollbar.prototype.updatePluginOptions = function (pluginName, options) {
            this._plugins.forEach(function (plugin) {
                if (plugin.name === pluginName) {
                    Object.assign(plugin.options, options);
                }
            });
        };
        Scrollbar.prototype.destroy = function () {
            var _a = this, containerEl = _a.containerEl, contentEl = _a.contentEl;
            clearEventsOn(this);
            this._listeners.clear();
            this.setMomentum(0, 0);
            cancelAnimationFrame(this._renderID);
            if (this._observer) {
                this._observer.disconnect();
            }
            scrollbarMap.delete(this.containerEl);
            // restore contents
            var childNodes = Array.from(contentEl.childNodes);
            while (containerEl.firstChild) {
                containerEl.removeChild(containerEl.firstChild);
            }
            childNodes.forEach(function (el) {
                containerEl.appendChild(el);
            });
            // reset scroll position
            setStyle(containerEl, {
                overflow: '',
            });
            containerEl.scrollTop = this.scrollTop;
            containerEl.scrollLeft = this.scrollLeft;
            // invoke plugin.onDestroy
            this._plugins.forEach(function (plugin) {
                plugin.onDestroy();
            });
            this._plugins.length = 0;
        };
        Scrollbar.prototype._init = function () {
            var _this = this;
            this.update();
            // init evet handlers
            Object.keys(eventHandlers).forEach(function (prop) {
                eventHandlers[prop](_this);
            });
            // invoke `plugin.onInit`
            this._plugins.forEach(function (plugin) {
                plugin.onInit();
            });
            this._render();
        };
        Scrollbar.prototype._updateDebounced = function () {
            this.update();
        };
        // check whether to propagate monmentum to parent scrollbar
        // the following situations are considered as `true`:
        //         1. continuous scrolling is enabled (automatically disabled when overscroll is enabled)
        //         2. scrollbar reaches one side and is not about to scroll on the other direction
        Scrollbar.prototype._shouldPropagateMomentum = function (deltaX, deltaY) {
            if (deltaX === void 0) { deltaX = 0; }
            if (deltaY === void 0) { deltaY = 0; }
            var _a = this, options = _a.options, offset = _a.offset, limit = _a.limit;
            if (!options.continuousScrolling)
                return false;
            // force an update when scrollbar is "unscrollable", see #106
            if (limit.x === 0 && limit.y === 0) {
                this._updateDebounced();
            }
            var destX = clamp(deltaX + offset.x, 0, limit.x);
            var destY = clamp(deltaY + offset.y, 0, limit.y);
            var res = true;
            // offsets are not about to change
            // `&=` operator is not allowed for boolean types
            res = res && (destX === offset.x);
            res = res && (destY === offset.y);
            // current offsets are on the edge
            res = res && (offset.x === limit.x || offset.x === 0 || offset.y === limit.y || offset.y === 0);
            return res;
        };
        Scrollbar.prototype._render = function () {
            var _momentum = this._momentum;
            if (_momentum.x || _momentum.y) {
                var nextX = this._nextTick('x');
                var nextY = this._nextTick('y');
                _momentum.x = nextX.momentum;
                _momentum.y = nextY.momentum;
                this.setPosition(nextX.position, nextY.position);
            }
            var remain = __assign({}, this._momentum);
            this._plugins.forEach(function (plugin) {
                plugin.onRender(remain);
            });
            this._renderID = requestAnimationFrame(this._render.bind(this));
        };
        Scrollbar.prototype._nextTick = function (direction) {
            var _a = this, options = _a.options, offset = _a.offset, _momentum = _a._momentum;
            var current = offset[direction];
            var remain = _momentum[direction];
            if (Math.abs(remain) <= 0.1) {
                return {
                    momentum: 0,
                    position: current + remain,
                };
            }
            var nextMomentum = remain * (1 - options.damping);
            if (options.renderByPixels) {
                nextMomentum |= 0;
            }
            return {
                momentum: nextMomentum,
                position: current + remain - nextMomentum,
            };
        };
        __decorate([
            debounce$1(100, { leading: true })
        ], Scrollbar.prototype, "_updateDebounced", null);
        return Scrollbar;
    }());

    var TRACK_BG = 'rgba(222, 222, 222, .75)';
    var THUMB_BG = 'rgba(0, 0, 0, .5)';
    // sets content's display type to `flow-root` to suppress margin collapsing
    var SCROLLBAR_STYLE = "\n[data-scrollbar] {\n  display: block;\n  position: relative;\n}\n\n.scroll-content {\n  display: flow-root;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n}\n\n.scrollbar-track {\n  position: absolute;\n  opacity: 0;\n  z-index: 1;\n  background: " + TRACK_BG + ";\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  -webkit-transition: opacity 0.5s 0.5s ease-out;\n          transition: opacity 0.5s 0.5s ease-out;\n}\n.scrollbar-track.show,\n.scrollbar-track:hover {\n  opacity: 1;\n  -webkit-transition-delay: 0s;\n          transition-delay: 0s;\n}\n\n.scrollbar-track-x {\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 8px;\n}\n.scrollbar-track-y {\n  top: 0;\n  right: 0;\n  width: 8px;\n  height: 100%;\n}\n.scrollbar-thumb {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 8px;\n  height: 8px;\n  background: " + THUMB_BG + ";\n  border-radius: 4px;\n}\n";
    var STYLE_ID = 'smooth-scrollbar-style';
    var isStyleAttached = false;
    function attachStyle() {
        if (isStyleAttached || typeof window === 'undefined') {
            return;
        }
        var styleEl = document.createElement('style');
        styleEl.id = STYLE_ID;
        styleEl.textContent = SCROLLBAR_STYLE;
        if (document.head) {
            document.head.appendChild(styleEl);
        }
        isStyleAttached = true;
    }
    function detachStyle() {
        if (!isStyleAttached || typeof window === 'undefined') {
            return;
        }
        var styleEl = document.getElementById(STYLE_ID);
        if (!styleEl || !styleEl.parentNode) {
            return;
        }
        styleEl.parentNode.removeChild(styleEl);
        isStyleAttached = false;
    }

    /**
     * cast `I.Scrollbar` to `Scrollbar` to avoid error
     *
     * `I.Scrollbar` is not assignable to `Scrollbar`:
     *     "privateProp" is missing in `I.Scrollbar`
     *
     * @see https://github.com/Microsoft/TypeScript/issues/2672
     */
    var SmoothScrollbar = /** @class */ (function (_super) {
        __extends(SmoothScrollbar, _super);
        function SmoothScrollbar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Initializes a scrollbar on the given element.
         *
         * @param elem The DOM element that you want to initialize scrollbar to
         * @param [options] Initial options
         */
        SmoothScrollbar.init = function (elem, options) {
            if (!elem || elem.nodeType !== 1) {
                throw new TypeError("expect element to be DOM Element, but got " + elem);
            }
            // attach stylesheet
            attachStyle();
            if (scrollbarMap.has(elem)) {
                return scrollbarMap.get(elem);
            }
            return new Scrollbar(elem, options);
        };
        /**
         * Automatically init scrollbar on all elements base on the selector `[data-scrollbar]`
         *
         * @param options Initial options
         */
        SmoothScrollbar.initAll = function (options) {
            return Array.from(document.querySelectorAll('[data-scrollbar]'), function (elem) {
                return SmoothScrollbar.init(elem, options);
            });
        };
        /**
         * Check if there is a scrollbar on given element
         *
         * @param elem The DOM element that you want to check
         */
        SmoothScrollbar.has = function (elem) {
            return scrollbarMap.has(elem);
        };
        /**
         * Gets scrollbar on the given element.
         * If no scrollbar instance exsits, returns `undefined`
         *
         * @param elem The DOM element that you want to check.
         */
        SmoothScrollbar.get = function (elem) {
            return scrollbarMap.get(elem);
        };
        /**
         * Returns an array that contains all scrollbar instances
         */
        SmoothScrollbar.getAll = function () {
            return Array.from(scrollbarMap.values());
        };
        /**
         * Removes scrollbar on the given element
         */
        SmoothScrollbar.destroy = function (elem) {
            var scrollbar = scrollbarMap.get(elem);
            if (scrollbar) {
                scrollbar.destroy();
            }
        };
        /**
         * Removes all scrollbar instances from current document
         */
        SmoothScrollbar.destroyAll = function () {
            scrollbarMap.forEach(function (scrollbar) {
                scrollbar.destroy();
            });
        };
        /**
         * Attaches plugins to scrollbars
         *
         * @param ...Plugins Scrollbar plugin classes
         */
        SmoothScrollbar.use = function () {
            var Plugins = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                Plugins[_i] = arguments[_i];
            }
            return addPlugins.apply(void 0, Plugins);
        };
        /**
         * Attaches default style sheets to current document.
         * You don't need to call this method manually unless
         * you removed the default styles via `Scrollbar.detachStyle()`
         */
        SmoothScrollbar.attachStyle = function () {
            return attachStyle();
        };
        /**
         * Removes default styles from current document.
         * Use this method when you want to use your own css for scrollbars.
         */
        SmoothScrollbar.detachStyle = function () {
            return detachStyle();
        };
        SmoothScrollbar.version = "8.7.3";
        SmoothScrollbar.ScrollbarPlugin = ScrollbarPlugin;
        return SmoothScrollbar;
    }(Scrollbar));

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

    function paginate ({ items, pageSize, currentPage }) {
      return items
        .slice(
          (currentPage - 1) * pageSize,
          (currentPage - 1) * pageSize + pageSize
        )
    }

    const PREVIOUS_PAGE = 'PREVIOUS_PAGE';
    const NEXT_PAGE = 'NEXT_PAGE';
    const ELLIPSIS = 'ELLIPSIS';

    function generateNavigationOptions ({ totalItems, pageSize, currentPage, limit = null, showStepOptions = false })  {
      const totalPages = Math.ceil(totalItems / pageSize);
      const limitThreshold = getLimitThreshold({ limit });
      const limited = limit && totalPages > limitThreshold;
      let options = limited
        ? generateLimitedOptions({ totalPages, limit, currentPage })
        : generateUnlimitedOptions({ totalPages });
      return showStepOptions
        ? addStepOptions({ options, currentPage, totalPages })
        : options
    }

    function generateUnlimitedOptions ({ totalPages }) {
      return new Array(totalPages)
        .fill(null)
        .map((value, index) => ({
          type: 'number',
          value: index + 1
        }))
    }

    function generateLimitedOptions ({ totalPages, limit, currentPage }) {
      const boundarySize = limit * 2 + 2;
      const firstBoundary = 1 + boundarySize;
      const lastBoundary = totalPages - boundarySize;
      const totalShownPages = firstBoundary + 2;

      if (currentPage <= firstBoundary - limit) {
        return Array(totalShownPages)
          .fill(null)
          .map((value, index) => {
            if (index === totalShownPages - 1) {
              return {
                type: 'number',
                value: totalPages
              }
            } else if (index === totalShownPages - 2) {
              return {
                type: 'symbol',
                symbol: ELLIPSIS,
                value: firstBoundary + 1
              }
            }
            return {
              type: 'number',
              value: index + 1
            }
          })
      } else if (currentPage >= lastBoundary + limit) {
        return Array(totalShownPages)
          .fill(null)
          .map((value, index) => {
            if (index === 0) {
              return {
                type: 'number',
                value: 1
              }
            } else if (index === 1) {
              return {
                type: 'symbol',
                symbol: ELLIPSIS,
                value: lastBoundary - 1
              }
            }
            return {
              type: 'number',
              value: lastBoundary + index - 2
            }
          })
      } else if (currentPage >= (firstBoundary - limit) && currentPage <= (lastBoundary + limit)) {
        return Array(totalShownPages)
          .fill(null)
          .map((value, index) => {
            if (index === 0) {
              return {
                type: 'number',
                value: 1
              }
            } else if (index === 1) {
              return {
                type: 'symbol',
                symbol: ELLIPSIS,
                value: currentPage - limit + (index - 2)
              }
            } else if (index === totalShownPages - 1) {
              return {
                type: 'number',
                value: totalPages
              }
            } else if (index === totalShownPages - 2) {
              return {
                type: 'symbol',
                symbol: ELLIPSIS,
                value: currentPage + limit + 1
              }
            }
            return {
              type: 'number',
              value: currentPage - limit + (index - 2)
            }
          })
      }
    }

    function addStepOptions ({ options, currentPage, totalPages }) {
      return [
        {
          type: 'symbol',
          symbol: PREVIOUS_PAGE,
          value: currentPage <= 1 ? 1 : currentPage - 1
        },
        ...options,
        {
          type: 'symbol',
          symbol: NEXT_PAGE,
          value: currentPage >= totalPages ? totalPages : currentPage + 1
        }
      ]
    }

    function getLimitThreshold ({ limit }) {
      const maximumUnlimitedPages = 3; // This means we cannot limit 3 pages or less
      const numberOfBoundaryPages = 2; // The first and last pages are always shown
      return limit * 2 + maximumUnlimitedPages + numberOfBoundaryPages
    }

    /* node_modules\svelte-paginate\src\PaginationNav.svelte generated by Svelte v3.44.3 */
    const file$9 = "node_modules\\svelte-paginate\\src\\PaginationNav.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    const get_next_slot_changes = dirty => ({});
    const get_next_slot_context = ctx => ({});
    const get_prev_slot_changes = dirty => ({});
    const get_prev_slot_context = ctx => ({});
    const get_ellipsis_slot_changes = dirty => ({});
    const get_ellipsis_slot_context = ctx => ({});
    const get_number_slot_changes = dirty => ({ value: dirty & /*options*/ 4 });
    const get_number_slot_context = ctx => ({ value: /*option*/ ctx[12].value });

    // (68:72) 
    function create_if_block_3$1(ctx) {
    	let current;
    	const next_slot_template = /*#slots*/ ctx[9].next;
    	const next_slot = create_slot(next_slot_template, ctx, /*$$scope*/ ctx[8], get_next_slot_context);
    	const next_slot_or_fallback = next_slot || fallback_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (next_slot_or_fallback) next_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (next_slot_or_fallback) {
    				next_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (next_slot) {
    				if (next_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						next_slot,
    						next_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(next_slot_template, /*$$scope*/ ctx[8], dirty, get_next_slot_changes),
    						get_next_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(next_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(next_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (next_slot_or_fallback) next_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(68:72) ",
    		ctx
    	});

    	return block;
    }

    // (56:76) 
    function create_if_block_2$1(ctx) {
    	let current;
    	const prev_slot_template = /*#slots*/ ctx[9].prev;
    	const prev_slot = create_slot(prev_slot_template, ctx, /*$$scope*/ ctx[8], get_prev_slot_context);
    	const prev_slot_or_fallback = prev_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (prev_slot_or_fallback) prev_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (prev_slot_or_fallback) {
    				prev_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (prev_slot) {
    				if (prev_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						prev_slot,
    						prev_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(prev_slot_template, /*$$scope*/ ctx[8], dirty, get_prev_slot_changes),
    						get_prev_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prev_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prev_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (prev_slot_or_fallback) prev_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(56:76) ",
    		ctx
    	});

    	return block;
    }

    // (52:71) 
    function create_if_block_1$1(ctx) {
    	let current;
    	const ellipsis_slot_template = /*#slots*/ ctx[9].ellipsis;
    	const ellipsis_slot = create_slot(ellipsis_slot_template, ctx, /*$$scope*/ ctx[8], get_ellipsis_slot_context);
    	const ellipsis_slot_or_fallback = ellipsis_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (ellipsis_slot_or_fallback) ellipsis_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (ellipsis_slot_or_fallback) {
    				ellipsis_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (ellipsis_slot) {
    				if (ellipsis_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						ellipsis_slot,
    						ellipsis_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(ellipsis_slot_template, /*$$scope*/ ctx[8], dirty, get_ellipsis_slot_changes),
    						get_ellipsis_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ellipsis_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ellipsis_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (ellipsis_slot_or_fallback) ellipsis_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(52:71) ",
    		ctx
    	});

    	return block;
    }

    // (48:6) {#if option.type === 'number'}
    function create_if_block$2(ctx) {
    	let current;
    	const number_slot_template = /*#slots*/ ctx[9].number;
    	const number_slot = create_slot(number_slot_template, ctx, /*$$scope*/ ctx[8], get_number_slot_context);
    	const number_slot_or_fallback = number_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (number_slot_or_fallback) number_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (number_slot_or_fallback) {
    				number_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (number_slot) {
    				if (number_slot.p && (!current || dirty & /*$$scope, options*/ 260)) {
    					update_slot_base(
    						number_slot,
    						number_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(number_slot_template, /*$$scope*/ ctx[8], dirty, get_number_slot_changes),
    						get_number_slot_context
    					);
    				}
    			} else {
    				if (number_slot_or_fallback && number_slot_or_fallback.p && (!current || dirty & /*options*/ 4)) {
    					number_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(number_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(number_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (number_slot_or_fallback) number_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(48:6) {#if option.type === 'number'}",
    		ctx
    	});

    	return block;
    }

    // (69:26)            
    function fallback_block_3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "#000000");
    			attr_dev(path, "d", "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z");
    			add_location(path, file$9, 73, 12, 2306);
    			set_style(svg, "width", "24px");
    			set_style(svg, "height", "24px");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$9, 69, 10, 2202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(69:26)            ",
    		ctx
    	});

    	return block;
    }

    // (57:26)            
    function fallback_block_2(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "#000000");
    			attr_dev(path, "d", "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z");
    			add_location(path, file$9, 61, 12, 1929);
    			set_style(svg, "width", "24px");
    			set_style(svg, "height", "24px");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$9, 57, 10, 1825);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(57:26)            ",
    		ctx
    	});

    	return block;
    }

    // (53:30)            
    function fallback_block_1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "...";
    			add_location(span, file$9, 53, 10, 1678);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(53:30)            ",
    		ctx
    	});

    	return block;
    }

    // (49:51)            
    function fallback_block(ctx) {
    	let span;
    	let t_value = /*option*/ ctx[12].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$9, 49, 10, 1521);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 4 && t_value !== (t_value = /*option*/ ctx[12].value + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(49:51)            ",
    		ctx
    	});

    	return block;
    }

    // (34:2) {#each options as option}
    function create_each_block$3(ctx) {
    	let span;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$2, create_if_block_1$1, create_if_block_2$1, create_if_block_3$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*option*/ ctx[12].type === 'number') return 0;
    		if (/*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === ELLIPSIS) return 1;
    		if (/*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE) return 2;
    		if (/*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[10](/*option*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(span, "class", "option");
    			toggle_class(span, "number", /*option*/ ctx[12].type === 'number');
    			toggle_class(span, "prev", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE);
    			toggle_class(span, "next", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE);
    			toggle_class(span, "disabled", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE && /*currentPage*/ ctx[0] >= /*totalPages*/ ctx[1] || /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE && /*currentPage*/ ctx[0] <= 1);
    			toggle_class(span, "ellipsis", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === ELLIPSIS);
    			toggle_class(span, "active", /*option*/ ctx[12].type === 'number' && /*option*/ ctx[12].value === /*currentPage*/ ctx[0]);
    			add_location(span, file$9, 34, 4, 751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(span, null);
    			}

    			append_dev(span, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
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
    					if_block.m(span, t);
    				} else {
    					if_block = null;
    				}
    			}

    			if (dirty & /*options*/ 4) {
    				toggle_class(span, "number", /*option*/ ctx[12].type === 'number');
    			}

    			if (dirty & /*options, PREVIOUS_PAGE*/ 4) {
    				toggle_class(span, "prev", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE);
    			}

    			if (dirty & /*options, NEXT_PAGE*/ 4) {
    				toggle_class(span, "next", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE);
    			}

    			if (dirty & /*options, NEXT_PAGE, currentPage, totalPages, PREVIOUS_PAGE*/ 7) {
    				toggle_class(span, "disabled", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE && /*currentPage*/ ctx[0] >= /*totalPages*/ ctx[1] || /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE && /*currentPage*/ ctx[0] <= 1);
    			}

    			if (dirty & /*options, ELLIPSIS*/ 4) {
    				toggle_class(span, "ellipsis", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === ELLIPSIS);
    			}

    			if (dirty & /*options, currentPage*/ 5) {
    				toggle_class(span, "active", /*option*/ ctx[12].type === 'number' && /*option*/ ctx[12].value === /*currentPage*/ ctx[0]);
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
    			if (detaching) detach_dev(span);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(34:2) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let current;
    	let each_value = /*options*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "pagination-nav");
    			add_location(div, file$9, 32, 0, 690);
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
    			if (dirty & /*options, PREVIOUS_PAGE, NEXT_PAGE, currentPage, totalPages, ELLIPSIS, handleOptionClick, $$scope*/ 271) {
    				each_value = /*options*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

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
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
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
    	let options;
    	let totalPages;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaginationNav', slots, ['number','ellipsis','prev','next']);
    	const dispatch = createEventDispatcher();
    	let { totalItems = 0 } = $$props;
    	let { pageSize = 1 } = $$props;
    	let { currentPage = 1 } = $$props;
    	let { limit = null } = $$props;
    	let { showStepOptions = false } = $$props;

    	function handleOptionClick(option) {
    		dispatch('setPage', { page: option.value });
    	}

    	const writable_props = ['totalItems', 'pageSize', 'currentPage', 'limit', 'showStepOptions'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaginationNav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = option => handleOptionClick(option);

    	$$self.$$set = $$props => {
    		if ('totalItems' in $$props) $$invalidate(4, totalItems = $$props.totalItems);
    		if ('pageSize' in $$props) $$invalidate(5, pageSize = $$props.pageSize);
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('limit' in $$props) $$invalidate(6, limit = $$props.limit);
    		if ('showStepOptions' in $$props) $$invalidate(7, showStepOptions = $$props.showStepOptions);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		generateNavigationOptions,
    		PREVIOUS_PAGE,
    		NEXT_PAGE,
    		ELLIPSIS,
    		dispatch,
    		totalItems,
    		pageSize,
    		currentPage,
    		limit,
    		showStepOptions,
    		handleOptionClick,
    		totalPages,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ('totalItems' in $$props) $$invalidate(4, totalItems = $$props.totalItems);
    		if ('pageSize' in $$props) $$invalidate(5, pageSize = $$props.pageSize);
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('limit' in $$props) $$invalidate(6, limit = $$props.limit);
    		if ('showStepOptions' in $$props) $$invalidate(7, showStepOptions = $$props.showStepOptions);
    		if ('totalPages' in $$props) $$invalidate(1, totalPages = $$props.totalPages);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*totalItems, pageSize, currentPage, limit, showStepOptions*/ 241) {
    			$$invalidate(2, options = generateNavigationOptions({
    				totalItems,
    				pageSize,
    				currentPage,
    				limit,
    				showStepOptions
    			}));
    		}

    		if ($$self.$$.dirty & /*totalItems, pageSize*/ 48) {
    			$$invalidate(1, totalPages = Math.ceil(totalItems / pageSize));
    		}
    	};

    	return [
    		currentPage,
    		totalPages,
    		options,
    		handleOptionClick,
    		totalItems,
    		pageSize,
    		limit,
    		showStepOptions,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class PaginationNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			totalItems: 4,
    			pageSize: 5,
    			currentPage: 0,
    			limit: 6,
    			showStepOptions: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationNav",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get totalItems() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalItems(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSize() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSize(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentPage() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPage(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get limit() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limit(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showStepOptions() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showStepOptions(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-paginate\src\LightPaginationNav.svelte generated by Svelte v3.44.3 */
    const file$8 = "node_modules\\svelte-paginate\\src\\LightPaginationNav.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let paginationnav;
    	let current;
    	const paginationnav_spread_levels = [/*$$props*/ ctx[0]];
    	let paginationnav_props = {};

    	for (let i = 0; i < paginationnav_spread_levels.length; i += 1) {
    		paginationnav_props = assign(paginationnav_props, paginationnav_spread_levels[i]);
    	}

    	paginationnav = new PaginationNav({
    			props: paginationnav_props,
    			$$inline: true
    		});

    	paginationnav.$on("setPage", /*setPage_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(paginationnav.$$.fragment);
    			attr_dev(div, "class", "light-pagination-nav svelte-s5ru8s");
    			add_location(div, file$8, 4, 0, 73);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(paginationnav, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const paginationnav_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(paginationnav_spread_levels, [get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			paginationnav.$set(paginationnav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(paginationnav);
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

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LightPaginationNav', slots, []);

    	function setPage_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ PaginationNav });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props, setPage_handler];
    }

    class LightPaginationNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LightPaginationNav",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\PackageUsages.svelte generated by Svelte v3.44.3 */
    const file$7 = "src\\components\\PackageUsages.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (55:12) {#each tableData as data, index }
    function create_each_block$2(ctx) {
    	let tr;
    	let th;
    	let t1;
    	let td0;
    	let t3;
    	let td1;
    	let t5;
    	let td2;
    	let t7;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th = element("th");
    			th.textContent = "1";
    			t1 = space();
    			td0 = element("td");
    			td0.textContent = "Mark";
    			t3 = space();
    			td1 = element("td");
    			td1.textContent = "Otto";
    			t5 = space();
    			td2 = element("td");
    			td2.textContent = "@mdo";
    			t7 = space();
    			attr_dev(th, "scope", "row");
    			add_location(th, file$7, 56, 12, 1775);
    			add_location(td0, file$7, 57, 12, 1811);
    			add_location(td1, file$7, 58, 12, 1838);
    			add_location(td2, file$7, 59, 12, 1865);
    			add_location(tr, file$7, 55, 12, 1757);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th);
    			append_dev(tr, t1);
    			append_dev(tr, td0);
    			append_dev(tr, t3);
    			append_dev(tr, td1);
    			append_dev(tr, t5);
    			append_dev(tr, td2);
    			append_dev(tr, t7);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(55:12) {#each tableData as data, index }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let h10;
    	let t1;
    	let div2;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let th3;
    	let t9;
    	let tbody;
    	let t10;
    	let div1;
    	let div0;
    	let t11;
    	let h11;
    	let t13;
    	let input;
    	let t14;
    	let h12;
    	let t16;
    	let lightpaginationnav;
    	let current;
    	let each_value = /*tableData*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	lightpaginationnav = new LightPaginationNav({
    			props: {
    				totalItems: /*items*/ ctx[2].length,
    				pageSize: /*pageSize*/ ctx[3],
    				currentPage: /*currentPage*/ ctx[0],
    				limit: 1,
    				showStepOptions: true
    			},
    			$$inline: true
    		});

    	lightpaginationnav.$on("setPage", /*setPage_handler*/ ctx[4]);

    	const block = {
    		c: function create() {
    			h10 = element("h1");
    			h10.textContent = "Smooth Scroll Package";
    			t1 = space();
    			div2 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "#";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "First";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "Last";
    			t7 = space();
    			th3 = element("th");
    			th3.textContent = "Handle";
    			t9 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t10 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t11 = space();
    			h11 = element("h1");
    			h11.textContent = "Light Picker Package";
    			t13 = space();
    			input = element("input");
    			t14 = space();
    			h12 = element("h1");
    			h12.textContent = "Paginate package";
    			t16 = space();
    			create_component(lightpaginationnav.$$.fragment);
    			add_location(h10, file$7, 42, 0, 1322);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$7, 47, 12, 1500);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$7, 48, 12, 1536);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$7, 49, 12, 1576);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$7, 50, 12, 1615);
    			add_location(tr, file$7, 46, 12, 1482);
    			add_location(thead, file$7, 45, 8, 1461);
    			add_location(tbody, file$7, 53, 8, 1689);
    			attr_dev(table, "class", "table table-striped");
    			add_location(table, file$7, 44, 4, 1416);
    			attr_dev(div0, "class", "scrollbar-thumb scrollbar-thumb-y");
    			add_location(div0, file$7, 68, 8, 2150);
    			attr_dev(div1, "class", "scrollbar-track scrollbar-track-y");
    			add_location(div1, file$7, 67, 4, 2093);
    			attr_dev(div2, "class", "scroll-content ms-4 me-4 svelte-ejli0b");
    			attr_dev(div2, "id", "my-scrollbar");
    			add_location(div2, file$7, 43, 0, 1354);
    			add_location(h11, file$7, 72, 0, 2227);
    			attr_dev(input, "type", "text");
    			set_style(input, "min-width", "10rem");
    			attr_dev(input, "id", "datepicker");
    			add_location(input, file$7, 73, 0, 2258);
    			add_location(h12, file$7, 75, 0, 2321);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h10, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(tr, t7);
    			append_dev(tr, th3);
    			append_dev(table, t9);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(div2, t10);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, h11, anchor);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, input, anchor);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, h12, anchor);
    			insert_dev(target, t16, anchor);
    			mount_component(lightpaginationnav, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const lightpaginationnav_changes = {};
    			if (dirty & /*currentPage*/ 1) lightpaginationnav_changes.currentPage = /*currentPage*/ ctx[0];
    			lightpaginationnav.$set(lightpaginationnav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lightpaginationnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lightpaginationnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h10);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(h11);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(h12);
    			if (detaching) detach_dev(t16);
    			destroy_component(lightpaginationnav, detaching);
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
    	validate_slots('PackageUsages', slots, []);
    	let prop;
    	let tableData = [1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3];

    	let items = [
    		1,
    		4,
    		3,
    		4,
    		5,
    		6,
    		7,
    		8,
    		9,
    		10,
    		11,
    		12,
    		1,
    		2,
    		3,
    		4,
    		5,
    		6,
    		7,
    		8,
    		9,
    		10,
    		11,
    		12,
    		1,
    		4,
    		3,
    		4,
    		5,
    		6,
    		7,
    		8,
    		9,
    		10,
    		11,
    		12,
    		1,
    		2,
    		3,
    		4,
    		5,
    		6,
    		7,
    		8,
    		9,
    		10,
    		11,
    		12,
    		1,
    		4,
    		3,
    		4,
    		5,
    		6,
    		7,
    		8,
    		9,
    		10,
    		11,
    		12,
    		1,
    		2,
    		3,
    		4,
    		5,
    		6,
    		7,
    		8,
    		9,
    		10,
    		11,
    		12
    	];

    	let currentPage = 1;
    	let pageSize = 4;

    	const options = {
    		singleMode: false,
    		delimiter: ' - ',
    		format: 'DD/MM/YYYY',
    		inlinemode: true,
    		numberOfMonths: 1,
    		position: 'top'
    	};

    	onMount(() => {
    		if (document.querySelector('#my-scrollbar')) {
    			SmoothScrollbar.init(document.querySelector('#my-scrollbar'), { alwaysShowTracks: true });
    		}

    		if (document.getElementById('datepicker')) {
    			new Litepicker({
    					element: document.getElementById('datepicker'),
    					...options
    				});
    		}
    	});

    	onDestroy(() => {
    		if (document.querySelector('#my-scrollbar')) {
    			SmoothScrollbar.destroy(document.querySelector('#my-scrollbar'), {});
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PackageUsages> was created with unknown prop '${key}'`);
    	});

    	const setPage_handler = e => $$invalidate(0, currentPage = e.detail.page);

    	$$self.$capture_state = () => ({
    		Scrollbar: SmoothScrollbar,
    		Litepicker,
    		onDestroy,
    		onMount,
    		paginate,
    		LightPaginationNav,
    		prop,
    		tableData,
    		items,
    		currentPage,
    		pageSize,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ('prop' in $$props) prop = $$props.prop;
    		if ('tableData' in $$props) $$invalidate(1, tableData = $$props.tableData);
    		if ('items' in $$props) $$invalidate(2, items = $$props.items);
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('pageSize' in $$props) $$invalidate(3, pageSize = $$props.pageSize);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentPage, tableData, items, pageSize, setPage_handler];
    }

    class PackageUsages extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PackageUsages",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\elements\LoadingSquareBar.svelte generated by Svelte v3.44.3 */

    const file$6 = "src\\elements\\LoadingSquareBar.svelte";

    function create_fragment$6(ctx) {
    	let div1;
    	let div0;
    	let span0;
    	let t0;
    	let span1;
    	let t1;
    	let span2;
    	let t2;
    	let span3;
    	let div0_class_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span0 = element("span");
    			t0 = space();
    			span1 = element("span");
    			t1 = space();
    			span2 = element("span");
    			t2 = space();
    			span3 = element("span");
    			attr_dev(span0, "class", "svelte-13jacip");
    			add_location(span0, file$6, 12, 4, 378);
    			attr_dev(span1, "class", "svelte-13jacip");
    			add_location(span1, file$6, 13, 4, 397);
    			attr_dev(span2, "class", "svelte-13jacip");
    			add_location(span2, file$6, 14, 4, 416);
    			attr_dev(span3, "class", "svelte-13jacip");
    			add_location(span3, file$6, 15, 4, 435);
    			attr_dev(div0, "class", div0_class_value = "child " + /*className*/ ctx[5] + " svelte-13jacip");
    			set_style(div0, "--height", /*height*/ ctx[0]);
    			set_style(div0, "--width", /*width*/ ctx[1]);
    			set_style(div0, "--color", /*color*/ ctx[2]);
    			set_style(div0, "--time", /*time*/ ctx[3]);
    			set_style(div0, "--background", /*background*/ ctx[4]);
    			add_location(div0, file$6, 11, 2, 239);
    			attr_dev(div1, "class", "parent svelte-13jacip");
    			add_location(div1, file$6, 10, 0, 215);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span0);
    			append_dev(div0, t0);
    			append_dev(div0, span1);
    			append_dev(div0, t1);
    			append_dev(div0, span2);
    			append_dev(div0, t2);
    			append_dev(div0, span3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*className*/ 32 && div0_class_value !== (div0_class_value = "child " + /*className*/ ctx[5] + " svelte-13jacip")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*height*/ 1) {
    				set_style(div0, "--height", /*height*/ ctx[0]);
    			}

    			if (dirty & /*width*/ 2) {
    				set_style(div0, "--width", /*width*/ ctx[1]);
    			}

    			if (dirty & /*color*/ 4) {
    				set_style(div0, "--color", /*color*/ ctx[2]);
    			}

    			if (dirty & /*time*/ 8) {
    				set_style(div0, "--time", /*time*/ ctx[3]);
    			}

    			if (dirty & /*background*/ 16) {
    				set_style(div0, "--background", /*background*/ ctx[4]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
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
    	validate_slots('LoadingSquareBar', slots, []);
    	let { height = '200px' } = $$props;
    	let { width = '200px' } = $$props;
    	let { color = '#2edce8' } = $$props;
    	let { time = '.5s' } = $$props;
    	let { background = 'none' } = $$props;
    	let { className = '' } = $$props;
    	const writable_props = ['height', 'width', 'color', 'time', 'background', 'className'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingSquareBar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('time' in $$props) $$invalidate(3, time = $$props.time);
    		if ('background' in $$props) $$invalidate(4, background = $$props.background);
    		if ('className' in $$props) $$invalidate(5, className = $$props.className);
    	};

    	$$self.$capture_state = () => ({
    		height,
    		width,
    		color,
    		time,
    		background,
    		className
    	});

    	$$self.$inject_state = $$props => {
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('width' in $$props) $$invalidate(1, width = $$props.width);
    		if ('color' in $$props) $$invalidate(2, color = $$props.color);
    		if ('time' in $$props) $$invalidate(3, time = $$props.time);
    		if ('background' in $$props) $$invalidate(4, background = $$props.background);
    		if ('className' in $$props) $$invalidate(5, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [height, width, color, time, background, className];
    }

    class LoadingSquareBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			height: 0,
    			width: 1,
    			color: 2,
    			time: 3,
    			background: 4,
    			className: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingSquareBar",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get height() {
    		throw new Error("<LoadingSquareBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<LoadingSquareBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<LoadingSquareBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<LoadingSquareBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<LoadingSquareBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<LoadingSquareBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get time() {
    		throw new Error("<LoadingSquareBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set time(value) {
    		throw new Error("<LoadingSquareBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get background() {
    		throw new Error("<LoadingSquareBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set background(value) {
    		throw new Error("<LoadingSquareBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<LoadingSquareBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<LoadingSquareBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\TableDataPagination.svelte generated by Svelte v3.44.3 */
    const file$5 = "src\\components\\TableDataPagination.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (47:4) {#each paginatedItems as item}
    function create_each_block$1(ctx) {
    	let tr;
    	let th;
    	let t0_value = /*item*/ ctx[7].id + "";
    	let t0;
    	let t1;
    	let td0;
    	let t2_value = /*item*/ ctx[7].value + "";
    	let t2;
    	let t3;
    	let td1;
    	let t5;
    	let td2;
    	let t7;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			td0 = element("td");
    			t2 = text(t2_value);
    			t3 = space();
    			td1 = element("td");
    			td1.textContent = "Otto";
    			t5 = space();
    			td2 = element("td");
    			td2.textContent = "@mdo";
    			t7 = space();
    			attr_dev(th, "scope", "row");
    			add_location(th, file$5, 48, 12, 1369);
    			add_location(td0, file$5, 49, 12, 1413);
    			add_location(td1, file$5, 50, 12, 1448);
    			add_location(td2, file$5, 51, 12, 1475);
    			add_location(tr, file$5, 47, 8, 1351);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th);
    			append_dev(th, t0);
    			append_dev(tr, t1);
    			append_dev(tr, td0);
    			append_dev(td0, t2);
    			append_dev(tr, t3);
    			append_dev(tr, td1);
    			append_dev(tr, t5);
    			append_dev(tr, td2);
    			append_dev(tr, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*paginatedItems*/ 2 && t0_value !== (t0_value = /*item*/ ctx[7].id + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*paginatedItems*/ 2 && t2_value !== (t2_value = /*item*/ ctx[7].value + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(47:4) {#each paginatedItems as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t1;
    	let th1;
    	let t3;
    	let th2;
    	let t5;
    	let th3;
    	let t7;
    	let tbody;
    	let t8;
    	let lightpaginationnav;
    	let current;
    	let each_value = /*paginatedItems*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	lightpaginationnav = new LightPaginationNav({
    			props: {
    				totalItems: /*items*/ ctx[2].length,
    				pageSize: /*pageSize*/ ctx[3],
    				currentPage: /*currentPage*/ ctx[0],
    				limit: 1,
    				showStepOptions: true
    			},
    			$$inline: true
    		});

    	lightpaginationnav.$on("setPage", /*setPage_handler*/ ctx[4]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "#";
    			t1 = space();
    			th1 = element("th");
    			th1.textContent = "First";
    			t3 = space();
    			th2 = element("th");
    			th2.textContent = "Last";
    			t5 = space();
    			th3 = element("th");
    			th3.textContent = "Handle";
    			t7 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			create_component(lightpaginationnav.$$.fragment);
    			attr_dev(th0, "scope", "col");
    			add_location(th0, file$5, 39, 12, 1109);
    			attr_dev(th1, "scope", "col");
    			add_location(th1, file$5, 40, 12, 1145);
    			attr_dev(th2, "scope", "col");
    			add_location(th2, file$5, 41, 12, 1185);
    			attr_dev(th3, "scope", "col");
    			add_location(th3, file$5, 42, 12, 1224);
    			add_location(tr, file$5, 38, 12, 1091);
    			add_location(thead, file$5, 37, 8, 1070);
    			add_location(tbody, file$5, 45, 8, 1298);
    			attr_dev(table, "class", "table table-striped svelte-fs5u96");
    			add_location(table, file$5, 36, 4, 1025);
    			attr_dev(div, "class", "parent svelte-fs5u96");
    			add_location(div, file$5, 35, 0, 999);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t1);
    			append_dev(tr, th1);
    			append_dev(tr, t3);
    			append_dev(tr, th2);
    			append_dev(tr, t5);
    			append_dev(tr, th3);
    			append_dev(table, t7);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(div, t8);
    			mount_component(lightpaginationnav, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*paginatedItems*/ 2) {
    				each_value = /*paginatedItems*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const lightpaginationnav_changes = {};
    			if (dirty & /*currentPage*/ 1) lightpaginationnav_changes.currentPage = /*currentPage*/ ctx[0];
    			lightpaginationnav.$set(lightpaginationnav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lightpaginationnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lightpaginationnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			destroy_component(lightpaginationnav);
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
    	let paginatedItems;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableDataPagination', slots, []);

    	let items = [
    		{ id: 1, value: 'one' },
    		{ id: 2, value: 'one' },
    		{ id: 3, value: 'one' },
    		{ id: 4, value: 'one' },
    		{ id: 5, value: 'one' },
    		{ id: 6, value: 'one' },
    		{ id: 7, value: 'one' },
    		{ id: 8, value: 'one' },
    		{ id: 9, value: 'one' },
    		{ id: 10, value: 'one' },
    		{ id: 11, value: 'one' },
    		{ id: 12, value: 'one' }
    	];

    	let currentPage = 1;
    	let pageSize = 4;
    	let rightArrow, leftArrow;

    	onMount(() => {
    		rightArrow = document.querySelector('.next');
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableDataPagination> was created with unknown prop '${key}'`);
    	});

    	const setPage_handler = e => $$invalidate(0, currentPage = e.detail.page);

    	$$self.$capture_state = () => ({
    		onMount,
    		paginate,
    		LightPaginationNav,
    		PaginationNav,
    		items,
    		currentPage,
    		pageSize,
    		rightArrow,
    		leftArrow,
    		paginatedItems
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(2, items = $$props.items);
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('pageSize' in $$props) $$invalidate(3, pageSize = $$props.pageSize);
    		if ('rightArrow' in $$props) rightArrow = $$props.rightArrow;
    		if ('leftArrow' in $$props) leftArrow = $$props.leftArrow;
    		if ('paginatedItems' in $$props) $$invalidate(1, paginatedItems = $$props.paginatedItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentPage*/ 1) {
    			$$invalidate(1, paginatedItems = paginate({ items, pageSize, currentPage }));
    		}
    	};

    	return [currentPage, paginatedItems, items, pageSize, setPage_handler];
    }

    class TableDataPagination extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableDataPagination",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    class Store {
        constructor(dbName = 'keyval-store', storeName = 'keyval') {
            this.storeName = storeName;
            this._dbp = new Promise((resolve, reject) => {
                const openreq = indexedDB.open(dbName, 1);
                openreq.onerror = () => reject(openreq.error);
                openreq.onsuccess = () => resolve(openreq.result);
                // First time setup: create an empty object store
                openreq.onupgradeneeded = () => {
                    openreq.result.createObjectStore(storeName);
                };
            });
        }
        _withIDBStore(type, callback) {
            return this._dbp.then(db => new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, type);
                transaction.oncomplete = () => resolve();
                transaction.onabort = transaction.onerror = () => reject(transaction.error);
                callback(transaction.objectStore(this.storeName));
            }));
        }
    }
    let store;
    function getDefaultStore() {
        if (!store)
            store = new Store();
        return store;
    }
    function get$1(key, store = getDefaultStore()) {
        let req;
        return store._withIDBStore('readonly', store => {
            req = store.get(key);
        }).then(() => req.result);
    }
    function set$1(key, value, store = getDefaultStore()) {
        return store._withIDBStore('readwrite', store => {
            store.put(value, key);
        });
    }
    function del$1(key, store = getDefaultStore()) {
        return store._withIDBStore('readwrite', store => {
            store.delete(key);
        });
    }
    function clear(store = getDefaultStore()) {
        return store._withIDBStore('readwrite', store => {
            store.clear();
        });
    }
    function keys(store = getDefaultStore()) {
        const keys = [];
        return store._withIDBStore('readonly', store => {
            // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
            // And openKeyCursor isn't supported by Safari.
            (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
                if (!this.result)
                    return;
                keys.push(this.result.key);
                this.result.continue();
            };
        }).then(() => keys);
    }

    var idbKeyval = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Store: Store,
        get: get$1,
        set: set$1,
        del: del$1,
        clear: clear,
        keys: keys
    });

    // Source: https://github.com/thomaspark/scoper
    var scopeCss = (css, prefix, idMap) => {
        const re = new RegExp("([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)", "g");
        css = css.replace(re, function (g0, g1, g2) {

            if (g1.match(/^\s*(@media|@.*keyframes|to|from|@font-face|1?[0-9]?[0-9])/)) {
                return g1 + g2;
            }

            const idRegex = /#(\w+)/;
            const match = g1.match(idRegex);

            if (match && idMap[match[1]]) {
                g1 = g1.replace(match[0], `#${idMap[match[1]]}`);
            }

            g1 = g1.replace(/^(\s*)/, "$1" + prefix + " ");

            return g1 + g2;
        });

        return css;
    };

    /**
     * Handle all SVG references correctly, which can be
     *   a) via attributes: url(#abc)
     *   b) via tags: <use href="#abc" />
     *   c) via css: .class { fill: url(#abc) }
     * @param {object} idMap: Map previous id with the new unique id
     * @param {string} attributeValueOrCSS
     * @param {string} attributeName
     * @returns attribute or css value with correct id
     */
    var cssUrlFixer = (idMap, attributeValueOrCSS, attributeName = "") => {
        const svgRefRegex = /url\(['"]?#([\w:.-]+)['"]?\)/g;
        const urlRefRegex = /#([\w:.-]+)/g;

        // fill="url(#abc)" -> fill="url(#abc_2)"
        // Use the unique IDs created previously
        if (attributeValueOrCSS.match(svgRefRegex)) {
            attributeValueOrCSS = attributeValueOrCSS.replace(svgRefRegex, function (g0, g1) {
                if (!idMap[g1]) {
                    return g0;
                }
                return `url(#${idMap[g1]})`;
            });
        }

        // <use href="#X" -> <use href="#X_23"
        // Use the unique IDs created previously
        if (["href", "xlink:href"].includes(attributeName)) {
            if (attributeValueOrCSS.match(urlRefRegex)) {
                attributeValueOrCSS = attributeValueOrCSS.replace(urlRefRegex, function (g0, g1) {
                    if (!idMap[g1]) {
                        return g0;
                    }
                    return `#${idMap[g1]}`;
                });
            }
        }
        return attributeValueOrCSS;
    };

    let counter = 0;

    var counter_1 = {
        incr () {
            return ++counter;
        },

        decr () {
            return --counter;
        },

        curr () {
            return counter;
        }
    };

    var require$$0$1 = /*@__PURE__*/getAugmentedNamespace(idbKeyval);

    const { get, set, del } = require$$0$1;




    const isCacheAvailable = async (url) => {
        try {
            let item = await get(`loader_${url}`);

            if (!item) {
                return;
            }

            item = JSON.parse(item);

            if (Date.now() < item.expiry) {
                return item.data;
            } else {
                del(`loader_${url}`);
                return;
            }
        } catch (e) {
            return;
        }
    };

    const setCache = async (url, data, cacheOpt) => {
        try {
            const cacheExp = parseInt(cacheOpt, 10);
            
            await set(`loader_${url}`, JSON.stringify({
                data,
                expiry: Date.now() + (Number.isNaN(cacheExp) ? 60 * 60 * 1000 * 24 : cacheExp)
            }));

        } catch (e) {
            console.error(e);
        }};

    const DOM_EVENTS = [];
    const getAllEventNames = () => {
        if (DOM_EVENTS.length) {
            return DOM_EVENTS;
        }

        for (const prop in document.head) {
            if (prop.startsWith("on")) {
                DOM_EVENTS.push(prop);
            }
        }

        return DOM_EVENTS;
    };

    const attributesSet = {};
    const renderBody = (elem, options, body) => {
        const { enableJs, disableUniqueIds, disableCssScoping } = options;

        const parser = new DOMParser();
        const doc = parser.parseFromString(body, "text/html");
        const fragment = doc.querySelector("svg");

        const eventNames = getAllEventNames();

        // When svg-loader is loading in the same element, it's
        // important to keep track of original properties.
        const elemAttributesSet = attributesSet[elem.getAttribute("data-id")] || new Set();

        const elemUniqueId = elem.getAttribute("data-id") || `svg-loader_${counter_1.incr()}`;

        const idMap = {};

        if (!disableUniqueIds) {
            // Append a unique suffix for every ID so elements don't conflict.
            Array.from(doc.querySelectorAll("[id]")).forEach((elem) => {
                const id = elem.getAttribute("id");
                const newId = `${id}_${counter_1.incr()}`;
                elem.setAttribute("id", newId);

                idMap[id] = newId;
            });
        }

        Array.from(doc.querySelectorAll("*")).forEach((elem) => {
            // Unless explicitly set, remove JS code (default)
            if (elem.tagName === "script") {
                if (!enableJs) {
                    elem.remove();
                    return;
                } else {
                    const scriptEl = document.createElement("script");
                    scriptEl.innerHTML = elem.innerHTML;
                    document.body.appendChild(scriptEl);
                }
            }

            for (let i = 0; i < elem.attributes.length; i++) {
                const {
                    name,
                    value
                } = elem.attributes[i];

                const newValue = cssUrlFixer(idMap, value, name);

                if (value !== newValue) {
                    elem.setAttribute(name, newValue);
                }

                // Remove event functions: onmouseover, onclick ... unless specifically enabled
                if (eventNames.includes(name.toLowerCase()) && !enableJs) {
                    elem.removeAttribute(name);
                    continue;
                }

                // Remove "javascript:..." unless specifically enabled
                if (["href", "xlink:href"].includes(name) && value.startsWith("javascript") && !enableJs) {
                    elem.removeAttribute(name);
                }
            }

            // .first -> [data-id="svg_loader_341xx"] .first
            // Makes sure that class names don't conflict with each other.
            if (elem.tagName === "style" && !disableCssScoping) {
                let newValue = scopeCss(elem.innerHTML, `[data-id="${elemUniqueId}"]`, idMap);
                newValue = cssUrlFixer(idMap, newValue);
                if (newValue !== elem.innerHTML)
                    elem.innerHTML = newValue;
            }
        });

        for (let i = 0; i < fragment.attributes.length; i++) {
            const {
                name,
                value
            } = fragment.attributes[i];

            // Don't override the attributes already defined, but override the ones that
            // were in the original element
            if (!elem.getAttribute(name) || elemAttributesSet.has(name)) {
                elemAttributesSet.add(name);
                elem.setAttribute(name, value);
            }
        }

        attributesSet[elemUniqueId] = elemAttributesSet;

        elem.setAttribute("data-id", elemUniqueId);
        elem.innerHTML = fragment.innerHTML;
    };

    const requestsInProgress = {};
    const memoryCache = {};

    const renderIcon = async (elem) => {
        const src = elem.getAttribute("data-src");
        const cacheOpt = elem.getAttribute("data-cache");

        const enableJs = elem.getAttribute("data-js") === "enabled";
        const disableUniqueIds = elem.getAttribute("data-unique-ids") === "disabled";
        const disableCssScoping = elem.getAttribute("data-css-scoping") === "disabled";

        const lsCache = await isCacheAvailable(src);
        const isCachingEnabled = cacheOpt !== "disabled";

        const renderBodyCb = renderBody.bind(undefined, elem, { enableJs, disableUniqueIds, disableCssScoping });

        // Memory cache optimizes same icon requested multiple
        // times on the page
        if (memoryCache[src] || (isCachingEnabled && lsCache)) {
            const cache = memoryCache[src] || lsCache;

            renderBodyCb(cache);
        } else {
            // If the same icon is being requested to rendered
            // avoid firing multiple XHRs
            if (requestsInProgress[src]) {
                setTimeout(() => renderIcon(elem), 20);
                return;
            }

            requestsInProgress[src] = true;

            fetch(src)
                .then((response) => {
                    if (!response.ok) {
                        throw Error(`Request for '${src}' returned ${response.status} (${response.statusText})`);
                    }
                    return response.text();
                })
                .then((body) => {
                    const bodyLower = body.toLowerCase().trim();

                    if (!(bodyLower.startsWith("<svg") || bodyLower.startsWith("<?xml"))) {
                        throw Error(`Resource '${src}' returned an invalid SVG file`);
                    }

                    if (isCachingEnabled) {
                        setCache(src, body, cacheOpt);
                    }

                    memoryCache[src] = body;

                    renderBodyCb(body);
                })
                .catch((e) => {
                    console.error(e);
                })
                .finally(() => {
                    delete requestsInProgress[src];
                });
        }
    };

    let intObserver;
    if (globalThis.IntersectionObserver) {
        const intObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        renderIcon(entry.target);
        
                        // Unobserve as soon as soon the icon is rendered
                        intObserver.unobserve(entry.target);
                    }
                });
            }, {
                // Keep high root margin because intersection observer 
                // can be slow to react
                rootMargin: "1200px"
            }
        );
    }


    const handled = [];
    function renderAllSVGs() {
        Array.from(document.querySelectorAll("svg[data-src]:not([data-id])"))
            .forEach((element) => {
                if (handled.indexOf(element) !== -1) {
                    return;
                }

                handled.push(element);
                if (element.getAttribute("data-loading") === "lazy") {
                    intObserver.observe(element);
                } else {
                    renderIcon(element);
                }
            });
    }

    let observerAdded = false;
    const addObservers = () => {
        if (observerAdded) {
            return;
        }

        observerAdded = true;
        const observer = new MutationObserver((mutationRecords) => {
            const shouldTriggerRender = mutationRecords.some(
                (record) => Array.from(record.addedNodes).some(
                    (elem) => elem.nodeType === Node.ELEMENT_NODE
                        && ((elem.getAttribute("data-src") && !elem.getAttribute("data-id")) // Check if the element needs to be rendered
                            || elem.querySelector("svg[data-src]:not([data-id])")) // Check if any of the element's children need to be rendered
                )
            );

            // If any node is added, render all new nodes because the nodes that have already
            // been rendered won't be rendered again.
            if (shouldTriggerRender) {
                renderAllSVGs();
            }

            // If data-src is changed, re-render
            mutationRecords.forEach((record) => {
                if (record.type === "attributes") {
                    renderIcon(record.target);
                }
            });
        });

        observer.observe(
            document.documentElement,
            {
                attributeFilter: ["data-src"],
                attributes: true,
                childList: true,
                subtree: true
            }
        );
    };

    if (globalThis.addEventListener) {
        // Start rendering SVGs as soon as possible
        const intervalCheck = setInterval(() => {
            renderAllSVGs();
        }, 100);

        globalThis.addEventListener("DOMContentLoaded", () => {
            clearInterval(intervalCheck);
        
            renderAllSVGs();
            addObservers();
        });
    }

    /* src\elements\SvgIcon.svelte generated by Svelte v3.44.3 */
    const file$4 = "src\\elements\\SvgIcon.svelte";

    function create_fragment$4(ctx) {
    	let svg;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			attr_dev(svg, "data-src", "icons/icon1.svg");
    			attr_dev(svg, "width", "250");
    			attr_dev(svg, "height", "250");
    			attr_dev(svg, "fill", "red");
    			set_style(svg, "color", "purple");
    			add_location(svg, file$4, 3, 0, 56);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
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

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvgIcon', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SvgIcon> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class SvgIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvgIcon",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\elements\LoadingSingleCircle.svelte generated by Svelte v3.44.3 */

    const file$3 = "src\\elements\\LoadingSingleCircle.svelte";

    function create_fragment$3(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "child svelte-1pzksmt");
    			add_location(div0, file$3, 1, 2, 24);
    			attr_dev(div1, "class", "parent svelte-1pzksmt");
    			add_location(div1, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
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
    	validate_slots('LoadingSingleCircle', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LoadingSingleCircle> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class LoadingSingleCircle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LoadingSingleCircle",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\MoonLit.svelte generated by Svelte v3.44.3 */
    const file$2 = "src\\components\\MoonLit.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (26:2) {#if data}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*data*/ ctx[0];
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

    			each_1_anchor = empty$1();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1) {
    				each_value = /*data*/ ctx[0];
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
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(26:2) {#if data}",
    		ctx
    	});

    	return block;
    }

    // (27:4) {#each data as item}
    function create_each_block(ctx) {
    	let i;

    	const block = {
    		c: function create() {
    			i = element("i");
    			set_style(i, "left", /*item*/ ctx[2].x + "px");
    			set_style(i, "top", /*item*/ ctx[2].y + "px");
    			set_style(i, "width", 1 + /*item*/ ctx[2].size + "px");
    			set_style(i, "height", 1 + /*item*/ ctx[2].size + "px");
    			set_style(i, "animation-duration", 5 + /*item*/ ctx[2].duration + "s");
    			set_style(i, "animation-delay", /*item*/ ctx[2].duration + "s");
    			attr_dev(i, "class", "svelte-h8z5jm");
    			add_location(i, file$2, 27, 6, 1032);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(27:4) {#each data as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let img1;
    	let img1_src_value;
    	let t2;
    	let img2;
    	let img2_src_value;
    	let t3;
    	let img3;
    	let img3_src_value;
    	let t4;
    	let img4;
    	let img4_src_value;
    	let t5;
    	let img5;
    	let img5_src_value;
    	let t6;
    	let img6;
    	let img6_src_value;
    	let t7;
    	let if_block = /*data*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			img0 = element("img");
    			t1 = space();
    			img1 = element("img");
    			t2 = space();
    			img2 = element("img");
    			t3 = space();
    			img3 = element("img");
    			t4 = space();
    			img4 = element("img");
    			t5 = space();
    			img5 = element("img");
    			t6 = space();
    			img6 = element("img");
    			t7 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "moon svelte-h8z5jm");
    			add_location(div0, file$2, 17, 2, 502);
    			if (!src_url_equal(img0.src, img0_src_value = "images/cloud/forest.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "forest svelte-h8z5jm");
    			attr_dev(img0, "alt", "img");
    			add_location(img0, file$2, 18, 2, 526);
    			if (!src_url_equal(img1.src, img1_src_value = "images/cloud/cloud1.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "cloud1 svelte-h8z5jm");
    			attr_dev(img1, "alt", "img");
    			add_location(img1, file$2, 19, 2, 592);
    			if (!src_url_equal(img2.src, img2_src_value = "images/cloud/cloud2.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "class", "cloud2 svelte-h8z5jm");
    			attr_dev(img2, "alt", "img");
    			add_location(img2, file$2, 20, 2, 658);
    			if (!src_url_equal(img3.src, img3_src_value = "images/cloud/cloud3.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "class", "cloud3 svelte-h8z5jm");
    			attr_dev(img3, "alt", "img");
    			add_location(img3, file$2, 21, 2, 724);
    			if (!src_url_equal(img4.src, img4_src_value = "images/cloud/cloud1.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "class", "cloud4 svelte-h8z5jm");
    			attr_dev(img4, "alt", "img");
    			add_location(img4, file$2, 22, 2, 790);
    			if (!src_url_equal(img5.src, img5_src_value = "images/cloud/cloud2.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "class", "cloud5 svelte-h8z5jm");
    			attr_dev(img5, "alt", "img");
    			add_location(img5, file$2, 23, 2, 856);
    			if (!src_url_equal(img6.src, img6_src_value = "images/cloud/cloud3.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "class", "cloud6 svelte-h8z5jm");
    			attr_dev(img6, "alt", "img");
    			add_location(img6, file$2, 24, 2, 922);
    			attr_dev(div1, "class", "parent2 svelte-h8z5jm");
    			add_location(div1, file$2, 16, 0, 477);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t0);
    			append_dev(div1, img0);
    			append_dev(div1, t1);
    			append_dev(div1, img1);
    			append_dev(div1, t2);
    			append_dev(div1, img2);
    			append_dev(div1, t3);
    			append_dev(div1, img3);
    			append_dev(div1, t4);
    			append_dev(div1, img4);
    			append_dev(div1, t5);
    			append_dev(div1, img5);
    			append_dev(div1, t6);
    			append_dev(div1, img6);
    			append_dev(div1, t7);
    			if (if_block) if_block.m(div1, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*data*/ ctx[0]) if_block.p(ctx, dirty);
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
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
    	validate_slots('MoonLit', slots, []);
    	let data = [];

    	const stars = () => {
    		let count = 500;

    		while (count--) {
    			let x = Math.floor(Math.random() * window.innerWidth) * .87;
    			let y = Math.floor(Math.random() * window.innerHeight) * .87;
    			let duration = Math.random() * 10;
    			let size = Math.random() * 2;
    			data.push({ x, y, duration, size });
    		}
    	};

    	stars();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MoonLit> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ onMount, data, stars });

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data];
    }

    class MoonLit extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MoonLit",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\Template.svelte generated by Svelte v3.44.3 */

    const { console: console_1 } = globals;

    const file$1 = "src\\components\\Template.svelte";

    // (35:0) {#key activeTab}
    function create_key_block(ctx) {
    	let navbar;
    	let updating_header;
    	let current;

    	function navbar_header_binding(value) {
    		/*navbar_header_binding*/ ctx[3](value);
    	}

    	let navbar_props = {};

    	if (/*activeTab*/ ctx[1] !== void 0) {
    		navbar_props.header = /*activeTab*/ ctx[1];
    	}

    	navbar = new NavBar({ props: navbar_props, $$inline: true });
    	binding_callbacks.push(() => bind$2(navbar, 'header', navbar_header_binding));

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbar_changes = {};

    			if (!updating_header && dirty & /*activeTab*/ 2) {
    				updating_header = true;
    				navbar_changes.header = /*activeTab*/ ctx[1];
    				add_flush_callback(() => updating_header = false);
    			}

    			navbar.$set(navbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(35:0) {#key activeTab}",
    		ctx
    	});

    	return block;
    }

    // (108:45) 
    function create_if_block_16(ctx) {
    	let packageusages;
    	let current;
    	packageusages = new PackageUsages({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(packageusages.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(packageusages, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(packageusages.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(packageusages.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(packageusages, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(108:45) ",
    		ctx
    	});

    	return block;
    }

    // (101:38) 
    function create_if_block_15(ctx) {
    	let toggle;
    	let updating_checkedValue;
    	let current;

    	function toggle_checkedValue_binding(value) {
    		/*toggle_checkedValue_binding*/ ctx[10](value);
    	}

    	let toggle_props = {
    		width: "10rem",
    		onText: "on",
    		offText: "off"
    	};

    	if (/*toggleValue*/ ctx[0] !== void 0) {
    		toggle_props.checkedValue = /*toggleValue*/ ctx[0];
    	}

    	toggle = new Toggle({ props: toggle_props, $$inline: true });
    	binding_callbacks.push(() => bind$2(toggle, 'checkedValue', toggle_checkedValue_binding));

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

    			if (!updating_checkedValue && dirty & /*toggleValue*/ 1) {
    				updating_checkedValue = true;
    				toggle_changes.checkedValue = /*toggleValue*/ ctx[0];
    				add_flush_callback(() => updating_checkedValue = false);
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
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(101:38) ",
    		ctx
    	});

    	return block;
    }

    // (99:42) 
    function create_if_block_14(ctx) {
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
    		p: noop$1,
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
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(99:42) ",
    		ctx
    	});

    	return block;
    }

    // (97:39) 
    function create_if_block_13(ctx) {
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
    		p: noop$1,
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
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(97:39) ",
    		ctx
    	});

    	return block;
    }

    // (95:46) 
    function create_if_block_12(ctx) {
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
    		p: noop$1,
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
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(95:46) ",
    		ctx
    	});

    	return block;
    }

    // (93:46) 
    function create_if_block_11(ctx) {
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
    		p: noop$1,
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
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(93:46) ",
    		ctx
    	});

    	return block;
    }

    // (91:45) 
    function create_if_block_10(ctx) {
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
    		p: noop$1,
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
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(91:45) ",
    		ctx
    	});

    	return block;
    }

    // (89:46) 
    function create_if_block_9(ctx) {
    	let animatedbutton;
    	let current;
    	animatedbutton = new AnimatedButton({ $$inline: true });
    	animatedbutton.$on("click", /*click_handler_4*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(animatedbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(animatedbutton, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(animatedbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(animatedbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(animatedbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(89:46) ",
    		ctx
    	});

    	return block;
    }

    // (87:48) 
    function create_if_block_8(ctx) {
    	let loadingsquarebar;
    	let current;
    	loadingsquarebar = new LoadingSquareBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadingsquarebar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingsquarebar, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingsquarebar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingsquarebar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingsquarebar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(87:48) ",
    		ctx
    	});

    	return block;
    }

    // (85:50) 
    function create_if_block_7(ctx) {
    	let loadinginfinitybar;
    	let current;
    	loadinginfinitybar = new LoadingInfinityBar({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(loadinginfinitybar.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadinginfinitybar, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadinginfinitybar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadinginfinitybar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadinginfinitybar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(85:50) ",
    		ctx
    	});

    	return block;
    }

    // (83:42) 
    function create_if_block_6(ctx) {
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
    		p: noop$1,
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
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(83:42) ",
    		ctx
    	});

    	return block;
    }

    // (81:39) 
    function create_if_block_5(ctx) {
    	let moonlit;
    	let current;
    	moonlit = new MoonLit({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(moonlit.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(moonlit, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(moonlit.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(moonlit.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(moonlit, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(81:39) ",
    		ctx
    	});

    	return block;
    }

    // (79:46) 
    function create_if_block_4(ctx) {
    	let lightdarktheme;
    	let current;
    	lightdarktheme = new LightDarkTheme({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(lightdarktheme.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(lightdarktheme, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lightdarktheme.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lightdarktheme.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(lightdarktheme, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(79:46) ",
    		ctx
    	});

    	return block;
    }

    // (73:39) 
    function create_if_block_3(ctx) {
    	let svgicon;
    	let current;
    	svgicon = new SvgIcon({ $$inline: true });
    	svgicon.$on("click", /*click_handler_3*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(svgicon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(svgicon, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svgicon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svgicon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(svgicon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(73:39) ",
    		ctx
    	});

    	return block;
    }

    // (67:51) 
    function create_if_block_2(ctx) {
    	let loadingsinglecircle;
    	let current;
    	loadingsinglecircle = new LoadingSingleCircle({ $$inline: true });
    	loadingsinglecircle.$on("click", /*click_handler_2*/ ctx[7]);

    	const block = {
    		c: function create() {
    			create_component(loadingsinglecircle.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(loadingsinglecircle, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(loadingsinglecircle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(loadingsinglecircle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(loadingsinglecircle, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(67:51) ",
    		ctx
    	});

    	return block;
    }

    // (61:40) 
    function create_if_block_1(ctx) {
    	let testcode;
    	let current;
    	testcode = new TestCode({ $$inline: true });
    	testcode.$on("click", /*click_handler_1*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(testcode.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(testcode, target, anchor);
    			current = true;
    		},
    		p: noop$1,
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(61:40) ",
    		ctx
    	});

    	return block;
    }

    // (55:6) {#if activeTab == 'TableDataPagination'}
    function create_if_block(ctx) {
    	let tabledatapagination;
    	let current;
    	tabledatapagination = new TableDataPagination({ $$inline: true });
    	tabledatapagination.$on("click", /*click_handler*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(tabledatapagination.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabledatapagination, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabledatapagination.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabledatapagination.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabledatapagination, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(55:6) {#if activeTab == 'TableDataPagination'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let previous_key = /*activeTab*/ ctx[1];
    	let t0;
    	let div4;
    	let div1;
    	let div0;
    	let sidebar;
    	let t1;
    	let div3;
    	let div2;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let key_block = create_key_block(ctx);

    	sidebar = new SideBar({
    			props: {
    				list: /*sidebarItems*/ ctx[2],
    				selected: /*activeTab*/ ctx[1]
    			},
    			$$inline: true
    		});

    	sidebar.$on("activeTab", /*activeTab_handler*/ ctx[4]);

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
    		create_if_block_10,
    		create_if_block_11,
    		create_if_block_12,
    		create_if_block_13,
    		create_if_block_14,
    		create_if_block_15,
    		create_if_block_16
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*activeTab*/ ctx[1] == 'TableDataPagination') return 0;
    		if (/*activeTab*/ ctx[1] == 'TestCode') return 1;
    		if (/*activeTab*/ ctx[1] == 'LoadingSingleCircle') return 2;
    		if (/*activeTab*/ ctx[1] == 'SvgIcon') return 3;
    		if (/*activeTab*/ ctx[1] == 'LightDarkTheme') return 4;
    		if (/*activeTab*/ ctx[1] == 'MoonLit') return 5;
    		if (/*activeTab*/ ctx[1] == 'JockTeller') return 6;
    		if (/*activeTab*/ ctx[1] == 'LoadingInfinityBar') return 7;
    		if (/*activeTab*/ ctx[1] == 'LoadingSquareBar') return 8;
    		if (/*activeTab*/ ctx[1] == 'AnimatedButton') return 9;
    		if (/*activeTab*/ ctx[1] == 'LoadingCircle') return 10;
    		if (/*activeTab*/ ctx[1] == 'InfiniteScroll') return 11;
    		if (/*activeTab*/ ctx[1] == 'QuoteGenerator') return 12;
    		if (/*activeTab*/ ctx[1] == 'AppPoll') return 13;
    		if (/*activeTab*/ ctx[1] == 'Calculator') return 14;
    		if (/*activeTab*/ ctx[1] == 'Toggle') return 15;
    		if (/*activeTab*/ ctx[1] == 'PackageUsages') return 16;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			key_block.c();
    			t0 = space();
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			create_component(sidebar.$$.fragment);
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "parent svelte-6xzses");
    			add_location(div0, file$1, 39, 4, 2165);
    			attr_dev(div1, "class", "col-2");
    			add_location(div1, file$1, 38, 2, 2140);
    			attr_dev(div2, "class", "content svelte-6xzses");
    			add_location(div2, file$1, 53, 4, 2507);
    			attr_dev(div3, "class", "col");
    			add_location(div3, file$1, 52, 2, 2484);
    			attr_dev(div4, "class", "row g-0 m-0");
    			add_location(div4, file$1, 37, 0, 2111);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			mount_component(sidebar, div0, null);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div2);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeTab*/ 2 && safe_not_equal(previous_key, previous_key = /*activeTab*/ ctx[1])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop$1);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(t0.parentNode, t0);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			const sidebar_changes = {};
    			if (dirty & /*activeTab*/ 2) sidebar_changes.selected = /*activeTab*/ ctx[1];
    			sidebar.$set(sidebar_changes);
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
    			transition_in(key_block);
    			transition_in(sidebar.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			transition_out(sidebar.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			key_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div4);
    			destroy_component(sidebar);

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
    	validate_slots('Template', slots, []);
    	let toggleValue = false;
    	let activeTab = 'TestCode';

    	let sidebarItems = [
    		{
    			name: 'TableDataPagination',
    			icon: 'fas fa-tachometer-alt',
    			component: TableDataPagination
    		},
    		{
    			name: 'MoonLit',
    			icon: 'fas fa-tachometer-alt',
    			component: MoonLit
    		},
    		{
    			name: 'LoadingSingleCircle',
    			icon: 'fas fa-tachometer-alt',
    			component: LoadingSingleCircle
    		},
    		{
    			name: 'TestCode',
    			icon: 'fas fa-tachometer-alt',
    			component: TestCode
    		},
    		{
    			name: 'SvgIcon',
    			icon: 'fas fa-tachometer-alt',
    			component: SvgIcon
    		},
    		{
    			name: 'LightDarkTheme',
    			icon: 'fas fa-tachometer-alt',
    			component: LightDarkTheme
    		},
    		{
    			name: 'LoadingSquareBar',
    			icon: 'fas fa-tachometer-alt',
    			component: LoadingSquareBar
    		},
    		{
    			name: 'LoadingInfinityBar',
    			icon: 'fas fa-tachometer-alt',
    			component: LoadingInfinityBar
    		},
    		{
    			name: 'JockTeller',
    			icon: 'fas fa-tachometer-alt',
    			component: JockTeller
    		},
    		{
    			name: 'AnimatedButton',
    			icon: "fab fa-medium",
    			component: AnimatedButton
    		},
    		{
    			name: 'LoadingCircle',
    			icon: 'fas fa-tachometer-alt',
    			component: LoadingCircle
    		},
    		{
    			name: 'QuoteGenerator',
    			icon: 'fas fa-tachometer-alt',
    			component: QuoteGenerator
    		},
    		{
    			name: 'InfiniteScroll',
    			icon: 'fas fa-tachometer-alt',
    			component: InfiniteScroll
    		},
    		{
    			name: 'Calculator',
    			icon: 'fas fa-tachometer-alt',
    			component: Calculator
    		},
    		{
    			name: 'Toggle',
    			icon: 'fas fa-tachometer-alt',
    			component: Toggle
    		},
    		{
    			name: 'AppPoll',
    			icon: 'fas fa-tachometer-alt',
    			component: AppPoll
    		},
    		{
    			name: 'PackageUsages',
    			icon: 'fas fa-tachometer-alt',
    			component: PackageUsages
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Template> was created with unknown prop '${key}'`);
    	});

    	function navbar_header_binding(value) {
    		activeTab = value;
    		$$invalidate(1, activeTab);
    	}

    	const activeTab_handler = event => {
    		$$invalidate(1, activeTab = event.detail.activeTab);
    	};

    	const click_handler = () => {
    		console.log(activeTab);
    	};

    	const click_handler_1 = () => {
    		console.log(activeTab);
    	};

    	const click_handler_2 = () => {
    		console.log(activeTab);
    	};

    	const click_handler_3 = () => {
    		console.log(activeTab);
    	};

    	const click_handler_4 = () => console.log('animaed button');

    	function toggle_checkedValue_binding(value) {
    		toggleValue = value;
    		$$invalidate(0, toggleValue);
    	}

    	$$self.$capture_state = () => ({
    		SideBar,
    		NavBar,
    		PackageUsages,
    		LightDarkTheme,
    		AnimatedButton,
    		AppPoll,
    		QuoteGenerator,
    		Toggle,
    		Calculator,
    		InfiniteScroll,
    		TestCode,
    		LoadingCircle,
    		JockTeller,
    		TableDataPagination,
    		LoadingSquareBar,
    		LoadingInfinityBar,
    		BounchingHeadline,
    		SvgIcon,
    		LoadingSingleCircle,
    		MoonLit,
    		toggleValue,
    		activeTab,
    		sidebarItems
    	});

    	$$self.$inject_state = $$props => {
    		if ('toggleValue' in $$props) $$invalidate(0, toggleValue = $$props.toggleValue);
    		if ('activeTab' in $$props) $$invalidate(1, activeTab = $$props.activeTab);
    		if ('sidebarItems' in $$props) $$invalidate(2, sidebarItems = $$props.sidebarItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*toggleValue*/ 1) {
    			console.log(toggleValue);
    		}
    	};

    	return [
    		toggleValue,
    		activeTab,
    		sidebarItems,
    		navbar_header_binding,
    		activeTab_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		toggle_checkedValue_binding
    	];
    }

    class Template extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Template",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.3 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let template;
    	let current;
    	template = new Template({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(template.$$.fragment);
    			add_location(main, file, 3, 0, 83);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(template, main, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(template.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(template.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(template);
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

    	$$self.$capture_state = () => ({ Template });
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
