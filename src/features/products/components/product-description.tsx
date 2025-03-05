import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "../hooks/use-product-form";
import { useQuillEditor } from "../hooks/use-quill-editor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductDescriptionProps {
  form: UseFormReturn<ProductFormData>;
  initialDescription?: string;
}

export function ProductDescription({
  form,
  initialDescription,
}: ProductDescriptionProps) {
  const { handleDescriptionFileUpload } = useQuillEditor({
    form,
    initialContent: initialDescription,
  });

  return (
    <div className="space-y-4 border p-4 rounded-md shadow-sm">
      <h2 className="text-lg font-medium">Description</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            placeholder="Enter product name"
            {...form.register("name")}
          />
          {form.formState.errors.name?.message && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="description">Product Description</Label>
            <Label
              htmlFor="descriptionFile"
              className="text-sm text-muted-foreground cursor-pointer hover:text-primary"
            >
              Upload .txt file
              <input
                type="file"
                id="descriptionFile"
                accept=".txt"
                className="hidden"
                onChange={handleDescriptionFileUpload}
              />
            </Label>
          </div>
          <div className="quill-editor">
            <div id="quill-editor" />
          </div>
          {form.formState.errors.description?.message && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
