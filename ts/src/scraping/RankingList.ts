import PlayerCharacterData from './PlayerCharacterData';

interface RankingList {
    dateString: string;
    worldKey: string;
    categoryKey: string;
    characters: PlayerCharacterData[];
}

export default RankingList;
