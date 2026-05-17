/**
 * Site Configuration
 * 
 * Global site metadata and navigation structure.
 */

export const siteConfig = {
  name: 'Memorize',
  description: 'NeuroLearn - Master knowledge with spaced repetition',
  url: 'https://memorize.app',
  
  navigation: {
    main: [
      {
        title: 'Home',
        href: '/',
      },
      {
        title: 'Dashboard',
        href: '/dashboard',
        protected: true,
      },
    ],
    dashboard: [
      {
        title: 'Pulse',
        href: '/dashboard',
        icon: 'zap',
      },
      {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: 'bar-chart',
      },
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: 'settings',
      },
    ],
  },

  links: {
    twitter: 'https://twitter.com/neurolearn',
    github: 'https://github.com/neurolearn',
    docs: 'https://docs.memorize.app',
  },
}

export type SiteConfig = typeof siteConfig
