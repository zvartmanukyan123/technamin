import { Wrapper } from './Wrapper/Wrapper';
import { DataResponse } from '../interfaces/Interfaces';

interface GroupBy {
  field: string;
  name: string;
  count?: number;
  nodes: DataResponse[];
}

interface Result {
  [key: string]: GroupBy;
}

export function groupBy(
  data: DataResponse[],
  fields: ("sport" | "region" | "tournament")[]
): any {
  const field = fields[0];
  fields = fields.slice(1);

  const retArr = Object.values(
    data.reduce((results: Result, game: DataResponse) => {
      (results[game[field].id] = results[game[field].id] || {
        field: field,
        name: game[field].name,
        nodes: [],
      }).nodes.push(game);
      return results;
    }, {})
  );
  // recurse for each child's nodes if there are remaining fields
  if (fields.length) {
    retArr.forEach((obj) => {
      obj.count = obj.nodes.length;
      obj.nodes = groupBy(obj.nodes, fields);
    });
  }
  return retArr;
}

export const Home = ({ data }: { data: DataResponse[] }) => {
  const preparedData = groupBy(data, ['sport', 'region', 'tournament']);
  return (
    <>{preparedData.length > 0 && preparedData.map((data: any, index: number) => <Wrapper key={data._id + String(index)} name={data.name} nodes={data.nodes} />)}</>
  );
};
