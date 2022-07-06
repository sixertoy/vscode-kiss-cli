const util = require('util');
const vscode = require('vscode');
const exec = util.promisify(require('child_process').exec);


async function insertTemplate () {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
      vscode.window.showErrorMessage('No available editor');
      return false;
  }

  // check if user has selected any string
  const selectedText = editor.selection;
  if (!selectedText) {
      vscode.window.showErrorMessage('No available selection');
      return false;
  }

  // check if selected string is a valid template
  const templateName = editor.document.getText(selectedText);
  if (!templateName || templateName.trim() === '') {
      vscode.window.showErrorMessage('No keyword selected');
      return false;
  }

  // check if kiss command is available
  try {
      const cliCommand = `kiss`
      await exec(cliCommand);
  } catch (err) {
      const msg = 'Kiss-cli should be installed globally'
      const opts = { detail: 'npm install -g kiss-cli', modal: true };
      vscode.window.showErrorMessage(msg, opts);
      return false;
  }


  // start
  try {
      const cwd = vscode.workspace.workspaceFolders[0].uri.path;
      const cliCommand = `kiss --raw ${templateName} ${cwd}`
      const { stdout: templateContent } = await exec(cliCommand);
      editor.edit(async (textEditor) => {
          textEditor.replace(selectedText, templateContent);
      });
  } catch (err) {
      // const msg = `Unable to load template file '${templateName}'`
      vscode.window.showErrorMessage(err.message);
      return false;
  }
}

module.exports = insertTemplate;
