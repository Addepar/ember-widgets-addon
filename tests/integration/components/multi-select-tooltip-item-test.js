import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('multi-select-tooltip-item', 'Integration | Component | multi select tooltip item', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{multi-select-tooltip-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#multi-select-tooltip-item}}
      template block text
    {{/multi-select-tooltip-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
