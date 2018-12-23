'use strict';

export class WorkshopsComponent {
  /*@ngInject*/
  constructor($timeout, $window, WorkshopsService, NewsletterService) {
    this.$window = $window;
    this.WorkshopsService = WorkshopsService;
    this.$timeout = $timeout;
    this.NewsletterService = NewsletterService;
  }

  $onInit() {
    this.subscriber = {};
    this.workshops = this.WorkshopsService.workshops;
    this.twitterLoad();
    this.$timeout(this.$anchorScroll, 50);
  }

  twitterLoad() {
    if(window.twttr === undefined) {
      this.twitterLoadScript(document, 'script', 'twitter-wjs');
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
    return {
      '@context': 'http://schema.org/',
      '@type': 'Event',
      name: workshop.title,
      disambiguatingDescription: section.title,
      location: `Schoolhouse Yoga, ${section.location} Studio`,
      image: `https://www.schoolhouseyoga.com${workshop.photo}`,
      description: workshop.description,
      url: `https://www.schoolhouseyoga.com/workshops#${this.condenseName(workshop.title)}`,
      startDate: section.start,
      endDate: section.expires,
      offers: {
        '@type': 'Offer',
        price: `${section.cost}.00`,
        priceCurrency: 'USD',
        priceValidUntil: section.expires,
        availability: 'http://schema.org/InStock',
        url: `https://www.schoolhouseyoga.com/workshops#${this.condenseName(workshop.title)}`
      }
    };
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

  // close the alert by deleting the element in the array
  closeAlert(index) {
    this.alerts.splice(index, 1);
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
        const message = await this.NewsletterService.subscribe(this.subscriber);
        this.$timeout(() => { // using async/await runs outside of digest cycle
          this.alerts = [{
            type: 'alert-success',
            message
          }];
        });
      } catch(err) {
        this.alerts = [{
          type: 'alert-danger',
          message: err.data
        }];
      }
    } else this.setFocus('email');
  }
}
