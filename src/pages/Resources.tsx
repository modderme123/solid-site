import { Component, For, Show, createSignal, createMemo } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Footer } from '../components/Footer';
import { useRouteData, useSearchParams } from '@solidjs/router';
import { Resource, ResourceType, ResourceTypeIcons, PackageType } from './Resources/Ecosystem';
import { ResourcesDataProps } from './Resources.data';
import Fuse from 'fuse.js';
import { Icon } from 'solid-heroicons';
import { chevronRight, chevronLeft, shieldCheck, funnel } from 'solid-heroicons/outline';
import { useI18n } from '@solid-primitives/i18n';
import { createCountdown } from '@solid-primitives/date';
import { makeIntersectionObserver } from '@solid-primitives/intersection-observer';
import { debounce } from '@solid-primitives/scheduled';
import Dismiss from 'solid-dismiss';
import { useRouteReadyState } from '../utils/routeReadyState';
import { parseKeyword } from '../utils/parseKeyword';
import { rememberSearch } from '../utils/rememberSearch';

const AResource: Component<Resource> = (props) => {
  const [t] = useI18n();
  const now = new Date();
  const published = new Date(0);
  published.setTime(props.published_at || 0);
  const { days, hours } = createCountdown(published, now);
  const publish_detail = () => {
    if (days! > 1) {
      return t('resources.days_ago', { amount: days!.toString() }, '{{amount}} days ago');
    }
    return t('resources.hours_ago', { amount: hours!.toString() }, '{{amount}} hours ago');
  };

  return (
    <li class="border-b py-6 text-left duration-100 hover:bg-gray-50 dark:border-solid-darkLighterBg dark:hover:bg-gray-700">
      <a
        class="text-solid relative grid grid-flow-col grid-cols-10 gap-2 md:grid-cols-12"
        target="_blank"
        href={props.link}
        rel="nofollow"
      >
        <div class="col-span-2 flex items-center justify-center md:col-span-3 lg:col-span-1">
          <figure class="flex h-11 w-11 flex-shrink-0 content-center justify-center rounded-full border-4 border-solid-medium p-1.5 text-white dark:border-solid-darkdefault md:h-14 md:w-14">
            <Icon
              class="w-5/6 text-solid-medium dark:text-solid-darkdefault"
              path={ResourceTypeIcons[props.type]}
            />
          </figure>
        </div>
        <div class="col-start-3 col-end-[-1] items-center md:col-span-7 lg:col-span-10">
          <div dir="ltr">
            <div class="text-lg">{props.title}</div>
            <Show when={props.description != ''}>
              <div class="mb-3 mt-2 block text-xs text-black dark:text-white">
                {props.description}
              </div>
            </Show>
            <Show when={props.author && !props.author_url}>
              <div class="mt-3 block text-xs text-gray-500 dark:text-gray-300">
                {t('resources.by')} {props.author}
              </div>
            </Show>
          </div>
          <Show when={props.author && props.author_url}>
            <div class="rtl:text-right">
              <a
                rel="noopener"
                href={props.author_url}
                target="_blank"
                class="inline text-xs text-gray-500 hover:text-solid-medium dark:text-gray-300"
              >
                {t('resources.by')} {props.author}
              </a>
            </div>
            <Show when={props.published_at}>
              <div class="block text-xs text-gray-400 rtl:text-right">
                {t('resources.published', {}, 'Published')} {published.toDateString()}
                <Show when={days! < 60}>
                  <span class="text-gray-300"> - {publish_detail()}</span>
                </Show>
              </div>
            </Show>
          </Show>
        </div>
        <div class="absolute right-0 top-[-18px] col-span-1 flex items-center text-[14px] text-solid-light md:static md:text-base">
          <Show when={props.official}>
            <Icon class="relative top-[-2px] mr-2 w-4 md:top-0 md:w-7" path={shieldCheck} />
            {t('resources.official')}
          </Show>
        </div>
        <div class="col-span-2 hidden justify-end md:flex lg:col-span-1">
          <Icon class="mx-2 w-7 text-gray-400 ltr:hidden" path={chevronLeft} />
          <Icon class="mx-2 w-7 text-gray-400 rtl:hidden" path={chevronRight} />
        </div>
      </a>
    </li>
  );
};

