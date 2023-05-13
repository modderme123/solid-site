import {
  ParentComponent,
  Switch,
  Match,
  Show,
  on,
  createEffect,
  createSignal,
  createMemo,
} from 'solid-js';
import { Transition } from 'solid-transition-group';
import { useI18n } from '@solid-primitives/i18n';
import { useLocation, Link } from '@solidjs/router';
import Nav from './Nav';
import { useAppContext } from '../AppContext';
import logo from '../assets/logo.svg';
import wordmark from '../assets/wordmark.svg';
import { chevronRight, play } from 'solid-heroicons/outline';
import { Icon } from 'solid-heroicons';
import PageLoadingBar from './LoadingBar/PageLoadingBar';
import { routeReadyState, page } from '../utils/routeReadyState';

const Header: ParentComponent<{ title?: string }> = () => {
  const [t] = useI18n();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const noSmallHeader = !isHome && !location.pathname.includes('tutorial');
  const [showLogo, setShowLogo] = createSignal(!isHome);
  const [showHeaderSmall, setShowHeaderSmall] = createSignal(noSmallHeader);
  const [showHeaderSplash, setShowHeaderSplash] = createSignal(isHome);

  const context = useAppContext();

  const guideName = createMemo(() => {
    if (context.guides) {
      const resource = location.pathname.slice('/guides/'.length);
      return context.guides.find((metadata) => metadata.resource == resource)?.title;
    }
  });

  createEffect(
    on(
      routeReadyState,
      (readyState) => {
        if (readyState.loading) return;
        const result = location.pathname !== '/';
        const noHeaderSmall = result && !location.pathname.includes('tutorial');

        setShowHeaderSmall(noHeaderSmall);
        setShowLogo(result);
        setShowHeaderSplash(!result);
      },
      { defer: true },
    ),
  );
  const Title: ParentComponent = (props) => (
    <span class="inline-block transition-all duration-200">{props.children}</span>
  );
  return (
    <>
      <Transition onBeforeEnter={onEnterBigHeader} onExit={onExitBigHeader}>
        <Show when={showHeaderSplash()}>
          <header
            id="header"
            class="via-solid-medium/85 relative z-[1] mx-2 overflow-hidden rounded-bl-3xl rounded-br-3xl bg-gradient-to-r from-solid-light to-solid-dark/80 text-white dark:from-solid-light/40 dark:via-solid-medium/80 dark:to-solid-medium/90"
          >
            <PageLoadingBar active={routeReadyState().loadingBar} postion="bottom"></PageLoadingBar>
            <a
              target="_blank"
              href={t('home.ukraine.link', {}, 'https://www.un.org/en/globalceasefire')}
              class="absolute w-full bg-yellow-500 p-3 text-center text-[15px] transition duration-200 hover:bg-yellow-500/80"
            >
              <b>{t('home.ukraine.support', {}, 'Support Global Ceasefire!')}</b>&nbsp;
              {t('home.ukraine.petition', {}, 'End war in Ukraine and all global conflict →')}
            </a>
            <div class="dark:from-bg-gray-700 bg-right bg-no-repeat px-10 rtl:bg-left md:bg-hero">
              <a target="_blank" href="https://www.youtube.com/watch?v=pFah4QqiUAg&t=9503s">
                <img
                  class="absolute hidden md:right-20 md:top-20 md:block md:w-40 lg:top-32 lg:w-72"
                  src="/img/award-badge.svg"
                />
              </a>
              <section class="container space-y-10 px-3 py-10 lg:px-12 lg:pb-20 lg:pt-52">
                <div class="mt-10 flex w-[calc(100%+40px)] items-center space-y-4 lg:mt-0 lg:space-x-4 lg:space-y-0">
                  <img
                    class="h-30 w-[6rem] lg:w-48"
                    style="filter: drop-shadow(-10px 4px 8px rgb(0 22 100 / 10%))"
                    src={logo}
                    alt="Solid logo"
                    width="166"
                    height="155.3"
                  />
                  <img
                    class="h-15 w-52 min-w-0 lg:w-80"
                    src={wordmark}
                    alt="Solid wordmark"
                    width="306.42"
                    height="70.7"
                  />
                </div>
                <h2 class="text-[26px] leading-8 sm:text-3xl lg:text-4xl lg:font-semibold lg:leading-10 xl:max-w-3xl">
                  {t('home.hero')}
                </h2>
                <div class="space-y-2 md:flex md:space-x-2 md:space-y-0">
                  <div>
                    <Link
                      href="/guides/getting-started"
                      class="text-md flex items-center justify-center rounded-lg bg-solid-medium px-5 py-3  transition hover:bg-solid-gray"
                    >
                      <span class="mt-0.5">{t('home.get_started', {}, 'Get Started')}</span>
                      <Icon stroke-width="3" class="w-5" path={chevronRight} />
                    </Link>
                  </div>
                  <div class="flex flex-col space-y-1">
                    <Link
                      target="_blank"
                      href="https://www.youtube.com/watch?v=hw3Bx5vxKl0"
                      class="text-md flex items-center rounded-lg bg-solid-light px-5 py-3 transition hover:bg-solid-gray"
                    >
                      <Icon stroke-width="2" class="mr-2 w-6" path={play} />
                      {t('home.intro_video', {}, 'Intro to Solid (100 seconds)')}
                    </Link>
                    {/* <Link
                      target="_blank"
                      href="https://www.youtube.com/watch?v=J70HXl1KhWE"
                      class="bg-solid-light bg-opacity-50 flex items-center px-5 py-3 text-md rounded-lg hover:bg-solid-gray transition"
                    >
                      <Icon stroke-width="2" class="w-6 mr-2" path={play} />
                      {t('home.intro_video_advanced', {}, 'Advanced intro (10 minutes)')}
                    </Link> */}
                  </div>
                </div>
              </section>
            </div>
          </header>
        </Show>
      </Transition>
      <Nav showLogo={showLogo()} />
      <div>
        <Transition onBeforeEnter={onEnterSmallHeader} onExit={onExitSmallHeader}>
          <Show when={showHeaderSmall() && !location.pathname.includes('/hack')}>
            <header class="overflow-hidden">
              <div class="bg-gradient-to-r from-solid-light via-solid-medium to-solid-medium/80 text-center text-white rtl:text-right dark:from-solid-light/70 dark:via-solid-medium/70 dark:to-solid-medium/40 md:text-left">
                <div class="container px-3 lg:px-12">
                  <h1 class="py-8 text-3xl">
                    <Transition
                      enterClass="translate-x-5 opacity-0"
                      enterToClass="translate-x-0 opacity-100"
                      exitClass="translate-x-0 opacity-100"
                      exitToClass="translate-x-5 opacity-0"
                      mode="inout"
                    >
                      <Switch>
                        <Match when={location.pathname.includes('/blog')}>
                          <Title>{t('global.blog.title', {}, 'Blog')}</Title>
                        </Match>
                        <Match when={location.pathname.includes('/guide')}>
                          <Title>
                            {t('guides.title', {}, 'Guides')}
                            {guideName() && ':'}
                            <span class="pl-2">{guideName()}</span>
                          </Title>
                        </Match>
                        <Match when={location.pathname.includes('/docs')}>
                          <Title>{t('docs.title', {}, 'Docs')}</Title>
                        </Match>
                        <Match when={location.pathname.includes('/ecosystem')}>
                          <Title>{t('resources.title', {}, 'Ecosystem')}</Title>
                        </Match>
                        <Match when={location.pathname.includes('/store')}>
                          <Title>{t('store.title', {}, 'Solid Store')}</Title>
                        </Match>
                        <Match when={location.pathname.includes('/examples')}>
                          <Title>{t('examples.title', {}, 'Examples')}</Title>
                        </Match>
                        <Match when={location.pathname.includes('/media')}>
                          <Title>{t('media.title', {}, 'Media Assets')}</Title>
                        </Match>
                        <Match when={location.pathname.includes('/blog')}>
                          <Title>{t('blog.title', {}, 'Blog')}</Title>
                        </Match>
                        <Match when={location.pathname.includes('/contributors')}>
                          <Title>{t('contributors.title', {}, 'Team & Contributions')}</Title>
                        </Match>
                      </Switch>
                    </Transition>
                  </h1>
                </div>
              </div>
            </header>
          </Show>
        </Transition>
      </div>
    </>
  );
};

