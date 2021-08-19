const vscode = require('vscode');
const insertTemplate = require('./command-insert');


module.exports = {
    activate: (context) => {
        let disposable = vscode.commands.registerCommand('vscode-kiss-cli.insert', insertTemplate);
        context.subscriptions.push(disposable);
    },
    deactivate: () => {}
}
