import { Component, For } from 'solid-js';
import downloadArrow from '../assets/download-arrow.svg';
import { Footer } from '../components/Footer';
import { useI18n } from '@solid-primitives/i18n';
import { useRouteReadyState } from '../utils/routeReadyState';
import { copyToClipboard } from '@solid-primitives/clipboard';

const assets = [
  {
    title: 'With Wordmark',
    background: 'bg-white dark:border-solid-darkLighterBg',
    example: '/img/logo/with-wordmark/logo.svg',
    assets: {
      SVG: '/img/logo/with-wordmark/logo.svg',
      PNG: '/img/logo/with-wordmark/logo.png',
      EPS: '/img/logo/with-wordmark/logo.eps',
      JPG: '/img/logo/with-wordmark/logo.jpg',
    },
  },
  {
    title: 'Dark With Wordmark',
    background: 'bg-solid-gray',
    example: '/img/logo/dark-with-wordmark/logo.svg',
    assets: {
      SVG: '/img/logo/dark-with-wordmark/logo.svg',
      PNG: '/img/logo/dark-with-wordmark/logo.png',
      EPS: '/img/logo/dark-with-wordmark/logo.eps',
      JPG: '/img/logo/dark-with-wordmark/logo.jpg',
    },
  },
  {
    title: 'Without Wordmark',
    background: 'bg-white',
    example: '/img/logo/without-wordmark/logo.svg',
    assets: {
      SVG: '/img/logo/without-wordmark/logo.svg',
      PNG: '/img/logo/without-wordmark/logo.png',
      EPS: '/img/logo/without-wordmark/logo.eps',
      JPG: '/img/logo/without-wordmark/logo.jpg',
    },
  },
  {
    title: 'Dark Without Wordmark',
    background: 'bg-solid-gray',
    example: '/img/logo/dark-without-wordmark/logo.svg',
    assets: {
      SVG: '/img/logo/dark-without-wordmark/logo.svg',
      PNG: '/img/logo/dark-without-wordmark/logo.png',
      EPS: '/img/logo/dark-without-wordmark/logo.eps',
      JPG: '/img/logo/dark-without-wordmark/logo.jpg',
    },
  },
  {
    title: 'Only Wordmark',
    background: 'bg-white dark:border-solid-darkLighterBg',
    example: '/img/logo/wordmark/logo.svg',
    assets: {
      SVG: '/img/logo/wordmark/logo.svg',
      PNG: '/img/logo/wordmark/logo.png',
      EPS: '/img/logo/wordmark/logo.eps',
      JPG: '/img/logo/wordmark/logo.jpg',
    },
  },
  {
    title: 'Dark Only Wordmark',
    background: 'bg-solid-gray',
    example: '/img/logo/dark-wordmark/logo.svg',
    assets: {
      SVG: '/img/logo/dark-wordmark/logo.svg',
      PNG: '/img/logo/dark-wordmark/logo.png',
      EPS: '/img/logo/dark-wordmark/logo.eps',
      JPG: '/img/logo/dark-wordmark/logo.jpg',
    },
  },
];

const AssetPanel: Component<{
  title: string;
  example: string;
  assets: Record<string, string>;
  background: string;
}> = ({ title, assets, example, background }) => {
  const [t] = useI18n();
  const slug = title.replaceAll(' ', '_').toLowerCase();
  return (
    <div class="shadow-md">
      <div class="border-b p-5 dark:border-solid-darkLighterBg">
        {t(`media.resources.${slug}`, {}, title)}
      </div>
      <div class={`flex h-56 items-center justify-center px-10 py-8 ${background}`}>
        <img class="max-h-20" src={example} alt={title} />
      </div>
      <div class="text-solid grid grid-cols-4 border-b border-t text-sm dark:border-solid-darkLighterBg">
        {Object.entries(assets).map(([name, path]) => (
          <a
            class="flex justify-center border-r p-3 transition hover:opacity-50 dark:border-solid-darkLighterBg"
            download={path.split('/').pop()}
            href={path}
          >
            <span class="sr-only">Download asset</span>
            <img class="mr-3 w-4" alt="Download Arrow" src={downloadArrow} /> {name}
          </a>
        ))}
      </div>
    </div>
  );
};

const Media: Component = () => {
  const [t] = useI18n();
  copyToClipboard;
  useRouteReadyState();
  return (
    <div class="flex flex-col">
      <div class="container my-10 px-3 pb-10 pt-5 lg:px-12">
        <div class="mb-10 gap-10 md:grid md:grid-cols-6">
          <div class="col-span-2">
            <div class="mb-8">{t('media.copy')}</div>
            <div class="flex justify-between border-2 border-b-0 p-4 dark:border-solid-darkLighterBg">
              <div class="inline-block w-5/12">{t('media.brand_font', {}, 'Brand Font')}</div>{' '}
              <div class="text-md">Gordita</div>
            </div>
            <div class="between flex h-36 items-end justify-between bg-solid-default p-4 text-white">
              <div>{t('media.primary', {}, 'Primary Color')}</div>
              <div class="cursor-pointer text-sm hover:opacity-50" use:copyToClipboard>
                #2c4f7c
              </div>
            </div>
            <div class="flex h-28 items-end justify-between bg-solid-medium p-4 text-white">
              <div>{t('media.secondary', {}, 'Secondary Color')}</div>
              <div class="cursor-pointer text-sm hover:opacity-50" use:copyToClipboard>
                #335d92
              </div>
            </div>
            <div class="flex h-20 items-end justify-between bg-solid-light p-4 text-white">
              <div>{t('media.light', {}, 'Light Color')}</div>
              <div class="cursor-pointer text-sm hover:opacity-50" use:copyToClipboard>
                #446b9e
              </div>
            </div>
            <div class="flex h-20 items-end justify-between bg-solid-accent p-4 text-white">
              <div>{t('media.accent', {}, 'Accent Color')}</div>
              <div class="cursor-pointer text-sm hover:opacity-50" use:copyToClipboard>
                #66e6ac
              </div>
            </div>
            <div class="flex h-20 items-end justify-between bg-solid-secondaccent p-4 text-white">
              <div>{t('media.second_accent', {}, 'Second Accent Color')}</div>
              <div class="cursor-pointer text-sm hover:opacity-50" use:copyToClipboard>
                #0CDC73
              </div>
            </div>
            <div class="mt-3 text-right text-xs text-gray-500">{t('media.copy_hex')}</div>
          </div>
          <div class="col-span-4 col-end-7 mt-9 md:mt-0">
            <div class="gap-4 space-y-5 md:space-y-0 lg:grid lg:grid-cols-2">
              <For each={assets}>{(props) => <AssetPanel {...props} />}</For>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Media;
