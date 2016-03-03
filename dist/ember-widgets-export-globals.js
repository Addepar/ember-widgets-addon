(function(){;
define('ember', ['exports'], function(__exports__) {
  __exports__['default'] = window.Ember;
});

window.Ember.Widgets = Ember.Namespace.create();
window.Ember.Widgets.CarouselComponent = require('ember-widgets/components/carousel-group')['default'];
window.Ember.Widgets.ModalComponent = require('ember-widgets/components/modal-box')['default'];
window.Ember.Widgets.MultiSelectComponent = require('ember-widgets/components/multi-select')['default'];
window.Ember.Widgets.PopoverComponent = require('ember-widgets/components/popover-box')['default'];
window.Ember.Widgets.TypeaheadComponent = require('ember-widgets/components/typeahead-input')['default'];})();