import { createContext, ReactNode, useContext, useState } from "react";

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    hasNext: boolean;
    isPlaying: boolean;
    isLooping: boolean;
    hasPreview: boolean;
    episodes: Episode[];
    isShuffling: boolean;
    currentEpisodeIndex: number;
    play: (episode: Episode) => void;
    nextPlay: () => void;
    playToggle: () => void;
    loopToggle: () => void;
    previewPlay: () => void;
    shuffleToggle: () => void;
    clearPlayerState: () => void;
    setPlayingState: (state: boolean) => void;
    listPlay: (episodes: Episode[], index: number) => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodes, setEpisodes] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    const hasPreview = currentEpisodeIndex > 0;
    const hasNext = isShuffling || currentEpisodeIndex + 1 < episodes.length;
    const playToggle = () => setIsPlaying(!isPlaying);
    const loopToggle = () => setIsLooping(!isLooping);
    const shuffleToggle = () => setIsShuffling(!isShuffling);
    const setPlayingState = (state: boolean) => setIsPlaying(state);
    const previewPlay = () => (hasPreview) ? setCurrentEpisodeIndex(currentEpisodeIndex - 1) : null;

    const play = (episode: Episode) => {
        setEpisodes([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    const listPlay = (list: Episode[], index: number) => {
        setEpisodes(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    const nextPlay = () => {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodes.length)
            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        }
        else if (hasNext) setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    };

    const clearPlayerState = () => {
        setEpisodes([]);
        setCurrentEpisodeIndex(0);
    }


    return (
        <PlayerContext.Provider value={{
            hasNext,
            episodes,
            isPlaying,
            isLooping,
            hasPreview,
            isShuffling,
            currentEpisodeIndex,
            play,
            listPlay,
            nextPlay,
            playToggle,
            loopToggle,
            previewPlay,
            shuffleToggle,
            setPlayingState,
            clearPlayerState,
        }}>
            {children}
        </PlayerContext.Provider>);
}

export const userPlayer = () => useContext(PlayerContext);