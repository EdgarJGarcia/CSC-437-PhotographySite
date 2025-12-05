(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var z,we;class st extends Error{}st.prototype.name="InvalidTokenError";function Ds(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function zs(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Ds(t)}catch{return atob(t)}}function Xe(r,t){if(typeof r!="string")throw new st("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new st(`Invalid token specified: missing part #${e+1}`);let i;try{i=zs(s)}catch(n){throw new st(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new st(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const qs="mu:context",Dt=`${qs}:change`;class Bs{constructor(t,e){this._proxy=Fs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ts extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Bs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Dt,t),t}detach(t){this.removeEventListener(Dt,t)}}function Fs(r,t){return new Proxy(r,{get:(s,i,n)=>i==="then"?void 0:Reflect.get(s,i,n),set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(Dt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function Vs(r,t){const e=es(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function es(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return es(r,i.host)}class Ws extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ss(r="mu:message"){return(t,...e)=>t.dispatchEvent(new Ws(e,r))}class Zt{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${t[0]} message`,t);const e=this._update(t,this._context.value);if(console.log(`Next[${t[0]}] => `,e),!Array.isArray(e))this._context.value=e;else{const[s,...i]=e;this._context.value=s,i.forEach(n=>n.then(o=>{o.length&&this.consume(o)}))}}}const zt="mu:auth:jwt",is=class rs extends Zt{constructor(t,e){super((s,i)=>this.update(s,i),t,rs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":{const{token:i,redirect:n}=t[1];return[Ks(i),jt(n)]}case"auth/signout":return[Js(e.user),jt(this._redirectForLogin)];case"auth/redirect":return[e,jt(this._redirectForLogin,{next:window.location.href})];default:const s=t[0];throw new Error(`Unhandled Auth message "${s}"`)}}};is.EVENT_TYPE="auth:message";let ns=is;const os=ss(ns.EVENT_TYPE);function jt(r,t){return new Promise((e,s)=>{if(r){const i=window.location.href,n=new URL(r,i);t&&Object.entries(t).forEach(([o,l])=>n.searchParams.set(o,l)),console.log("Redirecting to ",r),window.location.assign(n)}e([])})}class Ys extends ts{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=W.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ns(this.context,this.redirect).attach(this)}}class nt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(zt),t}}class W extends nt{constructor(t){super();const e=Xe(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new W(t);return localStorage.setItem(zt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(zt);return t?W.authenticate(t):new nt}}function Ks(r){return{user:W.authenticate(r),token:r}}function Js(r){return{user:r&&r.authenticated?nt.deauthenticate(r):r,token:""}}function Gs(r){return r&&r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function Zs(r){return r.authenticated?Xe(r.token||""):{}}const Qs=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:W,Provider:Ys,User:nt,dispatch:os,headers:Gs,payload:Zs},Symbol.toStringTag,{value:"Module"}));function Xs(r,t,e){const s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});r.dispatchEvent(s)}function qt(r,t,e){const s=r.target;Xs(s,t,e)}function Se(r,t="*"){return r.composedPath().find(i=>{const n=i;return n.tagName&&n.matches(t)})||void 0}function Qt(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const ti=new DOMParser;function M(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=ti.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u?.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return xe(a);case"bigint":case"boolean":case"number":case"symbol":return xe(a.toString());case"object":if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return a instanceof Node?a:new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function xe(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ct(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}z=class extends HTMLElement{constructor(){super(),this._state={},Ct(this).template(z.template).styles(z.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),qt(r,"mu-form:submit",this._state)}),this.submitSlot&&this.submitSlot.addEventListener("slotchange",()=>{var r,t;for(const e of((r=this.submitSlot)==null?void 0:r.assignedNodes())||[])(t=this.form)==null||t.insertBefore(e,this.submitSlot)})}set init(r){this._state=r||{},ei(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}get submitSlot(){var r;const t=(r=this.shadowRoot)==null?void 0:r.querySelector('slot[name="submit"]');return t||null}},z.template=M`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,z.styles=Qt`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function ei(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":i instanceof Date?o.value=i.toISOString().substr(0,10):o.value=i;break;default:o.value=i;break}}}return r}const as=class ls extends Zt{constructor(t){super((e,s)=>this.update(e,s),t,ls.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];return ii(s,i)}case"history/redirect":{const{href:s,state:i}=t[1];return ri(s,i)}}}};as.EVENT_TYPE="history:message";let Xt=as;class Pe extends ts{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=si(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(!this._root||s.pathname.startsWith(this._root))&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),te(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new Xt(this.context).attach(this),this._root=this.getAttribute("root")||void 0}}function si(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ii(r,t={}){return history.pushState(t,"",r),{location:document.location,state:history.state}}function ri(r,t={}){return history.replaceState(t,"",r),{location:document.location,state:history.state}}const te=ss(Xt.EVENT_TYPE),ni=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Pe,Provider:Pe,Service:Xt,dispatch:te},Symbol.toStringTag,{value:"Module"}));class vt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Ce(this._provider,t);this._effects.push(i),e(i)}else Vs(this._target,this._contextLabel).then(i=>{const n=new Ce(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ce{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const cs=class hs extends HTMLElement{constructor(){super(),this._state={},this._user=new nt,this._authObserver=new vt(this,"blazing:auth"),Ct(this).template(hs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;oi(i,this._state,e,this.authorization).then(n=>Q(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},Q(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&ke(this.src,this.authorization).then(e=>{this._state=e,Q(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&ke(this.src,this.authorization).then(i=>{this._state=i,Q(i,this)});break;case"new":s&&(this._state={},Q({},this));break}}};cs.observedAttributes=["src","new","action"];cs.template=M`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function ke(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function Q(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function oi(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const ai=class us extends Zt{constructor(t,e){super(e,t,us.EVENT_TYPE,!1)}};ai.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const gt=globalThis,ee=gt.ShadowRoot&&(gt.ShadyCSS===void 0||gt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,se=Symbol(),Oe=new WeakMap;let ds=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==se)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ee&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Oe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Oe.set(e,t))}return t}toString(){return this.cssText}};const li=r=>new ds(typeof r=="string"?r:r+"",void 0,se),ci=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new ds(e,r,se)},hi=(r,t)=>{if(ee)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=gt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Te=ee?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return li(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:ui,defineProperty:di,getOwnPropertyDescriptor:pi,getOwnPropertyNames:fi,getOwnPropertySymbols:mi,getPrototypeOf:gi}=Object,Y=globalThis,Re=Y.trustedTypes,yi=Re?Re.emptyScript:"",Ne=Y.reactiveElementPolyfillSupport,it=(r,t)=>r,_t={toAttribute(r,t){switch(t){case Boolean:r=r?yi:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ie=(r,t)=>!ui(r,t),Ue={attribute:!0,type:String,converter:_t,reflect:!1,useDefault:!1,hasChanged:ie};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Y.litPropertyMetadata??(Y.litPropertyMetadata=new WeakMap);let B=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ue){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&di(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=pi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){const l=i?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ue}static _$Ei(){if(this.hasOwnProperty(it("elementProperties")))return;const t=gi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(it("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(it("properties"))){const e=this.properties,s=[...fi(e),...mi(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Te(i))}else t!==void 0&&e.push(Te(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return hi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:_t).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s,i;const n=this.constructor,o=n._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const l=n.getPropertyOptions(o),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((s=l.converter)==null?void 0:s.fromAttribute)!==void 0?l.converter:_t;this._$Em=o,this[o]=a.fromAttribute(e,l.type)??((i=this._$Ej)==null?void 0:i.get(o))??null,this._$Em=null}}requestUpdate(t,e,s){var i;if(t!==void 0){const n=this.constructor,o=this[t];if(s??(s=n.getPropertyOptions(t)),!((s.hasChanged??ie)(o,e)||s.useDefault&&s.reflect&&o===((i=this._$Ej)==null?void 0:i.get(t))&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i){const{wrapped:l}=o,a=this[n];l!==!0||this._$AL.has(n)||a===void 0||this.C(n,void 0,o,a)}}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};B.elementStyles=[],B.shadowRootOptions={mode:"open"},B[it("elementProperties")]=new Map,B[it("finalized")]=new Map,Ne?.({ReactiveElement:B}),(Y.reactiveElementVersions??(Y.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $t=globalThis,bt=$t.trustedTypes,Le=bt?bt.createPolicy("lit-html",{createHTML:r=>r}):void 0,ps="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,fs="?"+P,vi=`<${fs}>`,j=document,ot=()=>j.createComment(""),at=r=>r===null||typeof r!="object"&&typeof r!="function",re=Array.isArray,_i=r=>re(r)||typeof r?.[Symbol.iterator]=="function",Ht=`[ 	
\f\r]`,X=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Me=/-->/g,je=/>/g,R=RegExp(`>|${Ht}(?:([^\\s"'>=/]+)(${Ht}*=${Ht}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),He=/'/g,Ie=/"/g,ms=/^(?:script|style|textarea|title)$/i,$i=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),tt=$i(1),K=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),De=new WeakMap,U=j.createTreeWalker(j,129);function gs(r,t){if(!re(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Le!==void 0?Le.createHTML(t):t}const bi=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=X;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===X?f[1]==="!--"?o=Me:f[1]!==void 0?o=je:f[2]!==void 0?(ms.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=R):f[3]!==void 0&&(o=R):o===R?f[0]===">"?(o=i??X,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?R:f[3]==='"'?Ie:He):o===Ie||o===He?o=R:o===Me||o===je?o=X:(o=R,i=void 0);const h=o===R&&r[l+1].startsWith("/>")?" ":"";n+=o===X?a+vi:u>=0?(s.push(d),a.slice(0,u)+ps+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[gs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let Bt=class ys{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=bi(t,e);if(this.el=ys.createElement(d,s),U.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=U.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(ps)){const c=f[o++],h=i.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ei:p[1]==="?"?wi:p[1]==="@"?Si:kt}),i.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(ms.test(i.tagName)){const u=i.textContent.split(P),c=u.length-1;if(c>0){i.textContent=bt?bt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],ot()),U.nextNode(),a.push({type:2,index:++n});i.append(u[c],ot())}}}else if(i.nodeType===8)if(i.data===fs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=j.createElement("template");return s.innerHTML=t,s}};function J(r,t,e=r,s){var i,n;if(t===K)return t;let o=s!==void 0?(i=e._$Co)==null?void 0:i[s]:e._$Cl;const l=at(t)?void 0:t._$litDirective$;return o?.constructor!==l&&((n=o?._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=J(r,o._$AS(r,t.values),o,s)),t}let Ai=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??j).importNode(e,!0);U.currentNode=i;let n=U.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new ne(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new xi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=U.nextNode(),o++)}return U.currentNode=j,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},ne=class vs{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),at(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==K&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):_i(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&at(this._$AH)?this._$AA.nextSibling.data=t:this.T(j.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Bt.createElement(gs(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Ai(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=De.get(t.strings);return e===void 0&&De.set(t.strings,e=new Bt(t)),e}k(t){re(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new vs(this.O(ot()),this.O(ot()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},kt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=J(this,t,e,0),o=!at(t)||t!==this._$AH&&t!==K,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=J(this,l[s+a],e,a),d===K&&(d=this._$AH[a]),o||(o=!at(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ei=class extends kt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}},wi=class extends kt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}},Si=class extends kt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??_)===K)return;const s=this._$AH,i=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},xi=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}};const ze=$t.litHtmlPolyfillSupport;ze?.(Bt,ne),($t.litHtmlVersions??($t.litHtmlVersions=[])).push("3.3.0");const Pi=(r,t,e)=>{const s=e?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const n=e?.renderBefore??null;s._$litPart$=i=new ne(t.insertBefore(ot(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lt=globalThis;let V=class extends B{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Pi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return K}};V._$litElement$=!0,V.finalized=!0,(we=lt.litElementHydrateSupport)==null||we.call(lt,{LitElement:V});const qe=lt.litElementPolyfillSupport;qe?.({LitElement:V});(lt.litElementVersions??(lt.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ci={attribute:!0,type:String,converter:_t,reflect:!1,hasChanged:ie},ki=(r=Ci,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.C(o,void 0,r,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function _s(r){return(t,e)=>typeof e=="object"?ki(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $s(r){return _s({...r,state:!0,attribute:!1})}function Oi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Ti(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var bs={};(function(r){var t=(function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,y,Rt){var E=y.length-1;switch(m){case 1:return new g.Root({},[y[E-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[E-1],y[E]]);break;case 4:case 5:this.$=y[E];break;case 6:this.$=new g.Literal({value:y[E]});break;case 7:this.$=new g.Splat({name:y[E]});break;case 8:this.$=new g.Param({name:y[E]});break;case 9:this.$=new g.Optional({},[y[E-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],y=this.table,Rt="",E=0,be=0,Ms=2,Ae=1,js=m.slice.call(arguments,1),v=Object.create(this.lexer),O={yy:{}};for(var Nt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Nt)&&(O.yy[Nt]=this.yy[Nt]);v.setInput(c,O.yy),O.yy.lexer=v,O.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var Ut=v.yylloc;m.push(Ut);var Hs=v.options&&v.options.ranges;typeof O.yy.parseError=="function"?this.parseError=O.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Is=function(){var D;return D=v.lex()||Ae,typeof D!="number"&&(D=h.symbols_[D]||D),D},A,T,w,Lt,I={},ft,x,Ee,mt;;){if(T=p[p.length-1],this.defaultActions[T]?w=this.defaultActions[T]:((A===null||typeof A>"u")&&(A=Is()),w=y[T]&&y[T][A]),typeof w>"u"||!w.length||!w[0]){var Mt="";mt=[];for(ft in y[T])this.terminals_[ft]&&ft>Ms&&mt.push("'"+this.terminals_[ft]+"'");v.showPosition?Mt="Parse error on line "+(E+1)+`:
`+v.showPosition()+`
Expecting `+mt.join(", ")+", got '"+(this.terminals_[A]||A)+"'":Mt="Parse error on line "+(E+1)+": Unexpected "+(A==Ae?"end of input":"'"+(this.terminals_[A]||A)+"'"),this.parseError(Mt,{text:v.match,token:this.terminals_[A]||A,line:v.yylineno,loc:Ut,expected:mt})}if(w[0]instanceof Array&&w.length>1)throw new Error("Parse Error: multiple actions possible at state: "+T+", token: "+A);switch(w[0]){case 1:p.push(A),g.push(v.yytext),m.push(v.yylloc),p.push(w[1]),A=null,be=v.yyleng,Rt=v.yytext,E=v.yylineno,Ut=v.yylloc;break;case 2:if(x=this.productions_[w[1]][1],I.$=g[g.length-x],I._$={first_line:m[m.length-(x||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(x||1)].first_column,last_column:m[m.length-1].last_column},Hs&&(I._$.range=[m[m.length-(x||1)].range[0],m[m.length-1].range[1]]),Lt=this.performAction.apply(I,[Rt,be,E,O.yy,w[1],g,m].concat(js)),typeof Lt<"u")return Lt;x&&(p=p.slice(0,-1*x*2),g=g.slice(0,-1*x),m=m.slice(0,-1*x)),p.push(this.productions_[w[1]][0]),g.push(I.$),m.push(I._$),Ee=y[p[p.length-2]][p[p.length-1]],p.push(Ee);break;case 3:return!0}}return!0}},d=(function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(p=this._input.match(this.rules[m[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(c=this.test_match(p,m[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u})();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f})();typeof Ti<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(bs);function q(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var As={Root:q("Root"),Concat:q("Concat"),Literal:q("Literal"),Splat:q("Splat"),Param:q("Param"),Optional:q("Optional")},Es=bs.parser;Es.yy=As;var Ri=Es,Ni=Object.keys(As);function Ui(r){return Ni.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var ws=Ui,Li=ws,Mi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ss(r){this.captures=r.captures,this.re=r.re}Ss.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var ji=Li({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Mi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Ss({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Hi=ji,Ii=ws,Di=Ii({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),zi=Di,qi=Ri,Bi=Hi,Fi=zi;dt.prototype=Object.create(null);dt.prototype.match=function(r){var t=Bi.visit(this.ast),e=t.match(r);return e||!1};dt.prototype.reverse=function(r){return Fi.visit(this.ast,r)};function dt(r){var t;if(this?t=this:t=Object.create(dt.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=qi.parse(r),t}var Vi=dt,Wi=Vi,Yi=Wi;const Ki=Oi(Yi);var Ji=Object.defineProperty,xs=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Ji(t,e,i),i};const Ps=class extends V{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>tt` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new Ki(i.path)})),this._historyObserver=new vt(this,e),this._authObserver=new vt(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),tt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(os(this,"auth/redirect"),tt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):tt` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),tt` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){te(this,"history/redirect",{href:t})}};Ps.styles=ci`
    :host,
    main {
      display: contents;
    }
  `;let At=Ps;xs([$s()],At.prototype,"_user");xs([$s()],At.prototype,"_match");const Gi=Object.freeze(Object.defineProperty({__proto__:null,Element:At,Switch:At},Symbol.toStringTag,{value:"Module"})),Cs=class Ft extends HTMLElement{constructor(){if(super(),Ct(this).template(Ft.template).styles(Ft.styles),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Cs.template=M` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;Cs.styles=Qt`
    :host {
      position: relative;
    }
    #is-shown {
      display: none;
    }
    #panel {
      display: none;

      position: absolute;
      right: 0;
      margin-top: var(--size-spacing-small);
      width: max-content;
      padding: var(--size-spacing-small);
      border-radius: var(--size-radius-small);
      background: var(--color-background-card);
      color: var(--color-text);
      box-shadow: var(--shadow-popover);
    }
    :host([open]) #panel {
      display: block;
    }
  `;const ks=class Vt extends HTMLElement{constructor(){super(),this._array=[],Ct(this).template(Vt.template).styles(Vt.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Os("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Se(t,"button.add")?qt(t,"input-array:add"):Se(t,"button.remove")&&qt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],Zi(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};ks.template=M`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;ks.styles=Qt`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function Zi(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Os(e)))}function Os(r,t){const e=r===void 0?M`<input />`:M`<input value="${r}" />`;return M`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Qi(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var Xi=Object.defineProperty,tr=Object.getOwnPropertyDescriptor,er=(r,t,e,s)=>{for(var i=tr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Xi(t,e,i),i};class sr extends V{constructor(t){super(),this._pending=[],this._observer=new vt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate(),this._lastModel=this._context.value;else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}er([_s()],sr.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const yt=globalThis,oe=yt.ShadowRoot&&(yt.ShadyCSS===void 0||yt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ae=Symbol(),Be=new WeakMap;let Ts=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(oe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Be.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Be.set(e,t))}return t}toString(){return this.cssText}};const ir=r=>new Ts(typeof r=="string"?r:r+"",void 0,ae),k=(r,...t)=>{const e=r.length===1?r[0]:t.reduce(((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1]),r[0]);return new Ts(e,r,ae)},rr=(r,t)=>{if(oe)r.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const s=document.createElement("style"),i=yt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Fe=oe?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return ir(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:nr,defineProperty:or,getOwnPropertyDescriptor:ar,getOwnPropertyNames:lr,getOwnPropertySymbols:cr,getPrototypeOf:hr}=Object,Ot=globalThis,Ve=Ot.trustedTypes,ur=Ve?Ve.emptyScript:"",dr=Ot.reactiveElementPolyfillSupport,rt=(r,t)=>r,Et={toAttribute(r,t){switch(t){case Boolean:r=r?ur:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},le=(r,t)=>!nr(r,t),We={attribute:!0,type:String,converter:Et,reflect:!1,useDefault:!1,hasChanged:le};Symbol.metadata??=Symbol("metadata"),Ot.litPropertyMetadata??=new WeakMap;let F=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=We){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&or(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=ar(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){const l=i?.call(this);n?.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??We}static _$Ei(){if(this.hasOwnProperty(rt("elementProperties")))return;const t=hr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(rt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(rt("properties"))){const e=this.properties,s=[...lr(e),...cr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Fe(i))}else t!==void 0&&e.push(Fe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return rr(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()))}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const n=(s.converter?.toAttribute!==void 0?s.converter:Et).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=s.getPropertyOptions(i),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:Et;this._$Em=i;const l=o.fromAttribute(e,n.type);this[i]=l??this._$Ej?.get(i)??l,this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){const i=this.constructor,n=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??le)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),n!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[i,n]of this._$Ep)this[i]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[i,n]of s){const{wrapped:o}=n,l=this[i];o!==!0||this._$AL.has(i)||l===void 0||this.C(i,void 0,n,l)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach((s=>s.hostUpdate?.())),this.update(e)):this._$EM()}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach((e=>e.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach((e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};F.elementStyles=[],F.shadowRootOptions={mode:"open"},F[rt("elementProperties")]=new Map,F[rt("finalized")]=new Map,dr?.({ReactiveElement:F}),(Ot.reactiveElementVersions??=[]).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ce=globalThis,wt=ce.trustedTypes,Ye=wt?wt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Rs="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Ns="?"+C,pr=`<${Ns}>`,H=document,ct=()=>H.createComment(""),ht=r=>r===null||typeof r!="object"&&typeof r!="function",he=Array.isArray,fr=r=>he(r)||typeof r?.[Symbol.iterator]=="function",It=`[ 	
\f\r]`,et=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ke=/-->/g,Je=/>/g,N=RegExp(`>|${It}(?:([^\\s"'>=/]+)(${It}*=${It}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ge=/'/g,Ze=/"/g,Us=/^(?:script|style|textarea|title)$/i,mr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),b=mr(1),G=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Qe=new WeakMap,L=H.createTreeWalker(H,129);function Ls(r,t){if(!he(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ye!==void 0?Ye.createHTML(t):t}const gr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=et;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===et?f[1]==="!--"?o=Ke:f[1]!==void 0?o=Je:f[2]!==void 0?(Us.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=i??et,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?N:f[3]==='"'?Ze:Ge):o===Ze||o===Ge?o=N:o===Ke||o===Je?o=et:(o=N,i=void 0);const h=o===N&&r[l+1].startsWith("/>")?" ":"";n+=o===et?a+pr:u>=0?(s.push(d),a.slice(0,u)+Rs+a.slice(u)+C+h):a+C+(u===-2?l:h)}return[Ls(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class ut{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=gr(t,e);if(this.el=ut.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=L.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Rs)){const c=f[o++],h=i.getAttribute(u).split(C),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?vr:p[1]==="?"?_r:p[1]==="@"?$r:Tt}),i.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Us.test(i.tagName)){const u=i.textContent.split(C),c=u.length-1;if(c>0){i.textContent=wt?wt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],ct()),L.nextNode(),a.push({type:2,index:++n});i.append(u[c],ct())}}}else if(i.nodeType===8)if(i.data===Ns)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:n}),u+=C.length-1}n++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}}function Z(r,t,e=r,s){if(t===G)return t;let i=s!==void 0?e._$Co?.[s]:e._$Cl;const n=ht(t)?void 0:t._$litDirective$;return i?.constructor!==n&&(i?._$AO?.(!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??=[])[s]=i:e._$Cl=i),i!==void 0&&(t=Z(r,i._$AS(r,t.values),i,s)),t}class yr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??H).importNode(e,!0);L.currentNode=i;let n=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new pt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new br(n,this,t)),this._$AV.push(d),a=s[++l]}o!==a?.index&&(n=L.nextNode(),o++)}return L.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class pt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),ht(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==G&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):fr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&ht(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=ut.createElement(Ls(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const n=new yr(i,this),o=n.u(this.options);n.p(e),this.T(o),this._$AH=n}}_$AC(t){let e=Qe.get(t.strings);return e===void 0&&Qe.set(t.strings,e=new ut(t)),e}k(t){he(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new pt(this.O(ct()),this.O(ct()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class Tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=Z(this,t,e,0),o=!ht(t)||t!==this._$AH&&t!==G,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=Z(this,l[s+a],e,a),d===G&&(d=this._$AH[a]),o||=!ht(d)||d!==this._$AH[a],d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class vr extends Tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class _r extends Tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class $r extends Tt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??$)===G)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class br{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const Ar=ce.litHtmlPolyfillSupport;Ar?.(ut,pt),(ce.litHtmlVersions??=[]).push("3.3.1");const Er=(r,t,e)=>{const s=e?.renderBefore??t;let i=s._$litPart$;if(i===void 0){const n=e?.renderBefore??null;s._$litPart$=i=new pt(t.insertBefore(ct(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ue=globalThis;class S extends F{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Er(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}S._$litElement$=!0,S.finalized=!0,ue.litElementHydrateSupport?.({LitElement:S});const wr=ue.litElementPolyfillSupport;wr?.({LitElement:S});(ue.litElementVersions??=[]).push("4.2.1");const pe=class pe extends S{render(){return b`
      <header>
        <h1>Photography Portfolio</h1>
        <nav>
          <a href="/app">Home</a>
          <a href="/app/gallery">Gallery</a>
          <a href="/app/service">Services</a>
          <a href="/app/booking">Book a Shoot</a>
        </nav>
      </header>
    `}};pe.styles=k`
    header {
      background-color: #333;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    h1 {
      margin: 0;
      font-size: 1.5rem;
    }

    nav {
      display: flex;
      gap: 1.5rem;
    }

    a {
      color: white;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    a:hover {
      opacity: 0.7;
    }
  `;let Wt=pe;const fe=class fe extends S{render(){return b`
      <main>
        <section class="hero">
          <h2>Welcome to My Photography Portfolio</h2>
          <p>Capturing moments, creating memories</p>
          <a href="/app/gallery" class="cta-button">View Gallery</a>
        </section>

        <section class="intro">
          <h3>About My Work</h3>
          <p>I specialize in portrait and nature photography in San Luis Obispo and Northern California.</p>
        </section>

        <section class="services-preview">
          <h3>Services</h3>
          <ul>
            <li>Portrait Photography</li>
            <li>Nature & Landscape</li>
            <li>Event Photography</li>
          </ul>
          <a href="/app/service">View All Services</a>
        </section>
      </main>
    `}};fe.styles=k`
    :host {
      display: block;
      padding: 2rem;
    }

    .hero {
      text-align: center;
      padding: 3rem 0;
    }

    .hero h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .cta-button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 1rem;
    }

    .cta-button:hover {
      background-color: #0056b3;
    }

    .intro, .services-preview {
      margin: 3rem 0;
    }

    h3 {
      font-size: 1.8rem;
      margin-bottom: 1rem;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      padding: 0.5rem 0;
    }
  `;let Yt=fe;const me=class me extends S{render(){return b`
      <main>
        <h2>Portfolio Gallery</h2>
        <p>Browse my photography work</p>
        
        <div class="gallery-grid">
          <div class="photo-card">
            <a href="/app/photo/1">
              <img src="/images/DSC_0213-2.jpg" alt="Photo 1">
              <p>Caption 1</p>
            </a>
          </div>
          
          <div class="photo-card">
            <a href="/app/photo/2">
              <img src="/images/DSC_0352.jpg" alt="Photo 2">
              <p>Caption 2</p>
            </a>
          </div>
          
          <div class="photo-card">
            <a href="/app/photo/3">
              <img src="/images/DSC_0353.jpg" alt="Photo 3">
              <p>Caption 3</p>
            </a>
          </div>
        </div>
      </main>
    `}};me.styles=k`
    :host {
      display: block;
      padding: 2rem;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .photo-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s;
    }

    .photo-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .photo-card img {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .photo-card p {
      padding: 1rem;
      text-align: center;
    }

    a {
      text-decoration: none;
      color: inherit;
    }
  `;let Kt=me;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Sr={attribute:!0,type:String,converter:Et,reflect:!1,hasChanged:le},xr=(r=Sr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),s==="setter"&&((r=Object.create(r)).wrapped=!0),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.C(o,void 0,r,l),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function de(r){return(t,e)=>typeof e=="object"?xr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}var Pr=Object.defineProperty,Cr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Pr(t,e,i),i};const ge=class ge extends S{render(){const t={1:{src:"/images/DSC_0213-2.jpg",caption:"Caption 1",date:"Sept 2025"},2:{src:"/images/DSC_0352.jpg",caption:"Caption 2",date:"Sept 2025"},3:{src:"/images/DSC_0353.jpg",caption:"Caption 3",date:"Sept 2025"}},e=this.photoId?t[this.photoId]:null;return e?b`
      <main>
        <nav>
          <a href="/app/gallery">← Back to Gallery</a>
        </nav>
        
        <h1>${e.caption}</h1>
        <img src="${e.src}" alt="${e.caption}">
        
        <dl>
          <dt>Date:</dt>
          <dd>${e.date}</dd>
          
          <dt>Location:</dt>
          <dd>San Luis Obispo, CA</dd>
        </dl>
      </main>
    `:b`<p>Photo not found</p>`}};ge.styles=k`
    :host {
      display: block;
      padding: 2rem;
    }

    nav {
      margin-bottom: 1rem;
    }

    nav a {
      color: #007bff;
      text-decoration: none;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 2rem 0;
    }

    dl {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    dt {
      font-weight: bold;
    }
  `;let St=ge;Cr([de({attribute:"photo-id"})],St.prototype,"photoId");const ye=class ye extends S{render(){return b`
      <main>
        <h2>Photography Services</h2>
        
        <div class="services-grid">
          <div class="service-card">
            <h3>Portrait Photography</h3>
            <p class="price">$200/session</p>
            <ul>
              <li>1-2 hour session</li>
              <li>20+ edited photos</li>
              <li>Digital download</li>
            </ul>
          </div>

          <div class="service-card">
            <h3>Nature & Landscape</h3>
            <p class="price">$150/session</p>
            <ul>
              <li>Location of choice</li>
              <li>15+ edited photos</li>
              <li>Digital download</li>
            </ul>
          </div>

          <div class="service-card">
            <h3>Event Photography</h3>
            <p class="price">$400/event</p>
            <ul>
              <li>Up to 4 hours</li>
              <li>50+ edited photos</li>
              <li>Digital download</li>
            </ul>
          </div>
        </div>

        <div class="cta-section">
          <p>Ready to book a session?</p>
          <a href="/app/booking" class="cta-button">Book Now</a>
        </div>
      </main>
    `}};ye.styles=k`
    :host {
      display: block;
      padding: 2rem;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .service-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
    }

    .service-card h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .price {
      font-size: 1.8rem;
      font-weight: bold;
      color: #007bff;
      margin: 1rem 0;
    }

    ul {
      list-style: none;
      padding: 0;
      text-align: left;
    }

    li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }

    .cta-section {
      text-align: center;
      margin-top: 3rem;
    }

    .cta-button {
      display: inline-block;
      padding: 0.75rem 2rem;
      background-color: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 1rem;
    }

    .cta-button:hover {
      background-color: #0056b3;
    }
  `;let Jt=ye;const ve=class ve extends S{render(){return b`
      <main>
        <h2>Book a Photography Session</h2>
        
        <form>
          <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
          </div>

          <div class="form-group">
            <label for="phone">Phone:</label>
            <input type="tel" id="phone" name="phone">
          </div>

          <div class="form-group">
            <label for="service">Service Type:</label>
            <select id="service" name="service" required>
              <option value="">Select a service...</option>
              <option value="portrait">Portrait Photography</option>
              <option value="nature">Nature & Landscape</option>
              <option value="event">Event Photography</option>
            </select>
          </div>

          <div class="form-group">
            <label for="date">Preferred Date:</label>
            <input type="date" id="date" name="date">
          </div>

          <div class="form-group">
            <label for="message">Additional Details:</label>
            <textarea id="message" name="message" rows="4"></textarea>
          </div>

          <button type="submit" class="submit-button">Submit Booking Request</button>
        </form>
      </main>
    `}};ve.styles=k`
    :host {
      display: block;
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    input, select, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    textarea {
      resize: vertical;
    }

    .submit-button {
      width: 100%;
      padding: 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1.1rem;
      cursor: pointer;
    }

    .submit-button:hover {
      background-color: #0056b3;
    }
  `;let Gt=ve;var kr=Object.defineProperty,Or=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&kr(t,e,i),i};const _e=class _e extends S{render(){return b`
      <main>
        <nav>
          <a href="/app/gallery">← Back to Gallery</a>
        </nav>
        
        <h1>Photography Session #${this.shootId}</h1>
        
        <dl>
          <dt>Date:</dt>
          <dd>September 15, 2025</dd>
          
          <dt>Time:</dt>
          <dd>5:00 PM - 7:00 PM</dd>
          
          <dt>Location:</dt>
          <dd>San Luis Obispo, CA</dd>
          
          <dt>Service Type:</dt>
          <dd>Portrait Photography</dd>
          
          <dt>Status:</dt>
          <dd>Completed</dd>
        </dl>
      </main>
    `}};_e.styles=k`
    :host {
      display: block;
      padding: 2rem;
    }

    nav a {
      color: #007bff;
      text-decoration: none;
    }

    h1 {
      margin: 1rem 0 2rem;
    }

    dl {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 1rem;
    }

    dt {
      font-weight: bold;
    }
  `;let xt=_e;Or([de({attribute:"shoot-id"})],xt.prototype,"shootId");var Tr=Object.defineProperty,Rr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Tr(t,e,i),i};const $e=class $e extends S{render(){return b`
      <main>
        <nav>
          <a href="/app">← Back to Home</a>
        </nav>
        
        <h1>Client Profile</h1>
        
        <dl>
          <dt>Client ID:</dt>
          <dd>${this.clientId}</dd>
          
          <dt>Name:</dt>
          <dd>Sample Client</dd>
          
          <dt>Email:</dt>
          <dd>client@example.com</dd>
          
          <dt>Past Sessions:</dt>
          <dd>2</dd>
        </dl>
      </main>
    `}};$e.styles=k`
    :host {
      display: block;
      padding: 2rem;
    }

    nav a {
      color: #007bff;
      text-decoration: none;
    }

    h1 {
      margin: 1rem 0 2rem;
    }

    dl {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 1rem;
    }

    dt {
      font-weight: bold;
    }
  `;let Pt=$e;Rr([de({attribute:"client-id"})],Pt.prototype,"clientId");const Nr=[{path:"/app/photo/:id",view:r=>b`
      <photo-view photo-id=${r.id}></photo-view>
    `},{path:"/app/gallery",view:()=>b`
      <gallery-view></gallery-view>
    `},{path:"/app/shoot/:id",view:r=>b`
      <shoot-view shoot-id=${r.id}></shoot-view>
    `},{path:"/app/service",view:()=>b`
      <service-view></service-view>
    `},{path:"/app/booking",view:()=>b`
      <booking-view></booking-view>
    `},{path:"/app/client/:id",view:r=>b`
      <client-view client-id=${r.id}></client-view>
    `},{path:"/app",view:()=>b`
      <home-view></home-view>
    `},{path:"/",redirect:"/app"}];Qi({"mu-auth":Qs.Provider,"mu-history":ni.Provider,"photography-header":Wt,"home-view":Yt,"gallery-view":Kt,"photo-view":St,"service-view":Jt,"booking-view":Gt,"shoot-view":xt,"client-view":Pt,"mu-switch":class extends Gi.Element{constructor(){super(Nr,"photography:history","photography:auth")}}});
