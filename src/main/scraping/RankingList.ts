import PlayerCharacterData from './PlayerCharacterData';

interface RankingList {
    date: Date;
    worldKey: string;
    categoryKey: string;
    characters: PlayerCharacterData[];
}

export default RankingList;
