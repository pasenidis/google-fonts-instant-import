import * as vscode from 'vscode';
import fetch, { Headers } from 'node-fetch';

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
    let isFound: boolean = false;

    for (let i = 0; i < fonts.length; i++) {
        if (String(fonts[i].family).toLowerCase() === prompt.toLowerCase()) {
            font = fonts[i];
            isFound = true;
            break;
        } else {
            isFound = false;
            continue;
        }
    }

    let href: string;
    if (isFound) {
        vscode.window.showInformationMessage(`Adding ${font.family} to your selected area or current line`);
        href = `https://fonts.googleapis.com/css2?family=${font.family.split(' ').join('+')}:wght@300&display=swap`;
        const editor = vscode.window.activeTextEditor;
        if (editor && isFound) {
            const document = editor.document;
            const selection = editor.selection;

            editor.edit(editBuilder => {
                editBuilder.replace(selection, document.getText(selection) + `\n\t<link rel="stylesheet" href="${href}">\n\t<style>\n\t\tbody { \n\t\t\tfont-family: '${font.family}', sans-serif; \n\t\t}\n\t</style>`);
            });
        }
    }
});

export default search;
