<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { WEBUI_NAME, showSidebar, functions, mobile, theme } from '$lib/stores';
	import { page } from '$app/stores';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import Sidebar from '$lib/components/icons/Sidebar.svelte';
	import {
		getTopBarActionClasses,
		getTopBarActiveTabClasses,
		getTopBarInactiveTabClasses,
		getTopBarRailClasses,
		getTopBarShellClasses,
		isPrismTheme,
		isSnapdealTheme
	} from '$lib/utils/theme';

	const i18n = getContext('i18n');

	onMount(async () => {});
</script>

<svelte:head>
	<title>
		{$i18n.t('Home')} • {$WEBUI_NAME}
	</title>
</svelte:head>

<div
	class=" flex flex-col w-full h-screen max-h-[100dvh] transition-[max-width] duration-300 ease-out {$showSidebar
		? 'md:max-w-[calc(100%-var(--sidebar-width))]'
		: ''} max-w-full"
>
	<nav class="px-2 pt-1.5 backdrop-blur-xl w-full drag-region">
		<div
			class="flex items-center {getTopBarShellClasses($theme)} {isSnapdealTheme($theme) ||
			isPrismTheme($theme)
				? 'px-2 py-1'
				: ''}"
		>
			{#if $mobile}
				<div class="{$showSidebar ? 'md:hidden' : ''} flex flex-none items-center self-end mt-1.5">
					<Tooltip
						content={$showSidebar ? $i18n.t('Close Sidebar') : $i18n.t('Open Sidebar')}
						interactive={true}
					>
						<button
							id="sidebar-toggle-button"
							class="cursor-pointer flex rounded-xl transition {getTopBarActionClasses($theme)}"
							on:click={() => {
								showSidebar.set(!$showSidebar);
							}}
						>
							<div class=" self-center p-1.5">
								<Sidebar />
							</div>
						</button>
					</Tooltip>
				</div>
			{/if}

			<div class=" flex w-full">
				<div
					class="flex gap-1 scrollbar-none overflow-x-auto w-fit text-center text-sm font-medium {isSnapdealTheme(
						$theme
					) || isPrismTheme($theme)
						? `pt-1 px-1.5 py-1 ${getTopBarRailClasses($theme)}`
						: 'rounded-full bg-transparent pt-1'}"
				>
					<a
						class="min-w-fit p-1.5 {$page.url.pathname.includes('/home/notes')
							? getTopBarActiveTabClasses($theme)
							: getTopBarInactiveTabClasses($theme)} transition"
						href="/playground/notes">{$i18n.t('Notes')}</a
					>

					<a
						class="min-w-fit p-1.5 {$page.url.pathname.includes('/playground/calendar')
							? getTopBarActiveTabClasses($theme)
							: getTopBarInactiveTabClasses($theme)} transition"
						href="/playground/completions">{$i18n.t('Calendar')}</a
					>
				</div>
			</div>
		</div>
	</nav>

	<div class=" flex-1 max-h-full overflow-y-auto">
		<slot />
	</div>
</div>
