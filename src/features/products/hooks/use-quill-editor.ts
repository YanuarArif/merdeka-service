import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "./use-product-form";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["clean"],
];

interface UseQuillEditorProps {
  form: UseFormReturn<ProductFormData>;
  initialContent?: string;
}

export const useQuillEditor = ({
  form,
  initialContent = "",
}: UseQuillEditorProps) => {
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loadQuill = async () => {
        const Quill = (await import("quill")).default;
        const quillElement = document.getElementById("quill-editor");

        if (quillElement && !quillRef.current) {
          const quill = new Quill(quillElement, {
            theme: "snow",
            modules: {
              toolbar: TOOLBAR_OPTIONS,
            },
          });
          quillRef.current = quill;

          // Set initial content
          if (initialContent) {
            quill.root.innerHTML = initialContent;
          }

          // Update form value when content changes
          quill.on("text-change", () => {
            const content = quill.root.innerHTML;
            form.setValue(
              "description",
              content === "<p><br></p>" ? "" : content
            );
          });
        }
      };

      loadQuill();
    }
  }, [initialContent, form]);

  const handleDescriptionFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (quillRef.current) {
          quillRef.current.root.innerHTML = text;
          form.setValue("description", text);
        }
      };
      reader.readAsText(file);
    }
  };

  return {
    handleDescriptionFileUpload,
  };
};
