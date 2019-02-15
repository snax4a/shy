import angular from 'angular';
import routes from './workshops.routes';
import ngRoute from 'angular-route';
import UibAlertDirective from 'angular-ui-bootstrap/src/alert';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';
import TweetComponent from '../../components/tweet/tweet.component';
import JsonLdComponent from '../../components/jsonld/jsonld.component';
import { WorkshopsComponent } from './workshops.component';
import { WorkshopService } from '../../services/workshop.service';
import { NewsletterService } from '../../services/newsletter.service';

export default angular.module('shyApp.workshops', [ngRoute, UibAlertDirective, HtmlIdFilter, TweetComponent, JsonLdComponent])
  .config(routes)
  .service('WorkshopService', WorkshopService)
  .service('NewsletterService', NewsletterService)
  .component('workshops', {
    template: require('./workshops.pug'),
    controller: WorkshopsComponent
  })
  .name;
