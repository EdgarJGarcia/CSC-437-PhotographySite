import { css, html, LitElement } from "lit";

export class BookingViewElement extends LitElement {
  render() {
    return html`
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
    `;
  }

  static styles = css`
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
  `;
}
