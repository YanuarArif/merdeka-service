import { getCategories, addCategory } from "@/app/actions/get-categories";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface CategoryOption {
  label: string;
  value: string;
  isSubCategory: boolean;
}

export const useCategories = () => {
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const fetchedCategories = await getCategories();
      setCategoryOptions(fetchedCategories);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (isSubCategory: boolean = false) => {
    const categoryName = isSubCategory ? newSubCategory : newCategory;
    if (categoryName.trim()) {
      try {
        const result = await addCategory(categoryName, isSubCategory);
        if (result.success) {
          await fetchCategories();
          if (isSubCategory) {
            setNewSubCategory("");
          } else {
            setNewCategory("");
          }
          toast.success(
            `${isSubCategory ? "Sub category" : "Category"} added successfully`
          );
        } else {
          toast.error(
            result.error ||
              `Failed to add ${isSubCategory ? "sub category" : "category"}`
          );
        }
      } catch (error) {
        toast.error(
          `Error adding ${isSubCategory ? "sub category" : "category"}`
        );
      }
    }
  };

  const handleRemoveCategory = (index: number) => {
    setCategoryOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEditCategory = (
    index: number,
    isSubCategory: boolean = false
  ) => {
    const option = categoryOptions[index];
    if (isSubCategory) {
      setNewSubCategory(option.label);
    } else {
      setNewCategory(option.label);
    }
    setEditIndex(index);
  };

  const categoriesArray = categoryOptions.filter(
    (option) => !option.isSubCategory
  );
  const subCategoriesArray = categoryOptions.filter(
    (option) => option.isSubCategory
  );

  return {
    categoryOptions,
    categoriesArray,
    subCategoriesArray,
    isLoading,
    newCategory,
    setNewCategory,
    newSubCategory,
    setNewSubCategory,
    editIndex,
    setEditIndex,
    handleAddCategory,
    handleRemoveCategory,
    handleEditCategory,
  };
};
