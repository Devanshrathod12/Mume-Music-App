import TrackPlayer, { Event, State } from 'react-native-track-player';

module.exports = async function () {
    TrackPlayer.addEventListener(Event.RemotePlay, async () => {
        await TrackPlayer.play();
    });
    TrackPlayer.addEventListener(Event.RemotePause, async () => {
        await TrackPlayer.pause();
    });
    TrackPlayer.addEventListener(Event.RemoteStop, async () => {
        await TrackPlayer.stop();
    });
    TrackPlayer.addEventListener(Event.RemoteNext, async () => {
        try { await TrackPlayer.skipToNext(); } catch (e) { }
    });
    TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
        try { await TrackPlayer.skipToPrevious(); } catch (e) { }
    });
    TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
        await TrackPlayer.seekTo(event.position);
    });
    TrackPlayer.addEventListener(Event.RemotePlayPause, async () => {
        const playbackState = await TrackPlayer.getState();
        if (playbackState === State.Playing) {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    });
};