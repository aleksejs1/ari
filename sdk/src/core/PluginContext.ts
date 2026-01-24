export type PluginContext = {
    api: any;
    i18n: any;
    routeRegistry: { register: (key: string, route: any) => void };
    sidebarRegistry: { register: (item: any) => void };
    topMenuRegistry?: { register: (item: any) => void };
};
