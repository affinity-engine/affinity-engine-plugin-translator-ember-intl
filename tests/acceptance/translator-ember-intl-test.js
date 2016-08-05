import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';
import { $hook } from 'ember-hook';

moduleForAcceptance('Acceptance | translator ember intl');

test('visiting /translator-ember-intl', function(assert) {
  assert.expect(8);

  visit('/').then(() => {
    assert.equal($hook('intl_string').text().trim(), 'I am a string', 'plain strings work');
    assert.equal($hook('intl_interpolated').text().trim(), 'Joe is interpolated', 'interpolation works');
    assert.equal($hook('intl_html').html(), 'I <em>am</em> html', 'html is correct');
    assert.equal($hook('intl_html').text().trim(), 'I am html', 'html is safe');
    assert.equal($hook('intl_fallback').text().trim(), 'I should not be translated', 'fallback comes through');
    assert.equal($hook('intl_not_string').text().trim(), 'Not String', 'non-strings do not break things');
    assert.equal($hook('intl_date').text().trim(), 'April 15, 2002, 2:32:45 PM', 'dates are formatted');
    assert.equal($hook('intl_number').text().trim(), '65.405', 'numbers are formatted');
  });
});
