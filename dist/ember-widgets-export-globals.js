(function(){;
define('ember', ['exports'], function(__exports__) {
  __exports__['default'] = window.Ember;
});

window.Ember.Widgets = Ember.Namespace.create();
window.Ember.Widgets.ModalComponent = require('ember-widgets/components/modal-box')['default'];
window.Ember.Widgets.TypeaheadComponent = require('ember-widgets/components/typeahead-input')['default'];})();