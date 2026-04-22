<script lang="ts">
	import { APP_NAME } from '$lib/constants';
	import { SNAPDEAL_COLORS } from '$lib/utils/theme';

	export let className = '';
	export let iconClassName = '';
	export let textClassName = '';
	export let compact = false;
	export let iconOnly = false;
	export let label = APP_NAME;

	$: resolvedIconClassName = iconClassName || (compact ? 'h-6 w-auto' : 'h-10 w-auto');
	$: resolvedTextClassName = textClassName || (compact ? 'text-[1.4rem]' : 'text-[2rem]');
</script>

<div
	class={`inline-flex items-center ${compact ? 'gap-2' : 'gap-3'} ${className}`}
	aria-hidden="true"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 32 32"
		fill="none"
		class={`shrink-0 ${resolvedIconClassName}`}
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M8.15738 28.1934L2.89 18.8954C2.60878 18.4007 2.55767 18.036 2.78779 17.489L7.72255 5.32623C7.82505 5.06595 8.23418 5.01361 8.3875 5.27417L14.7801 16.5256C15.0613 17.0202 15.3682 17.2026 15.9307 17.2026H28.639C28.9202 17.2026 29.1247 17.5931 28.9459 17.8275L21.019 28.2454C20.661 28.7142 20.3544 28.8707 19.7916 28.8707H9.30798C8.74553 28.8707 8.43861 28.6883 8.15738 28.1934ZM21.3515 14.7544L18.9478 10.483H14.1152C13.5525 10.483 13.2458 10.3007 12.9646 9.80599L9.92165 4.44086C9.76833 4.15412 9.99845 3.76356 10.3051 3.76356H22.0164C22.5789 3.76356 22.8858 3.9459 23.167 4.44086L29.0226 14.7544C29.1759 15.0408 28.9458 15.4317 28.6388 15.4317H22.5021C21.9396 15.4317 21.6327 15.2493 21.3515 14.7544Z"
			fill={SNAPDEAL_COLORS.logo}
		/>
	</svg>

	{#if !iconOnly}
		<span
			class={`shrink-0 font-primary font-semibold leading-none tracking-[-0.03em] ${resolvedTextClassName}`}
			style={`color: ${SNAPDEAL_COLORS.wordmark};`}
		>
			{label}
		</span>
	{/if}
</div>
