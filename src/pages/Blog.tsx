import { Component, For } from 'solid-js';
import { Footer } from '../components/Footer';
import { useRouteData, NavLink } from '@solidjs/router';
import { useRouteReadyState } from '../utils/routeReadyState';
import type { BlogData } from './Blog.data';

const Blog: Component = () => {
  const data = useRouteData<BlogData>();
  useRouteReadyState();

  const sortedArticles = Object.entries(data.articles).sort(
    (entry1, entry2) => entry2[1].date - entry1[1].date,
  );

  return (
    <div class="flex flex-col">
      <div class="container my-2 px-3 pb-10 pt-5 lg:my-10 lg:px-12">
        <div class="mb-10 justify-center lg:flex">
          <div class="space-y-10">
            <For each={sortedArticles}>
              {([id, article]) => (
                <NavLink
                  href={`/blog/${id}`}
                  class="text-md mx-auto mb-10 block px-3 pb-10 text-center lg:px-0"
                >
                  <img class="mx-auto mb-10 rounded-md shadow-md lg:w-4/6" src={article.img} />
                  <h1 class="mb-3 text-xl font-semibold text-solid-medium dark:text-solid-darkdefault lg:text-2xl">
                    {article.title}
                  </h1>
                  <span class="text-md">{article.description}</span>
                  <div class="mt-3 text-xs">
                    By {article.author} on {new Date(article.date).toDateString()}
                  </div>
                </NavLink>
              )}
            </For>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
