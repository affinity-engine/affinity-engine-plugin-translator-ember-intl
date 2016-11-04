import Ember from 'ember';
import { ConfigurableMixin, configurable } from 'affinity-engine';
import multiton from 'ember-multiton-service';

const {
  Service,
  assign,
  get
} = Ember;

const { inject: { service } } = Ember;

const configurationTiers = [
  'config.attrs.plugin.translator',
  'config.attrs.global'
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
    Reports whether a translation with the given key exists.

    @method exists
    @param {String} key
  */
  exists(key = '') {
    return get(this, 'intl').exists(key.toString());
  },

  /**
    Localizes the provided date.

    @method formatDate
    @param {String} date
    @param {Object} options
    @returns {String}
  */
  formatDate(date, options = {}) {
    return get(this, 'intl').formatTime(date, assign({
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }, options));
  },

  /**
    Localizes the provided number.

    @method formatNumber
    @param {String} number
    @param {Object} options
    @returns {String}
  */
  formatNumber(number, options) {
    return get(this, 'intl').formatNumber(number, options);
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
