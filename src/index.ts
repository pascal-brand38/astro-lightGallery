// Copyright (c) Pascal Brand
// MIT License

import ligthGallery from 'lightgallery'
import type { LightGallerySettings } from 'lightgallery/lg-settings';
import type { HTMLAttributes } from 'astro/types'
import type { LgQuery } from 'lightgallery/lgQuery'
type LightGallery = import('lightgallery/lightgallery.d.ts').LightGallery;

type pluginStrType = (
  'thumbnail' |
  'autoplay' |
  'comment' |
  'fullscreen' |
  'hash' |
  'mediumZoom' |
  'pager' |
  'relativeCaption' |
  'rotate' |
  'share' |
  'video' |
  'vimeoThumbnail' |
  'zoom'
  )

/** properties passed to the <LightGallery> component
 * It extends a div (that is may have class, style,...), plus other attributes
 */
export interface AstroLightGalleryType extends HTMLAttributes<"div"> {
  /** lightgallery options, to set autoplay, navigation, thumbnails,...
   * check fullset of options: https://www.lightgalleryjs.com/docs/settings
   */
  options?: LightGallerySettings,

  addPlugins?: pluginStrType[],
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

async function _addPlugin(plugins: (new (instance: LightGallery, $LG: LgQuery) => any)[], pluginStr: pluginStrType) {
  console.log(_textColor(`astro-lightgallery: add plugin ${pluginStr}`, 'FgGreen'))
  let plugin= undefined
  switch (pluginStr) {
    case 'thumbnail':
      plugin = await import('lightgallery/plugins/thumbnail')
      break
    case 'autoplay':
      plugin = await import('lightgallery/plugins/autoplay')
      break
    case 'comment':
      plugin = await import('lightgallery/plugins/comment')
      break
    case 'fullscreen':
      plugin = await import('lightgallery/plugins/fullscreen')
      break
    case 'hash':
      plugin = await import('lightgallery/plugins/hash')
      break
    case 'mediumZoom':
      plugin = await import('lightgallery/plugins/mediumZoom')
      break
    case 'pager':
      plugin = await import('lightgallery/plugins/pager')
      break
    case 'relativeCaption':
      plugin = await import('lightgallery/plugins/relativeCaption')
      break
    case 'rotate':
      plugin = await import('lightgallery/plugins/rotate')
      break
    case 'share':
      plugin = await import('lightgallery/plugins/share')
      break
    case 'video':
      plugin = await import('lightgallery/plugins/video')
      break
    case 'vimeoThumbnail':
      plugin = await import('lightgallery/plugins/vimeoThumbnail')
      break
    case 'zoom':
      plugin = await import('lightgallery/plugins/zoom')
      break
    default:
      console.log(_textColor(`astro-lightgallery: failed adding unknown plugin ${pluginStr}`, 'FgRed'))
      break
  }
  if (plugin !== undefined) {
    plugins.push(plugin.default)
  }
}

export async function createLightGallery(id: string, options: LightGallerySettings, addPlugins: pluginStrType[]) {
  const plugins: (new (instance: LightGallery, $LG: LgQuery) => any)[] = []
  const el = document.getElementById(id)
  if (el) {
    // automatic add plugins
    if (options.autoplay!==undefined) { addPlugins.push('autoplay') }
    // if (options.comment !== undefined) { addPlugins.push('comment') }
    if (options.fullScreen !== undefined) { addPlugins.push('fullscreen') }
    if (options.hash !== undefined) { addPlugins.push('hash') }
    if (options.mediumZoom !== undefined) { addPlugins.push('mediumZoom') }
    if (options.pager !== undefined) { addPlugins.push('pager') }
    // if (options.relativeCaption !== undefined) { addPlugins.push('relativeCaption') }
    if (options.rotate !== undefined) { addPlugins.push('rotate') }
    if (options.share !== undefined) { addPlugins.push('share') }
    if ((options.thumbnail!==undefined) || (options.animateThumb!==undefined)) { addPlugins.push('thumbnail') }
    // if (options.video !== undefined) { addPlugins.push('video') }
    // if (options.showVimeoThumbnails !== undefined) { addPlugins.push('vimeoThumbnail') }
    if (options.zoom !== undefined) { addPlugins.push('zoom') }

    // remove duplicates
    addPlugins = [... new Set(addPlugins)]

    // add plugins
    await Promise.all(addPlugins.map(async (pluginStr) => await _addPlugin(plugins, pluginStr)))

    options.plugins = plugins

    ligthGallery(el, options)
  }
}
