import Ember from 'ember';

var isPresent, isNotPresent, isVisible, isFocused, isHidden;

isPresent = function(app, selector, context) {
  var $element;
  $element = find(app, selector, context);
  return $element.length > 0;
};

isNotPresent = function(app, selector, context) {
  return !isPresent(app, selector, context);
};

isVisible = function(app, selector, context) {
  var $element;
  $element = find(app, selector, context);
  return $element.is(':visible');
};

isFocused = function(app, selector, context) {
  var $element;
  $element = find(app, selector, context);
  return $element.is(':focus');
};

isHidden = function(app, selector, context) {
  return !isVisible(app, selector, context);
};

export {
  isHidden
};