const Resources: Component = () => {
  const [t] = useI18n();
  const data = useRouteData<ResourcesDataProps>();
  const fs = new Fuse(data.list, {
    keys: ['author', 'title', 'categories', 'keywords', 'link', 'description'],
    threshold: 0.3,
  });
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = createSignal(parseKeyword(searchParams.search || ''));
  const debouncedKeyword = debounce((str: string) => setKeyword(str), 250);
  rememberSearch(keyword);
  const resources = createMemo(() => {
    if (keyword() == '') {
      return data.list;
    }
    return fs.search(keyword()).map((result) => result.item);
  });
  const [filtered, setFiltered] = createStore({
    // Produces a base set of filtered results
    resources,
    // Currently user enabled filters
    enabledTypes: [] as (ResourceType | PackageType)[],
    // Final list produces that applies enabled types and categories
    get list() {
      const filtered = resources().filter((item) => {
        if (this.enabledTypes.length !== 0) {
          return this.enabledTypes.indexOf(item.type) !== -1;
        }
        return true;
      });
      filtered.sort((b, a) => (a.published_at || 0) - (b.published_at || 0));
      return filtered;
    },
    // Retrieve a list of type counts
    get counts() {
      return resources().reduce<{ [key: string]: number }>(
        (memo, resource) => ({
          ...memo,
          [resource.type]: memo[resource.type] ? memo[resource.type] + 1 : 1,
        }),
        {},
      );
    },
  });
  const [toggleFilters, setToggleFilters] = createSignal(false);
  const [stickyBarActive, setStickyBarActive] = createSignal(false);
  const floatingPosScrollY = 220;
  let menuButton!: HTMLButtonElement;
  let firstLoad = true;

  useRouteReadyState();

  const { add: intersectionObserver } = makeIntersectionObserver([], ([entry]) => {
    if (firstLoad) {
      firstLoad = false;
      return;
    }
    setStickyBarActive(!entry.isIntersecting);
  });
  intersectionObserver;

  const onClickFiltersBtn = () => {
    if (window.scrollY >= floatingPosScrollY) return;
    window.scrollTo({ top: floatingPosScrollY });
  };

  const filtersClickScrollToTop = () => {
    const top = toggleFilters() ? floatingPosScrollY : 0;
    window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
  };

  return (
    <div class="relative flex flex-col">
      <div class="container relative gap-6 p-5 md:grid md:grid-cols-12">
        <div class="rounded py-5 md:sticky md:top-20 md:col-span-5 md:h-[calc(100vh-80px)] md:overflow-auto md:p-5 lg:col-span-3">
          <div
            class="rounded bg-gray-100 p-4 text-xs dark:bg-solid-darkLighterBg"
            innerHTML={t('resources.cta')}
          ></div>
          <div class="hidden md:block">
            <input
              class="my-5 w-full rounded border border-solid border-gray-400 bg-transparent p-3 placeholder-gray-500 placeholder-opacity-50 dark:placeholder-white"
              placeholder={t('resources.search')}
              value={keyword()}
              onInput={(evt) => debouncedKeyword(evt.currentTarget.value)}
              onChange={(evt) => setKeyword(evt.currentTarget.value)}
              type="text"
            />
            <h3 class="mb-4 border-b border-solid pb-2 text-xl font-semibold text-solid-default dark:border-solid-darkLighterBg dark:text-solid-darkdefault">
              {t('resources.types')}
            </h3>
            <div class="flex flex-col space-y-2">
              <For each={Object.entries(ResourceType)}>
                {([name, type]) => (
                  <button
                    disabled={!filtered.counts[type]}
                    onClick={() => {
                      filtersClickScrollToTop();
                      setFiltered('enabledTypes', (arr) => {
                        const pos = arr.indexOf(type);
                        if (pos === -1) {
                          return [...arr, type];
                        } else {
                          const newArray = arr.slice();
                          newArray.splice(pos, 1);
                          return newArray;
                        }
                      });
                    }}
                    classList={{
                      'opacity-30 cursor-default': !filtered.counts[type],
                      'hover:opacity-60': !!filtered.counts[type],
                      'bg-gray-100 dark:bg-gray-700': filtered.enabledTypes.indexOf(type) !== -1,
                    }}
                    class="grid w-full grid-cols-5 items-center rounded-md border py-3 text-left text-sm dark:border-solid-darkLighterBg lg:grid-cols-6"
                  >
                    <div class="col-span-1 flex justify-center px-2 lg:col-span-2">
                      <figure class="flex h-10 w-10 flex-shrink-0 content-center justify-center rounded-full border-4 border-solid p-1.5 text-white">
                        <Icon
                          class="w-5/6 text-solid-medium dark:text-solid-darkdefault"
                          path={ResourceTypeIcons[type]}
                        />
                      </figure>
                    </div>
                    <div class="col-span-3 rtl:text-right lg:col-span-3">
                      {t(`resources.types_list.${name.toLowerCase()}`, {}, name)}
                    </div>
                    <div class="flex-end col-span-1 text-center text-xs text-gray-400">
                      <Show when={filtered.counts[type]} fallback={0}>
                        {filtered.counts[type]}
                      </Show>
                    </div>
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>

        <div class="sticky top-[60px] z-10 -ml-5 w-[calc(100%+40px)] bg-white py-3 pt-4 md:hidden">
          <div
            class="absolute left-3 right-3 top-0 z-negative h-full rounded-[12%] bg-white"
            classList={{
              'shadow-md': stickyBarActive(),
            }}
          ></div>
          <div class="absolute left-0 top-0 z-negative h-full w-full bg-white dark:bg-neutral-600"></div>
          <div class="flex h-[45px] justify-between gap-1 px-5">
            <div use:intersectionObserver class="absolute top-[-62px] h-0" />
            <input
              class="h-full w-full rounded border border-solid border-gray-400 p-3 placeholder-gray-500 placeholder-opacity-50 dark:bg-gray-500 dark:placeholder-gray-200"
              placeholder={t('resources.search')}
              value={keyword()}
              onInput={(evt) => debouncedKeyword(evt.currentTarget.value)}
              onChange={(evt) => setKeyword(evt.currentTarget.value)}
              type="text"
            />
            <button
              class="flex h-full w-[45px] flex-shrink-0 items-center justify-center rounded-lg border border-gray-300 text-solid-medium dark:text-solid-darkdefault lg:hidden"
              onClick={onClickFiltersBtn}
              ref={menuButton}
            >
              <Icon class="h-7 w-7" path={funnel} />
            </button>
          </div>
        </div>
        <Dismiss
          class="relative"
          menuButton={menuButton}
          open={toggleFilters}
          setOpen={setToggleFilters}
          animation={{
            appendToElement: 'menuPopup',
            enterClass: 'translate-y-full',
            enterToClass: 'translate-y-0',
            exitClass: 'translate-y-0',
            exitToClass: 'translate-y-full',
          }}
        >
          <div
            class={
              'fixed left-0 top-14 z-20 w-full overflow-auto rounded-t-2xl border-2  border-gray-100 bg-white p-10 py-5 shadow-top-2xl transition-transform duration-300 dark:bg-solid-gray lg:sticky lg:top-12 lg:flex lg:flex-col lg:border-0 lg:p-0 lg:shadow-none '
            }
            style={{ height: 'calc(100vh - 8rem)', top: '8rem' }}
          >
            <h3 class="mb-4 border-b border-solid pb-2 text-xl font-semibold text-solid-default dark:text-solid-darkdefault">
              {t('resources.types')}
            </h3>
            <div class="flex flex-col space-y-2">
              <For each={Object.entries(ResourceType)}>
                {([name, type]) => (
                  <button
                    disabled={!filtered.counts[type]}
                    onClick={() => {
                      filtersClickScrollToTop();
                      setFiltered('enabledTypes', (arr) => {
                        const pos = arr.indexOf(type);
                        if (pos === -1) {
                          return [...arr, type];
                        } else {
                          const newArray = arr.slice();
                          newArray.splice(pos, 1);
                          return newArray;
                        }
                      });
                    }}
                    classList={{
                      'opacity-30 cursor-default': !filtered.counts[type],
                      'hover:opacity-60': !!filtered.counts[type],
                      'bg-gray-100 dark:bg-gray-700': filtered.enabledTypes.indexOf(type) !== -1,
                    }}
                    class="grid w-full grid-cols-5 items-center rounded-md border py-3 text-left text-sm lg:grid-cols-6"
                  >
                    <div class="col-span-1 flex justify-center px-2 lg:col-span-2">
                      <figure class="flex h-10 w-10 content-center justify-center rounded-full border-4 border-solid p-1.5 text-white">
                        <Icon
                          class="w-5/6 text-solid-medium dark:text-solid-darkdefault"
                          path={ResourceTypeIcons[type]}
                        />
                      </figure>
                    </div>
                    <div class="col-span-3 rtl:text-right lg:col-span-3">
                      {t(`resources.types_list.${name.toLowerCase()}`, {}, name)}
                    </div>
                    <div class="flex-end col-span-1 text-center text-xs text-gray-400">
                      <Show when={filtered.counts[type]} fallback={0}>
                        {filtered.counts[type]}
                      </Show>
                    </div>
                  </button>
                )}
              </For>
            </div>
          </div>
        </Dismiss>

        <div class="md:col-span-7 lg:col-span-9">
          <Show
            when={filtered.list.length !== 0}
            fallback={<div class="p-10 text-center">No resources found.</div>}
          >
            <ul>
              <For each={filtered.list}>{(resource) => <AResource {...resource} />}</For>
            </ul>
          </Show>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Resources;
