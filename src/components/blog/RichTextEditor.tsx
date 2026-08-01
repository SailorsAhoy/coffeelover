import { Editor } from "@tinymce/tinymce-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  height?: number;
};

const RichTextEditor = ({ value, onChange, height = 520 }: Props) => {
  return (
    <Editor
      tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@8.8.2/tinymce.min.js"
      licenseKey="gpl"
      value={value}
      onEditorChange={(html) => onChange(html)}
      init={{
        height,
        menubar: "file edit view insert format table",
        branding: false,
        promotion: false,
        plugins:
          "advlist autolink lists link image media table code codesample fullscreen preview searchreplace wordcount visualblocks charmap anchor",
        toolbar:
          "undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist outdent indent | link image media table blockquote | removeformat code fullscreen",
        image_title: true,
        image_caption: true,
        content_style:
          "body { font-family: Montserrat, system-ui, sans-serif; font-size: 15px; color: #3B2717; } img { max-width: 100%; height: auto; border-radius: 8px; } h1,h2,h3 { font-family: 'Playfair Display', Georgia, serif; }",
      }}
    />
  );
};

export default RichTextEditor;
