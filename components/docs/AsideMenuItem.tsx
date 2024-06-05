"use client"

import { NavLink } from "@/types/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export function AsideMenuItem({
    item
}: {
    item: NavLink
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState<boolean>(false)
    const subMenue = !!item?.children?.length ? (
        item.children.map((subItem) => (
            <AsideMenuItem key={subItem.label + subItem.href} item={subItem} />
        ))
    ) : null
    const clickHandler = () => {
        if (!!item?.children?.length) {
            setOpen((prev) => !prev)
            return
        }
        router.push(item.href)
    }
    return (
        <div className="space-y-2">
            <div
                className={cn("p-2 rounded active:bg-neutral-200 hover:bg-neutral-200 flex flex-row relative select-none cursor-pointer", { "bg-neutral-200": pathname === item.href })}
                onClick={clickHandler}
            >
                {item.label}
                {subMenue && <ChevronDown
                    className={cn("text-input justify-self-end absolute right-4", {
                        "-rotate-90": open,
                    })}
                />}
            </div>
            {subMenue && (
                <div className={cn("pl-4 space-y-2", { "hidden": !open })}>
                    {subMenue}
                </div>
            )}
        </div>
    )
}