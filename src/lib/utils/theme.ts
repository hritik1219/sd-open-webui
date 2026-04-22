export const SNAPDEAL_THEME = 'snapdeal';
export const PRISM_THEME = 'prism';

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

export const PRISM_COLORS = {
	background: '#090B10',
	surface: '#0F1218',
	surfaceAlt: '#171B23',
	text: '#F5F7FB',
	muted: '#9AA3B5',
	border: 'rgba(255, 255, 255, 0.12)',
	accent: '#FF2341',
	accentAlt: '#7C5CFF',
	glow: 'rgba(124, 92, 255, 0.32)'
} as const;

export const THEME_CLASS_NAMES = ['dark', 'light', 'oled-dark', 'her', SNAPDEAL_THEME, PRISM_THEME];

export const isSnapdealTheme = (value?: string | null) => value === SNAPDEAL_THEME;
export const isPrismTheme = (value?: string | null) => value === PRISM_THEME;
export const isCustomTheme = (value?: string | null) =>
	isSnapdealTheme(value) || isPrismTheme(value);

export const isDarkTheme = (value?: string | null, prefersDark = false) => {
	switch (value) {
		case 'system':
			return prefersDark;
		case 'dark':
		case 'oled-dark':
		case PRISM_THEME:
			return true;
		default:
			return false;
	}
};

const getThemeVariantClass = (
	value: string | null | undefined,
	{
		snapdeal,
		prism,
		fallback
	}: {
		snapdeal: string;
		prism: string;
		fallback: string;
	}
) => {
	if (isSnapdealTheme(value)) {
		return snapdeal;
	}

	if (isPrismTheme(value)) {
		return prism;
	}

	return fallback;
};

export const getInactiveTabClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-muted-tab',
		prism: 'prism-muted-tab',
		fallback: 'text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'
	});

export const getActiveTabClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-active-tab',
		prism: 'prism-active-tab',
		fallback: ''
	});

export const getTabRailClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-tab-rail',
		prism: 'prism-tab-rail',
		fallback: 'bg-transparent'
	});

export const getTopBarShellClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-topbar-shell',
		prism: 'prism-topbar-shell',
		fallback: 'bg-transparent'
	});

export const getTopBarActionClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-topbar-action',
		prism: 'prism-topbar-action',
		fallback: 'hover:bg-gray-100 dark:hover:bg-gray-850'
	});

export const getTopBarRailClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-topbar-rail',
		prism: 'prism-topbar-rail',
		fallback: 'bg-transparent'
	});

export const getTopBarActiveTabClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-topbar-active-tab',
		prism: 'prism-topbar-active-tab',
		fallback: ''
	});

export const getTopBarInactiveTabClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-topbar-inactive-tab',
		prism: 'prism-topbar-inactive-tab',
		fallback: 'text-gray-300 dark:text-gray-600 hover:text-gray-700 dark:hover:text-white'
	});

export const getSidebarActionClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-sidebar-action',
		prism: 'prism-sidebar-action',
		fallback: 'hover:bg-gray-100 dark:hover:bg-gray-900'
	});

export const getHeaderShellClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-header-shell',
		prism: 'prism-header-shell',
		fallback: 'bg-transparent'
	});

export const getHeaderIconButtonClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-header-action',
		prism: 'prism-header-action',
		fallback: 'hover:bg-gray-100 dark:hover:bg-gray-850'
	});

export const getSearchShellClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-search-shell',
		prism: 'prism-search-shell',
		fallback: 'bg-transparent'
	});

export const getMenuPanelClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-menu-panel',
		prism: 'prism-menu-panel',
		fallback: 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-850 dark:text-white'
	});

export const getMenuItemClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-menu-item',
		prism: 'prism-menu-item',
		fallback: 'hover:bg-gray-50 dark:hover:bg-gray-800'
	});

export const getSoftButtonClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-soft-button',
		prism: 'prism-soft-button',
		fallback: 'bg-gray-50 dark:text-white dark:bg-gray-900/50 text-black'
	});

export const getFolderButtonClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-folder-button',
		prism: 'prism-folder-button',
		fallback: 'hover:bg-gray-100 dark:hover:bg-gray-900'
	});

export const getIconButtonClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-icon-button',
		prism: 'prism-icon-button',
		fallback: 'dark:hover:bg-gray-850'
	});

export const getDialogPanelClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-dialog-panel',
		prism: 'prism-dialog-panel',
		fallback: 'bg-white/95 dark:bg-gray-950/95 border-white dark:border-gray-900'
	});

export const getDialogSecondaryButtonClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-dialog-secondary',
		prism: 'prism-dialog-secondary',
		fallback:
			'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-850 dark:hover:bg-gray-800 dark:text-white'
	});

export const getDialogPrimaryButtonClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-primary-button snapdeal-dialog-primary',
		prism: 'prism-primary-button prism-dialog-primary',
		fallback:
			'bg-gray-900 hover:bg-gray-850 text-gray-100 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-800'
	});

export const getPrimaryButtonClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-primary-button',
		prism: 'prism-primary-button',
		fallback:
			'bg-gray-900 hover:bg-gray-850 text-gray-100 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-800'
	});

export const getSearchCtaButtonClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-search-cta',
		prism: 'prism-search-cta',
		fallback:
			'bg-gray-900 hover:bg-gray-850 text-gray-100 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-800'
	});

export const getSelectContentClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-select-content',
		prism: 'prism-select-content',
		fallback: 'bg-white dark:bg-gray-900 dark:text-white border-gray-300/30 dark:border-gray-700/40'
	});

export const getSelectItemClasses = (value?: string | null) =>
	getThemeVariantClass(value, {
		snapdeal: 'snapdeal-select-item',
		prism: 'prism-select-item',
		fallback: 'text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-850'
	});

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
		case PRISM_THEME:
			return `dark ${PRISM_THEME}`;
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
		case PRISM_THEME:
			return PRISM_COLORS.background;
		case 'light':
			return '#ffffff';
		default:
			return '#171717';
	}
};
