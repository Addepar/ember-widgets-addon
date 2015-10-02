import Ember from 'ember';
import layout from '../../templates/components/accordion-group';

export default Ember.Component.extend({
  layout: layout,
  classNames: 'panel-gorup',
  activeIndex: 0
});
