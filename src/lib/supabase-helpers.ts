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

/**
 * Ambil data knockout (matches dan teams) untuk sport tertentu
 */
export async function getKnockoutData(sportId: string) {
  // Ambil semua matches untuk sportId tertentu
  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('*')
    .eq('sport_id', sportId);

  if (matchesError) {
    throw matchesError;
  }

  // Ambil semua teams yang terlibat di matches
  const teamIds = Array.from(
    new Set([
      ...(matches?.map((m) => m.team1_id) || []),
      ...(matches?.map((m) => m.team2_id) || []),
    ])
  );

  let teams = [];
  if (teamIds.length > 0) {
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .in('id', teamIds);
    if (teamsError) {
      throw teamsError;
    }
    teams = teamsData || [];
  }

  return { matches: matches || [], teams };
}

/**
 * Transform data matches dan teams ke format bracket (untuk react-tournament-brackets)
 * @param matches array of match objects from Supabase
 * @param teams array of team objects from Supabase
 * @returns array of bracket match objects
 *
 * Contoh hasil:
 * [
 *   {
 *     id: 'match1',
 *     name: 'Quarterfinal',
 *     scheduled: '2024-06-10T10:00:00Z',
 *     state: 'done',
 *     sides: {
 *       home: {
 *         team: { id: 'team1', name: 'Team A' },
 *         score: { score: 2 },
 *         seed: { rank: 1 }
 *       },
 *       visitor: {
 *         team: { id: 'team2', name: 'Team B' },
 *         score: { score: 1 },
 *         seed: { rank: 2 }
 *       }
 *     }
 *   },
 *   ...
 * ]
 */
export function transformToBracketFormat(matches: any[], teams: any[]) {
  // Helper untuk cari tim berdasarkan id
  const getTeam = (id: string) => teams.find((t) => t.id === id) || { id, name: 'Unknown' };

  // Urutkan matches berdasarkan round dan waktu (opsional, tergantung kebutuhan visualisasi)
  const sortedMatches = [...matches].sort((a, b) => {
    if (a.round === b.round) {
      return (a.match_time || '').localeCompare(b.match_time || '');
    }
    return (a.round || '').localeCompare(b.round || '');
  });

  // Transformasi ke format bracket
  return sortedMatches.map((match, idx) => {
    return {
      id: match.id,
      name: match.round || 'Match',
      scheduled: match.match_time || null,
      state: match.team1_score != null && match.team2_score != null ? 'done' : 'scheduled',
      sides: {
        home: {
          team: getTeam(match.team1_id),
          score: { score: match.team1_score ?? 0 },
          seed: { rank: 1 }, // Bisa diubah jika ada data seed
        },
        visitor: {
          team: getTeam(match.team2_id),
          score: { score: match.team2_score ?? 0 },
          seed: { rank: 2 }, // Bisa diubah jika ada data seed
        },
      },
    };
  });
} 