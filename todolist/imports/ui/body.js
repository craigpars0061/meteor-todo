import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js';

import './task.js';
import './bottom.js';
import './body.html';

//Then we need to set up a new ReactiveDict and attach it to the body template instance
// (as this is where we'll store the checkbox's state) when it is first created:
// Seems to be like a template contstructor.
// Or like the $(document).read()
Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});

Template.body.helpers({
    tasks() {
      const instance = Template.instance();
      if (instance.state.get('hideCompleted')) {
        // If hide completed is checked, filter tasks
        return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
      }
      // Otherwise, return all of the tasks
      return Tasks.find({}, { sort: { createdAt: -1 } });
    },
    // Otherwise, return all of the tasks
    incompleteCount() {
        return Tasks.find({ checked: { $ne: true } }).count();
    },
});

Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Tasks.insert({
      text,
      // Current time
      createdAt: new Date(),
    });

    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance) {
     // Then, we need an event handler to update the ReactiveDict variable when
     // the checkbox is checked or unchecked. An event handler takes two arguments,
     // the second of which is the same template instance which was this in the
     // onCreated callback:
     instance.state.set('hideCompleted', event.target.checked);
   },
});
