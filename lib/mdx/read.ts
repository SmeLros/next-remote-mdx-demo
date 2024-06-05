// lib/mdx/read.ts
"use server"

import fs from "fs"
import path from "path"
import { MDXConfig } from "."
import { TreeNode } from "./build"
import { NavLink } from "@/types/link"

/**
 * 根据传入的MDXPath和extensions参数，获取mdx数据
 * @param MDXPath 字符串数组或者字符串
 * @param extensions 扩展名数组，默认为 MDXConfig.extensions
 * @returns mdx原始数据(string) 和 error
 */
export async function readMDXFile(
    MDXPath: string[] | string,
    extensions: string[] = MDXConfig.extensions,
): Promise<{ source: string | undefined; error: Error | undefined }> {
    try {
        // 将MDXPath数组转换为完整路径
        const fullMDXPath = Array.isArray(MDXPath)
            ? MDXPath.map((p) => p.trim()).join("/")
            : MDXPath.trim()
        // 根据MDXPath和extensions，生成路径数组
        const paths = extensions.map((extension) =>
            path.join(MDXConfig.DOCS_PATH, `${fullMDXPath}.${extension}`),
        )
        // 读取第一个存在的文件，不存在则抛出异常
        const file = await readFirstExistingFileAsync(paths)
        return { source: file, error: undefined }
    } catch (err: any) {
        const error = new Error(
            `Failed to load MDX: ${err?.message ? err.message : err}`,
        )
        return { source: undefined, error }
    }
}

/**
 * 从MDX menu树形结构中抽取所有叶子节点 可自定义返回内容
 *
 *@param callback 回调函数，用于处理叶子节点，返回自定义内容
 * @returns 所有叶子节点的路径数组
 */
async function extractMDXMenu<T>(callback: (node: TreeNode<NavLink>) => T): Promise<T[]> {
    const menu: NavLink = await readMDXMenu()
    const results: T[] = []

    function traverse(node: TreeNode<NavLink>) {
        if (!!node.children?.length) {
            for (const child of node.children) {
                traverse(child)
            }
        } else {
            const res = callback(node)
            results.push(res)
        }
    }

    traverse(menu)
    return results
}

/**
 * 提取MDX menu中的所有path路径
 *
 * @returns 路径数组
 */
export async function extractMDXMenuPaths(): Promise<string[]> {
    return await extractMDXMenu((node) => node.href)
}

/**
 * 从动态生成的MDX menu.json中提取menu数据
 *
 * @returns menu数据
 */
export async function readMDXMenu(): Promise<NavLink> {
    const menuFile = fs.readFileSync(MDXConfig.MENU_PATH)
    const menu = JSON.parse(menuFile.toString("utf-8")) as NavLink
    return menu
}

/**
 * 异步获取列表中第一个存在的文件
 *
 * @param fileNames 文件名数组
 * @returns 第一个存在的文件内容 如果读取文件出错则抛出异常，如果全部无效则返回undefined
 */
export async function readFirstExistingFileAsync(
    fileNames: string[],
): Promise<string | undefined> {
    for (const fileName of fileNames) {
        try {
            // 如果文件不存在，跳过该文件
            if (!fs.existsSync(fileName)) continue
            // 读取文件内容
            const fileContent = await fs.promises.readFile(fileName)
            // 返回文件内容
            return fileContent.toString("utf-8")
        } catch (error: any) {
            // 如果错误不是 ENOENT（文件不存在），打印错误信息
            if (error?.code !== "ENOENT") {
                console.error(`Error reading file "${fileName}":`, error)
            }
            throw error
        }
    }
    return undefined
}
