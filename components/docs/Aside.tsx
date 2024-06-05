import { cn } from "@/lib/utils"
import { readMDXMenu } from "@/lib/mdx/read"
import { AsideMenuItem } from "./AsideMenuItem"

export async function DocsAside({
    className
}: {
    className?: string
}) {
    const menu = (await readMDXMenu()).children!
    return (
        <aside className={cn("sticky w-60 h-full px-4 py-2 bg-white rounded-r-md", className)}>
            <menu className="w-full space-y-2">
                {menu.map((item) => (
                    <AsideMenuItem key={item.label + item.href} item={item} />
                ))}
            </menu>
        </aside>
    )
}

