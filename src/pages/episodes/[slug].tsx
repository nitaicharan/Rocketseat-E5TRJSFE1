import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { userPlayer } from "../../contexts/PlayerContext";
import { api } from "../../services/api";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from "./episode.module.scss";

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
    description: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
    const { play } = userPlayer();

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title} | Podcaster</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>

                <Image width={700} height={160} src={episode.thumbnail} objectFit="cover" />

                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>


            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get<Episode[]>('/episodes', {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    });


    const paths = data.map(episode => ({
        params: {
            slug: episode.id,
        }
    }));

    return {
        paths,
        fallback: 'blocking',
    }
}


export const getStaticProps: GetStaticProps = async (context) => {
    const { slug } = context.params;

    const { data } = await api.get(`/episodes/${slug}`);

    const episode = {
        ...data,
        url: data.file.url,
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR })
    };

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24 * 30 * 12 // 60seg * 60 min = 1 hour * 24 = 1 day * 30 = 1 mouth * 12 = 1 year
    }
}