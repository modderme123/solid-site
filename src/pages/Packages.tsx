import { Component, For, JSX, Show, createMemo, createSignal, onMount } from 'solid-js';
import {
  Resource,
  ResourceCategory,
  ResourceCategoryName,
  ResourceType,
  ResourceTypeIcons,
} from './Resources/Ecosystem';
import { useNavigate, useRouteData, useSearchParams } from '@solidjs/router';
import Fuse from 'fuse.js';
import { Icon } from 'solid-heroicons';
import { PackagesDataProps } from './Packages.data';
import { SideContent } from '../components/layout/SideContent';
import { arrowTopRightOnSquare } from 'solid-heroicons/outline';
import { createCountdown } from '@solid-primitives/date';
import { debounce } from '@solid-primitives/scheduled';
import { makeIntersectionObserver } from '@solid-primitives/intersection-observer';
import { parseKeyword } from '../utils/parseKeyword';
import { rememberSearch } from '../utils/rememberSearch';
import { shieldCheck } from 'solid-heroicons/solid';
import { useI18n } from '@solid-primitives/i18n';

const FilterButton: Component<{
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  active: boolean;
  name: string;
  count: number;
  type?: ResourceType;
}> = (props) => (
  <>
    <button
      onClick={props.onClick}
      classList={{
        'opacity-20 cursor-default': !props.active,
        'hover:opacity-60': props.active,
      }}
      class="flex min-h-[50px] w-full items-center rounded border border-gray-400 px-4 py-2 text-left text-sm"
    >
      <Show when={props.type}>
        <figure class="-ml-2 mr-2 flex h-10 w-10 flex-shrink-0 content-center justify-center rounded-full border-4 border-solid p-1.5 text-white">
          <Icon
            class="w-5/6 text-solid-medium dark:text-solid-darkdefault"
            path={ResourceTypeIcons[props.type!]}
          />
        </figure>
      </Show>
      <span>{props.name}</span>
      <span class="flex-end ml-auto text-center text-xs text-gray-400">{props.count}</span>
    </button>
  </>
);

const FilterOfficial: Component<{
  onChange: JSX.EventHandlerUnion<HTMLInputElement, Event>;
  active: boolean;
}> = (props) => (
  <>
    <input type="checkbox" checked={props.active} onChange={props.onChange} id="filter" />{' '}
    <label for="filter">Official Filter</label>
  </>
);

const ResourceLink: Component<Resource> = (props) => {
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
    <a
      target="_blank"
      href={props.link}
      rel="nofollow"
      class="flex min-h-[144px] flex-col rounded border border-gray-400 px-3.5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <div class="flex items-center">
        <figure class="flex h-10 w-10 flex-shrink-0 content-center justify-center rounded-full border-4 border-solid-medium p-1.5 text-white md:h-14 md:w-14">
          <Icon
            class="w-5/6 text-solid-medium dark:text-solid-darkdefault"
            path={ResourceTypeIcons[props.type]}
          />
        </figure>
        <h1 class="break-all pl-3">{props.title}</h1>
        <Icon
          class="ml-auto w-7 min-w-[28px] self-start text-solid-default dark:text-solid-darkdefault"
          path={arrowTopRightOnSquare}
        />
      </div>
      <p class="py-2 text-xs">{props.description}</p>
      <div class="mt-auto flex place-content-between items-center">
        <div>
          <Show when={props.author && props.author_url}>
            <a
              rel="noopener"
              href={props.author_url}
              target="_blank"
              class="inline text-xs text-gray-500 hover:text-solid-medium dark:text-gray-300"
            >
              {t('resources.by')} {props.author}
            </a>
          </Show>
          <Show when={props.published_at}>
            <div class="block text-xs text-gray-400 rtl:text-right">
              {t('resources.published', {}, 'Published')} {published.toDateString()}
              <Show when={days! < 60}>
                <span class="text-gray-300"> - {publish_detail()}</span>
              </Show>
            </div>
          </Show>
        </div>

        <Show when={props.official}>
          <div class="flex w-min self-end rounded bg-solid-light p-1 pr-2 font-medium text-white dark:bg-solid-default">
            <Icon class="mr-1 w-4" path={shieldCheck} />
            <span class="text-xs">{t('resources.official')}</span>
          </div>
        </Show>
      </div>
    </a>
  );
};

