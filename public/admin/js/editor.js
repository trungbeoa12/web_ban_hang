const editorElements = document.querySelectorAll(".rich-text-editor");

if (editorElements.length > 0 && window.tinymce) {
  tinymce.init({
    selector: ".rich-text-editor",
    license_key: "gpl",
    height: 320,
    menubar: "file edit view insert format tools table help",
    plugins: "lists link image table code fullscreen preview wordcount autoresize",
    toolbar:
      "undo redo | blocks | bold italic underline | forecolor backcolor | " +
      "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
      "link table | removeformat code preview fullscreen",
    branding: false,
    promotion: false,
    browser_spellcheck: true,
    contextmenu: false,
    convert_urls: false,
    relative_urls: false,
    entity_encoding: "raw",
    setup(editor) {
      editor.on("change input undo redo", () => {
        editor.save();
      });
    }
  });
}
