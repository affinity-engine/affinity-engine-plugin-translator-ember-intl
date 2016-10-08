import { moduleFor, test } from 'ember-qunit';
import { deepStub } from 'affinity-engine';

moduleFor('service:affinity-engine/translator-ember-intl', 'Unit | Service | affinity engine/translator ember intl', {
  // Specify the other units that are required for this test.
  needs: ['service:intl', 'service:multiton-service-manager']
});

test('`setLocale` sets the locale', function(assert) {
  assert.expect(1);

  const service = this.subject({ config: {} });

  service.setLocale('es');

  assert.equal(service.get('intl.locale'), 'es', 'locale has changed');
});

const configurationTiers = [
  'config.attrs.plugin.translator',
  'config.attrs'
];

configurationTiers.forEach((tier) => {
  test(`init sets the locale to ${tier}'s defaultLocale'`, function(assert) {
    assert.expect(1);

    const stub = deepStub(tier, { defaultLocale: 'es' });
    const service = this.subject({ config: stub.config });

    assert.equal(service.get('intl.locale'), 'es', 'locale has changed');
  });
});
