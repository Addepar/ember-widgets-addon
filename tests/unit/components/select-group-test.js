import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

var select = null;

moduleForComponent('select-group', '[Unit] SelectGroup component', {
  unit: true,
  teardown: function() {
    Ember.run( function() {
      select.destroy();
    });
    select = null;
  }
});

test('Test continuous queries in a row', function(assert) {
  assert.expect(5);

  var filteredContent;
  select = this.subject({
    content: ['foo', 'bar', 'barca', 'baz']
  });

  select.set('query', 'ba');

  filteredContent = select.get('filteredContent');
  assert.equal(filteredContent[0], 'bar');
  assert.equal(filteredContent[1], 'barca');
  assert.equal(filteredContent[2], 'baz');

  select.set('query', 'bar');

  filteredContent = select.get('filteredContent');
  assert.equal(filteredContent[0], 'bar');
  assert.equal(filteredContent[1], 'barca');
});

test('Test filtered content using array proxy', function(assert) {
  assert.expect(2);

  var data = Ember.ArrayProxy.create({
    content: Ember.A(['red', 'reddit', 'green', 'blue'])
  });
  select = this.subject({
    content: data
  });
  select.set('query', 're');
  assert.equal(select.get('filteredContent')[0], 'red');
  assert.equal(select.get('filteredContent')[1], 'reddit');
});

test('Test sorted filter content', function(assert) {
  assert.expect(3);

  select = this.subject({
    content: ['reddit', 'red', 'green', 'blue']
  });
  select.set('query', 'r');

  assert.equal(select.get('sortedFilteredContent')[0], 'green');
  assert.equal(select.get('sortedFilteredContent')[1], 'red');
  assert.equal(select.get('sortedFilteredContent')[2], 'reddit');
});

test('Test keyboard interaction', function(assert) {
  assert.expect(10);

  var selectComponent, selectedText, validateDropdownHidden, validateDropdownVisible, validateFocus;
  selectedText = null;

  select = this.subject({
    content: ['foo', 'bar', 'barca', 'baz']
  });
  this.render();
  selectComponent = select.$();

  validateDropdownVisible = function(messageVisible) {
    assert.ok(isVisible(find('.ember-select-results', selectComponent)), messageVisible);
  };
  validateDropdownHidden = function(messageHidden) {
    assert.ok(isHidden(find('.ember-select-results', selectComponent)), messageHidden);
  };
  validateFocus = function(messageFocus) {
    assert.ok(isFocused(selectComponent, selectComponent), messageFocus);
  };

  validateDropdownHidden('Dropdown list should not exist at the beginning');
  selectComponent.focus();
  pressEnter(selectComponent);
  andThen(function() {
    validateDropdownVisible('Dropdown list should appear after pressing Enter');
  });

  pressDownArrow(selectComponent);
  andThen(function() {
    var resultItems;
    resultItems = find('.ember-select-result-item', selectComponent);
    assert.ok($(resultItems[1]).hasClass('highlighted'), 'The second option should be highlighted');
  });

  pressUpArrow(selectComponent);
  andThen(function() {
    var resultItems;
    resultItems = find('.ember-select-result-item', selectComponent);
    assert.ok($(resultItems[0]).hasClass('highlighted'), 'The first option should be highlighted');
    selectedText = $(resultItems[0]).text();
  });

  pressEnter(selectComponent);
  andThen(function() {
    var currentText, resultItems;
    validateFocus('Select component should be focused after selecting one option');
    validateDropdownHidden('Dropdown list should be hidden after selecting an option');
    resultItems = find('.ember-select-result-item', selectComponent);
    currentText = $(resultItems[0]).text();
    assert.equal(selectedText, find('.ember-select-result-item:eq(0)', selectComponent).text(),
                 'The selected item is not the one was Enter pressed');
  });

  keyEvent(selectComponent, 'keydown', 97);
  andThen(function() {
    validateDropdownVisible('Dropdown list should appear after pressing a letter');
  });

  pressESC(selectComponent);
  andThen(function() {
    validateDropdownHidden('Dropdown list should be hidden after pressing ESC');
    validateFocus('Select component should be focused after pressing ESC');
  });
});

test('Test userSelected action', function(assert) {
  assert.expect(3);

  var selectElement, spy;
  select = this.subject({
    content: ['bar', 'baz']
  });
  spy = sinon.spy(select, "sendAction");
  this.render();
  selectElement = select.$();
  openDropdown(selectElement);
  andThen(function() {
    assert.ok(!spy.calledWith('userSelected'), 'userSelected action should not be fired when first open the dropdown');
    spy.reset();
  });

  click('li:eq(0)', '.ember-select-results');
  andThen(function() {
    assert.ok(spy.calledWithExactly('userSelected', 'bar'), 'userSelected action is fired when select one item in the dropdown');
    spy.reset();
  });

  click('.ember-select-result-item', '.dropdown-toggle');
  andThen(function() {
    assert.ok(!spy.calledWith('userSelected'), 'userSelected action should not be fired when click on the dropdown containing highlighted item');
  });
});

test('Test selection label', function(assert) {
  assert.expect(2);

  var data = [
    {
      name: 'reddit'
    }, {
      name: 'red'
    }
  ];
  select = this.subject({
    content: data,
    selection: data[0],
    optionLabelPath: 'name'
  });
  assert.equal(select.get('selectedLabel'), 'reddit');

  select.set('selection.name', 'blues');
  assert.equal(select.get('selectedLabel'), 'blues');
});

