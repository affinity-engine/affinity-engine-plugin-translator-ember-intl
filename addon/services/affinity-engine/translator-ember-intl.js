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
      return intl.exists(this._getId(translation));
    });

    return isBlank(translationHash) ? this._getId(fallback) : this._getTranslation(translationHash).string;
  },

  _getTranslation(translationHash) {
    const intl = get(this, 'intl');
    const id = this._getId(translationHash);

    if (intl.exists(id)) {
      const options = get(translationHash, 'options') || get(translationHash, 'text.options');

      return intl.formatHtmlMessage(intl.findTranslationByKey(id), options);
    }
  },

  /**
     The translation id can be nested in one of four places:

     ```js
       translatable: 'id';
       translatable: { text: 'id' };
       translatable: { text: { id: 'id', options: {} } };
       translatable: { id: 'id', options: {} };
     ```

     `getId` cycles through each of the possible locations and returns the first matching id.

     @method _getId
     @param {*} translationHash
     @returns {String}
     @private
  */
  _getId(translationHash) {
    // scenario: `undefined`
    if (isBlank(translationHash)) { return; }

    const text = get(translationHash, 'text');
    const id = isBlank(text) ? get(translationHash, 'id') : get(text, 'id');

    // scenario: `'id'`
    if (isBlank(id) && isBlank(text)) { return translationHash; }

    // scenario: `translatable: { text: 'id' }`
    if (isBlank(id)) { return text; }

    // scenario: `translatable: { id: 'id', options: {} }` || `translatable: { text: { id: 'id' } }`
    return id;
  }
});
