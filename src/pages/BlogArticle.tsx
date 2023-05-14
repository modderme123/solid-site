import { Component, Show, createMemo } from 'solid-js';
import { useI18n } from '@solid-primitives/i18n';
import { useRouteData, NavLink } from '@solidjs/router';
import { useRouteReadyState } from '../utils/routeReadyState';
import { Footer } from '../components/Footer';
import { useAppContext } from '../AppContext';
import { YouTube, Tweet, Twitch, Spotify } from 'solid-social';
import type { BlogArticleData } from './BlogArticle.data';

const BlogArticle: Component = () => {
  const [t] = useI18n();
  const data = useRouteData<BlogArticleData>();
  useRouteReadyState();
  const chevron = createMemo(() =>
    t('global.dir', {}, 'ltr') == 'rtl' ? 'chevron-right' : 'chevron-left',
  );
  const context = useAppContext();

  return (
    <div class="flex flex-col">
      <div class="container my-2 px-3 pb-10 pt-5 lg:my-10 lg:px-12">
        <div class="mb-10 justify-center lg:flex">
          <div class="space-y-10 px-4 lg:px-0">
            <Show
              fallback={<div class="m-10 p-10 text-center">Loading article...</div>}
              when={!data.loading}
            >
              <div class="container lg:px-10">
                <div class="space-y-5 text-center">
                  <img class="mb-10 rounded-md shadow-md" src={data.details.img} />
                  <h1 class="mt-10 text-4xl font-semibold text-solid-medium dark:text-solid-darkdefault">
                    {data.details.title}
                  </h1>
                  <div class="text-md">
                    Posted by{' '}
                    <a target="_blank" rel="noopener" href={data.details.author_url}>
                      {data.details.author}
                    </a>{' '}
                    on {new Date(data.details.date).toDateString()}
                  </div>
                </div>
                <hr class="mx-auto mt-10 w-3/6" />
                <article class="prose mx-auto my-10 dark:prose-invert">
                  {data.article && (
                    <data.article
                      components={{
                        Tweet: (props) => (
                          <Tweet
                            {...props}
                            theme={context.isDark ? 'dark' : 'light'}
                            align="center"
                          />
                        ),
                        YouTube,
                        Twitch: (props) => <Twitch {...props} parent={location.hostname} />,
                        Spotify: (props) => (
                          <Spotify {...props} theme={context.isDark ? 'dark' : undefined} />
                        ),
                      }}
                    />
                  )}
                </article>
                <hr class="mx-auto mt-10 w-3/6" />
                <div class="mt-10 flex flex-row justify-center">
                  <NavLink href="/blog">
                    <figure class={`chevron inline-block ${chevron()}`} /> Back to the SolidJS Blog
                  </NavLink>
                </div>
              </div>
            </Show>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogArticle;
