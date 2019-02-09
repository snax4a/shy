import angular from 'angular';
import routes from './workshops.routes';
import ngRoute from 'angular-route';
import UibAlertDirective from 'angular-ui-bootstrap/src/alert';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';
import TweetComponent from '../../components/tweet/tweet.component';
import JsonLdComponent from '../../components/jsonld/jsonld.component';
import UpcomingFilter from '../../filters/upcoming/upcoming.filter';
import { WorkshopsComponent } from './workshops.component';
import { WorkshopsService } from '../../services/workshops.service';
import { NewsletterService } from '../../services/newsletter.service';

export default angular.module('shyApp.workshops', [ngRoute, UibAlertDirective, HtmlIdFilter, TweetComponent, JsonLdComponent, UpcomingFilter])
  .config(routes)
  .service('WorkshopsService', WorkshopsService)
  .service('NewsletterService', NewsletterService)
  .component('workshops', {
    template: require('./workshops.pug'),
    controller: WorkshopsComponent
  })
  .name;
