import topicsData from '../topics.json';
import topics2Data from '../topics2.json';
import topics3Data from '../topics3.json';
import animeData from '../../anime/anime-data.json';
import narutoData from '../../anime/naruto-characters.json';
import onePieceData from '../../anime/one-piece-characters.json';
import fruitsdata from '../../anime/fruits.json';
import seriedata from '../../anime/serie.json';
import nintendoData from '../../games/nintendo.json';
import pcData from '../../games/pc.json';
import metaData from '../../games/meta.json';

const randomTopics = {
  "Anime": animeData.Anime,
  "Naruto Characters": narutoData.characters,
  "One Piece Characters": onePieceData.characters,
  "Nintendo Best-Sellers": nintendoData.games,
  "PC Best-Sellers": pcData.games,
  "Highest Rated Games (Metacritic)": metaData.games,
  "Kinderserien": seriedata.kinderserien,
  "Teufelsfrüchte": fruitsdata.fruits,
};

export function loadTopicsGrouped() {
  return [
    { name: "Random", color: "#ffff00", topics: randomTopics },
    { name: "Pokemon (Gen 1-6)", color: "#ff00ff", topics: topicsData },
    { name: "Pokemon (Spezial Formen)", color: "#ff6600", topics: topics2Data },
    { name: "Pokemon (vollentwickelt alle Gens)", color: "#00ccff", topics: topics3Data },
  ];
}