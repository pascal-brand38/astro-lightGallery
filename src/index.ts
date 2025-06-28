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

  addPlugins?: string[],
}

/** astro components exported, used to create a lightgallery */
export { default as LightGallery } from './components/LightGallery.astro'

function _textColor(text: string, color: string) {
  let colorCode: string
  if      (color === 'FgRed')    { colorCode = '\x1b[31m' }
  else if (color === 'FgBlue')   { colorCode = '\x1b[34m' }
  else if (color === 'FgGreen')  { colorCode = '\x1b[32m' }
  else if (color === 'FgYellow') { colorCode = '\x1b[33m' }
  else if (color === 'FgCyan')   { colorCode = '\x1b[36m' }
  else { colorCode = '\x1b[31m' }   // red by default
  return colorCode + text + '\x1b[0m'
}

async function _addPlugin(plugins: (new (instance: LightGallery, $LG: LgQuery) => any)[], pluginStr: string) {
  console.log(_textColor(`astro-lightgallery: add plugin ${pluginStr}`, 'FgGreen'))
  let plugin = undefined
  switch (pluginStr) {
    case 'thumbnail':
      plugin = await import('lightgallery/plugins/thumbnail')
      break
    default:
      console.log(_textColor(`astro-lightgallery: failed adding unknown plugin ${pluginStr}`, 'FgRed'))
      break
  }
  if (plugin !== undefined) {
    plugins.push(plugin.default)
  }
}

export async function createLightGallery(id: string, options: LightGallerySettings, addPlugins: string[]) {
  const plugins: (new (instance: LightGallery, $LG: LgQuery) => any)[] = []
  const el = document.getElementById(id)
  if (el) {
    // automatic add plugins
    if ((options.thumbnail!==undefined) || (options.animateThumb!==undefined)) {
      addPlugins.push('thumbnail')
    }

    // remove duplicates
    addPlugins = [... new Set(addPlugins)]

    // add plugins
    await Promise.all(addPlugins.map(async (pluginStr) => await _addPlugin(plugins, pluginStr)))

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
