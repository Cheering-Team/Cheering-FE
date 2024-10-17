import {Player} from 'apis/player/types';
import React from 'react';
import DailyList from '../DailyList';

interface StarFeedListProps {
  player: Player;
}

const StarFeedList = ({player}: StarFeedListProps) => {
  return (
    <>
      <DailyList player={player} />
    </>
  );
};

export default StarFeedList;
