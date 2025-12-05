import { css, html, LitElement } from "lit";

export class GalleryViewElement extends LitElement {
  render() {
    return html`
      <main>
        <h2>Portfolio Gallery</h2>
        <p>Browse my photography work</p>
        
        <div class="gallery-grid">
          <div class="photo-card">
            <a href="/app/photo/1">
              <img src="/images/DSC_0213-2.jpg" alt="Photo 1">
              <p>Caption 1</p>
            </a>
          </div>
          
          <div class="photo-card">
            <a href="/app/photo/2">
              <img src="/images/DSC_0352.jpg" alt="Photo 2">
              <p>Caption 2</p>
            </a>
          </div>
          
          <div class="photo-card">
            <a href="/app/photo/3">
              <img src="/images/DSC_0353.jpg" alt="Photo 3">
              <p>Caption 3</p>
            </a>
          </div>
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
      margin-bottom: 1rem;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
      margin-top: 2rem;
    }

    .photo-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s;
    }

    .photo-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .photo-card img {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }

    .photo-card p {
      padding: 1rem;
      text-align: center;
    }

    a {
      text-decoration: none;
      color: inherit;
    }
  `;
}
