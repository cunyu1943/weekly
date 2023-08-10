import { type DefaultTheme, defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/weekly/',
  title: "村雨遥的好物周刊",
  description: "村雨遥的好物周刊，记录每周看到的有价值的信息，主要针对计算机领域，包含项目、插件、资源、网站、软件等方面内容，每周五发布。",

  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', href: '/site/logo.png' }]
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: { src: '/site/logo.png' },

    editLink: {
      pattern: 'https://github.com/cunyu1943/weekly/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    search: {
      provider: 'local'
    },

    footer: {
      // message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023 - present <a href="https://github.com/cunyu1943">村雨遥</a>'
    },

    nav: nav(),

    sidebar: {
      '/2023/': { base: '/2023/', items: sidebarCurrent() }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cunyu1943/weekly' }
    ]
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: '主页', link: '/' },
    { text: '2023', link: '/2023/0415-0421' }
  ]
}

function sidebarCurrent(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '2023 年刊',
      collapsed: false,
      items: [
        { text: '周刊#2（0422-0505）', link: '0422-0505' },
        { text: '周刊#1（0415-0421）', link: '0415-0421' }
      ]
    }]
}
