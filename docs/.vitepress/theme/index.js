// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import { Aside_Data } from '../data/AsideData'
import './style/index.css'
// theme/index.ts
import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
import { InjectionKey, NolebaseInlineLinkPreviewPlugin } from '@nolebase/vitepress-plugin-inline-link-preview/client'
import '@nolebase/vitepress-plugin-inline-link-preview/client/style.css'
import { Announcement, DocAsideLogo, HomeUnderline } from '@theojs/lumen'
import '@theojs/lumen/theme'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-info-before': () => h(Announcement),
      'aside-outline-before': () => h(DocAsideLogo, { Aside_Data })
    })
  },
  enhanceApp: ({ app }) => {
    app.component('Home', HomeUnderline)
    app.use(NolebaseGitChangelogPlugin)
    app.use(NolebaseInlineLinkPreviewPlugin)
    app.provide(InjectionKey, {
      // 配置...
    })

    // app.component('Box', DocBox)
    // app.component('Links', DocLinks)
    // app.component('BoxCube', DocBoxCube)
  }
}
