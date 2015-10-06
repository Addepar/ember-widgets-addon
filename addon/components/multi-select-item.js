import SelectOption from 'select-option';
import layout from '../templates/components/multi-select-item';

export default SelectOption.extend({
  layout: layout,
  processDropDownShown: function() {
    this._super();
    return this.get('controller').focusTextField();
  }
});
