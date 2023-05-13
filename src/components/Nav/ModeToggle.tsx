import { useI18n } from '@solid-primitives/i18n';
import { Icon } from 'solid-heroicons';
import { moon, sun } from 'solid-heroicons/outline';
import { VoidComponent } from 'solid-js';
import { useAppContext } from '../../AppContext';

export const ModeToggle: VoidComponent = () => {
  const [t] = useI18n();
  const context = useAppContext();
  const title = () => (context.isDark ? t('global.light_mode') : t('global.dark_mode')) as string;

  return (
    <button
      type="button"
      onClick={() => (context.isDark = !context.isDark)}
      class="focus:color-red-500 border-solid-100 ml-2 h-10 cursor-pointer rounded-md border bg-center bg-no-repeat px-3 text-solid-medium hover:border-gray-500 dark:border-gray-600 dark:brightness-150 dark:hover:border-gray-500"
      classList={{
        'hover:bg-gray-300 dark:hover:text-black focus:outline-none focus:highlight-none active:highlight-none focus:ring-0 active:outline-none':
          context.isDark,
      }}
      title={title()}
    >
      <Icon path={context.isDark ? sun : moon} class="h-6" />
      <span class="sr-only text-xs">{title()}</span>
    </button>
  );
};
