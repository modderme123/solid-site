import { Component } from 'solid-js';
import { Newsletter } from './Newsletter';
import { Social } from './Social';
import builder from '../assets/supporters/builder.webp';
import cloudflare from '../assets/supporters/cloudflare.webp';
import divriots from '../assets/supporters/divriots.webp';
import jetbrains from '../assets/supporters/jetbrains.webp';
import netlify from '../assets/supporters/netlify.webp';
import sauce from '../assets/supporters/saucelabs.webp';
import stytch from '../assets/supporters/stytch.webp';
import { useI18n } from '@solid-primitives/i18n';
import vercel from '../assets/supporters/vercel.webp';
import wordmark from '../assets/wordmark-dark.svg';

const Supporter: Component<{
  img: string;
  alt: string;
  href: string;
}> = (props) => (
  <a
    class="mx-4 grid transition hover:opacity-50 dark:brightness-150"
    target="_blank"
    rel="noopener"
    href={props.href}
  >
    <img class="m-auto w-40 md:m-0" src={props.img} alt={props.alt} loading="lazy" />
  </a>
);

export const Footer: Component = () => {
  const [t] = useI18n();
  return (
    <div
      dir={t('global.dir', {}, 'ltr') as 'ltr' | 'rtl'}
      class="mx-2 mt-5 rounded-tl-3xl rounded-tr-3xl bg-solid-lightgray py-10 dark:bg-solid-darkLighterBg"
    >
      <div class="container flex flex-col items-center space-y-10 px-7 py-10 md:px-0 lg:flex-row lg:space-x-20 lg:space-y-0 lg:px-12">
        <img class="w-52 dark:invert" src={wordmark} alt="Solid logo" />
        <div class="text-sm">
          <Newsletter
            title={t('global.newsletter.title', {}, 'Sign up for SolidJS News')}
            className="mb-7 py-3"
          />
          <p
            innerHTML={t('global.footer.declaration', {
              license: t('global.footer.license'),
              contributors: '/contributors',
            })}
          />
          <p class="mt-2">
            {t(
              'global.newsletter.trademark',
              {},
              'SolidJS and logo are trademarks of the SolidJS project and Core Team. Gordita font copyright and licensed non-commercially from typeatelier.com.',
            )}
          </p>
          <div class="relative mb-8 mt-12 flex flex-col items-center justify-center justify-items-center gap-12 bg-white/30 p-7 dark:bg-solid-darkbg/20 md:mb-5 md:mt-7 md:flex-row md:justify-start md:rounded-3xl">
            <span class="text-center text-lg font-semibold text-gray-600 dark:text-white md:static md:w-1/6 md:text-left">
              {t('global.footer.sponsored_by')}
            </span>
            <div class="grid w-full auto-rows-fr grid-cols-1 gap-8 sm:grid-cols-2 md:auto-rows-auto md:grid-cols-3">
              <Supporter alt="Cloudflare" href="https://www.cloudflare.com/" img={cloudflare} />
              <Supporter alt="Netlify" href="https://www.netlify.com/" img={netlify} />
              <Supporter alt="Builder.io" href="https://www.builder.io/" img={builder} />
              <Supporter alt="SAUCELABS" href="https://www.saucelabs.com/" img={sauce} />
              <Supporter alt="<div>riots>" href="https://divriots.com/" img={divriots} />
              <Supporter alt="Vercel" href="https://www.vercel.com/" img={vercel} />
              <Supporter alt="Jetbrains" href="https://www.jetbrains.com/" img={jetbrains} />
              <Supporter alt="Stytch" href="https://www.stytch.com/" img={stytch} />
            </div>
          </div>
          <div class="flex justify-between">
            <p class="text-center text-sm text-gray-600 dark:text-gray-300">
              {t('global.footer.updated', {
                date: __UPDATED_AT__,
                version: __SOLID_VERSION__,
              })}
            </p>
          </div>
          <ul class="flex items-center justify-center pt-12 lg:hidden">
            <Social />
          </ul>
        </div>
      </div>
    </div>
  );
};
