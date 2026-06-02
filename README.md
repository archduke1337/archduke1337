<div align="center">

<a href="https://opbento.vercel.app/api/bento/image?g=archduke1337&z=cd0f0">
  <img src="https://opbento.vercel.app/api/bento/image?g=archduke1337&z=cd0f0" alt="OpBento" width="1200">
</a>

*You expect me to be Perfect and I'm just full of Flaws.*

[![Portfolio](https://img.shields.io/badge/archduke.is--a.dev-000000?style=flat&logo=vercel&logoColor=white)](https://archduke.is-a.dev/about)

## About

This repository automatically updates the OpBento image above with fresh data from various sources.

## Configuration

Create a `.env` file with your own settings:

```env
NAME=Your Name
GITHUB=your-github-username
X_USERNAME=your-x-username
LASTFM_USERNAME=your-lastfm-username
IMAGE_URL=https://your-image-url
PORTFOLIO_URL=https://your-portfolio-url
CACHE_BUST=cache-bust-value
```

## Usage

1. Install Bun: `curl -fsSL https://bun.sh/install | bash`
2. Run the update script: `bun run getNewBento.ts`

The script will fetch a new image URL from the OpBento API and update this README file.

</div>
