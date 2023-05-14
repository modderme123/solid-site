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
      class="ml-2 h-10 cursor-pointer rounded-md border border-gray-600 px-3 brightness-150 hover:border-gray-500"
      title={title()}
    >
      <Icon path={context.isDark ? sun : moon} class="h-6" />
      <span class="sr-only text-xs">{title()}</span>
    </button>
  );
};
