import {
  Component,
  ErrorBoundary,
  For,
  Show,
  Suspense,
  batch,
  createEffect,
  createMemo,
  createSignal,
  on,
} from 'solid-js';
import { NavLink, useRouteData } from '@solidjs/router';
import { arrowLeft, arrowRight, chevronDoubleRight, chevronDown } from 'solid-heroicons/solid';
import { compiler, formatter, linter } from '../components/setupRepl';
import Dismiss from 'solid-dismiss';
import { Icon } from 'solid-heroicons';
import { LessonLookup } from '@solid.js/docs';
import Repl from 'solid-repl/lib/repl';
import type { TutorialRouteData } from './Tutorial.data';
import type { editor } from 'monaco-editor';
import { useAppContext } from '../AppContext';
import { useI18n } from '@solid-primitives/i18n';
import { useRouteReadyState } from '../utils';
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

interface DirectoryMenuProps {
  directory?: Record<string, LessonLookup[]>;
  current?: LessonLookup;
}

const DirectoryMenu: Component<DirectoryMenuProps> = (props) => {
  const [showDirectory, setShowDirectory] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal('');
  let listContainer!: HTMLOListElement;
  let menuButton!: HTMLButtonElement;
  let search!: HTMLInputElement;
  const directory = createMemo(() => Object.entries(props.directory || {}));
  const filteredDirectory = createMemo<[string, LessonLookup[]][]>(() => {
    return (
      directory()
        .map<[string, LessonLookup[]]>(([section, entries]) => [
          section,
          // TODO: Refactor this to be more easily digesteable (it's not that bad)
          entries.filter((entry) =>
            Object.values(entry).some((value: string) =>
              value.toLowerCase().includes(searchQuery().toLowerCase()),
            ),
          ),
        ])
        // Filter out sections that have no entries
        .filter(([, entries]) => entries.length > 0)
    );
  });

  // Close the dropdown menu every time the `current` page changes
  // and reset the querySearch
  createEffect(
    on(
      () => props.current,
      () =>
        setTimeout(() => {
          setShowDirectory(false);
          setSearchQuery('');
        }, 0),
    ),
  );

  createEffect(() => {
    if (showDirectory()) {
      search.focus();
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.clientWidth; // reflow

      const activeItem = listContainer.querySelector('.js-active');
      if (activeItem) {
        activeItem.scrollIntoView();
        listContainer.scroll({ top: listContainer.scrollTop - search.offsetHeight }); // reflow
      }

      window.scrollTo({ top: 0 });
      document.documentElement.style.scrollBehavior = 'smooth';
    }
  });

  return (
    <>
      <button class="group flex items-center space-x-1 px-10 py-2" ref={menuButton}>
        <div class="inline-flex flex-grow flex-col items-baseline">
          <h3 class="text-solid text-xl leading-none">{props.current?.lessonName}</h3>
        </div>

        <Icon
          path={chevronDown}
          class="-mb-1 h-8 transform transition duration-300 group-hover:translate-y-0.5"
          classList={{ 'translate-y-0.5': showDirectory() }}
        />
      </button>
      <Dismiss menuButton={menuButton} open={showDirectory} setOpen={setShowDirectory}>
        <ol
          ref={listContainer}
          class="absolute left-8 z-10 max-h-[50vh] w-64 space-y-3 overflow-auto rounded-b rounded-bl-lg rounded-br-lg bg-white shadow-lg dark:bg-solid-darkLighterBg"
          classList={{ hidden: !showDirectory() }}
        >
          <li class="sticky top-0">
            <input
              ref={search}
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              id="search"
              name="search"
              type="search"
              placeholder="Search..."
              autocomplete="off"
              class="block w-full px-3 py-2 text-black"
            />
          </li>
          <For each={filteredDirectory()}>
            {([section, entries], sectionIndex) => (
              <li class="js-section-title bg-3">
                <p class="inline-block px-3 py-1 font-semibold">
                  {sectionIndex() + 1}. {section}
                </p>

                <ul class="box-border divide-y divide-gray-500">
                  <For each={entries}>
                    {(entry, entryIndex) => (
                      <li>
                        <NavLink
                          activeClass="js-active bg-blue-50 dark:bg-solid-darkbg"
                          href={`/tutorial/${entry.internalName}`}
                          class="block px-5 py-3 hover:bg-blue-100 dark:hover:bg-solid-medium"
                        >
                          <p class="text-sm font-medium text-gray-900 dark:text-gray-200">
                            {alphabet[entryIndex()]}. {entry.lessonName}
                          </p>
                        </NavLink>
                      </li>
                    )}
                  </For>
                </ul>
              </li>
            )}
          </For>
        </ol>
      </Dismiss>
    </>
  );
};

