(function(){;
define('ember', ['exports'], function(__exports__) {
  __exports__['default'] = window.Ember;
});

window.Ember.Widgets = Ember.Namespace.create();
window.Ember.Widgets.AccordionComponent = require('ember-widgets/components/accordion-group')['default'];
window.Ember.Widgets.BodyEventListener = require('ember-widgets/mixins/body-event-listener')['default'];
window.Ember.Widgets.StyleBindingsMixin = require('ember-widgets/mixins/style-bindings')['default'];
window.Ember.Widgets.CarouselComponent = require('ember-widgets/components/carousel-group')['default'];
window.Ember.Widgets.ColorPickerComponent = require('ember-widgets/components/color-picker')['default'];
window.Ember.Widgets.ModalComponent = require('ember-widgets/components/modal-box')['default'];
window.Ember.Widgets.MultiSelectComponent = require('ember-widgets/components/multi-select')['default'];
window.Ember.Widgets.MultiSelectOptionView = require('ember-widgets/components/multi-select-option')['default'];
window.Ember.Widgets.PopoverComponent = require('ember-widgets/components/popover-box')['default'];
window.Ember.Widgets.PopoverLinkComponent = require('ember-widgets/components/popover-link')['default'];
window.Ember.Widgets.SelectComponent = require('ember-widgets/components/select-group')['default'];
window.Ember.Widgets.SelectOptionView = require('ember-widgets/components/select-option')['default'];
window.Ember.Widgets.SelectTooltipOptionView = require('ember-widgets/components/select-tooltip-option')['default'];
window.Ember.Widgets.TypeaheadComponent = require('ember-widgets/components/typeahead-input')['default'];})();