import { createSlice } from '@reduxjs/toolkit';

const musicSlice = createSlice({
  name: 'music',
  initialState: {
    favorites: [], 
    playlists: [], 
    recentlyPlayed: [], 
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