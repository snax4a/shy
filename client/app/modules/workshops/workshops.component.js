export class WorkshopsComponent {
  /*@ngInject*/
  constructor($timeout, $window, $anchorScroll, toast, WorkshopService, NewsletterService) {
    this.$timeout = $timeout;
    this.$window = $window;
    this.$anchorScroll = $anchorScroll;
    this.toast = toast;
    this.workshopService = WorkshopService;
    this.newsletterService = NewsletterService;
  }

  $onInit() {
    this.subscriber = {};
    this.workshops = [];
    this.workshopsGet();
    this.$timeout(this.$anchorScroll, 100);
  }

  async workshopsGet() {
    this.workshops = await this.workshopService.workshopsGet();
    this.twitterLoad();
  }

  twitterLoadScript(d, s, id) {
    let js;
    let fjs = d.getElementsByTagName(s)[0];
    let t = window.twttr || {};
    if(d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = '//platform.twitter.com/widgets.js';
    fjs.parentNode.insertBefore(js, fjs);
    t._e = [];
    t.ready = f => {
      t._e.push(f);
    };
    return t;
  }

  twitterLoad() {
    if(window.twttr === undefined) {
      this.$timeout(() => this.twitterLoadScript(document, 'script', 'twitter-wjs'));
    } else {
      this.$timeout(() => window.twttr.widgets.load());
    }
  }

  condenseName(name) {
    return name.replace(/[\W_]+/g, '')
      .toLowerCase()
      .substr(0, 20);
  }

  getEvent(workshop, section) {
    const now = new Date();

    return {
      '@context': 'http://schema.org/',
      '@type': 'Event',
      name: workshop.title,
      disambiguatingDescription: section.title,
      location: {
        '@type': 'Place',
        name: `Schoolhouse Yoga, ${section.location} Studio`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: section.streetAddress,
          addressLocality: section.addressLocality,
          postalCode: section.postalCode,
          addressRegion: section.addressRegion,
          addressCountry: section.addressCountry
        }
      },
      image: `https://www.schoolhouseyoga.com/api/file/${workshop.imageId}`,
      description: workshop.description,
      url: `https://www.schoolhouseyoga.com/workshops#${this.condenseName(workshop.title)}`,
      startDate: section.starts,
      endDate: section.ends,
      offers: {
        '@type': 'Offer',
        name: workshop.title,
        price: `${section.price}.00`,
        priceCurrency: 'USD',
        validFrom: now.toISOString(),
        priceValidUntil: section.ends,
        availability: 'http://schema.org/InStock',
        url: `https://www.schoolhouseyoga.com/workshops#${this.condenseName(workshop.title)}`
      }
    };
  }

  setFocus(fieldID) {
    let fieldToGetFocus = this.$window.document.getElementById(fieldID);
    this.$timeout(() => {
      fieldToGetFocus.focus();
    }, 50);
  }

  async subscribe(form) {
    if(form.$valid) {
      try {
        const message = await this.newsletterService.subscribe(this.subscriber);
        this.$timeout(() => { // using async/await runs outside of digest cycle
          this.toast({
            duration: 5000,
            message,
            className: 'alert-success'
          });
        });
      } catch(err) {
        this.toast({
          duration: 5000,
          message: err.data,
          className: 'alert-danger'
        });
      }
    } else this.setFocus('email');
  }
}
