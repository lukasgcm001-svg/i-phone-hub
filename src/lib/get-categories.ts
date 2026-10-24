import { categories } from '@wix/categories';

export async function getCategoriesFromWix() {
  try {
   const result = await categories.searchCategories(
  { filter: { visible: true } },
  { treeReference: { appNamespace: '@wix/stores' } }
);

    console.log('Raw getCategoriesFromWix result:', result);

    // Filter out "Todos os produtos" and "Destaques"
       const filtered = (result.categories || result.items || [])
      .filter((cat: any) => cat.name !== 'Todos os produtos' && cat.name !== 'Destaques')
      .map((cat: any) => ({
           id: cat._id ?? cat.id,
        name: cat.name
      }));

    console.log('Filtered categories:', filtered);
    return filtered;
  } catch (error) {
    console.error('Error in getCategoriesFromWix:', error);
    console.log('Full error object:', error);
    throw error;
  }
}
