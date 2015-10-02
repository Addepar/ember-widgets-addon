import Ember from 'ember';

export default Ember.Mixin.create({
  bodyElementSelector: 'html',
  bodyClick: Ember.K,
  didInsertElement: function() {
    this._super();
    return Ember.run.next(this, this._setupDocumentHandlers);
  },
  willDestroyElement: function() {
    this._super();
    return this._removeDocumentHandlers();
  },
  _setupDocumentHandlers: function() {
    if (this._clickHandler || this.isDestroying) {
      return;
    }
    this._clickHandler = (function(_this) {
      return function(event) {
        return Ember.run(function() {
          if ((_this.get('_state') || _this.get('state')) === 'inDOM' && Ember.isEmpty(_this.$().has($(event.target)))) {
            if ($.contains(document.body, event.target)) {
              return _this.bodyClick(event);
            }
          }
        });
      };
    })(this);
    return $(this.get('bodyElementSelector')).on("click", this._clickHandler);
  },
  _removeDocumentHandlers: function() {
    $(this.get('bodyElementSelector')).off("click", this._clickHandler);
    return this._clickHandler = null;
  }
});
