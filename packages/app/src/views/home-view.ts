import { css, html, LitElement } from "lit";

export class HomeViewElement extends LitElement {
  render() {
    return html`
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
    `;
  }

  static styles = css`
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
  `;
}
