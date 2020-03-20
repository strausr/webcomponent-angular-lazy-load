class CloudinaryImage extends HTMLElement {
  private readonly shadow: ShadowRoot;
  private publicid;
  private cloud;
  private transformation;
  private width;
  private height;
  private loading;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open'});

    window.onload = (e) => {
      this.createImage();
    };


  }
  // webcomponent lifecycle runs each time the element is added to the DOM

  static get observedAttributes() {
    return ['cloud', 'publicid', 'width', 'height', 'loading'];
  }

  connectedCallback() {
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.cloud = this.getAttribute('cloud');
    this.publicid = this.getAttribute('publicid');
    this.width = this.getAttribute('width');
    this.height = this.getAttribute('height');
    this.transformation = `w_${this.width},h_${this.height}`;
    this.loading = this.getAttribute('loading');
  }

  createImage() {
    const img = document.createElement('img');
    const URL = `https://res.cloudinary.com/${this.cloud}/image/upload/${this.transformation}/${this.publicid}`;

    if (this.loading === 'lazy') {
      img.setAttribute('datasrc', URL);
      this.loadLazy(img);
    } else {
      img.setAttribute('src', URL);
    }
    this.shadow.appendChild(img);
  }

  loadImage(img) {
    img.setAttribute('src', img.getAttribute('datasrc'));
  }


  loadLazy(img) {
    const options = {
      rootMargin: `0px 0px -50% 0px`, // Margin around the root
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(img);
            observer.unobserve(entry.target);
          }
        }, options);
      });
    observer.observe(this);


  }

}

window.customElements.define('cld-image', CloudinaryImage);

