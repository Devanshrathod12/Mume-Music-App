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
        try {
            const queue = await TrackPlayer.getQueue();
            const activeIndex = await TrackPlayer.getActiveTrackIndex();
            if (queue && queue.length > 0 && activeIndex !== undefined && activeIndex !== null) {
                const nextIndex = (activeIndex + 1) % queue.length;
                await TrackPlayer.skip(nextIndex);
                await TrackPlayer.play();
            }
        } catch (e) {
            console.log("RemoteNext Error:", e);
        }
    });
    TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
        try {
            const queue = await TrackPlayer.getQueue();
            const activeIndex = await TrackPlayer.getActiveTrackIndex();
            if (queue && queue.length > 0 && activeIndex !== undefined && activeIndex !== null) {
                const prevIndex = activeIndex === 0 ? queue.length - 1 : activeIndex - 1;
                await TrackPlayer.skip(prevIndex);
                await TrackPlayer.play();
            }
        } catch (e) {
            console.log("RemotePrevious Error:", e);
        }
    });
    TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
        await TrackPlayer.seekTo(event.position);
    });
    TrackPlayer.addEventListener(Event.RemotePlayPause, async () => {
        const playback = await TrackPlayer.getPlaybackState();
        if (playback.state === State.Playing) {
            await TrackPlayer.pause();
        } else {
            await TrackPlayer.play();
        }
    });
};