// Copyright (c) Pascal Brand
// MIT License

import ligthGallery from 'lightgallery';
import type { LightGallerySettings } from 'lightgallery/lg-settings';
import type { HTMLAttributes } from 'astro/types';
import type { LgQuery } from 'lightgallery/lgQuery';
import type { LightGallery } from 'lightgallery/lightgallery';

export type AstroLightGalleryPluginStrType =
  | 'thumbnail'
  | 'autoplay'
  | 'comment'
  | 'fullscreen'
  | 'hash'
  | 'mediumZoom'
  | 'pager'
  | 'relativeCaption'
  | 'rotate'
  | 'share'
  | 'video'
  | 'vimeoThumbnail'
  | 'zoom';

/**
 * Fix in atro-lightgallery missing plugin settings in LightGallerySettings
 * TODO: Once fixed in lightgallery (cf. PR https://github.com/sachinchoolur/lightGallery/pull/1724),
 * LightGallerySettingsFix can be removed from options types.
 *
 * This new type LightGallerySettingsFix is not exported on purpose, to avoid
 * using it directly as it should be removed once lightgallery is updated.
 * LightGallerySettings must be used instead in external applications
 */
import type { LightGalleryAllSettings } from 'lightgallery/lg-settings';
import type { RelativeCaptionSettings } from 'lightgallery/plugins/relativeCaption/lg-relative-caption-settings';
import type { VimeoThumbnailSettings } from 'lightgallery/plugins/vimeoThumbnail/lg-vimeo-thumbnail-settings';
type LightGalleryAllSettingsFix = LightGalleryAllSettings &
  RelativeCaptionSettings &
  VimeoThumbnailSettings;
type LightGallerySettingsFix = Partial<LightGalleryAllSettingsFix>;

/** List of images, and their attributes, to be displayed in a provided layout */
export interface AstroLightGalleryImgType
  extends Partial<Pick<HTMLAttributes<'img'>, 'loading' | 'alt'>> {
  /** the source of the large image */
  src: string;
  /** the source of the thumbnail image. If not provided, use src (the large one) */
  srcThumb?: string;
  /* caption for the slide, if any */
  subHtml?: string;
}

/** Layout parameters, when the user wants to use an existing layout
 * for the whole gallery.
 * It contains the images of the gallery, the parameters of the chosen
 * layout, ...
 */
export interface AstroLightGalleryLayoutType {
  /** images to be displayed in the gallery */
  imgs: readonly AstroLightGalleryImgType[];

  /** adaptive layout parameters. This is the default layout */
  adaptive?: {
    /** zoom factor (100 by default) to enlarge or reduce the gallery
     * with respect to the original size provided by the layout
     */
    zoom?: number;
  };

  /** classContainer, to be defined by the user in case he wants
   * to enrich the layout default container
   */
  classContainer?: string;

  /** classItem to be defined by the user in case he wants
   * to enrich the layout default item, for example with hover effect... */
  classItem?: string;
}

/** properties passed to the <LightGallery> component
 * It extends a div (that is may have class, style,...), plus other attributes
 */
export interface AstroLightGalleryType extends HTMLAttributes<'div'> {
  /** lightgallery options, to set autoplay, navigation, thumbnails,...
   * check fullset of options: https://www.lightgalleryjs.com/docs/settings
   */
  options?: LightGallerySettings | LightGallerySettingsFix;

  /** plugins to be added manually (such as zoom).
   * note that when possible, the plugins are automatically detected
   * (for example when thumbnail=true in the options)
   */
  addPlugins?: readonly AstroLightGalleryPluginStrType[];

  /** to ease user experience, some default layouts are provided.
   * This ease the lightgallery usage, as only the image list and their attributes
   * has to be provided
   */
  layout?: AstroLightGalleryLayoutType;
}

/** astro components exported, used to create a lightgallery */
export { default as LightGallery } from './components/LightGallery.astro';

function _textColor(text: string, color: string) {
  let colorCode: string;
  if (color === 'FgRed') {
    colorCode = '\x1b[31m';
  } else if (color === 'FgBlue') {
    colorCode = '\x1b[34m';
  } else if (color === 'FgGreen') {
    colorCode = '\x1b[32m';
  } else if (color === 'FgYellow') {
    colorCode = '\x1b[33m';
  } else if (color === 'FgCyan') {
    colorCode = '\x1b[36m';
  } else {
    colorCode = '\x1b[31m';
  } // red by default

  return `${colorCode + text}\x1b[0m`;
}

