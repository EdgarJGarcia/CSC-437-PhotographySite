import { css, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class PhotoViewElement extends LitElement {
  @property({ attribute: "photo-id" })
  photoId?: string;

  render() {
    const photos: Record<string, any> = {
      "1": { src: "/images/DSC_0213-2.jpg", caption: "Caption 1", date: "Sept 2025" },
      "2": { src: "/images/DSC_0352.jpg", caption: "Caption 2", date: "Sept 2025" },
      "3": { src: "/images/DSC_0353.jpg", caption: "Caption 3", date: "Sept 2025" }
    };

    const photo = this.photoId ? photos[this.photoId] : null;

    if (!photo) {
      return html`<p>Photo not found</p>`;
    }

    return html`
      <main>
        <nav>
          <a href="/app/gallery">← Back to Gallery</a>
        </nav>
        
        <h1>${photo.caption}</h1>
        <img src="${photo.src}" alt="${photo.caption}">
        
        <dl>
          <dt>Date:</dt>
          <dd>${photo.date}</dd>
          
          <dt>Location:</dt>
          <dd>San Luis Obispo, CA</dd>
        </dl>
      </main>
    `;
  }

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
    }

    nav {
      margin-bottom: 1rem;
    }

    nav a {
      color: #007bff;
      text-decoration: none;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 2rem 0;
    }

    dl {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    dt {
      font-weight: bold;
    }
  `;
}
