export default {
  priority: 2,
  default: {
    all: {
      attrs: {
        defaultLocale: 'en-us',
        locales: ['en-us']
      }
    }
  },
  registrant: {
    'affinity-engine': {
      'translator': {
        path: 'service:affinity-engine/translator-ember-intl'
      }
    }
  }
};
