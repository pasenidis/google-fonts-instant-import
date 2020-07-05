import * as vscode from 'vscode';
import search from './commands/search';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "google-fonts-instant-import" is now active!');

	context.subscriptions.push(search);
}

export function deactivate() { }