const pageTransitionDuration = 500;

const onEnterBigHeader = (el: Element) => {
  requestAnimationFrame(() => {
    const headerEl = el as HTMLElement;
    const parentEl = headerEl.parentElement!;
    const mainChildren = [...parentEl.children].filter((_, idx) => idx) as HTMLElement[];
    const headerHeight = `${headerEl.clientHeight}px`;
    const bannerEl = headerEl.firstElementChild as HTMLElement;
    const elements = [headerEl, bannerEl, ...mainChildren];

    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    elements.forEach((el) => {
      el.style.transform = `translateY(-${headerHeight})`;
    });

    bannerEl.style.transform = `translateY(${headerHeight})`;

    requestAnimationFrame(() => {
      elements.forEach((el) => {
        el.style.transform = '';
        el.style.transition = `transform ${pageTransitionDuration}ms`;
      });

      headerEl.addEventListener(
        'transitionend',
        (e) => {
          if (e.target !== e.currentTarget) return;

          elements.forEach((el) => {
            el.style.transition = '';
            el.style.transform = '';
          });
        },
        { once: true },
      );
    });
  });
};

const onExitBigHeader = (el: Element, done: () => void) => {
  const headerEl = el as HTMLElement;
  const parentEl = headerEl.parentElement!;
  const mainChildren = [...parentEl.children].filter((_, idx) => idx) as HTMLElement[];
  const bannerEl = headerEl.firstElementChild as HTMLElement;
  const headerHeight = headerEl.clientHeight;
  const elements = [headerEl, bannerEl, ...mainChildren];

  if (page.scrollY >= headerHeight) {
    headerEl.style.height = '0px';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    return done();
  }

  elements.forEach((el) => {
    el.style.transform = `translateY(-${headerHeight}px)`;
    el.style.transition = `transform ${pageTransitionDuration}ms`;
  });
  bannerEl.style.transform = `translateY(${headerHeight}px)`;

  const onTransitionEnd: EventListener = (e) => {
    if (e.target !== e.currentTarget) return;
    e.currentTarget?.removeEventListener('transitionend', onTransitionEnd);

    elements.forEach((el) => {
      el.style.transition = '';
      el.style.transform = '';
    });

    done();
  };

  headerEl.addEventListener('transitionend', onTransitionEnd);
};

