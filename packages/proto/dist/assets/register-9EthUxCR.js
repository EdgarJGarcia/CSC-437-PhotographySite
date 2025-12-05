import{i as p,x as h,r as m,a as b,b as l,n as u,d as f,c as g}from"./reset.css-BOYtISyV.js";var v=Object.defineProperty,i=(d,r,t,s)=>{for(var e=void 0,a=d.length-1,c;a>=0;a--)(c=d[a])&&(e=c(r,t,e)||e);return e&&v(r,t,e),e};const n=class n extends p{constructor(){super(...arguments),this.formData={},this.redirect="/"}get canSubmit(){return!!(this.api&&this.formData.username&&this.formData.password)}render(){return h`
      <form
        @change=${r=>this.handleChange(r)}
        @submit=${r=>this.handleSubmit(r)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">
            Register
          </button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `}handleChange(r){const t=r.target,s=t?.name,e=t?.value,a=this.formData;switch(s){case"username":this.formData={...a,username:e};break;case"password":this.formData={...a,password:e};break}}handleSubmit(r){r.preventDefault(),this.canSubmit&&fetch(this?.api||"",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.formData)}).then(t=>{if(t.status!==201)throw new Error("Registration failed");return t.json()}).then(t=>{const{token:s}=t,e=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:s,redirect:this.redirect}]});console.log("dispatching message",e),this.dispatchEvent(e)}).catch(t=>{console.log(t),this.error=t.toString()})}};n.styles=[m.styles,b`
      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      
      input {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      
      button {
        padding: 0.75rem;
        background-color: var(--color-accent);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .error:not(:empty) {
        color: red;
        border: 1px solid red;
        padding: 0.5rem;
        border-radius: 4px;
      }
    `];let o=n;i([l()],o.prototype,"formData");i([u()],o.prototype,"api");i([u()],o.prototype,"redirect");i([l()],o.prototype,"error");f({"mu-auth":g.Provider,"register-form":o});
