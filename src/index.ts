// Copyright (c) Pascal Brand
// MIT License

import ligthGallery from 'lightgallery'
import type { LightGallerySettings } from 'lightgallery/lg-settings';
import type { HTMLAttributes } from 'astro/types'
import type { LgQuery } from 'lightgallery/lgQuery'
type LightGallery = import('lightgallery/lightgallery.d.ts').LightGallery;


/** properties passed to the <LightGallery> component
 * It extends a div (that is may have class, style,...), plus other attributes
 */
export interface AstroLightGalleryType extends HTMLAttributes<"div"> {
  /** lightgallery options, to set autoplay, navigation, thumbnails,...
   * check fullset of options: https://www.lightgalleryjs.com/docs/settings
   */
  options?: LightGallerySettings,

}

/** astro components exported, used to create a lightgallery */
export { default as LightGallery } from './components/LightGallery.astro'


export async function createLightGallery(id: string, options: LightGallerySettings) {
  const plugins: (new (instance: LightGallery, $LG: LgQuery) => any)[]  = []
  const el = document.getElementById(id)
  if (el) {
    if (options.thumbnail || options.animateThumb) {
      const plugin = await import('lightgallery/plugins/thumbnail')
      plugins.push(plugin.default)
    }
    options.plugins = plugins

    ligthGallery(el, options)
  }
}

// other plugins to consider:
// import autoplay from 'lightgallery/plugins/autoplay'
// import comment from 'lightgallery/plugins/comment'
// import fullscreen from 'lightgallery/plugins/fullscreen'
// import hash from 'lightgallery/plugins/hash'
// import mediumZoom from 'lightgallery/plugins/mediumZoom'
// import pager from 'lightgallery/plugins/pager'
// import relativeCaption from 'lightgallery/plugins/relativeCaption'
// import rotate from 'lightgallery/plugins/rotate'
// import share from 'lightgallery/plugins/share'
// import video from 'lightgallery/plugins/video'
// import vimeoThumbnail from 'lightgallery/plugins/vimeoThumbnail'
// import zoom from 'lightgallery/plugins/zoom'
