import { articles } from './Resources/Articles.data';
import { podcasts } from './Resources/Podcasts.data';
import { videos } from './Resources/Videos.data';

export const ResourcesData = () => ({
  list: [...videos, ...articles, ...podcasts],
});

export type ResourcesDataProps = ReturnType<typeof ResourcesData>;
