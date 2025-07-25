// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { Aside_Data } from '../data/AsideData'
// theme/index.ts
import '@theojs/lumen/style'
import { Notice, Underline, Aside } from '@theojs/lumen'
import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-hero-info-before': () => h(Notice),
      'aside-outline-before': () => h(Aside, { Aside_Data })
    })
  },
  enhanceApp: ({ app }) => {
    app.component('Home', Underline)
    app.use(NolebaseGitChangelogPlugin)
    // app.component('Box', DocBox)
    // app.component('Links', DocLinks)
    // app.component('BoxCube', DocBoxCube)
  }
}
