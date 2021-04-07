/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'CourtHive TMX',
  tagline: 'Open Source Tournament Management',
  url: 'https://github.com/CourtHive',
  baseUrl: '/TMX/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'CourtHive', // Usually your GitHub org/user name.
  projectName: 'TMX', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'CourtHive TMX',
      logo: {
        alt: 'CourtHive TMX',
        src: 'img/CourtHive.png'
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left'
        },
        { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/CourtHive/TMX',
          label: 'GitHub',
          position: 'right'
        }
      ]
    },
    footer: {
      style: 'dark',
      // links: [
      //   {
      //     title: 'Docs',
      //     items: [
      //       {
      //         label: 'Getting Started',
      //         to: 'docs/'
      //       }
      //     ]
      //   },
      //   {
      //     title: 'Community',
      //     items: [
      //       {
      //         label: 'Discord',
      //         href: 'https://discordapp.com/invite/courthive'
      //       },
      //       {
      //         label: 'Twitter',
      //         href: 'https://twitter.com/CourtHive'
      //       }
      //     ]
      //   },
      //   {
      //     title: 'More',
      //     items: [
      //       {
      //         label: 'Blog',
      //         to: 'blog'
      //       },
      //       {
      //         label: 'GitHub',
      //         href: 'https://github.com/CourtHive/TMX'
      //       }
      //     ]
      //   }
      // ],
      copyright: `Copyright © ${new Date().getFullYear()} CourtHive`
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js')
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
};
