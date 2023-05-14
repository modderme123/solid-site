export type LangType = {
  global: {
    dir?: 'rtl';
    name: string;
    title: string;
    locale: string;
    nav: {
      title: string;
      path: string;
      links?: {
        title: string;
        description: string;
        path: string;
        external?: boolean;
      }[];
      external?: boolean;
    }[];
    '404': {
      header: string;
      body: string;
    };
    newsletter: {
      title: string;
      email: string;
      success: string;
      error: string;
      register: string;
      sending: string;
    };
    footer: {
      declaration: string;
      license: string;
      contributors: string;
      sponsored_by: string;
      updated: string;
    };
    dark_mode: string;
    light_mode: string;
  };
  home: {
    hero: string;
    get_started: string;
    intro_video: string;
    intro_video_advanced: string;
    news: {
      content: string;
    };
    strengths: {
      icon: string;
      label: string;
      description: string;
    }[];
    facts: {
      label: string;
      detail: string;
      link?: string;
    }[];
    example: {
      headline: string;
      copy: string[];
      link_label: string;
      link: string;
    };
    reactivity: {
      headline: string;
      subheadline: string;
      copy: string;
      link_label: string;
      link: string;
    };
    performance: {
      headline: string[];
      copy: string;
      link_label: string;
      link: string;
    };
    features: {
      headline: string;
      copy: string;
      list: string[];
    };
    benchmarks: {
      time: string;
      view: string;
      show_more: string;
      link_label: string;
      js_benchmark: {
        title: string;
        description: string;
      };
      isomorophic_benchmark: {
        title: string;
        description: string;
      };
    };
    ukraine: {
      link: string;
      support: string;
      petition: string;
    };
  };
  docs: {
    title: string;
  };
  media: {
    title: string;
    copy: string;
    brand_font: string;
    primary: string;
    secondary: string;
    light: string;
    accent: string;
    copy_hex: string;
    resources: {
      with_wordmark: string;
      without_wordmark: string;
      only_wordmark: string;
      dark_with_wordmark: string;
      dark_without_wordmark: string;
      dark_only_wordmark: string;
    };
  };
  resources: {
    title: string;
    cta: string;
    search: string;
    types: string;
    types_list: {
      article: string;
      video: string;
      library: string;
      package: string;
    };
    published: string;
    days_ago: string;
    hours_ago: string;
    categories: string;
    translations: string;
    categories_list: {
      primitive: string;
      router: string;
      data: string;
      ui: string;
      plugin: string;
      starters: string;
      build_utility: string;
      add_on: string;
      testing: string;
      educational: string;
    };
    official: string;
    by: string;
  };
  tutorial: {
    solve: string;
    reset: string;
    playground: {
      result: string;
      output: string;
      clear: string;
      add_tab: string;
      refresh: string;
      format: string;
      copy: string;
      mode: string;
      client_render: string;
      server_render: string;
      client_hydration_render: string;
      dark_mode: string;
      import_json: string;
      export_json: string;
      export_codesandbox: string;
      share: string;
      scale: string;
    };
  };
  examples: {
    title: string;
    basic: string;
    complex: string;
  };
  contributors: {
    title: string;
    core_team: string;
    acknowledgments: string;
    ecosystem_team: string;
    copy: string;
    translators_copy: string;
    contributors: string;
    open_collective: string;
    support_copy: string;
  };
};
