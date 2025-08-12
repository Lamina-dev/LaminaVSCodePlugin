import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// 提供代码补全
export class LaminaCompletionItemProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(document: vscode.TextDocument, position: vscode.Position): vscode.CompletionItem[] {
    const completionItems: vscode.CompletionItem[] = [];

    // 关键字补全
    const keywords = ['var', 'func', 'if', 'else', 'while', 'for', 'return', 'break', 'continue', 'print', 'true', 'false', 'null', 'include', 'define'];
    keywords.forEach(keyword => {
      const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword);
      completionItems.push(item);
    });

    // 数据类型补全
    const types = ['int', 'float', 'rational', 'irrational', 'bool', 'string', 'bigint'];
    types.forEach(type => {
      const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.TypeParameter);
      completionItems.push(item);
    });

    // 内置函数补全
    const functions = ['pi', 'e', 'sqrt', 'abs', 'sin', 'cos', 'log', 'dot', 'cross', 'norm', 'det', 'fraction', 'decimal', 'visit', 'visit_by_str'];
    functions.forEach(func => {
      const item = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
      item.detail = 'Built-in function';
      item.documentation = new vscode.MarkdownString(`*${func}* is a built-in function`);
      completionItems.push(item);
    });

    return completionItems;
  }
}

export function activate(context: vscode.ExtensionContext) {
  // 注册代码补全提供者
  const completionProvider = new LaminaCompletionItemProvider();
  const disposableCompletion = vscode.languages.registerCompletionItemProvider('lamina', completionProvider);
  context.subscriptions.push(disposableCompletion);

  // 创建状态栏项
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  context.subscriptions.push(statusBarItem);
  
  // 初始化状态栏
  updateStatusBar(statusBarItem);

  // 注册运行脚本命令
  let runScriptDisposable = vscode.commands.registerCommand('extension.runLaminaScript', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('No editor is active.');
      return;
    }

    const document = editor.document;
    if (document.languageId !== 'lamina') {
      vscode.window.showInformationMessage('Current file is not a Lamina script.');
      return;
    }

    const filePath = document.uri.fsPath;
    const interpreterPath = await getLaminaInterpreterPath();

    // 检查解释器是否存在
    if (!interpreterPath || !(await fileExists(interpreterPath))) {
      const selection = await vscode.window.showInformationMessage(
        'No Lamina interpreter selected or interpreter not found. Please select one.', 
        'Select Interpreter'
      );
      
      if (selection === 'Select Interpreter') {
        await vscode.commands.executeCommand('extension.selectLaminaInterpreter');
        // 选择后再次尝试运行
        await vscode.commands.executeCommand('extension.runLaminaScript');
      }
      return;
    }

    // 处理路径中的空格和特殊字
    const quotedInterpreterPath = interpreterPath.includes(' ') ? `"${interpreterPath}"` : interpreterPath;
    const quotedFilePath = filePath.includes(' ') ? `"${filePath}"` : filePath;
    const command = `&${quotedInterpreterPath} ${quotedFilePath}`;
    
    const terminal = vscode.window.createTerminal({
      name: 'Lamina',
    });
    terminal.sendText(command);
    terminal.show();
  });

  context.subscriptions.push(runScriptDisposable);

  // 注册选择解释器命令
  let selectInterpreterDisposable = vscode.commands.registerCommand('extension.selectLaminaInterpreter', async () => {
    const interpreterPath = await vscode.window.showOpenDialog({
      canSelectFiles: true,
      canSelectFolders: false,
      canSelectMany: false,
      openLabel: 'Select Lamina Interpreter',
      filters: {
        'Executable Files': ['exe', 'sh', 'bat', 'cmd'],
      }
    });

    if (interpreterPath && interpreterPath[0]) {
      const config = vscode.workspace.getConfiguration('lamina');
      await config.update('interpreterPath', interpreterPath[0].fsPath, vscode.ConfigurationTarget.Global);
      try {
        // 更新配置
        await config.update(
          'interpreterPath', 
          interpreterPath[0].fsPath, 
          vscode.ConfigurationTarget.Global
        );
        
        // 更新状态栏
        updateStatusBar(statusBarItem);
        
        vscode.window.showInformationMessage(
          `Lamina interpreter set to: ${path.basename(interpreterPath[0].fsPath)}`
        );
      } catch (error) {
          vscode.window.showErrorMessage(
            `Failed to save interpreter path: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }
      // 更新状态栏
      updateStatusBar(statusBarItem);
  });

  context.subscriptions.push(selectInterpreterDisposable);
}

export function deactivate() {}

// 更新状态栏显示
async function updateStatusBar(statusBarItem: vscode.StatusBarItem) {
  const interpreterPath = await getLaminaInterpreterPath();
  
  if (interpreterPath && fs.existsSync(interpreterPath)) {
    statusBarItem.text = `Lamina: ${path.basename(interpreterPath)}`;
    statusBarItem.tooltip = interpreterPath;
    statusBarItem.color = 'green';
  } else {
    statusBarItem.text = 'Lamina: $(alert) Select Interpreter';
    statusBarItem.tooltip = 'Click to select Lamina interpreter';
    statusBarItem.color = 'red';
  }
  
  statusBarItem.command = 'extension.selectLaminaInterpreter';
  statusBarItem.show();
}

async function getLaminaInterpreterPath(): Promise<string | undefined> {
  const config = vscode.workspace.getConfiguration('lamina');
  return config.get<string>('interpreterPath');
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}