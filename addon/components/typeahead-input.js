import Ember from 'ember';
import layout from '../templates/components/typeahead-input';

export default SelectComponent.extend({
  layout: layout,
  layoutName: 'typeahead'
  searchFieldClass: 'form-control'
  disabled: no

  searchView: Ember.TextField.extend
    class: 'ember-select-input'
    valueBinding: 'parentView.query'
    focusIn: (event) -> @set 'parentView.showDropdown', yes

  userDidSelect: (selection) ->
    @_super(selection)
    @set 'query', @get 'selection'
});
