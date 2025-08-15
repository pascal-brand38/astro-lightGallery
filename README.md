<div align="center" style="background-color: black; padding: 16px;">
  <a href="https://lightgalleryjs.com" target="_blank"><img width="70" src="images/lightgallery-logo.png"></a>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://astro.build/" target="_blank"><img height="70" src="images/astro-logo.png"></a>

  <h1>Astro LightGallery</h1>

  <p>
    Astro LightGallery is the native Astro component for
    <a href="https://www.lightgalleryjs.com">lightGallery</a>.
    lightGallery is a feature-rich, modular JavaScript gallery plugin for
    building beautiful image and video galleries for the web and the mobile
  </p>

  <p>
    It provides some layouts to ease integration of
    lightgallery.
  </p>

  [Demo](https://pascal-brand38.github.io/astro-dev/packages/astro-lightgallery)

  <a href="https://pascal-brand38.github.io/astro-dev/packages/astro-lightgallery" target="_blank">
    <img src="images/astro-lightGallery.gif">
  </a>

</div>

<br>
<br>



# Installation
Get the latest version from NPM:
```
$ npm install astro-lightgallery
```

<br>

# License
Astro-lightGallery is released under the MIT license.

Astro-lightGallery is using [lightGallery](https://github.com/sachinchoolur/lightGallery).
lightGallery is a **free and open-source library**, however,
if you are using the library for business, commercial sites, projects,
and applications, choose the **commercial license** to keep your source proprietary, to yourself.
Please refer to the [lightGallery license page](https://www.lightgalleryjs.com/license/)

<br>

# Usage

Here is a simple example that is using the default layout (adaptive).
Layout can be customized, by defining your own classes definition
(as for example adding effects on hover)

```jsx
---
import { LightGallery } from 'astro-lightgallery'
---
<LightGallery
  layout={{
    imgs: [
      { src: "/img01.jpg", },
      { src: "/img02.jpg", },
      ...
    ]
  }}
  options={{
    thumbnail: true,
  }}
/>
```

## Complex Examples

Layout can be customized. But we may also want to use
astro-lightgallery without layouts, and use native lightgallery
scheme.

Please check the [online doc](https://pascal-brand38.github.io/astro-dev/packages/astro-lightgallery) for a fullset of examples, including navigation and thumbnails.

Full code is provided.
