import { defineConfig } from 'vitepress'
import { tokenize } from './search'
import { head } from './configs/head'
import { nav } from './configs/nav'
import { sidebar } from './configs/sidebar'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 语言
  lang: 'zh-CN',
  // 网站标题
  title: "村雨遥的好物周刊",
  // 网站描述
  description: "村雨遥的好物周刊，记录每周看到的有价值的信息，主要针对计算机领域，每周五发布。主要包含项目、资料、插件、网站、软件方面的内容。",
  // 仓库名
  base: "/weekly/",
  // 源目录
  srcDir: "src",
  // head
  head,
  // 公式
  markdown: {
    math: true,
    lineNumbers: true,
    image: {
      lazyLoading: true
    }
  },

  themeConfig: {
    logo: 'logo.png',

    // 大纲标题级别
    outline: {
      level: [2, 3],
      label: '本页大纲'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          // https://lucaong.github.io/minisearch/modules/MiniSearch.html
          options: {
            tokenize
          },
          searchOptions: {
            combineWith: "AND",
            fuzzy: 0.1,
            prefix: true,
            boost: {
              title: 4,
              text: 2,
            },
          }
        },
      },
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/cunyu1943/weekly/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    // 上次更新
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    // 页脚
    footer: {
      message: 'Released under the Apache License.',
      copyright: 'Copyright © 村雨遥'
    },

    // 导航栏
    nav,

    // 侧边栏
    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cunyu1943' }
    ]
  }
})