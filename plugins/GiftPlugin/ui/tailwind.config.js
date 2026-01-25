/** @type {import('tailwindcss').Config} */
import sharedPreset from '@ari/plugin-sdk/tailwind.preset'

export default {
    presets: [sharedPreset],
    content: ['./src/**/*.{ts,tsx}'],
}
