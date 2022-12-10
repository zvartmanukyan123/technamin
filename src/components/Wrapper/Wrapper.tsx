import { useState } from 'react';
import { WrapperProps } from '../../interfaces/Interfaces';
import { Games } from '../Games';
import './wrapper.css';

export const Wrapper = ({ nodes, name }: { nodes: any; name?: string }): any => {
  const [isOpen, setIsOpen] = useState(true);

  console.log(name, nodes, 'wrapper');

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const render = () => {
    if (nodes[0].field) {
      return nodes.map((node: WrapperProps, index: number) => <Wrapper key={node.name + index} name={node.name} nodes={node.nodes} />);
    } else {
      return  <Games games={nodes} />;
    }
  };

  return (
    <div onClick={(e) => handleClick(e)}>
      {name ?? ''}
      <div className='child_nodes'>{isOpen ? render() : null}</div>
    </div>
  );
};
