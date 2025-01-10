import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
    { text: ' 主页', link: '/' },
    { text: ' 2025 年刊', link: '/2025/1228-0103' },
    {
        text: '往昔留档',
        items: [
            { text: '🐉 2024 年刊', link: '/archive/2024/0101-0105' },
            { text: '🐇 2023 年刊', link: '/archive/2023/0415-0421' },
        ]
    },
    { text: '', link: '/archive/2023/0415-0421' },
    { text: '超大流量卡', link: 'https://ym.ksjhaoka.com/?s=Ltxbbs9W330131' }
]