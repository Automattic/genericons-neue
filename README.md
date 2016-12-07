# Genericons Neue

Genericons Neue are generic looking icons, suitable for a blog or simple website.

![Genericons Neue](https://cldup.com/4zc6OeKs24.png)

Genericons Neue is a new version of [Genericons](https://github.com/Automattic/Genericons), with a refreshed look. Logos have been removed, however, so if you're upgrading from Genericons *you can't use Genericons Neue as a drop-in replacement*. If you used only icons, you probably can, but be sure to test thoroughly. For a great set logos, please consider [Social Logos](https://github.com/Automattic/social-logos).


## Usage

The icon set comes in three versions:

- Minimized SVG files in the `svg-min` directory
- An SVG sprite (not compatible with IE) in the `svg-sprite` directory
- An icon font ([shows up blurry in Chrome](https://code.google.com/p/chromium/issues/detail?id=426333)) in the `icon-font` directory
- For Node projects, there's [an npm module](https://www.npmjs.com/package/genericons-neue)

Genericons Neue can be used in WordPress themes or other web related projects. CSSTricks has great instructions on [how to use SVG files](https://css-tricks.com/using-svg/), and [how to use icon fonts](https://css-tricks.com/html-for-icon-font-usage/). You can pick the one that [works best for your project](https://css-tricks.com/icon-fonts-vs-svg/).


## Icon Set Style Guidelines

- 16pt base grid
- mostly straight angles, with occasional rounded edges for style
- flat, bidimensional look
- 2pt lines generally
- 1.5pt lines when necessary for clarity, be sure to have one edge on the pixelgrid
- 2pt corner radius
- no logos
- mostly solid icons

These are not rules, they are guidelines that can be broken with the proper reason.


## Building Your Own

Genericons Neue is built semi-automatically. SVG source files in the `svg` directory are processed and converted into minimized SVGs, a sprite, and an icon font using `grunt`. To build your own version of Genericons Neue, follow these instructions:

```
brew install ttfautohint fontforge --with-python
npm install
npm run build
```


## Pixel Grid

Genericons Neue has been designed for a 16px grid. That means icons will look their best at that size, or 2x multiples thereof, such as 32px or 64px. Icons will also look reasonably crisp at in-between 1.5x multiples such as 24px or 48px, but edges _will_ look blurry at arbitrary multiples. Please don't size them at 17px, for example.
