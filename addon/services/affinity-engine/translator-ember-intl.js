import Ember from 'ember';
import { ConfigurableMixin, configurable } from 'affinity-engine';
import multiton from 'ember-multiton-service';

const {
  Service,
  get
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
    Reports whether a translation with the given key exists.

    @method exists
    @param {String} key
  */
  exists(key) {
    return get(this, 'intl').exists(key.toString());
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
    Translates and returns the key, if a translation is available.

    @method translate
    @param {String} key
    @param {Object} options
    @returns {String}
  */
  translate(key, options) {
    if (this.exists(key)) {
      const intl = get(this, 'intl');

      return intl.formatHtmlMessage(intl.findTranslationByKey(key.toString()), options).string;
    }
  }
});
