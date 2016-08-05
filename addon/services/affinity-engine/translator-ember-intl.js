import Ember from 'ember';
import { ConfigurableMixin, configurable } from 'affinity-engine';
import multiton from 'ember-multiton-service';

const {
  Service,
  get,
  isBlank
} = Ember;

const { inject: { service } } = Ember;

const configurationTiers = [
  'config.attrs.plugin.translator',
  'config.attrs'
];

export default Service.extend(ConfigurableMixin, {
  intl: service(),

  config: multiton('affinity-engine/config', 'engineId'),

  defaultLocale: configurable(configurationTiers, 'defaultLocale'),
  locales: configurable(configurationTiers, 'locales'),

  init(...args) {
    this._super(...args);
    this.setLocale(get(this, 'defaultLocale'));
  },

  /**
    Sets the `intl` service's locale.

    @method setLocale
    @param {String} locale
  */
  setLocale(locale) {
    get(this, 'intl').setLocale(locale);
  },

  /**
    Translates and returns the first valid `translationHashes`, if any. Otherwise, returns
    the first `translationHashes` without translating it.

    @method translate
    @param {Array} translationHashes
    @returns {String}
  */
  translate(...translationHashes) {
    const intl = get(this, 'intl');
    const fallback = translationHashes[0];
    const translationHash = translationHashes.find((translation) => {
      return intl.exists(this._getKey(translation) || '');
    });

    return isBlank(translationHash) ? this._getKey(fallback) : this._getTranslation(translationHash).string;
  },

  _getTranslation(translationHash) {
    const intl = get(this, 'intl');
    const key = this._getKey(translationHash);

    if (intl.exists(key)) {
      const options = get(translationHash, 'options') || get(translationHash, 'text.options');

      return intl.formatHtmlMessage(intl.findTranslationByKey(key), options);
    }
  },

  /**
     The translation key can be nested in one of four places:

     ```js
       translatable: 'key';
       translatable: { text: 'key' };
       translatable: { text: { key: 'key', options: {} } };
       translatable: { key: 'key', options: {} };
     ```

     `getKey` cycles through each of the possible locations and returns the first matching key.

     @method _getKey
     @param {*} translationHash
     @returns {String}
     @private
  */
  _getKey(translationHash) {
    // scenario: `undefined`
    if (isBlank(translationHash)) { return; }

    const text = get(translationHash, 'text');
    const key = isBlank(text) ? get(translationHash, 'key') : get(text, 'key');

    // scenario: `'key'`
    if (isBlank(key) && isBlank(text)) { return translationHash; }

    // scenario: `translatable: { text: 'key' }`
    if (isBlank(key)) { return text; }

    // scenario: `translatable: { key: 'key', options: {} }` || `translatable: { text: { key: 'key' } }`
    return key;
  }
});
