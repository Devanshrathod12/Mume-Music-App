import { createSlice } from '@reduxjs/toolkit';

const musicSlice = createSlice({
  name: 'music',
  initialState: {
    favorites: [], 
    playlists: [], 
    recentlyPlayed: [], // Naya section for suggestions/history
  },
  reducers: {
    // 1. Favorite toggle logic
    toggleFavorite: (state, action) => {
      const song = action.payload;
      const index = state.favorites.findIndex(item => item.id === song.id);
      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(song);
      }
    },

    // 2. Recently Played / Suggestions Logic
    addToRecentlyPlayed: (state, action) => {
      const song = action.payload;
      // Pehle check karo ki kya ye gaana list mein pehle se hai?
      const existingIndex = state.recentlyPlayed.findIndex(item => item.id === song.id);
      
      if (existingIndex !== -1) {
        // Agar hai, toh usey wahan se hata do taaki wo top par aa sake
        state.recentlyPlayed.splice(existingIndex, 1);
      }

      // Gaane ko list ke shuruat (top) mein add karo
      state.recentlyPlayed.unshift(song);

      // Limit rakhte hain 20 gaano ki taaki storage heavy na ho
      if (state.recentlyPlayed.length > 20) {
        state.recentlyPlayed.pop(); // Sabse purana gaana hata do
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
    }
  },
});

export const { 
    toggleFavorite, 
    addPlaylist, 
    addSongToPlaylist, 
    addToRecentlyPlayed 
} = musicSlice.actions;

export default musicSlice.reducer;