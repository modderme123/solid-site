import { Benchmarks, GraphData } from '../components/Benchmarks';
import {
  Component,
  For,
  Show,
  Suspense,
  createEffect,
  createMemo,
  createSignal,
  lazy,
  onMount,
} from 'solid-js';
import { Link, useIsRouting, useRouteData } from '@solidjs/router';
import { chevronRight, play } from 'solid-heroicons/outline';
import { Footer } from '../components/Footer';
import { Icon } from 'solid-heroicons';
import { createViewportObserver } from '@solid-primitives/intersection-observer';
import flag from '../assets/icons/flag.svg';
import iconBlocks1 from '../assets/icons/blocks1.svg';
import iconBlocks2 from '../assets/icons/blocks2.svg';
import logo from '../assets/logo.svg';
import performant from '../assets/icons/performant.svg';
import powerful from '../assets/icons/powerful.svg';
import pragmatic from '../assets/icons/pragmatic.svg';
import productive from '../assets/icons/productive.svg';
import sandbox from '../assets/icons/sandbox.svg';
import { shoppingCart } from 'solid-heroicons/outline';
import { useI18n } from '@solid-primitives/i18n';
import { useRouteReadyState } from '../utils';
import wordmark from '../assets/wordmark.svg';

const Repl = lazy(() => import('../components/ReplTab'));

const strength_icons: { [key: string]: string } = {
  performant,
  powerful,
  pragmatic,
  productive,
};

