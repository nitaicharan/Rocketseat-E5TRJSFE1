
export default function Home({episodes}) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(episodes,null, 2)}</p>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes');
  const data = await response.json();

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8, // 60 sec * 60 min = 1 hour * 8 = 8 hours
  }
}