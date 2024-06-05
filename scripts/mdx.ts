import { buildMDXMenu, TreeNode } from "@/lib/mdx/build"
import fs from "fs"
import { MDXConfig } from "@/lib/mdx"
import path from 'path'
import { NavLink } from "@/types/link"
import grayMatter from "gray-matter"

export async function generateMDXMenu() {
    const { DOCS_PATH, MENU_PATH } = MDXConfig

    const handleItemToTreeNode = (itemPath: string): TreeNode<NavLink> => {
        const label = path.parse(itemPath).name;
        const normalizedPath = itemPath.replace(/\\/g, '/')
        const href = normalizedPath.replace(DOCS_PATH.split("/").slice(0, -1).join("/"), '').split(".")[0]
        const item: NavLink = {
            label,
            href: href,
            children: undefined,
        };
        const isFile = fs.statSync(itemPath).isFile()

        if (isFile) {
            const source = fs.readFileSync(itemPath, "utf-8")
            if (!source) throw new Error("source load failed")
            const { data: frontmatter } = grayMatter(source!)
            if (frontmatter?.icon !== undefined) {
                item.icon = frontmatter.icon as string
            }
        }

        return item
    };

    const tree = await buildMDXMenu<NavLink>(DOCS_PATH, handleItemToTreeNode);

    fs.writeFileSync(MENU_PATH, JSON.stringify(tree, null, 2))
}