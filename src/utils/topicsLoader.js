import topicsData from '../topics.json';
import animeData from '../../anime/anime-data.json';
import narutoData from '../../anime/naruto-characters.json';
import onePieceData from '../../anime/one-piece-characters.json';
import fruitsdata from '../../anime/fruits.json';
import seriedata from '../../anime/serie.json';
import nintendoData from '../../games/nintendo.json';
import pcData from '../../games/pc.json';
import metaData from '../../games/meta.json';

export function loadTopicsData() {
  return {
    "Anime": animeData.Anime,
    "Naruto Characters": narutoData.characters,
    "One Piece Characters": onePieceData.characters,
    "Nintendo Best-Sellers": nintendoData.games,
    "PC Best-Sellers": pcData.games,
    "Highest Rated Games (Metacritic)": metaData.games,
    "Kinderserien": seriedata.kinderserien,
    "Teufelsfrüchte": fruitsdata.fruits,
    ...topicsData
  };
}