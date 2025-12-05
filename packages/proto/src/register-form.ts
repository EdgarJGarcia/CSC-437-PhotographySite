import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

interface RegisterFormData {
  username?: string;
  password?: string;
}

export class RegisterFormElement extends LitElement {
  @state()
  formData: RegisterFormData = {};

  @property()
  api?: string;

  @property()
  redirect: string = "/";

  @state()
  error?: string;

  get canSubmit(): boolean {
    return Boolean(
      this.api && this.formData.username && this.formData.password
    );
  }

  override render() {
    return html`
      <form
        @change=${(e: InputEvent) => this.handleChange(e)}
        @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">
            Register
          </button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
  }

  static styles = [
    reset.styles,
    css`
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
    `
  ];

  handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const name = target?.name;
    const value = target?.value;
    const prevData = this.formData;

    switch (name) {
      case "username":
        this.formData = { ...prevData, username: value };
        break;
      case "password":
        this.formData = { ...prevData, password: value };
        break;
    }
  }

  handleSubmit(submitEvent: SubmitEvent) {
    submitEvent.preventDefault();

    if (this.canSubmit) {
      fetch(this?.api || "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.formData)
      })
        .then((res) => {
          if (res.status !== 201) throw new Error("Registration failed");
          else return res.json();
        })
        .then((json: object) => {
          const { token } = json as { token: string };
          const customEvent = new CustomEvent("auth:message", {
            bubbles: true,
            composed: true,
            detail: ["auth/signin", { token, redirect: this.redirect }]
          });
          console.log("dispatching message", customEvent);
          this.dispatchEvent(customEvent);
        })
        .catch((error: Error) => {
          console.log(error);
          this.error = error.toString();
        });
    }
  }
}
