import{i as y,x as u,r as f,a as g,n as d,O as v,b,d as $,c as _,e as x}from"./reset.css-BOYtISyV.js";var O=Object.defineProperty,c=(r,e,t,o)=>{for(var s=void 0,n=r.length-1,a;n>=0;n--)(a=r[n])&&(s=a(e,t,s)||s);return s&&O(e,t,s),s};const l=class l extends y{render(){return u`
      <a href="${this.href}">
        <img src="${this.src}" alt="${this.alt}" />
      </a>
    `}};l.styles=[f.styles,g`
      :host {
        display: block;
      }
      
      img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
      }
      
      a {
        text-decoration: none;
      }
    `];let i=l;c([d()],i.prototype,"src");c([d()],i.prototype,"alt");c([d()],i.prototype,"href");var k=Object.defineProperty,m=(r,e,t,o)=>{for(var s=void 0,n=r.length-1,a;n>=0;n--)(a=r[n])&&(s=a(e,t,s)||s);return s&&k(e,t,s),s};const p=class p extends y{constructor(){super(...arguments),this.photos=[],this._authObserver=new v(this,"photo:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(e=>{this._user=e.user,this.src&&this.hydrate(this.src)})}get authorization(){return this._user?.authenticated&&{Authorization:`Bearer ${this._user.token}`}}hydrate(e){fetch(e,{headers:this.authorization||{}}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to load photos: ${t.status}`)}).then(t=>{t&&(this.photos=t)}).catch(t=>{console.error("Error loading photos:",t),this.photos=[]})}render(){const{photos:e}=this;function t(o){return u`
        <photo-card 
          src="${o.src}" 
          alt="${o.alt}"
          href="${o.href}">
        </photo-card>
      `}return u`
      <ul class="photo-grid">
        ${e.map(t)}
      </ul>
    `}};p.styles=[f.styles,g`
      .photo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        list-style: none;
        padding: 0;
      }
    `];let h=p;m([d()],h.prototype,"src");m([b()],h.prototype,"photos");$({"mu-auth":_.Provider,"photo-card":i,"photo-gallery":h});const B=new v(document.body,"photo:auth");B.observe(r=>{const e=document.getElementById("userid"),t=document.getElementById("signout"),o=document.getElementById("signin");r.user&&r.user.authenticated?(e.textContent=`Hello, ${r.user.username}`,t.style.display="inline",o.style.display="none"):(e.textContent="",t.style.display="none",o.style.display="inline")});document.getElementById("signout").addEventListener("click",r=>{x.relay(r,"auth:message",["auth/signout"])});