test('Test query matching', function(assert) {
  assert.expect(8);

  select = this.subject({
    content: ['foo', 'bana$  na', 'bar ca', 'baz']
  });
  select.set('query', null);
  assert.equal(select.get('filteredContent').length, 4, 'null queries should return the full list of options');
  select.set('query', '   ');
  assert.equal(select.get('filteredContent').length, 4, 'queries containing all spaces should return the full list of options');
  select.set('query', ' a ');
  assert.equal(select.get('filteredContent').length, 3, 'queries containing spaces at two ends should be trimmed');
  select.set('query', 'bar  ca');
  assert.equal(select.get('filteredContent').length, 1, 'queries containing duplicated spaces should be removed');
  select.set('query', 'barca');
  assert.equal(select.get('filteredContent').length, 0, 'correct spaces should be considered when matching');
  select.set('query', 'bana$');
  assert.equal(select.get('filteredContent').length, 1, 'special characters should be considered when matching');
  select.set('query', 'bana[  na');
  assert.equal(select.get('filteredContent').length, 0, 'special characters should be considered when matching');
  select.set('query', 'bana$ n');
  assert.equal(select.get('filteredContent').length, 1, 'duplicated spaces in the source string should be removed before matching');
});

test("Show empty content view if content is empty", function(assert) {
  assert.expect(5);

  var EmptyContentView, selectElement;
  EmptyContentView = Ember.View.extend({
    layout: Ember.Handlebars.compile("<div class='empty-content-view'>No Content</div>")
  });
  select = this.subject({
    content: [],
    optionLabelPath: 'name',
    optionValuePath: 'code',
    classNames: 'select-class-name'
  });
  this.render();
  selectElement = select.$();
  openDropdown(selectElement);
  andThen(function() {
    assert.ok(isPresent(emptyContentSelector, selectElement), 'Empty content block displayed');
    assert.ok(isNotPresent('.empty-content-view', selectElement), 'Empty content view not displayed before specified');
    assert.ok(isNotPresent(noResultSelector, selectElement), '"No result" message not displayed');
  });
  andThen(function() {
    Ember.run(function() {
      select.set('emptyContentView', EmptyContentView);
    });
  });
  andThen(function() {
    assert.ok(isPresent('.empty-content-view', selectElement), 'Empty content view displayed');
  });
  andThen(function() {
    Ember.run(function() {
      select.set('emptyContentView', null);
    });
  });
  andThen(function() {
    assert.ok(isNotPresent('.empty-content-view', selectElement), 'Empty content view no longer displayed');
  });
});

test("Show no-result message if has content but filtered content is empty", function(assert) {
  assert.expect(2);

  var selectElement;
  var data = [
    {
      name: 'reddit'
    }, {
      name: 'red'
    }
  ];
  select = this.subject({
    content: data,
    query: 'Non-existing Name',
    optionLabelPath: 'name',
    classNames: 'select-class-name'
  });
  this.render();
  selectElement = select.$();
  openDropdown(selectElement);
  andThen(function() {
    assert.ok(isNotPresent(emptyContentSelector, selectElement), 'Empty content block not displayed');
    assert.ok(isPresent(noResultSelector, selectElement), '"No result" message displayed');
  });
});

test('optionValuePath with POJOs', function(assert) {
  assert.expect(1);

  var data, obj1, obj2;
  obj1 = {
    name: 'reddit',
    value: 1
  };
  obj2 = {
    name: 'red',
    value: 2
  };
  data = [obj1, obj2];
  select = this.subject({
    content: data,
    optionLabelPath: 'name',
    optionValuePath: 'value'
  });
  this.render();
  Ember.run(function() {
    select.set('value', 2);
  });
  assert.equal(obj2, select.get('selection'), 'The right selection is retrieved');
});

test('optionValuePath with Ember Objects', function(assert) {
  assert.expect(1);

  var Klass, data, obj1, obj2;
  Klass = Ember.Object.extend({
    name: null,
    value: null
  });
  obj1 = Klass.create({
    name: 'reddit',
    value: 1
  });
  obj2 = Klass.create({
    name: 'red',
    value: 2
  });
  data = [obj1, obj2];
  select = this.subject({
    content: data,
    optionLabelPath: 'name',
    optionValuePath: 'value'
  });
  this.render();
  Ember.run(function() {
    select.set('value', 2);
  });
  assert.equal(obj2, select.get('selection'), 'The right selection is retrieved');
});

test('optionValuePath with ArrayProxy', function(assert) {
  assert.expect(1);

  var Klass, arrData, data, obj1, obj2;
  Klass = Ember.Object.extend({
    name: null,
    value: null
  });
  obj1 = Klass.create({
    name: 'reddit',
    value: 1
  });
  obj2 = Klass.create({
    name: 'red',
    value: 2
  });
  data = [obj1, obj2];
  arrData = Ember.ArrayProxy.create({
    content: Ember.A(data)
  });
  select = this.subject({
    content: arrData,
    optionLabelPath: 'name',
    optionValuePath: 'value'
  });
  this.render();
  Ember.run(function() {
    select.set('value', 2);
  });
  assert.equal(obj2, select.get('selection'), 'The right selection is retrieved');
});

test('optionValuePath with nested valuePath', function(assert) {
  assert.expect(1);

  var data, obj1, obj2, value1;
  value1 = Ember.Object.create();
  value1.set('subvalue', 1);
  obj1 = {
    name: 'reddit',
    value: value1
  };
  obj2 = {
    name: 'red',
    value: {
      subvalue: 2
    }
  };
  data = [obj1, obj2];
  select = this.subject({
    content: Ember.A(data),
    optionLabelPath: 'name',
    optionValuePath: 'value.subvalue'
  });
  this.render();
  Ember.run(function() {
    select.set('value', 2);
  });
  assert.equal(obj2, select.get('selection'), 'The right selection is retrieved');
});
