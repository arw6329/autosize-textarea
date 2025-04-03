import typescript from '@rollup/plugin-typescript'
import { defineConfig } from 'rollup'
import { dts } from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser'

export default defineConfig([
	{
		input: 'src/index.ts',
		output: {
			file: 'dist/index.js',
			format: 'es'
		},
		plugins: [typescript(), terser()]
	}, {
		input: 'src/index.ts',
		output: {
			file: 'dist/index-cjs.js',
			format: 'cjs'
		},
		plugins: [typescript(), terser()]
	}, {
		input: 'src/index.ts',
		output: {
			file: 'dist/index.d.ts',
			format: 'es'
		},
		plugins: [dts()]
	}
])