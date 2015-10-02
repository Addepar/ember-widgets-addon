import Ember from 'ember';
import layout from '../templates/components/select-group';

Ember.Component.extend(Ember.Widgets.BodyEventListener, Ember.AddeparMixins.ResizeHandlerMixin, Ember.Widgets.KeyboardHelper,
export default Ember.Component.extend({
  layout: layout,
  layoutName: 'select',
  classNames: 'ember-select',
  attributeBindings: Ember.A(['tabindex']),
  classNameBindings: Ember.A(['showDropdown:open', 'isDropup:dropup']),
  prompt: 'Select a Value',
  placeholder: void 0,
  disabled: false,
  hasFocus: false,
  showTooltip: true,
  highlightedIndex: -1,
  tabindex: 0,
  showDropdown: false,
  dropdownHeight: 300,
  rowHeight: 26,
  sortLabels: true,
  titleOnOptions: false,
  isSelect: false,
  isDropup: false,
  isDropdownMenuPulledRight: false,
  dropdownToggleIcon: 'fa fa-caret-down',
  buttonClass: 'btn btn-default',
  dropdownMenuClass: '',
  content: Ember.A([]),
  selection: null,
  query: '',
  optionLabelPath: '',
  optionValuePath: '',
  optionGroupPath: '',
  optionDefaultPath: '',
  selectMenuView: null,
  tooltipItemViewClass: 'Ember.Widgets.SelectTooltipOptionView',
  originalItemViewClass: 'Ember.Widgets.SelectOptionView',
  acceptedKeys: Ember.computed(function() {
    var i, j, keySet, mappedKeys, results, results1;
    mappedKeys = Ember.Map.create();
    keySet = _.union([this.KEY_CODES.ENTER, this.KEY_CODES.SPACEBAR], [this.KEY_CODES.DOWN, this.KEY_CODES.UP], (function() {
      results = [];
      for (i = 65; i <= 90; i++){ results.push(i); }
      return results;
    }).apply(this), (function() {
      results1 = [];
      for (j = 97; j <= 122; j++){ results1.push(j); }
      return results1;
    }).apply(this), [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]);
    keySet.forEach(function(key) {
      return mappedKeys[key] = true;
    });
    return mappedKeys;
  }).property(),
  itemViewClass: Ember.computed(function() {
    if (this.get('showTooltip')) {
      return this.get('tooltipItemViewClass');
    } else {
      return this.get('originalItemViewClass');
    }
  }).property('showTooltip'),
  willDestroy: function() {
    var contentProxy, propertyName;
    propertyName = 'contentProxy';
    if (this.cacheFor(propertyName)) {
      contentProxy = this.get(propertyName);
      contentProxy.destroy();
    }
    return this._super();
  },
  updateDropdownLayout: Ember.observer(function() {
    var dropdownButton, dropdownButtonHeight, dropdownButtonOffset, dropdownMargin, dropdownMenu, dropdownMenuBottom, dropdownMenuHeight, dropdownMenuOffset, dropdownMenuWidth, dropupMenuTop;
    if ((this.get('_state') || this.get('state')) !== 'inDOM' || this.get('showDropdown') === false) {
      return;
    }
    this.$('.js-dropdown-menu').css('visibility', 'hidden');
    dropdownButton = this.$('.js-dropdown-toggle')[0];
    dropdownButtonHeight = this.$(dropdownButton).outerHeight();
    dropdownButtonOffset = this.$(dropdownButton).offset();
    dropdownMenu = this.$('.js-dropdown-menu')[0];
    dropdownMenuHeight = this.$(dropdownMenu).outerHeight();
    dropdownMenuWidth = this.$(dropdownMenu).outerWidth();
    dropdownMenuOffset = this.$(dropdownMenu).offset();
    dropdownMargin = 15;
    if (this.get('isDropup')) {
      dropdownMenuBottom = dropdownButtonOffset.top + dropdownButtonHeight + dropdownMenuHeight + dropdownMargin;
    } else {
      dropdownMenuBottom = dropdownMenuOffset.top + dropdownMenuHeight;
    }
    dropupMenuTop = dropdownButtonOffset.top - dropdownMenuHeight - dropdownMargin;
    this.set('isDropup', dropupMenuTop > window.scrollY && dropdownMenuBottom > window.innerHeight);
    this.set('isDropdownMenuPulledRight', dropdownButtonOffset.left + dropdownMenuWidth + dropdownMargin > window.innerWidth);
    return this.$('.js-dropdown-menu').css('visibility', 'visible');
  }, 'showDropdown'),
  onResizeEnd: function() {
    return Ember.run(this, this.updateDropdownLayout);
  },
  itemView: Ember.computed(function() {
    var itemViewClass;
    itemViewClass = this.get('itemViewClass');
    if (typeof itemViewClass === 'string') {
      return Ember.get(itemViewClass);
    }
    return itemViewClass;
  }).property('itemViewClass'),
  selectedItemView: Ember.computed(function() {
    return this.get('itemView').extend({
      tagName: 'span',
      labelPath: Ember.computed.alias('controller.optionLabelPath'),
      context: Ember.computed.alias('controller.selection')
    });
  }).property('itemView'),
  optionLabelPathChanges: Ember.on('init', Ember.observer(function() {
    var labelPath, path;
    labelPath = this.get('optionLabelPath');
    path = labelPath ? "selection." + labelPath : 'selection';
    return Ember.defineProperty(this, 'selectedLabel', Ember.computed.alias(path));
  }, 'selection', 'optionLabelPath')),
  searchView: Ember.TextField.extend({
    placeholder: Ember.computed.alias('parentView.placeholder'),
    valueBinding: 'parentView.query',
    showDropdownDidChange: Ember.observer(function() {
      if (this.get('parentView.showDropdown')) {
        return Ember.run.schedule('afterRender', this, function() {
          if ((this.get('_state') || this.get('state')) === 'inDOM') {
            return this.$().focus();
          }
        });
      } else {
        return this.set('value', '');
      }
    }, 'parentView.showDropdown')
  }),
  listView: Ember.ListView.extend({
    style: Ember.computed(function() {
      var height;
      height = Math.min(this.get('height'), this.get('totalHeight'));
      return "height: " + height + "px";
    })
  }.property('height', 'totalHeight')),
  preparedContent: Ember.computed(function() {
    if (this.get('sortLabels')) {
      return this.get('sortedFilteredContent');
    } else {
      return this.get('filteredContent');
    }
  }).property('sortLabels', 'filteredContent.[]', 'sortedFilteredContent.[]', 'filteredContent', 'sortedFilteredContent'),
  contentProxy: Ember.computed(function() {
    var ContentProxy, observableString, optionLabelPath;
    optionLabelPath = this.get('optionLabelPath');
    if (optionLabelPath) {
      observableString = "content.@each." + optionLabelPath;
    } else {
      observableString = 'content.@each';
    }
    ContentProxy = Ember.ObjectProxy.extend({
      _select: null,
      content: Ember.computed.alias('_select.content'),
      query: Ember.computed.alias('_select.query'),
      filteredContent: Ember.computed(function() {
        var query, selectComponent;
        selectComponent = this.get('_select');
        query = this.get('query');
        return (this.get('content') || []).filter(function(item) {
          return selectComponent.matcher(query, item);
        });
      }).property(observableString, 'query'),
      sortedFilteredContent: Ember.computed(function() {
        return _.sortBy(this.get('filteredContent'), (function(_this) {
          return function(item) {
            var ref;
            return (ref = Ember.get(item, optionLabelPath)) != null ? ref.toLowerCase() : void 0;
          };
        })(this));
      }).property('filteredContent.[]')
    });
    return ContentProxy.create({
      _select: this
    });
  }).property('optionLabelPath'),
  filteredContent: Ember.computed.alias('contentProxy.filteredContent'),
  sortedFilteredContent: Ember.computed.alias('contentProxy.sortedFilteredContent'),
  groupedContent: Ember.computed(function() {
    var content, groups, path, result;
    path = this.get('optionGroupPath');
    content = this.get('preparedContent');
    if (!path) {
      return Ember.A(content);
    }
    groups = _.groupBy(content, function(item) {
      return Ember.get(item, path);
    });
    result = Ember.A();
    _.keys(groups).sort().forEach(function(key) {
      result.pushObject(Ember.Object.create({
        isGroupOption: true,
        name: key
      }));
      return result.pushObjects(groups[key]);
    });
    return result;
  }).property('preparedContent.[]', 'optionGroupPath', 'labels.[]'),
  isLoading: false,
  isLoaded: Ember.computed.not('isLoading'),
  filteredContentIsEmpty: Ember.computed.empty('filteredContent'),
  hasNoResults: Ember.computed.and('isLoaded', 'filteredContentIsEmpty'),
  value: Ember.computed(function(key, value) {
    var selection, valuePath;
    if (arguments.length === 2) {
      valuePath = this.get('optionValuePath');
      selection = value;
      if (valuePath && this.get('content')) {
        selection = this.get('content').findProperty(valuePath, value);
      }
      this.set('selection', selection);
      return value;
    } else {
      valuePath = this.get('optionValuePath');
      selection = this.get('selection');
      if (valuePath) {
        return Ember.get(selection, valuePath);
      } else {
        return selection;
      }
    }
  }).property('selection'),
  didInsertElement: function() {
    this._super();
    return this.setDefaultSelection();
  },
  matcher: function(searchText, item) {
    var escapedSearchText, label, regex, trimmedLabel, trimmedSearchText;
    if (!searchText) {
      return true;
    }
    label = Ember.get(item, this.get('optionLabelPath'));
    if (!label) {
      return false;
    }
    trimmedLabel = label.trim().replace(/\s{2,}/g, ' ');
    trimmedSearchText = searchText.trim().replace(/\s{2,}/g, ' ');
    escapedSearchText = trimmedSearchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    regex = new RegExp(escapedSearchText, 'i');
    return regex.test(trimmedLabel);
  },
  setDefaultSelection: Ember.observer(function() {
    var content, defaultPath;
    if (this.get('selection')) {
      return;
    }
    content = this.get('content');
    defaultPath = this.get('optionDefaultPath');
    if (!(content && defaultPath)) {
      return;
    }
    return this.set('selection', content.findProperty(defaultPath));
  }, 'content.[]'),
  selectableOptionsDidChange: Ember.observer(function() {
    var highlighted;
    if (this.get('showDropdown')) {
      highlighted = this.get('highlighted');
      if (!this.get('selectableOptions').contains(highlighted)) {
        return this.set('highlighted', this.get('selectableOptions.firstObject'));
      }
    }
  }, 'selectableOptions.[]', 'showDropdown'),

  /*
   * SELECTION RELATED
   */
  KEY_EVENTS: {
    8: 'deletePressed',
    27: 'escapePressed',
    13: 'enterPressed',
    38: 'upArrowPressed',
    40: 'downArrowPressed',
    9: 'tabPressed'
  },
  selectableOptions: Ember.computed(function() {
    return Ember.A((this.get('groupedContent') || []).filter(function(item) {
      return !Ember.get(item, 'isGroupOption');
    }));
  }).property('groupedContent.[]'),
  highlighted: Ember.computed(function(key, value) {
    var content, index;
    content = this.get('selectableOptions') || Ember.A();
    value = value || Ember.A();
    if (arguments.length === 1) {
      index = this.get('highlightedIndex');
      value = content.objectAt(index);
    } else {
      index = content.indexOf(value);
      this.setHighlightedIndex(index, true);
    }
    return value;
  }).property('selectableOptions.[]', 'highlightedIndex'),
  setFocus: function() {
    var activeElem, selectComponent;
    activeElem = document.activeElement;
    selectComponent = this.$()[0];
    if (selectComponent.contains(activeElem) || selectComponent === activeElem) {
      return this.set('hasFocus', true);
    } else {
      return this.set('hasFocus', false);
    }
  },
  bodyClick: function() {
    return this.send('hideDropdown');
  },
  keyDown: function(event) {
    var acceptedKeys, map, method, ref;
    if (this.get('isDestroyed') || this.get('isDestroying')) {
      return;
    }
    this.setFocus();
    acceptedKeys = this.get('acceptedKeys');
    if (acceptedKeys[event.keyCode] && !this.get('showDropdown')) {
      this.set('showDropdown', true);
      return;
    }
    map = this.get('KEY_EVENTS');
    method = map[event.keyCode];
    if (method) {
      return (ref = this.get(method)) != null ? ref.apply(this, arguments) : void 0;
    }
  },
  deletePressed: Ember.K,
  escapePressed: function(event) {
    if (this.get('showDropdown')) {
      this.send('hideDropdown');
      this.$().focus();
      return event.preventDefault();
    }
  },
  tabPressed: function(event) {
    if (this.get('showDropdown')) {
      return this.send('hideDropdown');
    }
  },
  enterPressed: function(event) {
    var item, ref;
    item = this.get('highlighted');
    if (!Ember.isEmpty(item)) {
      this.set('selection', item);
    }
    if (!Ember.isEmpty(item)) {
      this.userDidSelect(item);
    }
    if ((ref = this.$()) != null) {
      ref.focus();
    }
    if (this.get('showDropdown')) {
      this.send('hideDropdown');
    }
    return event.preventDefault();
  },
  upArrowPressed: function(event) {
    var index, sel;
    sel = this.get('highlightedIndex');
    index = event.ctrlKey || event.metaKey ? 0 : sel - 1;
    this.setHighlightedIndex(index, true);
    return event.preventDefault();
  },
  downArrowPressed: function(event) {
    var clen, index, sel;
    sel = this.get('highlightedIndex');
    clen = this.get('selectableOptions.length');
    index = event.ctrlKey || event.metaKey ? clen - 1 : sel + 1;
    this.setHighlightedIndex(index, true);
    return event.preventDefault();
  },
  setHighlightedIndex: function(index, ensureVisible) {
    if (!this.ensureIndex(index)) {
      return;
    }
    this.set('highlightedIndex', index);
    if (ensureVisible) {
      return this.ensureVisible(index);
    }
  },
  ensureIndex: function(index) {
    var clen;
    clen = this.get('selectableOptions.length');
    return index >= 0 && index < clen;
  },
  ensureVisible: function(index) {
    var $listView, endIndex, item, listView, newIndex, numRows, startIndex;
    $listView = this.$('.ember-list-view');
    listView = Ember.View.views[$listView.attr('id')];
    if (!listView) {
      return;
    }
    startIndex = listView._startingIndex();
    numRows = listView._childViewCount() - 1;
    endIndex = startIndex + numRows;
    item = this.get('selectableOptions').objectAt(index);
    newIndex = this.get('groupedContent').indexOf(item);
    if (index === 0) {
      return $listView.scrollTop(0);
    } else if (newIndex < startIndex) {
      return $listView.scrollTop(newIndex * this.get('rowHeight'));
    } else if (newIndex >= endIndex) {
      return $listView.scrollTop((newIndex - numRows + 1.5) * this.get('rowHeight'));
    }
  },
  userDidSelect: function(selection) {
    return this.sendAction('userSelected', selection);
  },
  focusIn: function(event) {
    return this.set('hasFocus', true);
  },
  focusOut: function(event) {
    return this.set('hasFocus', false);
  },
  actions: {
    toggleDropdown: function(event) {
      if (this.get('disabled')) {
        return;
      }
      return this.toggleProperty('showDropdown');
    },
    hideDropdown: function(event) {
      if (this.get('isDestroyed') || this.get('isDestroying')) {
        return;
      }
      return this.set('showDropdown', false);
    }
  }
});
