import type { Component } from 'solid-js';
import { useI18n } from '@solid-primitives/i18n';
import wordmark from '../assets/wordmark-dark.svg';
import builder from '../assets/supporters/builder.png';
import sauce from '../assets/supporters/saucelabs.png';
import cloudflare from '../assets/supporters/cloudflare.png';
import netlify from '../assets/supporters/netlify.png';
import Social from './Social';

const Footer: Component = () => {
  const [t] = useI18n();
  // const data = useData<{ isDark: true }>(0);
  return (
      <div
        dir={t('global.dir', {}, 'ltr')}
        class="py-10 mt-16 border-t dark:text-white dark:bg-solid-gray mx-2"
      >
        <div class="px-7 md:px-0 py-10 lg:px-12 container flex flex-col lg:flex-row items-center space-y-10 lg:space-y-0 lg:space-x-20">
          <img class="w-52" src={wordmark} alt="Solid logo" />
          <div class="text-sm max-w-5xl">
            <p
              innerHTML={t('global.footer.declaration', {
                license: t('global.footer.license'),
                contributors: '/contributors',
              })}
            />
            <div class="relative justify-center justify-items-center mb-8 mt-12 grid gap-2 grid-cols-2 p-2 bg-white rounded-3xl md:mb-5 md:mt-7 md:rounded-full md:justify-start md:flex md:gap-0 items-center">
              <div class="text-xs m-0 text-center absolute -top-5 left-0 font-semibold text-gray-600 md:text-sm md:static md:text-left md:my-4 md:ml-5 md:mr-2">
                {t('global.footer.sponsored_by')}
              </div>
              <a
                class="mx-4 hover:opacity-50 transition"
                target="_blank"
                rel="noopener"
                href="https://www.cloudflare.com/"
              >
                <img class="w-32" src={cloudflare} alt="cloudflare" />
              </a>
              <a
                class="mx-4 hover:opacity-50 transition"
                target="_blank"
                rel="noopener"
                href="https://www.netlify.com/"
              >
                <img class="w-32" src={netlify} alt="netlify" />
              </a>
              <a
                class="mx-4 hover:opacity-50 transition"
                target="_blank"
                rel="noopener"
                href="https://www.builder.io/"
              >
                <img class="w-24" src={builder} alt="builder.io" />
              </a>
              <a
                class="mx-4 hover:opacity-50 transition"
                target="_blank"
                rel="noopener"
                href="https://www.saucelabs.com/"
              >
                <img class="w-32" src={sauce} alt="SAUCELABS" />
              </a>
            </div>
            <div class="flex justify-between">
              <p class="text-sm text-center text-gray-600">
                {t('global.footer.updated', {
                  date: '2021/12/24, 9:00pm',
                  version: '1.3.0',
                })}
              </p>
              {/* <button class="flex text-gray-600" onClick={() => data.isDark = !!data.isDark}>
                <img class="w-5" src={darkLight} />&nbsp;
                {data.isDark ? 'Disable dark mode' : 'Enable dark mode'}
              </button> */}
            </div>
            <ul class="lg:hidden flex justify-center items-center pt-12 space-x-3">
              <Social />
            </ul>
          </div>
        </div>
      </div>
  );
};

export default Footer;
