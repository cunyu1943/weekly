import { defineConfig } from 'vitepress'
import { groupIconVitePlugin, groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { nav } from './configs/nav'
import { sidebar } from './configs/sidebar'
import { AnnouncementPlugin } from 'vitepress-plugin-announcement'
import { RSSOptions, RssPlugin } from 'vitepress-plugin-rss'
// import { pagefindPlugin } from 'vitepress-plugin-pagefind'
import { GitChangelog, GitChangelogMarkdownSection, } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { SponsorPlugin } from 'vitepress-plugin-sponsor'


const baseUrl = 'https://cunyu1943.github.io'
const RSS: RSSOptions = {
  title: '村雨遥的好物周刊',
  baseUrl,
  copyright: 'Copyright © ' + new Date().getFullYear() + '<a href="https://github.com/cunyu1943">村雨遥</a>',
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 代码组图标
  markdown: {
    config: (md) => {
      md.use(groupIconMdPlugin) //代码组图标
      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options);
        if (tokens[idx].tag === 'h1') htmlResult += `<ArticleMetadata />`;
        return htmlResult;
      }
    },
  },

  vite: {
    plugins: [

      // 打赏插件
      SponsorPlugin({
        /**
         * 打赏模块样式
         */
        type: 'simple',
        aliPayQR: '/imgs/award/alipay.jpg',
        weChatQR: '/imgs/award/wechatpay.jpg'
      }),
      // 基于 Git
      GitChangelog({
        // 填写在此处填写您的仓库链接
        repoURL: () => 'https://github.com/cunyu1943/weekly',
      }),
      GitChangelogMarkdownSection(),
      // 离线全文搜索（暂注释，插件存在兼容性问题）
      // pagefindPlugin(),
      // RSS
      RssPlugin(RSS),
      //代码组图标
      groupIconVitePlugin(),
      // 公告
      AnnouncementPlugin({
        title: '公告',
        body: [
          { type: 'text', content: '👇 微信 👇<------->👇 公众号 👇' },
          {
            type: 'image',
            src: '/imgs/imgs/contact/wechat.jpg',
            style: 'display: inline-block;width:46%;padding-right:6px'
          },
          {
            type: 'image',
            src: 'imgs/contact/wepublic.jpg',
            style: 'display: inline-block;width:46%;padding-left:6px'
          }
        ],
        footer: [
          {
            type: 'text',
            content: '还可以通过这里找到我'
          },
          {
            type: 'button',
            content: '数字花园',
            link: 'https://yuque.com/cunyu1943'
          },
          {
            type: 'button',
            content: 'ima知识库',
            link: 'https://ima.qq.com/wiki/?shareId=2d93931f9ba4bdf4d9d25cb112b5f17451e9367d2dbb4f63fb9a32575899b73c',
            props: {
              type: 'success'
            }
          },
        ],
      })
    ],
  },

  // 站点名
  title: "村雨遥的好物周刊",
  // 站点描述
  description: "发现好用的网站、软件、项目、资料、插件等资源",
  // 纯净链接
  cleanUrls: true,
  // 预演
  lang: 'zh-CN',
  // 源目录
  srcDir: "src",
  // 仓库名
  base: "/weekly/",
  // 深色主题
  appearance: 'dark',
  // 忽略死链
  ignoreDeadLinks: false,
  // 站点地图
  sitemap: {
    hostname: 'https://cunyu1943.github.io',
  },
  lastUpdated: true,

  // 主题配置
  themeConfig: {
    // 本地搜索
    search: { provider: 'local' },
    // logo
    logo: '/imgs/site/logo.png',
    // 隐藏站点标题
    siteTitle: false,

    // 页脚
    footer: {
      // message: 'Released under the MIT License.', 
      copyright: 'Copyright © ' + new Date().getFullYear() + '<a href="https://github.com/cunyu1943">村雨遥</a>',
    },

    //上次更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full', // 可选值full、long、medium、short
        timeStyle: 'medium' // 可选值full、long、medium、short
      },
    },

    //自定义上下页名
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },

    // 侧边栏文字更改(移动端)
    sidebarMenuLabel: '目录',

    //返回顶部文字修改
    returnToTopLabel: '返回顶部',
    // 大纲
    outline: {
      level: [2, 3], // 显示2-4级标题
      // level: 'deep', // 显示2-6级标题
      label: '大纲' // 文字显示
    },

    //编辑本页
    editLink: {
      pattern: 'https://github.com/cunyu1943/weekly/edit/main/docs/:path', // 改成自己的仓库
      text: '我要纠错'
    },
    // 导航栏
    nav: nav,
    // 侧边栏
    sidebar: sidebar,
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cunyu1943/weekly' },
    ]
  }
})
