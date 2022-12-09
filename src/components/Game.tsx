import { useLocation } from "react-router";
import { LocationState } from "../interfaces/Interfaces";

export const Game = () => {
  const state = useLocation().state as LocationState;

  return (
    <>
      <div>
        {state.home ?? ""} : {state.away ?? ""}
      </div>
      <div>
        <span>Match Result - </span>
        {state.matchInfo.score ?? "0 : 0"}
      </div>
      <div>
        <span>Markets Count - </span>
        {state.marketsCount ?? ""}
      </div>
    </>
  );
};
