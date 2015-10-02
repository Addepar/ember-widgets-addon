import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('color-picker/color-picker-cell', 'Integration | Component | color picker/color picker cell', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{color-picker/color-picker-cell}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#color-picker/color-picker-cell}}
      template block text
    {{/color-picker/color-picker-cell}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
