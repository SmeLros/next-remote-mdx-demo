// next.config.mjs
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js']
}

const withMDX = createMDX({
    extension: /\.mdx?$/,
    // Add markdown plugins here, as desired
})
 
export default withMDX(nextConfig)
