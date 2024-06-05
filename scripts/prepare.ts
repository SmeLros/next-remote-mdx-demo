import { generateMDXMenu } from "./mdx"

// 项目启动前执行内容
async function main(){
    // other scripts ...
    await generateMDXMenu()
}

main().catch(console.error);