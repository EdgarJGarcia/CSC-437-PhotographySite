import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class ShootViewElement extends LitElement {
  @property({ attribute: "shoot-id" })
  shootId?: string;

  render() {
    return html`
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
    `;
  }

  static styles = css`
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
  `;
}