const onEnterSmallHeader = (el: Element) => {
  requestAnimationFrame(() => {
    const headerEl = el as HTMLElement;
    const bgContainerEl = el.firstElementChild as HTMLElement;

    const contentEl = bgContainerEl.firstElementChild as HTMLElement;
    const mainContentChild = document.getElementById('main-content')
      ?.firstElementChild as HTMLElement;
    const headerHeight = `${bgContainerEl.clientHeight}px`;
    const elements = [bgContainerEl, headerEl, contentEl, mainContentChild];

    bgContainerEl.style.transform = `translateY(-100%)`;
    contentEl.style.transform = `translateY(100%)`;
    mainContentChild.style.transform = `translateY(-${headerHeight})`;

    requestAnimationFrame(() => {
      elements.forEach((el) => {
        el.style.transform = 'translateY(0)';
        el.style.transition = `transform ${pageTransitionDuration}ms`;
      });

      bgContainerEl.addEventListener(
        'transitionend',
        (e) => {
          if (e.target !== e.currentTarget) return;

          elements.forEach((el) => {
            el.style.transition = '';
            el.style.transform = '';
          });
        },
        { once: true },
      );
    });
  });
};

const onExitSmallHeader = (el: Element, done: () => void) => {
  const headerEl = el as HTMLElement;
  const bgContainerEl = headerEl.firstElementChild as HTMLElement;
  const contentEl = bgContainerEl.firstElementChild as HTMLElement;
  const mainContentChild = document.getElementById('main-content')
    ?.firstElementChild as HTMLElement;
  const headerHeight = headerEl.clientHeight;
  const navHeight = 64;
  const elements = [bgContainerEl, contentEl, mainContentChild];

  if (page.scrollY >= headerHeight + navHeight) {
    headerEl.style.height = '0px';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    done();
    return;
  }

  bgContainerEl.style.transform = `translateY(-100%)`;
  contentEl.style.transform = `translateY(100%)`;
  mainContentChild.style.transform = `translateY(-${headerHeight}px)`;
  elements.forEach((el) => {
    el.style.transition = `transform ${pageTransitionDuration}ms`;
  });

  requestAnimationFrame(() => {
    bgContainerEl.addEventListener(
      'transitionend',
      (e) => {
        if (e.target !== e.currentTarget) return;

        elements.forEach((el) => {
          el.style.transition = '';
          el.style.transform = '';
        });
        done();
      },
      { once: true },
    );
  });
};
export default Header;
