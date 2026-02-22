# 11ty StartBootstrap Coming Soon
[Demo soon.000000076.xyz](https://soon.000000076.xyz)

Eleventy (11ty) port of the Start Bootstrap Coming Soon theme using:

- Eleventy `3.1.2`
- Nunjucks templates
- ESM config (`eleventy.config.js`)
- Luxon filters

## Quick Start

```bash
npm install
npx @11ty/eleventy --serve
```

Build output goes to `_site`.

## Site Configuration

All site-level values are in `_data/metadata.yml`, including:

- `title`
- `description`
- `url`
- `favicon`
- `formspree_key`
- social links and robots/humans values

## Templates

- `src/index.njk`
- `src/sitemap.xml.njk`
- `src/robots.txt.njk`
- `src/humans.txt.njk`
- `src/_includes/layouts/base.njk`

## Deployment

XMIT GitHub Actions workflow:

- `.github/workflows/xmit-deploy.yml`

Set `XMIT_KEY` in repository secrets and update `XMIT_SITE` in the workflow (or pass it via `workflow_dispatch`).

## License

MIT (unchanged from the original Start Bootstrap project).
