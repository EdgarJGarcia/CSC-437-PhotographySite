import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { state } from "lit/decorators.js";
import { Photo } from "../model";
import { Msg } from "../messages";
import { Model } from "../model";

export class GalleryViewElement extends View<Model, Msg> {
  @state()
  get gallery(): Photo[] | undefined {
    return this.model.gallery;
  }

  @state()
  selectedPhoto: Photo | null = null;

  constructor() {
    super("photography:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["gallery/request", {}]);
  }

  openLightbox(photo: Photo) {
    this.selectedPhoto = photo;
  }

  closeLightbox() {
    this.selectedPhoto = null;
  }

  render() {
    const photos = this.gallery || [];
    
    return html`
      <main>
        <h2>Portfolio Gallery</h2>
        <p>Browse my photography work</p>
        
        ${photos.length === 0 
          ? html`<p>Loading gallery...</p>`
          : html`
            <div class="gallery-grid">
              ${photos.map((photo) => html`
                <div class="photo-card" @click=${() => this.openLightbox(photo)}>
                  <img src="${photo.src}" alt="${photo.alt}">
                </div>
              `)}
            </div>
          `
        }

        ${this.selectedPhoto ? html`
          <div class="lightbox" @click=${() => this.closeLightbox()}>
            <div class="lightbox-content">
              <span class="close">&times;</span>
              <img src="${this.selectedPhoto.src}" alt="${this.selectedPhoto.alt}">
            </div>
          </div>
        ` : ''}
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
      margin-bottom: 0.5rem;
      text-align: center;
    }

    p {
      text-align: center;
      margin-bottom: 2rem;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .photo-card {
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.2s;
      cursor: pointer;
    }

    .photo-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .photo-card img {
      width: 100%;
      height: auto;
      object-fit: contain;
      display: block;
      background-color: #f5f5f5;
    }

    /* Lightbox styles */
    .lightbox {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      cursor: pointer;
    }

    .lightbox-content {
      position: relative;
      max-width: 90%;
      max-height: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lightbox-content img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 4px;
    }

    .close {
      position: absolute;
      top: -40px;
      right: 0;
      color: white;
      font-size: 40px;
      font-weight: bold;
      cursor: pointer;
      transition: color 0.2s;
    }

    .close:hover {
      color: #ccc;
    }

    @media (max-width: 1200px) {
      .gallery-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 768px) {
      .gallery-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;
}
