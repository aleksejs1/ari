/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [require('../../../sdk/tailwind.preset.js')],
    content: [
        './src/**/*.{ts,tsx}',
        '../../../sdk/src/components/ui/**/*.{ts,tsx}' // Scan SDK components too if we use them? 
        // Actually, classes in SDK are already compiled? No, Tailwind scans usage.
        // If we use classes in our plugin code that match the preset, fine.
        // If we import SDK components, they have their own classes.
        // Ideally SDK components are pre-built or we scan them.
        // But since we are building the plugin, and importing source from SDK (via alias),
        // we should probably scan SDK files or assume they are handled?
        // Wait, the alias points to source `sdk/src/index.ts`.
        // So Vite will bundle SDK code into the plugin?
        // No, we marked `@ari/plugin-sdk` as external.
        // So the Plugin bundle WON'T contain the SDK code.
        // The HOST app must provide the SDK.
        // So correct interpretation: The Plugin only needs to generate CSS for ITS OWN usage of Tailwind classes.
    ],
}
