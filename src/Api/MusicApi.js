import axios from 'axios';

// Base API URL
const baseUrl = "https://saavnapi-nine.vercel.app";

// Normalizer function to map raw API response to expected UI format
export const normalizeSong = (item) => {
    return {
        id: item.id || Math.random().toString(),
        name: item.song || "Unknown Song",
        image: item.image || "https://via.placeholder.com/150",
        artists: {
            primary: item.primary_artists 
                ? item.primary_artists.split(',').map(name => ({ name: name.trim() })) 
                : [{ name: "Unknown Artist" }]
        },
        downloadUrl: [
            {
                url: item.media_url || item.encrypted_media_url || ""
            }
        ],
        album: {
            name: item.album || "Unknown Album",
            id: item.albumid || "",
            url: item.album_url || ""
        },
        duration: Number(item.duration) || 0,
        type: 'song',
        perma_url: item.perma_url || ""
    };
};

export const MusicApiSearch = async (query) => {
    try {
        if (!query) return [];
        const encodedQuery = encodeURIComponent(query);
        const endpoint = `${baseUrl}/result/?query=${encodedQuery}`;
        const response = await axios.get(endpoint);
        
        if (response.data && Array.isArray(response.data)) {
            return response.data.map(normalizeSong);
        }
        return [];
    } catch (error) {
        console.error("MusicApiSearch Error:", error);
        throw error;
    }
};