async function _addPlugin(
  plugins: (new (instance: LightGallery, $LG: LgQuery) => unknown)[],
  pluginType: AstroLightGalleryPluginStrType,
) {
  console.log(_textColor(`astro-lightgallery: add plugin ${pluginType}`, 'FgGreen'));
  let plugin = undefined;

  switch (pluginType) {
    case 'thumbnail':
      plugin = await import('lightgallery/plugins/thumbnail');
      break;
    case 'autoplay':
      plugin = await import('lightgallery/plugins/autoplay');
      break;
    case 'comment':
      plugin = await import('lightgallery/plugins/comment');
      break;
    case 'fullscreen':
      plugin = await import('lightgallery/plugins/fullscreen');
      break;
    case 'hash':
      plugin = await import('lightgallery/plugins/hash');
      break;
    case 'mediumZoom':
      plugin = await import('lightgallery/plugins/mediumZoom');
      break;
    case 'pager':
      plugin = await import('lightgallery/plugins/pager');
      break;
    case 'relativeCaption':
      plugin = await import('lightgallery/plugins/relativeCaption');
      break;
    case 'rotate':
      plugin = await import('lightgallery/plugins/rotate');
      break;
    case 'share':
      plugin = await import('lightgallery/plugins/share');
      break;
    case 'video':
      plugin = await import('lightgallery/plugins/video');
      break;
    case 'vimeoThumbnail':
      plugin = await import('lightgallery/plugins/vimeoThumbnail');
      break;
    case 'zoom':
      plugin = await import('lightgallery/plugins/zoom');
      break;
    default:
      console.log(
        _textColor(`astro-lightgallery: failed adding unknown plugin ${pluginType}`, 'FgRed'),
      );
      break;
  }

  if (plugin != null) {
    plugins.push(plugin.default);
  }
}

export async function createLightGallery(
  id: string,
  options: LightGallerySettings,
  addPlugins: AstroLightGalleryPluginStrType[],
): Promise<LightGallery | undefined> {
  const plugins: (new (instance: LightGallery, $LG: LgQuery) => unknown)[] = [];
  const el = document.getElementById(id);
  if (!el) {
    return undefined;
  }

  const pluginMappings: { condition: boolean; plugin: AstroLightGalleryPluginStrType }[] = [
    { condition: options.autoplay !== undefined, plugin: 'autoplay' },
    { condition: options.fullScreen !== undefined, plugin: 'fullscreen' },
    { condition: options.hash !== undefined, plugin: 'hash' },
    { condition: options.mediumZoom !== undefined, plugin: 'mediumZoom' },
    { condition: options.pager !== undefined, plugin: 'pager' },
    { condition: options.rotate !== undefined, plugin: 'rotate' },
    { condition: options.share !== undefined, plugin: 'share' },
    {
      condition: options.thumbnail !== undefined || options.animateThumb !== undefined,
      plugin: 'thumbnail',
    },
    { condition: options.zoom !== undefined, plugin: 'zoom' },
    // Commented out plugins that need specific option checks:
    // { condition: options.comment !== undefined, plugin: 'comment' },
    // { condition: options.relativeCaption !== undefined, plugin: 'relativeCaption' },
    // { condition: options.video !== undefined, plugin: 'video' },
    // { condition: options.showVimeoThumbnails !== undefined, plugin: 'vimeoThumbnail' },
  ];

  pluginMappings
    .filter((mapping) => mapping.condition)
    .forEach((mapping) => {
      addPlugins.push(mapping.plugin);
    });

  // resolve plugins
  await Promise.all(
    [...new Set(addPlugins)].map(async (pluginStr) => await _addPlugin(plugins, pluginStr)),
  );

  options.plugins = plugins;

  return ligthGallery(el, options);
}

declare class AstroLightgallery extends HTMLElement {
  /** pointer to the Lightgallery structure that was created using "new",
   *  even when not initialized */
  astroLightGallery: Promise<LightGallery | undefined> | undefined;
}

export function getLightGalleryFromUniqueSelector(
  uniqueSelector: string,
): Promise<LightGallery | undefined> | undefined {
  return (document.querySelector(uniqueSelector) as AstroLightgallery)?.astroLightGallery;
}
