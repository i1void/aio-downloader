# aio-downloader

All-in-one social media downloader — TikTok, Instagram, Facebook.

**Live:** https://aio.herta.web.id

## Routes

| URL | Page |
|-----|------|
| `/` | Landing page |
| `/tiktok` | TikDL — TikTok Downloader |
| `/fesnuk` | FesnukDL — Facebook Downloader |
| `/instagram` | IGram DL — Instagram Downloader |

## API Endpoints

```
GET /api/tiktok?url=<tiktok_url>
GET /api/facebook?url=<facebook_url>
GET /api/instagram?url=<instagram_url>
```

## Structure

```
/
├── api/
│   ├── tiktok.js
│   ├── facebook.js
│   └── instagram.js
├── public/
│   ├── index.html       ← landing page
│   ├── tiktok.html
│   ├── fesnuk.html
│   ├── instagram.html
│   ├── style.css        ← shared styles
│   └── shared.js        ← shared JS (theme, menu, helpers)
├── package.json
└── vercel.json
```

## Deploy

Push to GitHub, connect ke Vercel. Set custom domain `aio.herta.web.id`.

## Dev

```bash
npm install -g vercel
vercel dev
```

Built with ❤️ by [1void](https://github.com/i1void)
