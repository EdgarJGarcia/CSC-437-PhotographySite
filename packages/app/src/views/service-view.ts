import { css, html, LitElement } from "lit";

export class ServiceViewElement extends LitElement {
  render() {
    return html`
      <main>
        <h2>Photography Services</h2>
        
        <div class="services-grid">
          <div class="service-card">
            <h3>Portrait Photography</h3>
            <p class="price">$250/session</p>
            <ul>
              <li>1-2 hour session</li>
              <li>40+ edited photos</li>
              <li>Digital download</li>
            </ul>
          </div>

          <div class="service-card">
            <h3>Nature & Landscape</h3>
            <p class="price">$150/session</p>
            <ul>
              <li>Location of choice</li>
              <li>20+ edited photos</li>
              <li>Digital download</li>
            </ul>
          </div>

          <div class="service-card">
            <h3>Event Photography</h3>
            <p class="price">$400/event</p>
            <ul>
              <li>Up to 4 hours</li>
              <li>60+ edited photos</li>
              <li>Digital download</li>
            </ul>
          </div>
        </div>

        <div class="cta-section">
          <p>Ready to book a session?</p>
          <a href="/app/booking" class="cta-button">Book Now</a>
        </div>
      </main>
    `;
  }

  static styles = css`
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
  `;
}
