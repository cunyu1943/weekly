import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
  title: "村雨遥的好物周刊",
  description: "记录每周看到的有价值的信息，主要针对计算机领域，每周五发布。",
  dest: "public",
  theme: recoTheme({
    primaryColor: '#3aa675',
    style: "@vuepress-reco/style-default",
    logo: "/logo.png",
    author: "村雨遥",
    authorAvatar: "/head.png",
    docsRepo: "https://github.com/cunyu1943/weekly",
    docsBranch: "main",
    docsDir: "docs",
    lastUpdatedText: "上次更新时间",

    // series 为原 sidebar
    series: {
      "/docs/2023/": [
        {
          text: "八月",
          children: ["0812-0818", "0805-0811", "0729-0804"],
          collapsible: true
        },
        {
          text: "七月",
          children: ["0722-0728", "0715-0721", "0708-0714", "0701-0707"],
          collapsible: true
        },
        {
          text: "六月",
          children: ["0624-0630", "0617-0623", "0610-0616", "0603-0609", "0527-0602"],
          collapsible: true
        },
        {
          text: "五月",
          children: ["0520-0526", "0513-0519", "0506-0512", "0429-0505"],
          collapsible: true
        },
        {
          text: "四月",
          children: ["0422-0428", "0415-0421"],
          collapsible: true
        },
      ],
    },

    navbar: [
      { text: "主页", icon: "Home", link: "/" },
      { text: "创刊寄语", icon: "Compass", link: "/docs/intro" },
      { text: "2023 年刊", icon: "DocumentAttachment", link: "/docs/2023/0415-0421" },
      {
        text: "其他项目", icon: "Categories", children: [
          { text: 'JavaPark', icon: "NumberSmall_1", link: 'https://github.com/cunyu1943/JavaPark' },
        ]
      },
    ],
    bulletin: {
      body: [
        {
          type: "text",
          content: `🎉🎉🎉 如果本项目对你有所帮助，那就帮我点个 <a href="https://github.com/cunyu1943/weekly">⭐️ <font color="#3aa675">Star</font></a> 再走吧。`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        {
          type: "title",
          content: "微信 | 公众号",
        },
        {
          type: "text",
          content: `<img src="/contact/contact.png" />`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        {
          type: "title",
          content: "GitHub",
        },
        {
          type: "text",
          content: `
          <ul>
            <li><a href="https://github.com/cunyu1943/weekly/issues">Issues<a/></li>
          </ul>`,
          style: "font-size: 12px;",
        },
        {
          type: "hr",
        },
        {
          type: "buttongroup",
          children: [
            {
              text: "打赏",
              link: "/docs/intro.html#赞助",
            },
          ],
        },
      ],
    },
    // commentConfig: {
    //   type: 'valie',
    //   // options 与 1.x 的 valineConfig 配置一致
    //   options: {
    //     // appId: 'xxx',
    //     // appKey: 'xxx',
    //     // placeholder: '填写邮箱可以收到回复提醒哦！',
    //     // verify: true, // 验证码服务
    //     // notify: true,
    //     // recordIP: true,
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
  // debug: true,
});
