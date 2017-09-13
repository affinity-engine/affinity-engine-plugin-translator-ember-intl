export default {
  priority: 2,
  all: {
    attrs: {
      defaultLocale: 'en-us',
      locales: ['en-us']
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