const Tutorial: Component = () => {
  const data = useRouteData<TutorialRouteData>();
  const context = useAppContext();
  const [t] = useI18n();
  let replEditor: editor.IStandaloneCodeEditor;
  const [tabs, setTabs] = createSignal([
    {
      name: 'main.jsx',
      source: '',
    },
  ]);
  const [current, setCurrent] = createSignal('main.jsx', { equals: false });
  const [open, setOpen] = createSignal(true);
  let markDownRef!: HTMLDivElement;

  useRouteReadyState();

  createEffect(() => {
    // markDownRef.scrollTop = 0;
    replEditor && replEditor.setScrollPosition({ scrollTop: 0 });
    const fileset = data.solved ? data.solvedJs : data.js;
    const files = fileset?.files;
    if (!files) return;
    batch(() => {
      const newTabs = files.map((file) => {
        return {
          name: file.name + (file.type ? `.${file.type}` : '.jsx'),
          source: file.content,
        };
      });
      setTabs(newTabs);
      setCurrent(newTabs[0].name);
    });
  });

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div
        dir="ltr"
        class="h-[calc(100vh-64px)] transition-all duration-300 md:grid"
        classList={{
          'grid-cols-[minmax(40%,_600px)_auto]': open(),
          'grid-cols-[minmax(100%,_600px)_auto]': !open(),
        }}
      >
        <div class="border-grey mb-10 flex h-full flex-col overflow-hidden border-r-2 bg-gray-50 dark:border-solid-darkLighterBg dark:bg-solid-darkbg md:mb-0 ">
          <div class="box-border rounded-t border-b-2 border-solid bg-white pb-2 pt-3 dark:border-solid-darkLighterBg dark:bg-solid-darkLighterBg">
            <button
              type="button"
              class="float-right mr-5 mt-1 hidden md:block"
              onClick={() => setOpen(!open())}
            >
              <Icon
                path={chevronDoubleRight}
                class="h-6 opacity-50 transition-all duration-300"
                classList={{ '-rotate-180': !open() }}
              />
            </button>
            <DirectoryMenu
              current={data.tutorialDirectoryEntry}
              directory={data.tutorialDirectory}
            />
          </div>
          <Show when={data.markdown} fallback={''}>
            <div
              ref={markDownRef}
              class="prose max-w-full flex-1 overflow-auto p-10 dark:prose-invert"
            >
              {data.markdown}
            </div>
          </Show>

          <div class="flex items-center justify-between border-t-2 px-10 py-4 dark:border-solid-darkLighterBg">
            <Show
              when={data.solved}
              fallback={
                <NavLink
                  class="inline-flex rounded bg-solid-default px-3 py-2 text-white hover:bg-solid-medium"
                  href={`/tutorial/${data.id}?solved`}
                  onClick={() => setOpen(true)}
                >
                  {t('tutorial.solve')}
                </NavLink>
              }
            >
              <NavLink
                class="inline-flex rounded bg-solid-default px-3 py-2 text-white hover:bg-solid-medium"
                href={`/tutorial/${data.id}`}
                onClick={() => setOpen(true)}
              >
                {t('tutorial.reset')}
              </NavLink>
            </Show>
            <div class="flex items-center space-x-4">
              <span data-tooltip={data.previousLesson}>
                <NavLink href={data.previousUrl ?? '#'}>
                  <span class="sr-only">Previous step</span>
                  <Icon
                    path={arrowLeft}
                    class="h-6"
                    classList={{ 'opacity-25': !data.previousUrl }}
                  />
                </NavLink>
              </span>

              <span data-tooltip={data.nextLesson}>
                <NavLink href={data.nextUrl ?? '#'}>
                  <span class="sr-only">Next step</span>
                  <Icon path={arrowRight} class="h-6" classList={{ 'opacity-25': !data.nextUrl }} />
                </NavLink>
              </span>
            </div>
          </div>
        </div>
        <Show when={open()}>
          <ErrorBoundary
            fallback={
              <>Repl failed to load. You may be using a browser that doesn't support Web Workers.</>
            }
          >
            <Repl
              onEditorReady={(editor) => {
                replEditor = editor;
              }}
              compiler={compiler}
              formatter={formatter}
              linter={linter}
              isHorizontal={true}
              dark={context.isDark}
              tabs={tabs()}
              setTabs={setTabs}
              reset={() => {
                batch(() => {
                  const fileset = data.solved ? data.solvedJs : data.js;
                  const files = fileset?.files;
                  if (!files) return;
                  batch(() => {
                    const newTabs = files.map((file) => {
                      return {
                        name: file.name + (file.type ? `.${file.type}` : '.jsx'),
                        source: file.content,
                      };
                    });
                    setTabs(newTabs);
                    setCurrent(newTabs[0].name);
                  });
                });
              }}
              current={current()}
              setCurrent={setCurrent}
              id="tutorial"
            />
          </ErrorBoundary>
        </Show>
      </div>
    </Suspense>
  );
};

export default Tutorial;
