/**
 * Order model events
 */

'use strict';

import { EventEmitter } from 'events';
let Order = require('../../sqldb').Order;
let OrderEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OrderEvents.setMaxListeners(0);

// Model events
let events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
for(let e in events) {
  let event = events[e];
  Order.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return (doc, options, done) => {
    OrderEvents.emit(`${event}:${doc._id}`, doc);
    OrderEvents.emit(event, doc);
    done(null);
  };
}

export default OrderEvents;
