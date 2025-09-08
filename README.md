# VSCode Lamina 语言支持扩展

<img src="https://github.com/Lamina-dev/LaminaVSCodePlugin/blob/main/doc/assets/logo.jpg?raw=true" width="100%">

<div align="center">

![STARS](https://img.shields.io/github/stars/Lamina-dev/LaminaVSCodePlugin?color=yellow&label=Github%20Stars)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()
[![License](https://img.shields.io/badge/license-LGPL-2.svg)](LICENSE)
</div>

这是一个为 Visual Studio Code 提供 Lamina 语言支持的扩展。以下是该扩展的主要功能和使用说明。

## 功能特性

### 代码补全
- 提供关键字、数据类型、内置函数的代码补全功能，帮助你更高效地编写 Lamina 代码。

### 运行脚本
- 通过顶部运行按钮或命令面板运行当前 Lamina 脚本。
- 支持自定义解释器路径，用户可以通过状态栏选择解释器。

### 状态栏
- 在状态栏显示当前选择的 Lamina 解释器路径。
- 点击状态栏中的解释器路径，可以重新选择解释器。

### 语法高亮
- 提供 Lamina 语言的语法高亮支持，包括关键字、数据类型、注释、字符串等。

### 代码片段
- 提供常用的 Lamina 代码片段，帮助你快速插入代码模板。

## 使用方法

### 安装
1. 打开 Visual Studio Code。
2. 进入扩展商店（点击左侧的扩展图标或按 `Ctrl+Shift+X`）。
3. 搜索 `Lamina` 并安装。

### 运行脚本
1. 打开一个 `.lm` 文件。
2. 点击顶部的运行按钮，或使用命令面板运行脚本：
   - 按 `Ctrl+Shift+P` 打开命令面板。
   - 输入 `Run Lamina Script` 并选择该命令。

### 选择解释器
1. 点击状态栏中的 `Lamina Interpreter: $(gear) Select`。
2. 选择一个 Lamina 解释器路径。
3. 选择的解释器路径将被持久化存储，即使重启 VS Code 也会记住。

## 配置设置

该扩展通过 `contributes.configuration` 提供以下配置项：

- `lamina.interpreterPath`：设置 Lamina 解释器的路径。默认为空，用户可以通过状态栏选择解释器。
- `lamina.activeCommand`：自定义运行 Lamina 脚本的命令格式。可以使用以下占位符：
  - `$interpreterPath`：解释器路径
  - `$scriptPath`：脚本文件路径
  
  示例配置：
  - Windows PowerShell: `&$interpreterPath $scriptPath`
  - Windows CMD: `$interpreterPath $scriptPath`
  - Linux/macOS: `$interpreterPath $scriptPath`
  
  如果该配置项为空，将根据当前操作系统使用默认命令格式。

## 打包插件

运行在项目目录运行下面的命令：

```shell
npm run compile
vsce package
vsce publish
```



## 已知问题

- 暂无，欢迎您在[Issues](https://github.com/Lamina-dev/LaminaVSCodePlugin/issues)板块中提出

## 未来计划

- 制作`Lamina`专用的`Language Serve Protocol`，可以检查用户代码中的错误
- 支持`Lamina`代码调试（需要配合`Lamina`解释器）


## 许可证说明

本扩展插件采用 **GNU LGPL v2.1** 许可证。该许可证允许你自由使用、修改和分发软件，但要求你在分发时包含原始许可证文本，并在修改版本中注明更改。你也可以将本软件与非自由软件结合使用，但需遵循许可证规定。更多详情，请参阅 [LICENSE](LICENSE) 文件。