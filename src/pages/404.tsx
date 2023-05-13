import { Component } from 'solid-js';
import { Icon } from 'solid-heroicons';
import { faceFrown } from 'solid-heroicons/outline';

import { useI18n } from '@solid-primitives/i18n';

const FourOhFour: Component = () => {
  const [t] = useI18n();
  return (
    <div>
      <div class="m-10 flex flex-col content-center justify-center rounded-2xl bg-gray-100 py-10 text-center text-solid-medium dark:bg-gray-800">
        <div class="my-10 py-10">
          <Icon
            class="m-auto w-40 text-solid-default dark:text-solid-darkdefault"
            path={faceFrown}
          />
          <h2 class="mt-5 text-4xl font-semibold">
            {t('global.404.header', {}, 'Oops. Four oh four.')}
          </h2>
          <h2 class="text-2xl text-solid-gray">
            <a class="text-solid-medium" href="https://github.com/solidjs/@solidjs/router">
              @solidjs/router
            </a>{' '}
            {t('global.404.body', {}, "believes this page definitely doesn't exist.")}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default FourOhFour;
