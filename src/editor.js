import { EditorView, minimalSetup } from "codemirror"
import { lineNumbers } from "@codemirror/view"
import { bracketMatching, indentOnInput } from "@codemirror/language"
import { closeBrackets } from "@codemirror/autocomplete"
import { javascript } from "@codemirror/lang-javascript"
import { oneDark } from '@codemirror/theme-one-dark';

const editor_element = document.getElementById("editor");
const editor = new EditorView({
  extensions: [
    minimalSetup,
    bracketMatching(), 
    closeBrackets(), 
    indentOnInput(),
    lineNumbers(),
    javascript(),
    oneDark
  ],
  parent: editor_element,
  dark: true
});

const load_code_button = document.getElementById("load-code");

load_code_button.addEventListener("click", async function() {
  try {
    let response = await fetch("./templates/latest.js");
    if (response.status === 200) {

      let template_code = await response.text();

      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: template_code
        }
      });

      saveEditorContent();
      
    } else {
      alert("Wrong password!");
    }
  } catch (error) {
    alert("Something went wrong!");
  }
})

const viewer_iframe = document.getElementById("viewer");

let reload_listener_set = false;

function saveEditorContent() {
  localStorage.setItem("editor_content", editor.state.doc.toString());
}

function runUserCode() {

  if (!reload_listener_set) {

    window.addEventListener("message", (event) => {

      if (event.origin !== location.origin) {
        return;
      }

      const message = JSON.parse(event.data);

      if (message.type === "load" && message.loaded) {

        const entered_code = editor.state.doc.toString();
        const script = viewer_iframe.contentWindow.document.createElement("script");
        const script_content = viewer_iframe.contentWindow.document.createTextNode(
          "import { GameBuilder } from './gamebuilder.min.js';\n" +
          entered_code
        );

        script.type = "module";
        
        script.appendChild(script_content);
        viewer_iframe.contentWindow.document.body.appendChild(script);
        viewer_iframe.contentWindow.focus();

      }

    });

  }

  reload_listener_set = true;

  viewer_iframe.contentWindow.location.reload();

}

let editor_keyup_timeout = null;

editor.contentDOM.addEventListener("blur", saveEditorContent);
editor.contentDOM.addEventListener("keyup", function() {
  clearTimeout(editor_keyup_timeout);
  editor_keyup_timeout = setTimeout(saveEditorContent, 500);
});

let saved_editor_content = localStorage.getItem("editor_content");

if (saved_editor_content !== null && saved_editor_content !== "") {

  editor.dispatch({
    changes: {
      from: 0,
      to: editor.state.doc.length,
      insert: saved_editor_content
    }
  });

  runUserCode();

  setTimeout(() => {
    editor.scrollDOM.scrollTop = 0;
  }, 100);
  

} else {

  //document.getElementById("click-run").classList.remove("hidden");

}

document.getElementById("run").addEventListener("click", runUserCode);