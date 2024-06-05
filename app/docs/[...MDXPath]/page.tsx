// app/docs/[...MDXPath]/page.tsx
import { MDXRemote } from 'next-mdx-remote/rsc'
import { readMDXFile, extractMDXMenuPaths } from '@/lib/mdx/read'

export const dynamicParams = false

export async function generateStaticParams() {
    const paths: string[] = await extractMDXMenuPaths()
    // 由于MDXPath参数类型为string[],所以这里需要转化路径
    const staticPaths = paths.map(path => ({ MDXPath: path.replace(/^\/docs\//, "").split("/") }))
    return staticPaths
}

export default async function Page({ params }: { params: { MDXPath: string[] } }) {
    const { source, error } = await readMDXFile(params.MDXPath)
    if (error) return <div>Load error</div>
    if (source === undefined) return <div>file does not unexist or is corrupt</div>
    return <MDXRemote source={source} options={{ parseFrontmatter: true }} />
}
