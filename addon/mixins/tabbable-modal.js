import Ember from 'ember';

export default Ember.Mixin.create({
  enforceModality: false,
  escToCancel: true,
  currentFocus: null,
  _focusTabbable: function() {
    var focusElement, hasFocus;
    hasFocus = [this.get('currentFocus')];
    if (!this.$().has(hasFocus[0]).length) {
      hasFocus = this.$('[autofocus]');
    }
    if (hasFocus.length === 0) {
      hasFocus = this.$(':tabbable');
    }
    if (focusElement = hasFocus[0]) {
      if (focusElement.className.indexOf('close') > -1) {
        if (hasFocus.length > 1) {
          focusElement = hasFocus[1];
        }
      }
      focusElement.focus();
      return this.set('currentFocus', focusElement);
    }
  },
  _checkContainingElement: function(containers, element) {
    var containerItem, i, len;
    for (i = 0, len = containers.length; i < len; i++) {
      containerItem = containers[i];
      if (containerItem === element || $.contains(containerItem, element)) {
        return true;
      }
    }
    return false;
  },
  mouseDown: function(event) {
    this._super(event);
    if (this._checkContainingElement(this.$(':tabbable'), event.target)) {
      return this.set('currentFocus', event.target);
    } else {
      this.set('currentFocus', null);
      return this.$().focus();
    }
  },
  keyDown: function(event) {
    var _currentFocus, _index, first, last, tabbableObjects;
    this._super(event);
    if (event.isDefaultPrevented()) {
      return;
    }
    if (event.keyCode === this.KEY_CODES.ESCAPE && this.get('escToCancel')) {
      this.send('sendCancel');
      event.preventDefault();
    } else if (event.keyCode === this.KEY_CODES.TAB) {
      tabbableObjects = this.$(":tabbable").not('.close');
      _currentFocus = document.activeElement;
      _index = tabbableObjects.index(_currentFocus);
      if (_index === -1) {
        this._focusTabbable();
        return false;
      }
      if (tabbableObjects.length > 0) {
        first = tabbableObjects[0];
        last = tabbableObjects[tabbableObjects.length - 1];
        if (event.target === last && !event.shiftKey) {
          first.focus();
          this.set('currentFocus', first);
          event.preventDefault();
        } else if (event.target === first && event.shiftKey) {
          this.set('currentFocus', last);
          last.focus();
          event.preventDefault();
        } else {
          this.set('currentFocus', tabbableObjects[_index + 1]);
        }
      }
    }
    return true;
  }
});
