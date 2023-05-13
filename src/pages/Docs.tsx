import {
  Component,
  For,
  Show,
  Switch,
  Match,
  createEffect,
  createSignal,
  Accessor,
  ParentComponent,
} from 'solid-js';
import { useRouteData } from '@solidjs/router';
import { createScrollPosition } from '@solid-primitives/scroll';
import { throttle } from '@solid-primitives/scheduled';
import SideContent from '../components/layout/SideContent';
import { slug } from 'github-slugger';
import type { DocData } from './Docs.data';
import { Section } from '@solid.js/docs/dist/types';

const SectionButton: ParentComponent<{
  href: string;
  title: string;
  class: string;
  classList: { [k: string]: boolean | undefined };
}> = (props) => (
  <li>
    <a class={props.class} classList={props.classList} href={props.href} target="_self">
      {props.title}
    </a>
    {props.children}
  </li>
);

const Sidebar: Component<{
  items: Section[] | undefined;
  current: Accessor<string | null>;
  hash: string | undefined;
}> = (props) => (
  <ul class="flex flex-1 flex-col overflow-auto py-10 dark:text-white lg:pl-10">
    <For each={props.items}>
      {(firstLevel: Section) => (
        <SectionButton
          title={firstLevel.value}
          class={
            `w-full border-b border-gray-200 text-left transition hover:text-gray-400 dark:border-gray-500 dark:text-white ` +
            `mb-6 mt-2 flex flex-wrap content-center justify-between space-x-2 p-2 py-2 text-xl`
          }
          classList={{
            'font-semibold text-solid-medium dark:text-solid-darkdefault':
              props.current() == firstLevel.value,
          }}
          href={`#${slug(firstLevel.value)}`}
        >
          <ul>
            <For each={firstLevel.children}>
              {(secondLevel, index) => (
                <SectionButton
                  title={secondLevel.value}
                  class="text-md block break-words py-1 pl-2 font-semibold text-gray-500 dark:text-gray-300"
                  classList={{
                    'text-solid hover:text-solid-dark dark:hover:text-solid-light':
                      `#${slug(secondLevel.value)}` === props.hash,
                    'hover:text-gray-400 dark:hover:text-gray-400':
                      `#${slug(secondLevel.value)}` !== props.hash,
                    'pb-2': index() == firstLevel.children!.length - 1,
                  }}
                  href={`#${slug(secondLevel.value)}`}
                >
                  <Show when={secondLevel.children && secondLevel.children.length !== 0}>
                    <ul class="my-1">
                      <For each={secondLevel.children}>
                        {(thirdLevel) => (
                          <SectionButton
                            href={`#${slug(thirdLevel.value)}`}
                            title={thirdLevel.value}
                            class="my-2 ml-6 block break-words pb-2 text-sm text-gray-400"
                            classList={{
                              'text-solid hover:text-solid-dark dark:hover:text-solid-dark':
                                `#${slug(thirdLevel.value)}` === props.hash,
                              'hover:text-gray-500 dark:hover:text-gray-300':
                                `#${slug(thirdLevel.value)}` !== props.hash,
                            }}
                          />
                        )}
                      </For>
                    </ul>
                  </Show>
                </SectionButton>
              )}
            </For>
          </ul>
        </SectionButton>
      )}
    </For>
  </ul>
);

const Content: Component<{
  data: DocData;
}> = ({ data }) => (
  <Switch fallback={'Failed to load markdown...'}>
    <Match when={data.loading}>Loading documentation...</Match>
    <Match when={data.doc}>
      <Show when={data.fallback}>
        <div class="mb-10 rounded-lg bg-yellow-100 p-5 text-sm dark:bg-yellow-900">
          Unfortunately our docs are not currently available in your language. We encourage you to
          support Solid by{' '}
          <a
            class="underline"
            target="_blank"
            href="https://github.com/solidjs/solid-docs/blob/main/README.md#support"
          >
            helping with on-going translation efforts
          </a>
          .
        </div>
      </Show>
      <div class="prose-solid prose max-w-full dark:prose-invert lg:px-8">{data.doc?.default}</div>
    </Match>
  </Switch>
);

const Docs: Component<{ hash?: string }> = (props) => {
  const data = useRouteData<DocData>();
  const [current, setCurrent] = createSignal<string | null>(null);
  const [toggleSections, setToggleSections] = createSignal(false);
  const scrollPosition = createScrollPosition();

  const sections: () => Section[] | undefined = () => {
    if (!data.doc) return;

    if (data.doc.toc.length == 1) {
      return data.doc.toc[0].children;
    }
    return data.doc.toc;
  };

  // Determine the section based on title positions
  const determineSection = throttle((position: number) => {
    let prev = sections()![0];
    const pos = position + 500;
    for (let i = 0; i < sections()!.length; i++) {
      const el = document.getElementById(slug(sections()![i].value))!;
      if (pos < el.offsetTop + el.clientHeight) {
        break;
      }
      prev = sections()![i];
    }
    setCurrent(slug(prev.value));
  }, 250);

  // Upon loading finish bind observers
  createEffect(() => {
    if (!data.loading) {
      if (globalThis.location.hash !== '') {
        const anchor = document.getElementById(globalThis.location.hash.replace('#', ''));
        anchor && anchor.scrollIntoView(true);
      }
    }
  });
  createEffect(() => determineSection(scrollPosition.y || 0));

  return (
    <SideContent
      toggleVisible={toggleSections}
      setToggleVisible={setToggleSections}
      aside={<Sidebar items={sections()} current={current} hash={props.hash} />}
      content={<Content data={data} />}
    />
  );
};

export default Docs;
