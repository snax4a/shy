/**
 * Subscriber model events
 */

'use strict';

import { EventEmitter } from 'events';
let Subscriber = require('../../sqldb').Subscriber;
let SubscriberEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SubscriberEvents.setMaxListeners(0);

// Model events
let events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
for(let e in events) {
  let event = events[e];
  Subscriber.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return (doc, options, done) => {
    SubscriberEvents.emit(`${event}:${doc._id}`, doc);
    SubscriberEvents.emit(event, doc);
    done(null);
  };
}

export default SubscriberEvents;
