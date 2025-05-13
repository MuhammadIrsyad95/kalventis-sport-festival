import { supabase } from './supabase/client';

// Helper function for handling Supabase CRUD operations with better error handling

/**
 * Safely fetch data from a Supabase table
 */
export async function fetchFromTable(tableName: string, options = {}) {
  try {
    console.log(`Fetching from ${tableName}...`);
    const query = supabase.from(tableName).select('*');
    
    // Apply any additional query options
    Object.entries(options).forEach(([key, value]) => {
      if (key === 'order' && typeof value === 'object') {
        const { column, ascending } = value as { column: string; ascending: boolean };
        query.order(column, { ascending });
      } else if (key === 'select' && typeof value === 'string') {
        query.select(value);
      } else if (key === 'filter' && Array.isArray(value)) {
        const [column, operator, filterValue] = value;
        query.filter(column, operator, filterValue);
      }
    });
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching from ${tableName}:`, error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error in fetchFromTable for ${tableName}:`, error);
    return [];
  }
}

/**
 * Safely insert a record into a Supabase table
 */
export async function insertRecord(tableName: string, data: any) {
  try {
    console.log(`Inserting into ${tableName}:`, data);
    
    const { data: result, error } = await supabase
      .from(tableName)
      .insert([data])
      .select();
    
    if (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      throw error;
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error(`Error in insertRecord for ${tableName}:`, error);
    return { success: false, error };
  }
}

/**
 * Safely update a record in a Supabase table
 */
export async function updateRecord(tableName: string, id: string | number, data: any) {
  try {
    console.log(`Updating ${tableName} id ${id}:`, data);
    
    const { data: result, error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error updating ${tableName}:`, error);
      throw error;
    }
    
    return { success: true, data: result };
  } catch (error) {
    console.error(`Error in updateRecord for ${tableName}:`, error);
    return { success: false, error };
  }
}

/**
 * Safely delete a record from a Supabase table
 */
export async function deleteRecord(tableName: string, id: string | number) {
  try {
    console.log(`Deleting from ${tableName} id ${id}`);
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting from ${tableName}:`, error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error in deleteRecord for ${tableName}:`, error);
    return { success: false, error };
  }
} 