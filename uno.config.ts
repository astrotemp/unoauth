// uno.config.ts
import {
	defineConfig,
	presetIcons,
	presetWebFonts,
	presetTypography,
} from "unocss";

export default defineConfig({
	// ...UnoCSS options
	presets: [
		presetIcons(),
		presetTypography(),
		presetWebFonts({
			provider: "bunny",
			fonts: {
				sans: "Roboto",
				mono: ["Fira Code", "Fira Mono:400,700"],
				inter: [
					{
						name: "Inter",
						weights: ["400", "700"],
					},
					{
						name: "sans-serif",
						provider: "none",
					},
				],
			},
		}),
	],
});
