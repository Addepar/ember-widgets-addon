import Ember from 'ember';

var _isPresent, _isNotPresent, _isVisible, _isFocused, _isHidden;

_isPresent = function(app, selector, context) {
  var $element;
  $element = find(app, selector, context);
  return $element.length > 0;
};

_isNotPresent = function(app, selector, context) {
  return !_isPresent(app, selector, context);
};

_isVisible = function(app, selector, context) {
  var $element;
  $element = find(app, selector, context);
  return $element.is(':visible');
};

_isFocused = function(app, selector, context) {
  var $element;
  $element = find(app, selector, context);
  return $element.is(':focus');
};

_isHidden = function(app, selector, context) {
  return !_isVisible(app, selector, context);
};

Ember.Test.registerHelper('isPresent', _isPresent);
Ember.Test.registerHelper('isNotPresent', _isNotPresent);
Ember.Test.registerHelper('isVisible', _isVisible);
Ember.Test.registerHelper('isFocused', _isFocused);
Ember.Test.registerHelper('isHidden', _isHidden);
