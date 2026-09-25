import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setupPlayer = async () => {
  let isSetup = false;
  try {
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
    });
    isSetup = true;
  } catch (error) {
    isSetup = true;
    console.log("Player error or already setup", error);
  }

  if (isSetup) {
    try {
      // 2. Player Options (Notification bar & Lock screen controls)
      await TrackPlayer.updateOptions({
        alwaysPauseOnInterruption: true,
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
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        progressUpdateEventInterval: 2,
      });

      await restoreQueue();
      console.log("Track Player Setup Complete");
    } catch (e) {
      console.log("updateOptions error", e);
    }
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