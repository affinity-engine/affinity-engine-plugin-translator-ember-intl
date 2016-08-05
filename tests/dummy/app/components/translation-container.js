import Ember from 'ember';
import { registrant } from 'affinity-engine';
import multiton from 'ember-multiton-service';

const {
  Component,
  computed,
  get
} = Ember;

const { String: { htmlSafe } } = Ember;

export default Component.extend({
  config: multiton('affinity-engine/config', 'engineId'),
  translator: registrant('affinity-engine/translator'),

  intlString: computed({
    get() {
      return get(this, 'translator').translate('affinity-engine.translator-ember-intl.dummy.string');
    }
  }).readOnly(),

  intlInterpolated: computed({
    get() {
      return get(this, 'translator').translate('affinity-engine.translator-ember-intl.dummy.interpolated', { name: 'Joe' });
    }
  }).readOnly(),

  intlHtml: computed({
    get() {
      return htmlSafe(get(this, 'translator').translate('affinity-engine.translator-ember-intl.dummy.html'));
    }
  }).readOnly(),

  intlFallback: computed({
    get() {
      return get(this, 'translator').translate('invalid') || 'I should not be translated';
    }
  }).readOnly()
});
