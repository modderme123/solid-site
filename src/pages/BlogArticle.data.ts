import { BlogInfo, MDXComponent, list } from './Blog.data';
import { RouteDataFunc } from '@solidjs/router';
import { createResource } from 'solid-js';

export interface BlogArticleData {
  loading: boolean;
  slug: string;
  details: BlogInfo;
  article?: MDXComponent;
}

export const BlogArticleData: RouteDataFunc<BlogArticleData> = (props) => {
  const [article] = createResource(async () => (await list[props.params.slug].body()).default);
  return {
    get slug() {
      return props.params.slug;
    },
    get loading() {
      return article.loading;
    },
    get details() {
      return list[props.params.slug];
    },
    get article() {
      return article();
    },
  };
};
