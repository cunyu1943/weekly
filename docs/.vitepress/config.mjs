import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'
import { defineConfig } from 'vitepress'
// import { head } from './configs/head'
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

  // head,
  // 公式
  markdown: {
    math: true,
    lineNumbers: true,
    image: {
      lazyLoading: true
    },
    config(md) {
      // 其他 markdown-it 配置...
      md.use(InlineLinkPreviewElementTransform)
    }
  },

  vite: {
    plugins: [
      GitChangelog({
        // 填写在此处填写您的仓库链接
        repoURL: () => 'https://github.com/cunyu1943/weekly',
      }),
      GitChangelogMarkdownSection(),
    ],
  },

  themeConfig: {
    logo: 'logo.png',

    // 大纲标题级别
    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 搜索
    search: {
      provider: 'local',
      options: {

        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                },
              },
            },
          },
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
