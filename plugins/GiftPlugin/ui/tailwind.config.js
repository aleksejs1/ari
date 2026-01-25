/** @type {import('tailwindcss').Config} */
import sharedPreset from '../../../sdk/tailwind.preset.js';

export default {
    presets: [sharedPreset],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
}
