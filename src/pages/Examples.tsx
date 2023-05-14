import { Component, ErrorBoundary, For, batch, createEffect, createSignal } from 'solid-js';
import { NavLink, useParams, useRouteData } from '@solidjs/router';
import { compiler, formatter, linter } from '../components/setupRepl';
import { ExamplesDataRoute } from './Examples.data';
import Repl from 'solid-repl/lib/repl';
import { useAppContext } from '../AppContext';
import { useI18n } from '@solid-primitives/i18n';
import { useRouteReadyState } from '../utils';

const Examples: Component = () => {
  const data = useRouteData<ExamplesDataRoute>();
  const context = useAppContext();
  const [t] = useI18n();
  const params = useParams<{ id: string }>();
  const [tabs, setTabs] = createSignal([
    {
      name: 'main.jsx',
      source: '',
    },
  ]);
  const [current, setCurrent] = createSignal(`main.jsx`, { equals: false });

  useRouteReadyState();

  let currentData: {
    name: string;
    source: string;
  }[] = [];
  createEffect(async () => {
    const exampleData = (await fetch(`${location.origin}/examples/${params.id}.json`).then((r) =>
      r.json(),
    )) as {
      files: {
        name: string;
        type: string;
        content: string | string[];
      }[];
      version?: string;
    };
    batch(() => {
      currentData = exampleData.files.map(
        (file: { name: string; type?: string; content: string | string[] }) => {
          return {
            name: file.name + (file.type ? `.${file.type}` : '.jsx'),
            source: Array.isArray(file.content) ? file.content.join('\n') : file.content,
          };
        },
      );
      setTabs(currentData);
      setCurrent(currentData[0].name);
    });
  });

  return (
    <div class="relative flex flex-col">
      <div class="container mx-auto my-10 w-[98vw]">
        <div class="gap-6 md:grid md:grid-cols-12">
          <div class="overflow-auto rounded border p-5 dark:border-solid-darkLighterBg md:col-span-4 md:h-[82vh] lg:col-span-3">
            <For each={Object.entries(data)}>
              {([name, examples]) => (
                <>
                  <h3 class="border-b-2 border-solid pb-2 text-xl font-semibold text-solid-default dark:border-solid-darkLighterBg dark:text-solid-darkdefault">
                    {t(`examples.${name.toLowerCase()}`, {}, name)}
                  </h3>
                  <div class="mb-10">
                    <For each={examples}>
                      {(example) => (
                        <NavLink
                          dir="ltr"
                          href={`/examples/${example.id}`}
                          class="my-4 block space-y-2 border-b py-3 pl-2 text-sm hover:opacity-60 dark:border-solid-darkLighterBg"
                          activeClass="text-solid-light dark:text-solid-darkdefault"
                        >
                          <span>{example.name}</span>
                          <span>{example.id === params.id}</span>
                          <span class="text-md block text-xs text-gray-500 dark:text-white/40">
                            {example.description}
                          </span>
                        </NavLink>
                      )}
                    </For>
                  </div>
                </>
              )}
            </For>
          </div>

          <div
            dir="ltr"
            class="flex h-[82vh] overflow-hidden rounded-lg shadow-2xl md:col-span-8 lg:col-span-9"
          >
            <ErrorBoundary
              fallback={
                <>
                  Repl failed to load. You may be using a browser that doesn't support Web Workers.
                </>
              }
            >
              <Repl
                compiler={compiler}
                formatter={formatter}
                linter={linter}
                isHorizontal={true}
                dark={context.isDark}
                tabs={tabs()}
                reset={() => {
                  setTabs(currentData);
                  setCurrent(currentData[0].name);
                }}
                setTabs={setTabs}
                current={current()}
                setCurrent={setCurrent}
                id="examples"
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Examples;
