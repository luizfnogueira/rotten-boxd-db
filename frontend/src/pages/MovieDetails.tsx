import { useParams } from 'react-router-dom';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Detalhes do Filme: {id}</h1>
      <p>Aqui estarão as resenhas e informações do filme...</p>
    </div>
  );
}
