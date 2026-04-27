import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setupPlayer = async () => {
  try {
    // 1. Setup Player
    await TrackPlayer.setupPlayer();

    // 2. Player Options (Notification bar & Lock screen controls)
    await TrackPlayer.updateOptions({
       stopWithApp: false,
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 2,
    });

     await restoreQueue();

    console.log("Track Player Setup Complete");
  } catch (error) {
    // Agar player pehle se setup hai to ignore karein
    console.log("Player error or already setup", error);
  }
};

const restoreQueue = async () => {
  try {
    const queue = await AsyncStorage.getItem('mini_player_queue');
    const index = await AsyncStorage.getItem('last_played_index');

    if (queue) {
      const tracks = JSON.parse(queue);

      await TrackPlayer.reset();
      await TrackPlayer.add(tracks);

      if (index) {
        await TrackPlayer.skip(Number(index));
      }
    }
  } catch (e) {
    console.log("Restore Queue Error", e);
  }
};