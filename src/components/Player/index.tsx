import Image from "next/image";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useContext, useEffect, useRef, useState } from "react";
import { PlayerContext } from "../../contexts/PlayerContext";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from "./styles.module.scss";

export function Player() {
    const {
        hasNext,
        episodes,
        isPlaying,
        isLooping,
        hasPreview,
        isShuffling,
        currentEpisodeIndex,
        nextPlay,
        loopToggle,
        playToggle,
        previewPlay,
        shuffleToggle,
        setPlayingState,
        clearPlayerState,
    } = useContext(PlayerContext);

    const [progress, setProgress] = useState(0)
    const episode = episodes[currentEpisodeIndex];
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (!audioRef.current) return;

        isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }, [isPlaying])

    const setupProgressListener = () => {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    };

    const handleSeek = (amount: number) => {
        setProgress(amount);
        audioRef.current.currentTime = amount;
    };

    const handleEpisodeEnded = () => hasNext ? nextPlay() : clearPlayerState();


    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando Agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={episode ? '' : styles.empty}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04D361' }}
                                railStyle={{ backgroundColor: '#9F75FF' }}
                                handleStyle={{ borderColor: '#04D361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        loop={isLooping}
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button" onClick={shuffleToggle} disabled={!episode || episodes.length === 1} className={isShuffling ? styles.isActive : ''}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>

                    <button type="button" onClick={previewPlay} disabled={!episode || !hasPreview}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>

                    <button
                        type="button"
                        disabled={!episode}
                        className={styles.playButton}
                        onClick={playToggle}
                    >
                        {isPlaying ? (
                            <img src='/pause.svg' alt='Pausar' />
                        ) : (
                            <img src='/play.svg' alt='Tocar' />
                        )}
                    </button>

                    <button type="button" onClick={nextPlay} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>

                    <button type="button" disabled={!episode} onClick={loopToggle} className={isLooping ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}