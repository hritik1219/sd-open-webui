<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { goto } from '$app/navigation';

	import { WEBUI_NAME, config, mobile, showSidebar, theme, user } from '$lib/stores';
	import { page } from '$app/stores';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import {
		getTopBarActionClasses,
		getTopBarActiveTabClasses,
		getTopBarInactiveTabClasses,
		getTopBarRailClasses,
		getTopBarShellClasses,
		isSaarthiTheme,
		isSnapdealTheme
	} from '$lib/utils/theme';

	import Sidebar from '$lib/components/icons/Sidebar.svelte';

	const i18n = getContext('i18n');

	let loaded = false;

	onMount(async () => {
		if ($user?.role !== 'admin') {
			await goto('/');
		}
		loaded = true;
	});
</script>

<svelte:head>
	<title>
		{$i18n.t('Admin Panel')} • {$WEBUI_NAME}
	</title>
</svelte:head>

{#if loaded}
	<div
		class=" flex flex-col h-screen max-h-[100dvh] flex-1 transition-[max-width] duration-300 ease-out {$showSidebar
			? 'md:max-w-[calc(100%-var(--sidebar-width))]'
			: ' md:max-w-[calc(100%-49px)]'}  w-full max-w-full"
	>
		<nav class="px-2 pt-1.5 backdrop-blur-xl drag-region select-none">
			<div
				class="flex items-center gap-1 {getTopBarShellClasses($theme)} {isSnapdealTheme($theme) ||
				isSaarthiTheme($theme)
					? 'px-2 py-1'
					: ''}"
			>
				{#if $mobile}
					<div class="{$showSidebar ? 'md:hidden' : ''} flex flex-none items-center self-end">
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
						) || isSaarthiTheme($theme)
							? `pt-1 px-1.5 py-1 ${getTopBarRailClasses($theme)}`
							: 'rounded-full bg-transparent pt-1'}"
					>
						<a
							draggable="false"
							class="min-w-fit p-1.5 {$page.url.pathname.includes('/admin/users')
								? getTopBarActiveTabClasses($theme)
								: getTopBarInactiveTabClasses($theme)} transition select-none"
							href="/admin">{$i18n.t('Users')}</a
						>

						{#if $config?.features.enable_admin_analytics ?? true}
							<a
								draggable="false"
								class="min-w-fit p-1.5 {$page.url.pathname.includes('/admin/analytics')
									? getTopBarActiveTabClasses($theme)
									: getTopBarInactiveTabClasses($theme)} transition select-none"
								href="/admin/analytics">{$i18n.t('Analytics')}</a
							>
						{/if}

						<a
							draggable="false"
							class="min-w-fit p-1.5 {$page.url.pathname.includes('/admin/evaluations')
								? getTopBarActiveTabClasses($theme)
								: getTopBarInactiveTabClasses($theme)} transition select-none"
							href="/admin/evaluations">{$i18n.t('Evaluations')}</a
						>

						<a
							draggable="false"
							class="min-w-fit p-1.5 {$page.url.pathname.includes('/admin/functions')
								? getTopBarActiveTabClasses($theme)
								: getTopBarInactiveTabClasses($theme)} transition select-none"
							href="/admin/functions">{$i18n.t('Functions')}</a
						>

						<a
							draggable="false"
							class="min-w-fit p-1.5 {$page.url.pathname.includes('/admin/settings')
								? getTopBarActiveTabClasses($theme)
								: getTopBarInactiveTabClasses($theme)} transition select-none"
							href="/admin/settings">{$i18n.t('Settings')}</a
						>
					</div>
				</div>
			</div>
		</nav>

		<div class="  pb-1 flex-1 max-h-full overflow-y-auto">
			<slot />
		</div>
	</div>
{/if}