const Home: Component = () => {
  const isRouting = useIsRouting();
  const data = useRouteData<GraphData[]>();
  const [t] = useI18n();
  const [loadRepl, setLoadRepl] = createSignal(false);
  const [observeInteraction] = createViewportObserver({ threshold: 0.4 });
  let playgroundRef!: HTMLElement;

  onMount(() => {
    observeInteraction(playgroundRef, (entry) => entry.isIntersecting && setLoadRepl(true));
  });

  createEffect(() => {
    if (isRouting()) {
      setLoadRepl(false);
    }
  });

  useRouteReadyState();

  const chevron = createMemo(() => {
    const direction = t('global.dir', {}, 'ltr') == 'rtl' ? 'chevron-left' : 'chevron-right';
    return `chevron ${direction}`;
  });

  return (
    <>
      <header
        id="header"
        class="via-solid-medium/85 relative z-[1] mx-2 overflow-hidden rounded-bl-3xl rounded-br-3xl bg-gradient-to-r from-solid-light to-solid-dark/80 text-white dark:from-solid-light/40 dark:via-solid-medium/80 dark:to-solid-medium/90"
      >
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
            <div class="mt-10 flex items-center space-y-4 lg:mt-0 lg:space-x-4 lg:space-y-0">
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
      <div class="flex flex-col">
        <div class="container flex flex-col bg-contain bg-left-top bg-no-repeat px-0 md:bg-blocks-one md:pt-10 md:dark:bg-blocks-one-dark lg:space-y-10 lg:px-12">
          <a
            href="/store"
            class="max-width-[300px] m-5 flex items-center justify-center space-x-3 rounded-lg bg-slate-200/50 p-5 text-center text-lg text-solid-medium transition duration-500 hover:text-solid-dark dark:bg-solid-light/40 dark:text-white md:mx-0"
          >
            <Icon class="w-10" stroke-width={1.5} path={shoppingCart} />
            <div innerHTML={t('home.news.content')} />
          </a>
          <section class="grid space-y-4 rounded-lg sm:grid-cols-2 lg:grid-cols-4 lg:space-x-4 lg:space-y-0">
            <For
              each={
                t('home.strengths') as unknown as {
                  icon: string;
                  label: string;
                  description: string;
                }[]
              }
            >
              {(strength) => (
                <div class="mt-4 border-0 border-b px-10 py-4 last:border-none dark:border-solid-darkLighterBg md:border-r md:py-10 lg:ml-4 lg:mt-0 lg:border-b-0">
                  <img
                    class="mb-5 w-12 dark:brightness-150"
                    src={strength_icons[strength.icon]}
                    alt={strength.label}
                  />
                  <h3 class="mb-2 text-xl font-semibold">{strength.label}</h3>
                  <p>{strength.description}</p>
                </div>
              )}
            </For>
          </section>
        </div>
        <div class="container flex flex-col px-0 lg:my-10 lg:space-y-10 lg:px-12">
          <section class="defer m-5 rounded-lg border-2 border-gray-200 dark:border-solid-darkLighterBg lg:m-0">
            <ul class="grid w-full grid-cols-1 md:grid-cols-6">
              <For
                each={
                  t('home.facts') as unknown as { label: string; detail: string; link?: string }[]
                }
              >
                {(fact) => {
                  const d = (
                    <div class="flex md:inline-block">
                      <strong class="mr-1 font-semibold">{fact.label}</strong>
                      <span class="flex items-center text-sm">{fact.detail}</span>
                    </div>
                  );
                  return (
                    <li
                      class="border-r border-gray-100 transition last:border-r-0 dark:border-solid-darkLighterBg"
                      classList={{
                        'hover:bg-solid-dark': !!fact.link,
                        'hover:text-white': !!fact.link,
                      }}
                    >
                      {fact.link ? (
                        <a
                          target="_blank"
                          rel="noopener"
                          href={fact.link}
                          class="flex w-full justify-center border-b p-3 md:border-none md:px-5 md:py-5"
                        >
                          {d}
                        </a>
                      ) : (
                        <span class="flex w-full justify-center border-b p-3 md:border-none md:px-5 md:py-5">
                          {d}
                        </span>
                      )}
                    </li>
                  );
                }}
              </For>
            </ul>
          </section>
          <section
            class="lg:px-15 flex flex-col px-8 py-20 lg:flex-row lg:space-x-32"
            ref={playgroundRef}
          >
            <div
              dir="ltr"
              style="height: 70vh; max-height: 600px; min-height: 475px;"
              class="order-2 mt-10 flex flex-1 rounded-lg shadow-2xl rtl:order-2 lg:order-1 lg:mt-0"
            >
              <Show when={loadRepl()}>
                <Suspense
                  fallback={
                    <div class="flex h-full items-center justify-center">
                      Starting playground...
                    </div>
                  }
                >
                  <Repl
                    tabs={[
                      {
                        name: 'main.jsx',
                        source: `import { render } from "solid-js/web";
import { onCleanup, createSignal } from "solid-js";

const CountingComponent = () => {
  const [count, setCount] = createSignal(0);
  const interval = setInterval(
    () => setCount(count => count + 1),
    1000
  );
  onCleanup(() => clearInterval(interval));
  return <div>Count value is {count()}</div>;
};

render(() => <CountingComponent />, document.getElementById("app"));`,
                      },
                    ]}
                  />
                </Suspense>
              </Show>
            </div>
            <div class="order-1 flex flex-1 flex-col justify-center rtl:order-1 lg:order-2">
              <img class="w-20" src={iconBlocks1} alt="" />
              <h3 class="text-solid mt-6 text-3xl font-semibold leading-10">
                {t('home.example.headline')}
              </h3>
              <For each={t('home.example.copy') as unknown as string[]}>
                {(copy) => <p class="mt-9 leading-7">{copy}</p>}
              </For>
              <Link
                class={`button mt-8 inline-block font-semibold text-solid-default hover:text-gray-500 dark:text-solid-darkdefault dark:hover:text-gray-300 ${chevron()}`}
                href={t('home.example.link')}
              >
                {t('home.example.link_label')}
              </Link>
            </div>
          </section>
          <section class="defer grid grid-cols-1 rounded-br-6xl bg-solid-lightgray bg-contain bg-right bg-no-repeat py-16 rtl:bg-left dark:bg-solid-darkLighterBg md:px-5 lg:grid-cols-2 lg:bg-blocks-three lg:px-16">
            <div
              class="rounded-lg bg-opacity-80 px-10 py-4 2xl:bg-opacity-0"
              classList={{ 'xl:bg-opacity-0': t('global.dir', {}, 'ltr') === 'ltr' }}
            >
              <img class="w-16" src={sandbox} alt="" />
              <h2 class="text-solid mb-5 mt-8 text-3xl font-semibold">
                {t('home.reactivity.headline')}
              </h2>
              <p class="mt-2 text-2xl">{t('home.reactivity.subheadline')}</p>
              <p class="mt-6 leading-7">{t('home.reactivity.copy')}</p>
              <a
                class={`button mt-8 inline-block font-semibold text-solid-default hover:text-gray-500 dark:text-solid-darkdefault dark:hover:text-gray-300 ${chevron()}`}
                href={t('home.reactivity.link')}
              >
                {t('home.reactivity.link_label')}
              </a>
            </div>
          </section>
          <section class="flex flex-col gap-x-32 space-y-10 px-10 py-20 lg:flex-row lg:space-y-0 lg:px-10">
            <div class="flex flex-1 flex-wrap items-center rtl:ml-10">
              <Benchmarks list={data} />
            </div>
            <div class="flex flex-1 flex-col justify-around bg-no-repeat">
              <img class="w-20" src={iconBlocks2} alt="" />
              <h2 class="text-solid mt-6 text-3xl font-semibold">
                {t('home.performance.headline.0')}
              </h2>
              <h2 class="m3-6 text-solid text-2xl font-semibold">
                {t('home.performance.headline.1')}
              </h2>
              <p class="mt-9 leading-7">{t('home.performance.copy')}</p>
              <a
                class={`button inline-block py-3 font-semibold text-solid-default hover:text-gray-500 dark:text-solid-darkdefault dark:hover:text-gray-300 ${chevron()}`}
                href={t('home.performance.link')}
              >
                {t('home.performance.link_label')}
              </a>
            </div>
          </section>
          <section class="grid rounded-3xl bg-solid-lightgray px-10 py-20 dark:bg-solid-darkLighterBg md:grid-cols-2 md:space-x-12 lg:px-20">
            <div class="gridflex flex-wrap content-center">
              <h2 class="text-2xl font-semibold">
                <img class="mb-5 block w-10 dark:invert" src={flag} alt="" />
                {t('home.features.headline')}
              </h2>
              <p class="mt-4 text-xl">{t('home.features.copy')}</p>
            </div>
            <ul class="flex flex-wrap">
              <For each={t('home.features.list') as unknown as string[]}>
                {(feature) => (
                  <li class="feature-block mr-3 mt-3 w-full border-gray-300 px-5 py-3 dark:border-gray-700 md:w-auto">
                    <span class="block text-sm">{feature}</span>
                  </li>
                )}
              </For>
            </ul>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
