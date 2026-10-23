import { categories } from '@wix/categories';
import { elevate } from '@wix/essentials';

export async function getCategoriesFromWix() {
  try {
    const elevatedCategories = elevate(categories);
    
    const result = await elevatedCategories.searchCategories({
      query: {
        filter: {
          'treeReference.appNamespace': '@wix/stores',
          'visible': true
        }
      }
    });

    console.log('Raw getCategoriesFromWix result:', result);

    // Filter out "Todos os produtos" and "Destaques"
    const filtered = (result.items || [])
      .filter((cat: any) => cat.name !== 'Todos os produtos' && cat.name !== 'Destaques')
      .map((cat: any) => ({
        id: cat._id,
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
