## 介绍

此项目是一个由 Next.js14 + next-mdx-remote 构建的一个示例项目

主要是为了解决：通过访问 `/docs/*` 解析动态路由链接获取项目内`public/docs`目录下的md/mdx资源的需求

## 功能
此demo实现了一个类似于Next.js文件路由的功

- 动态路由资源映射（将动态路由映射到指定目录）
- 动态导航栏（根据指定目录资源动态生成目录结构）

## 使用

### 安装依赖
```cmd
npm install
```

### 启动项目
```cmd
npm run dev
```

### 打包项目
```cmd
npm run build
```

### 启动项目
```cmd
npm run start
```

### 手动构建文档目录
```cmd
npm run prepare
```