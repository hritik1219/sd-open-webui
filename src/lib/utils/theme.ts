export const SNAPDEAL_THEME = 'snapdeal';

export const SNAPDEAL_COLORS = {
	logo: '#FF2341',
	accent: '#EE204E',
	rose: '#FFE7EA',
	surface: '#F7F9F9',
	text: '#2B2B2B',
	muted: '#666666',
	divider: '#C8C8C8',
	wordmark: '#333333'
} as const;

export const THEME_CLASS_NAMES = ['dark', 'light', 'oled-dark', 'her', SNAPDEAL_THEME];

export const isSnapdealTheme = (value?: string | null) => value === SNAPDEAL_THEME;

export const getInactiveTabClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-muted-tab'
		: 'text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white';

export const getActiveTabClasses = (value?: string | null) =>
	isSnapdealTheme(value) ? 'snapdeal-active-tab' : '';

export const getTabRailClasses = (value?: string | null) =>
	isSnapdealTheme(value) ? 'snapdeal-tab-rail' : 'bg-transparent';

export const getTopBarShellClasses = (value?: string | null) =>
	isSnapdealTheme(value) ? 'snapdeal-topbar-shell' : 'bg-transparent';

export const getTopBarActionClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-topbar-action'
		: 'hover:bg-gray-100 dark:hover:bg-gray-850';

export const getTopBarRailClasses = (value?: string | null) =>
	isSnapdealTheme(value) ? 'snapdeal-topbar-rail' : 'bg-transparent';

export const getTopBarActiveTabClasses = (value?: string | null) =>
	isSnapdealTheme(value) ? 'snapdeal-topbar-active-tab' : '';

export const getTopBarInactiveTabClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-topbar-inactive-tab'
		: 'text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white';

export const getSidebarActionClasses = (value?: string | null) =>
	isSnapdealTheme(value) ? 'snapdeal-sidebar-action' : 'hover:bg-gray-100 dark:hover:bg-gray-900';

export const getHeaderShellClasses = (value?: string | null) =>
	isSnapdealTheme(value) ? 'snapdeal-header-shell' : 'bg-transparent';

export const getHeaderIconButtonClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-header-action'
		: 'hover:bg-gray-100 dark:hover:bg-gray-850';

export const getSearchShellClasses = (value?: string | null) =>
	isSnapdealTheme(value) ? 'snapdeal-search-shell' : 'bg-transparent';

export const getMenuPanelClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-menu-panel'
		: 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-850 dark:text-white';

export const getMenuItemClasses = (value?: string | null) =>
	isSnapdealTheme(value) ? 'snapdeal-menu-item' : 'hover:bg-gray-50 dark:hover:bg-gray-800';

export const getSoftButtonClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-soft-button'
		: 'bg-gray-50 dark:text-white dark:bg-gray-900/50 text-black';

export const getFolderButtonClasses = (value?: string | null) =>
	isSnapdealTheme(value) ? 'snapdeal-folder-button' : 'hover:bg-gray-100 dark:hover:bg-gray-900';

export const getIconButtonClasses = (value?: string | null) =>
	isSnapdealTheme(value) ? 'snapdeal-icon-button' : 'dark:hover:bg-gray-850';

export const getDialogPanelClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-dialog-panel'
		: 'bg-white/95 dark:bg-gray-950/95 border-white dark:border-gray-900';

export const getDialogSecondaryButtonClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-dialog-secondary'
		: 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-850 dark:hover:bg-gray-800 dark:text-white';

export const getDialogPrimaryButtonClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-primary-button snapdeal-dialog-primary'
		: 'bg-gray-900 hover:bg-gray-850 text-gray-100 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-800';

export const getPrimaryButtonClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-primary-button'
		: 'bg-gray-900 hover:bg-gray-850 text-gray-100 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-800';

export const getSearchCtaButtonClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-search-cta'
		: 'bg-gray-900 hover:bg-gray-850 text-gray-100 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-800';

export const getSelectContentClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-select-content'
		: 'bg-white dark:bg-gray-900 dark:text-white border-gray-300/30 dark:border-gray-700/40';

export const getSelectItemClasses = (value?: string | null) =>
	isSnapdealTheme(value)
		? 'snapdeal-select-item'
		: 'text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-850';

export const getThemeClasses = (value: string, prefersDark = false) => {
	switch (value) {
		case 'system':
			return prefersDark ? 'dark' : 'light';
		case 'oled-dark':
			return 'dark oled-dark';
		case 'light':
			return 'light';
		case 'her':
			return 'light her';
		case SNAPDEAL_THEME:
			return `light ${SNAPDEAL_THEME}`;
		default:
			return 'dark';
	}
};

export const getThemeMetaColor = (value: string, prefersDark = false) => {
	switch (value) {
		case 'system':
			return prefersDark ? '#171717' : '#ffffff';
		case 'dark':
			return '#171717';
		case 'oled-dark':
			return '#000000';
		case 'her':
			return '#983724';
		case SNAPDEAL_THEME:
			return SNAPDEAL_COLORS.logo;
		case 'light':
			return '#ffffff';
		default:
			return '#171717';
	}
};
