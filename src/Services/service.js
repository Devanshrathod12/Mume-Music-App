import TrackPlayer, { Event } from 'react-native-track-player';

module.exports = async function () {
  console.log("SERVICE STARTED 🔥");

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log("PLAY");
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log("PAUSE");
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, () => {
    console.log("STOP");
    TrackPlayer.reset();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    console.log("NEXT");
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    console.log("PREVIOUS");
    TrackPlayer.skipToPrevious();
  });
};