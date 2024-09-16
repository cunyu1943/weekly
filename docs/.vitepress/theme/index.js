// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './style/index.css'
import { Aside_Data } from '../data/AsideData'
// theme/index.ts
import '@theojs/lumen/theme'
import { DocAsideLogo, Announcement, HomeUnderline } from '@theojs/lumen'
import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'

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
    // app.component('Box', DocBox)
    // app.component('Links', DocLinks)
    // app.component('BoxCube', DocBoxCube)
  }
}
