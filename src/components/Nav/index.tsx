import { Component, For, Show, createMemo, createSignal, on } from 'solid-js';
import { Link, NavLink } from '@solidjs/router';
import { LinkTypes, MenuLink } from './MenuLink';
import { page, routeReadyState, setRouteReadyState } from '../../utils';
import Dismiss from 'solid-dismiss';
import { LangType } from '../../../lang/types';
import { LanguageSelector } from './LanguageSelector';
import { ModeToggle } from './ModeToggle';
import { PageLoadingBar } from '../LoadingBar/PageLoadingBar';
import { Social } from '../Social';
import { debounce } from '@solid-primitives/scheduled';
import logo from '../../assets/logo.svg';
import ukraine from '../../assets/for-ukraine.svg';
import { useAppContext } from '../../AppContext';
import { useI18n } from '@solid-primitives/i18n';

const langs = {
  en: 'English',
  az: 'Azərbaycanca',
  'ko-kr': '한국어',
  'zh-cn': '简体中文',
  'zh-tw': '繁體中文',
  ja: '日本語',
  it: 'Italiano',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ru: 'Русский',
  id: 'Bahasa Indonesia',
  ar: 'عربي',
  he: 'עִברִית',
  fa: 'فارسی',
  tr: 'Türkçe',
  tl: 'Filipino',
  es: 'Español',
  pl: 'Polski',
  uk: 'Українська',
};

export const Nav: Component = () => {
  const [showLangs, toggleLangs] = createSignal(false);
  const [subnav, setSubnav] = createSignal<LinkTypes[]>([]);
  const [subnavPosition, setSubnavPosition] = createSignal<number>(0);
  const closeSubnav = debounce(() => setSubnav([]), 150);
  const [t, { locale }] = useI18n<LangType>();
  const context = useAppContext();

  let langBtnTablet!: HTMLButtonElement;
  let langBtnDesktop!: HTMLButtonElement;
  let logoEl!: HTMLDivElement;
  let subnavEl!: HTMLDivElement;

  const isRTL = () => t('global.dir', {}, 'ltr') === 'rtl';
  const logoPosition = () => (isRTL() ? 'right-3 lg:right-12 pl-5' : 'left-3 lg:left-12 pr-5');

  const navList = createMemo<LinkTypes[]>(
    on(
      () => [(t('global.nav') as unknown as LinkTypes[]) || [], context.guides] as const,
      ([nav, guides]) => {
        return nav.map<LinkTypes>((item) => {
          const itm = { ...item };
          // Inject guides if available
          if (item.path == '/guides') {
            if (guides?.length) {
              const direction = t('global.dir', {}, 'ltr') as 'ltr' | 'rtl';
              itm.links = guides.map(({ title, description, resource }) => ({
                title,
                description,
                direction,
                path: `/guides/${resource}`,
              }));
              itm.direction = direction;
            }
          }
          return itm;
        }, []);
      },
    ),
  );

  const onClickLogo = () => {
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0 });
      return;
    }
    page.scrollY = window.scrollY;
    setRouteReadyState((prev) => ({
      ...prev,
      loading: true,
      routeChanged: true,
      showPageLoadingBar: true,
    }));
  };

  return (
    <div class="sticky top-0 z-50 bg-solid-medium text-white shadow-md">
      <div class="flex w-full justify-center overflow-scroll">
        <PageLoadingBar postion="top" active={routeReadyState().loadingBar} />
        <nav class="container relative z-20 h-14 items-center justify-between px-3 lg:flex lg:px-12">
          <div
            class={`absolute bottom-0 top-0 flex ${logoPosition()} nav-logo-bg scale-100 transition-transform duration-500`}
            ref={logoEl}
          >
            <Link
              href="/"
              onClick={onClickLogo}
              noScroll
              class="flex w-9"
              aria-describedby="ukraine-support"
            >
              <img class="z-10 h-auto w-full" src={logo} alt="SolidJS" />
              <img
                class={`absolute h-5 w-8 ${isRTL() ? 'mr-5 mt-4 -scale-x-100' : 'ml-5 mt-4'}`}
                src={ukraine}
                alt=""
              />
            </Link>
            <span id="ukraine-support" hidden>
              {t('home.ukraine.support', {}, 'We stand with Ukraine.')}
            </span>
          </div>
          <div
            class={`nav-items-container group relative transition-all duration-500 ${
              isRTL() ? 'mr-[56px]' : 'ml-[56px]'
            }`}
          >
            <ul class="flex items-center">
              <For each={navList()}>
                {(item) => (
                  <MenuLink
                    {...item}
                    setSubnav={setSubnav}
                    closeSubnav={closeSubnav}
                    clearSubnavClose={closeSubnav.clear}
                    setSubnavPosition={setSubnavPosition}
                    links={item.links}
                  />
                )}
              </For>
              <li>
                <span class="flex lg:hidden">
                  <ModeToggle />
                </span>
              </li>
              <li class="flex lg:hidden">
                <LanguageSelector ref={langBtnTablet} />
              </li>
            </ul>
          </div>
          <ul class="hidden items-center lg:flex">
            <Social />
            <ModeToggle />
            <LanguageSelector ref={langBtnDesktop} />
          </ul>
        </nav>
      </div>
      <Dismiss
        menuButton={[langBtnTablet, langBtnDesktop]}
        open={showLangs}
        setOpen={toggleLangs}
        class="container absolute bottom-0 left-0 right-0 mx-auto -mt-4 flex justify-end"
        animation={{
          appendToElement: 'menuPopup',
          enterClass: 'opacity-0 -translate-y-5',
          enterToClass: 'opacity-1 translate-y-0',
          exitClass: 'opacity-1 translate-y-0',
          exitToClass: 'opacity-0 -translate-y-4',
        }}
      >
        <div class="absolute mt-2 w-full rounded-md border bg-white shadow-md transition-composite dark:border-solid-darkbg dark:bg-solid-darkLighterBg md:ml-12 md:mr-5 md:w-96">
          <For each={Object.entries(langs)}>
            {([lang, label]) => (
              <button
                class="w-3/6 border-b border-r p-3 text-center text-sm text-black first:rounded-t last:rounded-b hover:bg-solid-light hover:text-white dark:border-solid-darkbg/70 dark:text-white"
                classList={{
                  'bg-solid-medium text-white': lang == locale(),
                  'hover:bg-solid-light': lang == locale(),
                }}
                onClick={() => locale(lang) && toggleLangs(false)}
              >
                {label}
              </button>
            )}
          </For>
        </div>
      </Dismiss>
      <Show when={subnav().length !== 0}>
        <div
          ref={subnavEl}
          onmouseenter={closeSubnav.clear}
          onmouseleave={closeSubnav}
          class="left-50 duration-750 absolute max-w-sm bg-gray-200 shadow-2xl transition dark:bg-solid-darkLighterBg"
          style={{ left: `${screen.width > 768 ? subnavPosition() : 0}px` }}
        >
          <ul class="flex flex-col divide-x divide-transparent">
            <For each={subnav()}>
              {(link) => (
                <li
                  class="px-5 text-sm text-black transition duration-300 hover:bg-solid-default hover:text-white dark:text-white"
                  style={
                    link.direction && {
                      direction: link.direction,
                      'text-align': link.direction === 'ltr' ? 'left' : 'right',
                    }
                  }
                >
                  <NavLink onClick={() => setSubnav([])} class="block w-full py-3" href={link.path}>
                    {link.title}
                    <Show when={link.description}>
                      <span class="block text-gray-400">{link.description}</span>
                    </Show>
                  </NavLink>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Show>
    </div>
  );
};
