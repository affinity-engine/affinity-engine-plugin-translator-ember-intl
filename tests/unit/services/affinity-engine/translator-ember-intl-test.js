import { moduleFor, test } from 'ember-qunit';

moduleFor('service:affinity-engine/translator-ember-intl', 'Unit | Service | affinity engine/translator ember intl', {
  // Specify the other units that are required for this test.
  needs: ['service:intl', 'service:multiton-service-manager']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
