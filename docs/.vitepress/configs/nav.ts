import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
    { text: '🏠 主页', link: '/' },
    { text: '🐎 2026 年刊', link: '/2026/latest' },
    
    {
        text: '🗃️ 往昔留档',
        items: [
            { text: '🐍 2025 年刊', link: '/archive/2025/1228-0103' },
            { text: '🐉 2024 年刊', link: '/archive/2024/0101-0105' },
            { text: '🐇 2023 年刊', link: '/archive/2023/0415-0421' },
        ]
    },
    {
        text: '🗄️ 开源项目',
        items: [
            { text: '🅱️ blog', link: 'https://github.com/cunyu1943/blog' },
            { text: '☕️ JavaPark', link: 'https://github.com/cunyu1943/JavaPark' },
            { text: '🍃 Spring Boot Demos', link: 'https://github.com/cunyu1943/spring-boot-demos' },
        ]
    },
]