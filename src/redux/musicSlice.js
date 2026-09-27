import { createSlice } from '@reduxjs/toolkit';

const musicSlice = createSlice({
  name: 'music',
  initialState: {
    favorites: [], 
    playlists: [], 
    recentlyPlayed: [], 
    queue: [],
    isShuffle: false,
    recentSearches: [],
  },
  reducers: {

    toggleFavorite: (state, action) => {
      const song = action.payload;
      const index = state.favorites.findIndex(item => item.id === song.id);
      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(song);
      }
    },

    addToRecentlyPlayed: (state, action) => {
      const song = action.payload;
      const existingIndex = state.recentlyPlayed.findIndex(item => item.id === song.id);
      
      if (existingIndex !== -1) {
        state.recentlyPlayed.splice(existingIndex, 1);
      }

      state.recentlyPlayed.unshift(song);

      if (state.recentlyPlayed.length > 20) {
        state.recentlyPlayed.pop();
      }
    },

    // 3. Playlist logic
    addPlaylist: (state, action) => {
      state.playlists.push({ name: action.payload, songs: [] });
    },

    addSongToPlaylist: (state, action) => {
      const { playlistName, song } = action.payload;
      const folder = state.playlists.find(p => p.name === playlistName);
      if (folder) {
        const isSongInPlaylist = folder.songs.some(s => s.id === song.id);
        if (!isSongInPlaylist) {
          folder.songs.push(song);
        }
      }
    },
    
    // 4. Queue and Shuffle logic
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },
    
    // 5. Recent Searches
    addRecentSearch: (state, action) => {
      const query = action.payload;
      if (!state.recentSearches) state.recentSearches = [];
      
      if (!state.recentSearches.includes(query)) {
        state.recentSearches = [query, ...state.recentSearches].slice(0, 10);
      } else {
        // Move to top if already exists
        state.recentSearches = state.recentSearches.filter(q => q !== query);
        state.recentSearches.unshift(query);
      }
    },
    removeRecentSearch: (state, action) => {
      if (!state.recentSearches) state.recentSearches = [];
      state.recentSearches = state.recentSearches.filter(q => q !== action.payload);
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    }
  },
});

export const { 
    toggleFavorite, 
    addPlaylist, 
    addSongToPlaylist, 
    addToRecentlyPlayed,
    setQueue,
    toggleShuffle,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches
} = musicSlice.actions;

export default musicSlice.reducer;