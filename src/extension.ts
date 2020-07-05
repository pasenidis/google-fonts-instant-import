import * as vscode from 'vscode';
import fetch, { Headers } from 'node-fetch';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "google-fonts-instant-import" is now active!');

	let search = vscode.commands.registerCommand('google-fonts-instant-import.searchFont', async () => {
		const prompt: string = String(await vscode.window.showInputBox({ placeHolder: 'Enter font (family) name (e.g Open Sans)' }));

		const response = await fetch('https://cors-anywhere.herokuapp.com/https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyDrwscy04xGYMeRyeWOnxXilRnyCafwqHA', {
			headers: new Headers({
				'origin': 'thomaspark.co'
			})
		});

		const data = await response.json();

		const fonts = data.items;
		let font: { family: string; } = { family: '' };

		for (let i = 0; i < fonts.length; i++) {
			if (fonts[i].family === prompt) {
				font = fonts[i];
				break;
			} else {
				continue;
			}
		}

		vscode.window.showInformationMessage(`Font is ${font.family}`);

			const href = `https://fonts.googleapis.com/css2?family=${font.family.split(' ').join('+')}:wght@300&display=swap`;
			vscode.window.showInformationMessage(href);
		// }

		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			
			editor.edit(editBuilder => {
				editBuilder.replace(selection, document.getText(selection) + `\n\t<link rel="stylesheet" href="${href}">\n\t<style>\n\t\tbody { font-family: '${font.family}', sans-serif; }\n\t</style>`);
			});
		}
	});

	context.subscriptions.push(search);
}

// this method is called when your extension is deactivated
export function deactivate() { }
