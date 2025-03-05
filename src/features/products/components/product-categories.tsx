import { UseFormReturn } from "react-hook-form";
import { ProductFormData } from "../hooks/use-product-form";
import { useCategories } from "../hooks/use-categories";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface ProductCategoriesProps {
  form: UseFormReturn<ProductFormData>;
}

export function ProductCategories({ form }: ProductCategoriesProps) {
  const {
    categoryOptions,
    categoriesArray,
    subCategoriesArray,
    isLoading,
    newCategory,
    setNewCategory,
    newSubCategory,
    setNewSubCategory,
    handleAddCategory,
    handleRemoveCategory,
    handleEditCategory,
  } = useCategories();

  if (isLoading) {
    return (
      <div className="space-y-4 border p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-medium">Categories</h2>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 border p-4 rounded-md shadow-sm">
      <h2 className="text-lg font-medium">Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <select
            className="w-full border rounded-md p-2"
            {...form.register("category")}
          >
            <option value="">Select category</option>
            {categoryOptions
              .filter((option) => !option.isSubCategory)
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
          {form.formState.errors.category?.message && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.category.message}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add or edit category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button onClick={() => handleAddCategory(false)}>Add</Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Sub Category</Label>
          <select
            className="w-full border rounded-md p-2"
            {...form.register("subCategory")}
          >
            <option value="">Select sub category (optional)</option>
            {categoryOptions
              .filter((option) => option.isSubCategory)
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
          {form.formState.errors.subCategory?.message && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.subCategory.message}
            </p>
          )}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add or edit sub category"
              value={newSubCategory}
              onChange={(e) => setNewSubCategory(e.target.value)}
            />
            <Button onClick={() => handleAddCategory(true)}>Add</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
