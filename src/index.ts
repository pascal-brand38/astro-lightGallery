// Copyright (c) Pascal Brand
// MIT License

import ligthGallery from 'lightgallery'
// import type { LightGallerySettings } from 'lightgallery/types'
import type { LightGallerySettings } from 'lightgallery/lg-settings';
import type { HTMLAttributes } from 'astro/types'
import type { LgQuery } from 'lightgallery/lgQuery'
type LightGallery = import('lightgallery/lightgallery.d.ts').LightGallery;


/** properties passed to the <LightGallery> component
 * It extends a div (that is may have class, style,...), plus other attributes
 */
export interface AstroLightGalleryType extends HTMLAttributes<"div"> {
  /** lightgallery options, to set autoplay, navigation, thumbnails,...
   * check fullset of options: TODO
   */
  options?: LightGallerySettings,

  /** unique class to be able to retrieve the lightgallery instance, if required
   * When undefined, an automatic unique id name is provided
   */
  // uniqueClass?: string,

  /** a thumbnail slider is build, this parameter is provided on the main slider
   * (the one with big slides, not the one to track the progress) and equal
   * the unique class of the thumbnail slider
   */
  // linkToThumbUniqueClass?: string,
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
