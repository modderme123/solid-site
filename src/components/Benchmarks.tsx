import { For, Show, createMemo, createSignal } from 'solid-js';
import type { Component } from 'solid-js';
import { createVisibilityObserver } from '@solid-primitives/intersection-observer';
import { useI18n } from '@solid-primitives/i18n';

export interface GraphData {
  id: string;
  name: string;
  description: string;
  link: string;
  data: RowData[];
  scale: string;
}
interface RowData {
  label: string;
  active?: boolean;
  score: number;
}

const Chart: Component<{ rows: RowData[]; scale: string; direction: string }> = (props) => {
  const [t] = useI18n();
  const maxValue = createMemo(() => Math.max(...props.rows.map((row) => row.score)));
  const options = createMemo(() =>
    props.rows
      .sort((a, b) => a.score - b.score)
      .map((row) => ({
        ...row,
        width: `${(row.score / maxValue()) * 100}%`,
      })),
  );
  return (
    <table class="w-full table-fixed">
      <tbody>
        <For each={options()}>
          {(row) => {
            let chartRef: HTMLDivElement;
            const useVisibilityObserver = createVisibilityObserver();
            const isVisible = useVisibilityObserver(() => chartRef);
            return (
              <tr>
                <td class="w-1/6 text-xs">{row.label}</td>
                <td class="w-4/6 py-1">
                  <div
                    ref={(ref) => (chartRef = ref)}
                    class="relative z-10 overflow-hidden rounded-3xl"
                  >
                    <div
                      class="h-full w-full -translate-x-full rounded-3xl py-1 text-xxs transition-transform duration-700 ltr:text-right rtl:text-left"
                      classList={{
                        'bg-solid-light text-white font-semibold': row.active,
                        'bg-gray-100 dark:bg-solid-darkLighterBg': !row.active,
                      }}
                      style={{
                        width: row.width,
                        transform: `translateX(${
                          isVisible() ? '0%' : props.direction === 'right' ? '-100%' : '100%'
                        })`,
                      }}
                    >
                      {row.score ? (
                        <figure>
                          <span class="inline-block rounded-full p-1 px-2">
                            {row.score.toLocaleString()}
                          </span>
                        </figure>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            );
          }}
        </For>
        {!options().length ? (
          <tr>
            <td>&nbsp;</td>
            <td colSpan="2">No data has been supplied.</td>
          </tr>
        ) : null}
        <tr>
          <td>&nbsp;</td>
          <td class="p-3 text-xs">{t('home.benchmarks.time')}</td>
        </tr>
      </tbody>
    </table>
  );
};

export const Benchmarks: Component<{ list: Array<GraphData> }> = (props) => {
  const [t] = useI18n();
  const [current, setCurrent] = createSignal(0);
  const [expanded, setExpanded] = createSignal(false);
  const direction = createMemo(() => (t('global.dir', {}, 'ltr') == 'rtl' ? 'left' : 'right'));
  return (
    <>
      <Chart
        scale={props.list[current()].scale}
        rows={props.list[current()].data}
        direction={direction()}
      />
      <Show
        when={expanded()}
        fallback={
          <button
            class={`chevron button py-3 text-sm font-semibold text-solid-default hover:text-gray-500 dark:text-solid-darkdefault dark:hover:text-gray-300 chevron-${direction()}`}
            onClick={() => setExpanded(true)}
          >
            {t('home.benchmarks.show_more', {}, 'Show more client + server benchmarks')}
          </button>
        }
      >
        <div class="m-auto mt-4 flex flex-col space-y-2 lg:m-0 lg:flex-row lg:space-y-0">
          {props.list.map((item, index) => {
            return (
              <button
                onClick={() => setCurrent(index)}
                class="rounded p-3 text-xs transition duration-150 hover:text-white md:hover:bg-gray-400 dark:md:hover:bg-gray-400 lg:mr-1"
                classList={{
                  'active text-white bg-solid-light': current() === index,
                  'bg-gray-100 dark:bg-gray-500': current() !== index,
                }}
              >
                {item.name}
              </button>
            );
          })}
        </div>
        <div>
          <div class="block pt-5 text-xs">{props.list[current()].description}</div>
          <Show when={props.list[current()].link}>
            <a
              target="_blank"
              class="button chevron chevron-right mt-3 block text-xs font-semibold text-solid-default hover:text-gray-500 dark:text-solid-darkdefault dark:hover:text-gray-300"
              rel="noopener noreferrer"
              href={props.list[current()].link}
            >
              {t('home.benchmarks.view')}
            </a>
          </Show>
        </div>
      </Show>
    </>
  );
};
