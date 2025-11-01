import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "./styles/reset.css.ts";

export class PhotoCardElement extends LitElement {
  @property()
  src?: string;

  @property()
  alt?: string;

  @property()
  href?: string;

  override render() {
    return html`
      <a href="${this.href}">
        <img src="${this.src}" alt="${this.alt}" />
      </a>
    `;
  }

  static styles = [
    reset.styles,
    css`
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
    `
  ];
}