const Packages: Component = () => {
  const [t] = useI18n();
  const data = useRouteData<PackagesDataProps>();
  const fs = new Fuse(data.list, {
    keys: ['author', 'title', 'categories', 'keywords', 'link', 'description'],
    threshold: 0.3,
  });

  const [check, setCheck] = createSignal(false);
  const toggleOfficial = ({ target }: Event) => setCheck((target as HTMLInputElement).checked);
  const official = data.list.filter((item) => item.official);

  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = createSignal(parseKeyword(searchParams.search || ''));
  const debouncedKeyword = debounce((str: string) => setKeyword(str), 250);
  rememberSearch(keyword);

  // Produces a base set of filtered results
  const resources = createMemo<Resource[]>(() => {
    if (keyword() == '') {
      return check() ? official : data.list;
    }
    const search = fs.search(keyword()).map((result) => result.item);
    return check() ? search.filter((item) => item.official) : search;
  });

  // Retrieve a map from categories to array of resources
  const byCategory = createMemo(() => {
    const map: Partial<Record<ResourceCategory, Resource[]>> = {};
    for (const resource of resources()) {
      for (const category of resource.categories) {
        const cat = map[category];
        if (cat) {
          cat.push(resource);
        } else {
          map[category] = [resource];
        }
      }
    }
    return map;
  });

  const [toggleFilters, setToggleFilters] = createSignal(false);
  const [stickyBarActive, setStickyBarActive] = createSignal(false);
  let firstLoad = true;

  const { add: intersectionObserver } = makeIntersectionObserver([], ([entry]) => {
    if (firstLoad) {
      firstLoad = false;
      return;
    }
    setStickyBarActive(!entry.isIntersecting);
  });
  intersectionObserver;

  const navigate = useNavigate();
  const scrollToCategory = (category: ResourceCategory) => {
    setToggleFilters(false);
    const url = globalThis.location;
    navigate(`${url.pathname}${url.search}#${category}`, { scroll: false });
    document.getElementById(category)?.scrollIntoView(true);
  };

  onMount(() => {
    const hash = globalThis.location.hash.replace(/^#/, '');
    if (!hash) return;
  });

  return (
    <SideContent
      toggleVisible={toggleFilters}
      setToggleVisible={setToggleFilters}
      aside={
        <div class="lg:m-6">
          <div
            class="rounded border border-gray-400 p-4 text-xs dark:bg-solid-darkLighterBg"
            innerHTML={t('resources.cta')}
          />
          <input
            class="my-5 w-full rounded border border-solid border-gray-400 bg-white p-3 placeholder-gray-500 placeholder-opacity-50 dark:bg-solid-darkgray dark:placeholder-white"
            placeholder={t('resources.search')}
            value={keyword()}
            onInput={(evt) => debouncedKeyword(evt.currentTarget.value)}
            onChange={(evt) => setKeyword(evt.currentTarget.value)}
            type="text"
          />

          <FilterOfficial active={check()} onChange={toggleOfficial} />

          <h3 class="mt-8 border-b border-solid pb-2 text-xl font-semibold text-solid-default dark:border-gray-500 dark:text-solid-darkdefault">
            {t('resources.categories')}
          </h3>
          <div class="mt-3 space-y-2">
            <For each={Object.entries(ResourceCategory).sort()}>
              {([name, id]) => (
                <FilterButton
                  name={t(`resources.categories_list.${id.toLowerCase()}`, {}, name)}
                  count={(byCategory()[id] || []).length}
                  active={!!byCategory()[id]}
                  onClick={[scrollToCategory, id]}
                />
              )}
            </For>
          </div>
        </div>
      }
      content={
        <>
          <div use:intersectionObserver class="absolute top-0" />
          <div
            class="block rounded bg-gray-100 p-4 text-xs dark:bg-solid-darkLighterBg lg:hidden"
            innerHTML={t('resources.cta')}
          />
          <div class="sticky top-16 block bg-white dark:bg-solid-darkbg lg:hidden">
            <input
              class="mb-3 mr-3 mt-14 w-full rounded border border-solid border-gray-400 bg-white p-3 placeholder-gray-500 placeholder-opacity-50 dark:bg-solid-darkgray dark:placeholder-white sm:mt-5"
              placeholder={t('resources.search')}
              value={keyword()}
              onInput={(evt) => debouncedKeyword(evt.currentTarget.value)}
              onChange={(evt) => setKeyword(evt.currentTarget.value)}
              type="text"
            />
            <FilterOfficial active={check()} onChange={toggleOfficial} />
            <div
              class="relative h-2"
              classList={{
                'shadow-md': stickyBarActive(),
              }}
            />
          </div>
          <Show
            when={resources().length}
            fallback={<div class="p-10 text-center">No resources found.</div>}
          >
            <For each={Object.entries(byCategory()).sort()}>
              {([category, resources]) => (
                <>
                  <h3
                    class="mb-5 mt-8 border-b border-solid pb-2 text-2xl font-semibold text-solid-default first-of-type:mt-0 dark:border-solid-darkLighterBg dark:text-solid-darkdefault"
                    id={category}
                  >
                    {t(
                      `resources.categories_list.${category.toLowerCase()}`,
                      {},
                      ResourceCategoryName[category],
                    )}
                  </h3>
                  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <For each={resources}>{(resource) => <ResourceLink {...resource} />}</For>
                  </div>
                </>
              )}
            </For>
          </Show>
        </>
      }
    />
  );
};

export default Packages;
