import { batch, Component, createSignal, ErrorBoundary } from 'solid-js';
import { Tab } from 'solid-repl';
import Repl from 'solid-repl/lib/repl';
import { compiler, formatter, linter } from './setupRepl';
import { useAppContext } from '../AppContext';

let count = 0;
const OldRepl: Component<{ tabs: Tab[] }> = (props) => {
  count++;
  const context = useAppContext();
  const initialTabs = props.tabs || [
    {
      name: 'main.jsx',
      source: '',
    },
  ];
  const [tabs, setTabs] = createSignal(initialTabs);
  const [current, setCurrent] = createSignal(initialTabs[0].name, {
    equals: false,
  });
  return (
    <ErrorBoundary
      fallback={
        <>Repl failed to load. You may be using a browser that doesn't support Web Workers.</>
      }
    >
      <Repl
        id={`repl-${count}`}
        compiler={compiler}
        formatter={formatter}
        linter={linter}
        isHorizontal={true}
        dark={context.isDark}
        tabs={tabs()}
        reset={() => {
          batch(() => {
            setTabs(initialTabs);
            setCurrent(initialTabs[0].name);
          });
        }}
        setTabs={setTabs}
        current={current()}
        hideDevtools={true}
        setCurrent={setCurrent}
      />
    </ErrorBoundary>
  );
};
export default OldRepl;
