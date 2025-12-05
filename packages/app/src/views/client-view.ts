import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class ClientViewElement extends LitElement {
  @property({ attribute: "client-id" })
  clientId?: string;

  render() {
    return html`
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
