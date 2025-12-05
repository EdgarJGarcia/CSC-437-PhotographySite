import { css, html, LitElement } from "lit";

export class HeaderElement extends LitElement {
  render() {
    return html`
      <header>
        <h1>Photography Portfolio</h1>
        <nav>
          <a href="/app">Home</a>
          <a href="/app/gallery">Gallery</a>
          <a href="/app/service">Services</a>
          <a href="/app/booking">Book a Shoot</a>
        </nav>
      </header>
    `;
  }

  static styles = css`
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
  `;
}
