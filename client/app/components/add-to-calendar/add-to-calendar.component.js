import angular from 'angular';
import moment from 'moment';

export class AddToCalendarComponent {
  constructor($window) {
    'ngInject';
    this.$window = $window;
  }

  $onInit() {
    this.edge = this.$window.navigator.userAgent.indexOf('Edge') > -1;
    this.isOpen = false;
    const starts = this.iCalUTC(this.starts);
    const ends = this.iCalUTC(this.ends);
    const iCal = encodeURIComponent(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Schoolhouse Yoga, Inc.//Website//EN
BEGIN:VEVENT
UID:${this.getUid()}
DTSTAMP:${this.iCalUTCnow()}
DTSTART:${starts}
DTEND:${ends}${this.weekly ? '\nRRULE:FREQ=WEEKLY;WKST=SU' : ''}
SUMMARY:${this.iCalText(this.title, 250)}
LOCATION:${this.iCalText(this.location, 250)}
DESCRIPTION:${this.iCalText(this.description, 1024)}
BEGIN:VALARM
TRIGGER:-P120M
ACTION:AUDIO
ATTACH;VALUE=URI:Chord
END:VALARM
END:VEVENT
END:VCALENDAR`);
    this.icsFile = `data:text/calendar;charset=utf-8,${iCal}`;
    this.google = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(this.title)}&dates=${starts}/${ends}&details=${encodeURIComponent(this.description)}&location=${encodeURIComponent(this.location)}${this.weekly ? '&recur=RRULE:FREQ=WEEKLY' : ''}`;
  }

  getUid() {
    return Math.random().toString(36)
      .substr(2);
  }

  iCalUTCnow() {
    return moment().format('YYYYMMDDTHHmmss');
  }

  iCalUTC(isoDate) {
    return moment(isoDate, moment.ISO_8601).format('YYYYMMDDTHHmmss');
  }

  iCalText(str, maxLength) {
    if(!str) {
      return '';
    }
    str = str.replace(/\n/g, '\\n'); // escape line breaks
    str = str.substring(0, maxLength || 250);
    return str;
  }

  iCalFileName(title) {
    if(!title) {
      return 'event.ics';
    }
    return `${title.replace(/[^\w ]+/g, '')}.ics`;
  }

  toggled(isOpen) {
    if(isOpen === null) {
      this.isOpen = !this.isOpen;
      return;
    }
    this.isOpen = isOpen;
  }
}

export default angular.module('shyApp.addtocalendar', [])
  .component('addtocalendar', {
    template: require('./add-to-calendar.pug'),
    controller: AddToCalendarComponent,
    bindings: {
      title: '<',
      description: '<',
      location: '<',
      starts: '<',
      ends: '<',
      weekly: '<',
      mini: '<'
    }
  })
  .name;
