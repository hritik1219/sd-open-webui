<script lang="ts">
	import { onMount } from 'svelte';

	type PrismAnimationType = 'rotate' | 'hover' | '3drotate';

	export let height = 3.5;
	export let baseWidth = 5.5;
	export let animationType: PrismAnimationType = 'rotate';
	export let glow = 1;
	export let offset: { x?: number; y?: number } = { x: 0, y: 0 };
	export let noise = 0.5;
	export let transparent = true;
	export let scale = 3.6;
	export let hueShift = 0;
	export let colorFrequency = 1;
	export let hoverStrength = 2;
	export let inertia = 0.05;
	export let bloom = 1;
	export let edgeShine = 1.35;
	export let vertexFlash = 1.5;
	export let suspendWhenOffscreen = false;
	export let timeScale = 0.5;
	export let className = '';

	let containerRef: HTMLDivElement | null = null;
	let mounted = false;
	let setupToken = 0;
	let cleanup = () => {};

	const destroyEffect = () => {
		cleanup();
		cleanup = () => {};
	};

	const buildEffect = async (_signature: string) => {
		const container = containerRef;
		if (!mounted || !container) {
			return;
		}

		const currentToken = ++setupToken;
		destroyEffect();

		const { Renderer, Triangle, Program, Mesh } = await import('ogl');
		if (!mounted || currentToken !== setupToken || container !== containerRef) {
			return;
		}

		const H = Math.max(0.001, height);
		const BW = Math.max(0.001, baseWidth);
		const BASE_HALF = BW * 0.5;
		const GLOW = Math.max(0.0, glow);
		const NOISE = Math.max(0.0, noise);
		const offX = offset?.x ?? 0;
		const offY = offset?.y ?? 0;
		const SAT = transparent ? 1.5 : 1;
		const SCALE = Math.max(0.001, scale);
		const HUE = hueShift || 0;
		const CFREQ = Math.max(0.0, colorFrequency || 1);
		const BLOOM = Math.max(0.0, bloom || 1);
		const EDGE_SHINE = Math.max(0.0, edgeShine || 1);
		const TS = Math.max(0, timeScale || 1);
		const HOVSTR = Math.max(0, hoverStrength || 1);
		const INERT = Math.max(0, Math.min(1, inertia || 0.12));
		const VERTEX_FLASH = Math.max(0.0, vertexFlash || 1);

		const dpr = Math.min(2, window.devicePixelRatio || 1);
		const renderer = new Renderer({
			dpr,
			alpha: transparent,
			antialias: false
		});

		const gl = renderer.gl;
		gl.disable(gl.DEPTH_TEST);
		gl.disable(gl.CULL_FACE);
		gl.disable(gl.BLEND);

		Object.assign(gl.canvas.style, {
			position: 'absolute',
			inset: '0',
			width: '100%',
			height: '100%',
			display: 'block'
		} as Partial<CSSStyleDeclaration>);

		container.appendChild(gl.canvas);

		const vertex = /* glsl */ `
			attribute vec2 position;
			void main() {
				gl_Position = vec4(position, 0.0, 1.0);
			}
		`;

		const fragment = /* glsl */ `
			precision highp float;
			uniform vec2  iResolution;
			uniform float iTime;
			uniform float uHeight;
			uniform float uBaseHalf;
			uniform mat3  uRot;
			uniform int   uUseBaseWobble;
			uniform float uGlow;
			uniform vec2  uOffsetPx;
			uniform float uNoise;
			uniform float uSaturation;
			uniform float uScale;
			uniform float uHueShift;
			uniform float uColorFreq;
			uniform float uBloom;
			uniform float uCenterShift;
			uniform float uInvBaseHalf;
			uniform float uInvHeight;
			uniform float uMinAxis;
			uniform float uPxScale;
			uniform float uTimeScale;
			uniform float uEdgeShine;
			uniform float uVertexFlash;
			uniform float uMotionBoost;

			vec4 tanh4(vec4 x){
				vec4 e2x = exp(2.0*x);
				return (e2x - 1.0) / (e2x + 1.0);
			}

			float rand(vec2 co){
				return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453123);
			}

			float sdOctaAnisoInv(vec3 p){
				vec3 q = vec3(abs(p.x) * uInvBaseHalf, abs(p.y) * uInvHeight, abs(p.z) * uInvBaseHalf);
				float m = q.x + q.y + q.z - 1.0;
				return m * uMinAxis * 0.5773502691896258;
			}

			float sdPyramidUpInv(vec3 p){
				float oct = sdOctaAnisoInv(p);
				float halfSpace = -p.y;
				return max(oct, halfSpace);
			}

			mat3 hueRotation(float a){
				float c = cos(a), s = sin(a);
				mat3 W = mat3(
					0.299, 0.587, 0.114,
					0.299, 0.587, 0.114,
					0.299, 0.587, 0.114
				);
				mat3 U = mat3(
					 0.701, -0.587, -0.114,
					-0.299,  0.413, -0.114,
					-0.300, -0.588,  0.886
				);
				mat3 V = mat3(
					 0.168, -0.331,  0.500,
					 0.328,  0.035, -0.500,
					-0.497,  0.296,  0.201
				);
				return W + U * c + V * s;
			}

			float sdSegment(vec2 p, vec2 a, vec2 b){
				vec2 pa = p - a;
				vec2 ba = b - a;
				float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.00001), 0.0, 1.0);
				return length(pa - ba * h);
			}

			float lineGlow(vec2 p, vec2 a, vec2 b, float width, float softness){
				float d = sdSegment(p, a, b);
				float core = pow(clamp(1.0 - d / max(width, 0.0001), 0.0, 1.0), 3.0);
				float halo = exp(-softness * d * d);
				return core * 2.4 + halo * 1.15;
			}

			float pointGlow(vec2 p, vec2 c, float radius, float softness){
				float d = length(p - c);
				float core = pow(clamp(1.0 - d / max(radius, 0.0001), 0.0, 1.0), 4.0);
				float halo = exp(-softness * d * d);
				return core * 2.8 + halo * 1.2;
			}

			void main(){
				vec2 f = (gl_FragCoord.xy - 0.5 * iResolution.xy - uOffsetPx) * uPxScale;
				float z = 5.0;
				float d = 0.0;
				vec3 p;
				vec4 o = vec4(0.0);
				float centerShift = uCenterShift;
				float cf = uColorFreq;

				mat2 wob = mat2(1.0);
				if (uUseBaseWobble == 1) {
					float t = iTime * uTimeScale;
					float c0 = cos(t + 0.0);
					float c1 = cos(t + 33.0);
					float c2 = cos(t + 11.0);
					wob = mat2(c0, c1, c2, c0);
				}

				const int STEPS = 100;
				for (int i = 0; i < STEPS; i++) {
					p = vec3(f, z);
					p.xz = p.xz * wob;
					p = uRot * p;
					vec3 q = p;
					q.y += centerShift;
					float sdf = sdPyramidUpInv(q);
					d = 0.1 + 0.2 * abs(sdf);
					z -= d;
					o += (sin((p.y + z) * cf + vec4(0.0, 1.0, 2.0, 3.0)) + 1.0) / d;
				}

				o = tanh4(o * o * (uGlow * uBloom) / 1e5);
				vec3 col = o.rgb;

				vec3 apex = vec3(0.0, uHeight - centerShift, 0.0);
				vec3 b0 = vec3( uBaseHalf, -centerShift,  uBaseHalf);
				vec3 b1 = vec3(-uBaseHalf, -centerShift,  uBaseHalf);
				vec3 b2 = vec3(-uBaseHalf, -centerShift, -uBaseHalf);
				vec3 b3 = vec3( uBaseHalf, -centerShift, -uBaseHalf);

				apex.xz = apex.xz * wob;
				b0.xz = b0.xz * wob;
				b1.xz = b1.xz * wob;
				b2.xz = b2.xz * wob;
				b3.xz = b3.xz * wob;

				apex = uRot * apex;
				b0 = uRot * b0;
				b1 = uRot * b1;
				b2 = uRot * b2;
				b3 = uRot * b3;

				vec2 screenPos = f;
				float edgeWire =
					lineGlow(screenPos, apex.xy, b0.xy, 0.034, 118.0) +
					lineGlow(screenPos, apex.xy, b1.xy, 0.034, 118.0) +
					lineGlow(screenPos, apex.xy, b2.xy, 0.034, 118.0) +
					lineGlow(screenPos, apex.xy, b3.xy, 0.034, 118.0) +
					lineGlow(screenPos, b0.xy, b1.xy, 0.028, 96.0) +
					lineGlow(screenPos, b1.xy, b2.xy, 0.028, 96.0) +
					lineGlow(screenPos, b2.xy, b3.xy, 0.028, 96.0) +
					lineGlow(screenPos, b3.xy, b0.xy, 0.028, 96.0);

				float motionPulse = smoothstep(0.02, 1.4, uMotionBoost);
				float vertexPulse = 0.55 + motionPulse * (1.4 + 4.2 * pow(abs(sin(iTime * 20.0)), 12.0));
				float vertexWire =
					pointGlow(screenPos, apex.xy, 0.072, 146.0) * 1.45 +
					pointGlow(screenPos, b0.xy, 0.052, 132.0) * 0.95 +
					pointGlow(screenPos, b1.xy, 0.052, 132.0) * 0.95 +
					pointGlow(screenPos, b2.xy, 0.052, 132.0) * 0.95 +
					pointGlow(screenPos, b3.xy, 0.052, 132.0) * 0.95;

				float edgeGlowAmount = edgeWire * (0.42 + 1.5 * uEdgeShine) * (1.0 + motionPulse * 0.45);
				float vertexGlowAmount = vertexWire * uVertexFlash * (0.36 + motionPulse * 3.4) * vertexPulse;
				vec3 edgeColor = mix(vec3(1.0, 0.28, 0.52), vec3(1.0), 0.88);
				vec3 vertexColor = vec3(1.0, 0.98, 1.0);
				col += edgeColor * edgeGlowAmount;
				col += vertexColor * vertexGlowAmount;
				float n = rand(gl_FragCoord.xy + vec2(iTime));
				col += (n - 0.5) * uNoise;
				col = clamp(col, 0.0, 1.0);
				float L = dot(col, vec3(0.2126, 0.7152, 0.0722));
				col = clamp(mix(vec3(L), col, uSaturation), 0.0, 1.0);

				if(abs(uHueShift) > 0.0001){
					col = clamp(hueRotation(uHueShift) * col, 0.0, 1.0);
				}

				float overlayAlpha = clamp(edgeGlowAmount * 0.12 + vertexGlowAmount * 0.18, 0.0, 1.0);
				gl_FragColor = vec4(col, max(o.a, overlayAlpha));
			}
		`;

		const geometry = new Triangle(gl);
		const iResBuf = new Float32Array(2);
		const offsetPxBuf = new Float32Array(2);

		const program = new Program(gl, {
			vertex,
			fragment,
			uniforms: {
				iResolution: { value: iResBuf },
				iTime: { value: 0 },
				uHeight: { value: H },
				uBaseHalf: { value: BASE_HALF },
				uUseBaseWobble: { value: 1 },
				uRot: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) },
				uGlow: { value: GLOW },
				uOffsetPx: { value: offsetPxBuf },
				uNoise: { value: NOISE },
				uSaturation: { value: SAT },
				uScale: { value: SCALE },
				uHueShift: { value: HUE },
				uColorFreq: { value: CFREQ },
				uBloom: { value: BLOOM },
				uCenterShift: { value: H * 0.25 },
				uInvBaseHalf: { value: 1 / BASE_HALF },
				uInvHeight: { value: 1 / H },
				uMinAxis: { value: Math.min(BASE_HALF, H) },
				uPxScale: {
					value: 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE)
				},
				uTimeScale: { value: TS },
				uEdgeShine: { value: EDGE_SHINE },
				uVertexFlash: { value: VERTEX_FLASH },
				uMotionBoost: { value: 0 }
			}
		});

		const mesh = new Mesh(gl, { geometry, program });

		const resize = () => {
			const width = container.clientWidth || 1;
			const heightValue = container.clientHeight || 1;
			renderer.setSize(width, heightValue);
			iResBuf[0] = gl.drawingBufferWidth;
			iResBuf[1] = gl.drawingBufferHeight;
			offsetPxBuf[0] = offX * dpr;
			offsetPxBuf[1] = offY * dpr;
			program.uniforms.uPxScale.value = 1 / ((gl.drawingBufferHeight || 1) * 0.1 * SCALE);
		};

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(container);
		resize();

		const rotBuf = new Float32Array(9);
		const setMat3FromEuler = (yawY: number, pitchX: number, rollZ: number, out: Float32Array) => {
			const cy = Math.cos(yawY);
			const sy = Math.sin(yawY);
			const cx = Math.cos(pitchX);
			const sx = Math.sin(pitchX);
			const cz = Math.cos(rollZ);
			const sz = Math.sin(rollZ);

			const r00 = cy * cz + sy * sx * sz;
			const r01 = -cy * sz + sy * sx * cz;
			const r02 = sy * cx;
			const r10 = cx * sz;
			const r11 = cx * cz;
			const r12 = -sx;
			const r20 = -sy * cz + cy * sx * sz;
			const r21 = sy * sz + cy * sx * cz;
			const r22 = cy * cx;

			out[0] = r00;
			out[1] = r10;
			out[2] = r20;
			out[3] = r01;
			out[4] = r11;
			out[5] = r21;
			out[6] = r02;
			out[7] = r12;
			out[8] = r22;
			return out;
		};

		const NOISE_IS_ZERO = NOISE < 1e-6;
		let raf = 0;
		const startedAt = performance.now();

		const startRAF = () => {
			if (raf) {
				return;
			}

			raf = requestAnimationFrame(render);
		};

		const stopRAF = () => {
			if (!raf) {
				return;
			}

			cancelAnimationFrame(raf);
			raf = 0;
		};

		const randomValue = () => Math.random();
		const wobbleX = 0.3 + randomValue() * 0.6;
		const wobbleY = 0.2 + randomValue() * 0.7;
		const wobbleZ = 0.1 + randomValue() * 0.5;
		const phaseX = randomValue() * Math.PI * 2;
		const phaseZ = randomValue() * Math.PI * 2;

		let yaw = 0;
		let pitch = 0;
		let roll = 0;
		let targetYaw = 0;
		let targetPitch = 0;
		let motionBoost = 0;

		const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
		const setMotionBoost = (nextBoost: number) => {
			motionBoost = Math.max(nextBoost, motionBoost * 0.94);
			program.uniforms.uMotionBoost.value = Math.min(2.4, motionBoost);
		};
		const pointer = { x: 0, y: 0, inside: true };

		const onMove = (event: PointerEvent) => {
			const viewportWidth = Math.max(1, window.innerWidth);
			const viewportHeight = Math.max(1, window.innerHeight);
			const centerX = viewportWidth * 0.5;
			const centerY = viewportHeight * 0.5;
			const normalizedX = (event.clientX - centerX) / (viewportWidth * 0.5);
			const normalizedY = (event.clientY - centerY) / (viewportHeight * 0.5);
			pointer.x = Math.max(-1, Math.min(1, normalizedX));
			pointer.y = Math.max(-1, Math.min(1, normalizedY));
			pointer.inside = true;
		};

		const onLeave = () => {
			pointer.inside = false;
		};

		const onBlur = () => {
			pointer.inside = false;
		};

		let onPointerMove: ((event: PointerEvent) => void) | null = null;
		if (animationType === 'hover') {
			onPointerMove = (event: PointerEvent) => {
				onMove(event);
				startRAF();
			};
			window.addEventListener('pointermove', onPointerMove, { passive: true });
			window.addEventListener('mouseleave', onLeave);
			window.addEventListener('blur', onBlur);
			program.uniforms.uUseBaseWobble.value = 0;
		} else if (animationType === '3drotate') {
			program.uniforms.uUseBaseWobble.value = 0;
		} else {
			program.uniforms.uUseBaseWobble.value = 1;
		}

		const render = (timestamp: number) => {
			const time = (timestamp - startedAt) * 0.001;
			program.uniforms.iTime.value = time;
			let continueRAF = true;

			if (animationType === 'hover') {
				const maxPitch = 0.6 * HOVSTR;
				const maxYaw = 0.6 * HOVSTR;
				targetYaw = (pointer.inside ? -pointer.x : 0) * maxYaw;
				targetPitch = (pointer.inside ? pointer.y : 0) * maxPitch;

				const previousYaw = yaw;
				const previousPitch = pitch;
				const previousRoll = roll;

				yaw = lerp(previousYaw, targetYaw, INERT);
				pitch = lerp(previousPitch, targetPitch, INERT);
				roll = lerp(previousRoll, 0, 0.1);
				setMotionBoost(
					(Math.abs(yaw - previousYaw) +
						Math.abs(pitch - previousPitch) +
						Math.abs(roll - previousRoll)) *
						14.0
				);

				program.uniforms.uRot.value = setMat3FromEuler(yaw, pitch, roll, rotBuf);

				if (NOISE_IS_ZERO) {
					const settled =
						Math.abs(yaw - targetYaw) < 1e-4 &&
						Math.abs(pitch - targetPitch) < 1e-4 &&
						Math.abs(roll) < 1e-4;

					if (settled) {
						continueRAF = false;
					}
				}
			} else if (animationType === '3drotate') {
				const scaledTime = time * TS;
				const previousYaw = yaw;
				const previousPitch = pitch;
				const previousRoll = roll;
				yaw = scaledTime * wobbleY;
				pitch = Math.sin(scaledTime * wobbleX + phaseX) * 0.6;
				roll = Math.sin(scaledTime * wobbleZ + phaseZ) * 0.5;
				setMotionBoost(
					0.18 +
						(Math.abs(yaw - previousYaw) +
							Math.abs(pitch - previousPitch) +
							Math.abs(roll - previousRoll)) *
							6.2
				);
				program.uniforms.uRot.value = setMat3FromEuler(yaw, pitch, roll, rotBuf);

				if (TS < 1e-6) {
					continueRAF = false;
				}
			} else {
				rotBuf[0] = 1;
				rotBuf[1] = 0;
				rotBuf[2] = 0;
				rotBuf[3] = 0;
				rotBuf[4] = 1;
				rotBuf[5] = 0;
				rotBuf[6] = 0;
				rotBuf[7] = 0;
				rotBuf[8] = 1;
				setMotionBoost(0.22 + 0.34 * (0.5 + 0.5 * Math.sin(time * 5.6)));
				program.uniforms.uRot.value = rotBuf;

				if (TS < 1e-6) {
					continueRAF = false;
				}
			}

			renderer.render({ scene: mesh });

			if (continueRAF) {
				raf = requestAnimationFrame(render);
			} else {
				raf = 0;
			}
		};

		interface PrismContainer extends HTMLElement {
			__prismIO?: IntersectionObserver;
		}

		if (suspendWhenOffscreen) {
			const io = new IntersectionObserver((entries) => {
				const visible = entries.some((entry) => entry.isIntersecting);
				if (visible) {
					startRAF();
				} else {
					stopRAF();
				}
			});

			io.observe(container);
			startRAF();
			(container as PrismContainer).__prismIO = io;
		} else {
			startRAF();
		}

		const localCleanup = () => {
			stopRAF();
			resizeObserver.disconnect();

			if (animationType === 'hover') {
				if (onPointerMove) {
					window.removeEventListener('pointermove', onPointerMove as EventListener);
				}

				window.removeEventListener('mouseleave', onLeave);
				window.removeEventListener('blur', onBlur);
			}

			if (suspendWhenOffscreen) {
				const io = (container as PrismContainer).__prismIO;
				if (io) {
					io.disconnect();
				}

				delete (container as PrismContainer).__prismIO;
			}

			if (gl.canvas.parentElement === container) {
				container.removeChild(gl.canvas);
			}
		};

		if (currentToken === setupToken && mounted) {
			cleanup = localCleanup;
		} else {
			localCleanup();
		}
	};

	$: effectSignature = JSON.stringify({
		height,
		baseWidth,
		animationType,
		glow,
		offsetX: offset?.x ?? 0,
		offsetY: offset?.y ?? 0,
		noise,
		transparent,
		scale,
		hueShift,
		colorFrequency,
		hoverStrength,
		inertia,
		bloom,
		edgeShine,
		vertexFlash,
		suspendWhenOffscreen,
		timeScale
	});

	$: if (mounted && containerRef && effectSignature) {
		void buildEffect(effectSignature);
	}

	onMount(() => {
		mounted = true;

		return () => {
			mounted = false;
			setupToken += 1;
			destroyEffect();
		};
	});
</script>

<div
	bind:this={containerRef}
	class={`relative h-full w-full overflow-hidden ${className}`}
	aria-hidden="true"
></div>
