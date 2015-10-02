import Ember from 'ember';
import layout from '../templates/components/multi-select';

export default Ember.Component.extend({
  layout: layout,
  layoutName: 'multi-select',
  selections: void 0,
  choicesFieldClass: '',
  placeholder: void 0,
  persistentPlaceholder: void 0,
  resetQueryOnSelect: true,
  showTooltip: true,
  tooltipItemViewClass: 'Ember.Widgets.MultiSelectTooltipItemView',
  originalItemViewClass: 'Ember.Widgets.MultiSelectItemView',
  tabindex: -1,
  values: Ember.computed(function(key, value) {
    var selections, valuePath;
    if (arguments.length === 2) {
      if (!value) {
        return;
      }
      valuePath = this.get('optionValuePath');
      this.set('selections', Ember.A(this.get('content').filter(function(item) {
        return value.contains(Ember.get(item, valuePath));
      })));
      return value;
    } else {
      valuePath = this.get('optionValuePath');
      selections = this.get('selections');
      if (valuePath) {
        return selections.getEach(valuePath);
      } else {
        return selections;
      }
    }
  }).property('selections.[]'),
  selectionItemView: Ember.Widgets.MultiSelectOptionView,
  invisiblePlaceholderText: Ember.computed(function() {
    if (this.get('query')) {
      return this.get('query');
    }
    if (this.get('selections.length')) {
      return this.get('persistentPlaceholder');
    }
    return this.get('placeholder') || this.get('persistentPlaceholder');
  }).property('query', 'placeholder', 'persistentPlaceholder', 'selections.length'),
  searchView: Ember.TextField.extend({
    "class": 'ember-select-input',
    valueBinding: 'parentView.query',
    placeholder: Ember.computed(function() {
      if (this.get('parentView.selections.length')) {
        return this.get('parentView.persistentPlaceholder');
      }
      return this.get('parentView.placeholder') || this.get('parentView.persistentPlaceholder');
    }).property('parentView.placeholder', 'parentView.persistentPlaceholder', 'parentView.selections.length'),
    click: function(event) {
      return this.set('parentView.showDropdown', true);
    }
  }),
  preparedContent: Ember.computed(function() {
    var content, selections;
    content = this.get('content');
    selections = this.get('selections');
    if (!(content && selections)) {
      return Ember.A([]);
    }
    if (this.get('sortLabels')) {
      return this.get('sortedFilteredContent').filter(function(item) {
        return !selections.contains(item);
      });
    } else {
      return this.get('filteredContent').filter(function(item) {
        return !selections.contains(item);
      });
    }
  }).property('content.[]', 'filteredContent.[]', 'sortedFilteredContent.[]', 'selections.[]', 'sortLabels', 'filteredContent', 'sortedFilteredContent'),
  selectionDidChange: Ember.observer(function() {
    var selection, selections;
    selections = this.get('selections');
    selection = this.get('selection');
    if (this.get('resetQueryOnSelect')) {
      this.set('query', '');
    }
    this.set('selection', null);
    if (!Ember.isEmpty(selection) && !selections.contains(selection)) {
      return selections.pushObject(selection);
    }
  }, 'selection', 'selections.[]'),
  focusTextField: function() {
    var ref;
    return (ref = this.$('.ember-text-field')) != null ? ref.focus() : void 0;
  },
  didInsertElement: function() {
    this._super();
    if (!this.get('selections')) {
      this.set('selections', Ember.A([]));
    }
    if (!this.get('values')) {
      return this.set('values', Ember.A([]));
    }
  },
  deletePressed: function(event) {
    if (event.target.selectionStart === 0 && event.target.selectionEnd === 0) {
      this.removeSelectItem(this.get('selections.lastObject'));
      return event.preventDefault();
    }
  },
  removeSelectItem: function(item) {
    var dropdownIsShowing;
    dropdownIsShowing = this.get('showDropdown');
    this.focusTextField();
    if (!dropdownIsShowing) {
      this.send('hideDropdown');
    }
    return this.get('selections').removeObject(item);
  },
  escapePressed: function(event) {
    if (this.get('showDropdown')) {
      this.focusTextField();
      this.send('hideDropdown');
      return event.preventDefault();
    }
  },
  enterPressed: function(event) {
    this._super(event);
    return this.focusTextField();
  },
  actions: {
    removeSelectItem: function(item) {
      return this.removeSelectItem(item);
    }
  }
});
