import SelectTooltipOption from 'select-tooltip-option';
import layout from '../templates/components/multi-select-tooltip-item';

export default SelectTooltipOption.extend({
  layout: layout,
  processDropDownShown: function() {
    this._super();
    return this.get('controller').focusTextField();
  }
});
