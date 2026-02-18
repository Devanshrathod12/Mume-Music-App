import TrackPlayer, { Capability, AppKilledPlaybackBehavior } from 'react-native-track-player';

export const setupPlayer = async () => {
  try {
    // 1. Setup Player
    await TrackPlayer.setupPlayer();

    // 2. Player Options (Notification bar & Lock screen controls)
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
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
    console.log("Track Player Setup Complete");
  } catch (error) {
    // Agar player pehle se setup hai to ignore karein
    console.log("Player error or already setup", error);
  }
};