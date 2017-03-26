/**
 * User model events
 */

'use strict';

import { EventEmitter } from 'events';
import { Schedule } from '../../sqldb';
var ScheduleEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ScheduleEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Schedule.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return (doc, options, done) => {
    ScheduleEvents.emit(`${event}:${doc._id}`, doc);
    ScheduleEvents.emit(event, doc);
    done(null);
  };
}

export default ScheduleEvents;
