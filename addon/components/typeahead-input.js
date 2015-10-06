import Ember from 'ember';
import SelectComponent from 'select-group';
import layout from '../templates/components/typeahead-input';

export default SelectComponent.extend({
  layout: layout,
  layoutName: 'typeahead',
  searchFieldClass: 'form-control',
  disabled: false,

  searchView: Ember.TextField.extend({
    class: 'ember-select-input',
    valueBinding: 'parentView.query',
    focusIn: () => this.set('parentView.showDropdown', true)
  }),

  userDidSelect: (selection) => {
    this._super(selection);
    this.set('query', this.get('selection'));
  }
});
