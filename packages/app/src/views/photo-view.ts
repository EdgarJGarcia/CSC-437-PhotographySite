import { View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import { Photo } from "../model";
import { Msg } from "../messages";
import { Model } from "../model";

export class PhotoViewElement extends View<Model, Msg> {
  @property({ attribute: "photo-id" })
  photoId?: string;

  @state()
  get photo(): Photo | undefined {
    return this.model.photo;
  }

  constructor() {
    super("photography:model");
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "photo-id" &&
      oldValue !== newValue &&
      newValue
    ) {
      this.dispatchMessage([
        "photo/request",
        { photoId: newValue }
      ]);
    }
  }

  render() {
    const photo = this.photo;

    if (!photo) {
      return html`<p>Loading photo...</p>`;
    }

    return html`
      <main>
        <nav>
          <a href="/app/gallery">← Back to Gallery</a>
        </nav>
        
        <h1>${photo.alt}</h1>
        <img src="${photo.src}" alt="${photo.alt}">
        
        <dl>
          <dt>Photo ID:</dt>
          <dd>${this.photoId}</dd>
          
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
