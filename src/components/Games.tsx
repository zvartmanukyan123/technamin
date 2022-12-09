import { Link } from 'react-router-dom';
import { DataResponse } from '../interfaces/Interfaces';

export const Games = ({ games }: { games: DataResponse[] }) => {

  return (
    <>
      {games.map((game, index) => (
        <Link
          key={game._id + index}
          to={`/${game._id}`}
          state={{
            home: game.home.alias,
            away: game.away.alias,
            matchInfo: game.match_info,
            marketsCount: game.markets_count,
          }}
        >
          {game.home.alias} : {game.away.alias}
        </Link>
      ))}
    </>
  );
};
