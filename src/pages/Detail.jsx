import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import pokeball from "../assets/pokeball.gif";

export default function Detail() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState(null);
  const [evolutionList, setEvolutionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const typeColors = {
    fire: "bg-red-600",
    water: "bg-blue-500",
    grass: "bg-green-500",
    electric: "bg-yellow-400",
    ice: "bg-cyan-400",
    fighting: "bg-orange-700",
    poison: "bg-purple-600",
    ground: "bg-yellow-700",
    flying: "bg-indigo-400",
    psychic: "bg-pink-500",
    bug: "bg-lime-600",
    rock: "bg-stone-500",
    ghost: "bg-violet-700",
    dark: "bg-gray-800",
    dragon: "bg-indigo-700",
    steel: "bg-gray-500",
    fairy: "bg-rose-400",
    normal: "bg-gray-400",
  };

  const statColors = {
    hp: "bg-red-500",
    attack: "bg-yellow-500",
    defense: "bg-blue-500",
    "special-attack": "bg-pink-500",
    "special-defense": "bg-purple-500",
    speed: "bg-green-500",
  };

  useEffect(() => {
    async function loadPokemon() {
      try {
        setLoading(true);

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setPokemon(data);

        // species
        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        // evolution chain
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        // extract evolution list
        const list = [];
        let current = evoData.chain;
        while (current) {
          list.push(current.species.name);
          current = current.evolves_to[0];
        }
        setEvolutionList(list);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();
  }, [name]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-800">
        <img
          src={pokeball}
          alt="Loading..."
          className="w-full h-screen"
        />
      </div>
    );

  if (error)
    return (
      <h2 className="text-center mt-20 text-xl text-white">
        Pokémon not found.
      </h2>
    );

  const currentIndex = evolutionList.indexOf(name);
  const prev = evolutionList[currentIndex - 1];
  const next = evolutionList[currentIndex + 1];

  return (
    <div className="p-4 flex flex-wrap justify-between text-center bg-blue-800 min-h-screen">

      {/* Left Column: Image, Name, Types, Evolution */}
      <div className="w-full md:w-[45%] flex flex-col items-center mb-10 md:mb-0">

        <div className="flex items-start w-full mb-4">
          <Link
            to="/"
            className="text-xl font-bold py-1 px-2 rounded-xl hover:bg-red-500 hover:text-white"
          >
            Home
          </Link>
        </div>

        <h1 className="uppercase font-bold text-yellow-500 text-4xl">
          {pokemon.name}
        </h1>

        <div className="flex flex-col items-center gap-6 mt-4">
          <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            width="250"
            alt={pokemon.name}
            className="cursor-pointer transition-all duration-500 hover:rotate-180 hover:scale-125"
          />

          <div className="flex gap-8">
            <button
              disabled={!prev}
              onClick={() => navigate(`/pokemon/${prev}`)}
              className="px-4 py-2 bg-gray-800 text-white rounded-xl disabled:opacity-50"
            >
              ⬅️ Prev
            </button>

            <button
              disabled={!next}
              onClick={() => navigate(`/pokemon/${next}`)}
              className="px-4 py-2 bg-gray-800 text-white rounded-xl disabled:opacity-50"
            >
              Next ➡️
            </button>
          </div>
        </div>

        {/* Types */}
        <div className="flex gap-2 mt-3 justify-center flex-wrap">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className={`px-4 py-1 text-xl font-semibold rounded-xl text-white ${typeColors[t.type.name]}`}
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>

      {/* Right Column: Abilities, Stats, Moves */}
      <div className="w-full md:w-[50%] p-2 text-left flex flex-col justify-center items-center">

        {/* Abilities */}
        <h2 className="mt-4 text-2xl text-yellow-400 font-bold">Abilities</h2>
        <p className="gap-4 p-4 text-xl text-white">
          {pokemon.abilities.map((a) => a.ability.name).join(", ")}
        </p>

        {/* Stats */}
        <h2 className="mt-4 text-2xl text-yellow-400 font-bold">Stats</h2>
        <div className="w-full max-w-md space-y-3 mt-2">
          {pokemon.stats.map((s) => {
            const percentage = Math.min((s.base_stat / 150) * 100, 100);
            return (
              <div key={s.stat.name}>
                <div className="flex justify-between mb-1 text-white font-semibold">
                  <span className="capitalize">{s.stat.name}</span>
                  <span>{s.base_stat}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-5">
                  <div
                    className={`${statColors[s.stat.name]} h-5 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Moves */}
        <h2 className="mt-6 text-2xl text-yellow-400 font-bold">Moves (first 10)</h2>
        <ul className="text-white text-xl font-bold list-disc list-inside">
          {pokemon.moves.slice(0, 10).map((m) => (
            <li key={m.move.name}>{m.move.name}</li>
          ))}
        </ul>

      </div>

          <div className="mt-6 flex justify-center items-center">
            <Link to="/game">
              <button className="px-6 py-2 bg-green-600 text-white rounded-xl text-xl font-bold hover:bg-green-700">
                 Play Guessing Game
              </button>
            </Link>
          </div>


    </div>
  );
}


























