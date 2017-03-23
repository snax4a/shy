/**
 * Announcement model events
 */

'use strict';

import { EventEmitter } from 'events';
let Announcement = require('../../sqldb').Announcement;
let AnnouncementEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AnnouncementEvents.setMaxListeners(0);

// Model events
let events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
for(let e in events) {
  let event = events[e];
  Announcement.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return (doc, options, done) => {
    AnnouncementEvents.emit(`${event}:${doc._id}`, doc);
    AnnouncementEvents.emit(event, doc);
    done(null);
  };
}

export default AnnouncementEvents;
