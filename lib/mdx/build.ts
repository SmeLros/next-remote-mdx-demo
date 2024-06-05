// lib/mdx/build.ts

import path from "path"
import fs from "fs"
import { MDXConfig } from "."

export type TreeNode<T> = T & { children?: TreeNode<T>[] };

/**
 * 异步遍历指定目录，构建树形结构，并允许自定义处理逻辑。
 * 
 * @param dir 目标目录的路径
 * @param handleItem 处理每个目录项的回调函数，返回处理后的 TreeNode<T>
 * @returns 树形结构的数据，类型为 TreeNode<T>
 */
export async function buildMDXMenu<T>(
    dir: string,
    handleItem: (itemPath: string) => TreeNode<T>
): Promise<TreeNode<T>> {
    
    removeMDXMenu()

    const node = handleItem(dir);
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    if (!node.children) {
        node.children = [];
    }

    for (const entry of entries) {
        const itemPath = path.join(dir, entry.name);
        const childNode = handleItem(itemPath);

        if (entry.isDirectory()) {
            const subTree = await buildMDXMenu<T>(itemPath, handleItem);
            node.children!.push(subTree);
        } else {
            node.children!.push(childNode);
        }
    }

    return node;
}

export function removeMDXMenu() {
    const isExist = fs.existsSync(MDXConfig.MENU_PATH)
    if (isExist) {
        fs.rmSync(MDXConfig.MENU_PATH)
    }
}