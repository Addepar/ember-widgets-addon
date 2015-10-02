import Ember from 'ember';
import layout from '../templates/components/multi-select-item';

export default Ember.Component.extend({
  layout: layout,
  processDropDownShown: function() {
    this._super();
    return this.get('controller').focusTextField();
  }
});
