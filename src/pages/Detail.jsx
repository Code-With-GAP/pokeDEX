    // import { useParams, Link } from "react-router-dom";
    // import { useEffect, useState } from "react";

    // export default function Detail() {
    // const { name } = useParams(); // URL me jo name aayega
    // const [pokemon, setPokemon] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(false);
    // const typeColors = {
    //     fire: "bg-red-600",
    //     water: "bg-blue-500",
    //     grass: "bg-green-500",
    //     electric: "bg-yellow-400",
    //     ice: "bg-cyan-400",
    //     fighting: "bg-orange-700",
    //     poison: "bg-purple-600",
    //     ground: "bg-yellow-700",
    //     flying: "bg-indigo-400",
    //     psychic: "bg-pink-500",
    //     bug: "bg-lime-600",
    //     rock: "bg-stone-500",
    //     ghost: "bg-violet-700",
    //     dark: "bg-gray-800",
    //     dragon: "bg-indigo-700",
    //     steel: "bg-gray-500",               
    //     fairy: "bg-rose-400",
    //     normal: "bg-gray-400",
    // };

    // useEffect(() => {
    //     async function loadPokemon() {
    //     try {
    //         const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    //         if (!res.ok) {
    //         setError(true);
    //         return;
    //         }
    //         const data = await res.json();
    //         setPokemon(data);
    //     } catch (err) {
    //         setError(true);
    //     } finally {
    //         setLoading(false);
    //     }
    //     }
    //     loadPokemon();
    // }, [name]);

    // if (loading) return <h2>Loading Pokémon...</h2>;
    // if (error) return <h2>Pokémon not found </h2>;

    // return (
    //     <div className="p-4 flex flex-col text-center bg-gray-600 justify-center items-center">
    //         <div className="flex items-start w-full  ">
    //             <Link 
    //                 to="/" 
    //                 className=" text-xl font-bold py-1 px-2 rounded-xl hover:bg-red-500 hover:text-white">
    //                 Home
    //             </Link>
    //         </div>

    //         <h1     
    //             className="uppercase font-bold text-yellow-500 text-5xl  ">{pokemon.name}
    //         </h1>

    //         <img
    //             src={pokemon.sprites.other["official-artwork"].front_default}
    //             width="250"
    //             alt={pokemon.name}
    //         />

            
    //         <div className="flex gap-2 mt-2">
    //             {pokemon.types.map((t) => (
    //                 <span
    //                     key={t.type.name}
    //                     className={`px-4 py-1 text-xl font-semibold rounded-xl text-white 
    //                     ${typeColors[t.type.name]}
    //                     `}
    //                 >
    //                     {t.type.name}
    //                 </span>
    //             ))}
    //         </div>

    //         <h2>Abilities</h2>

    //         <p className="border-2 p-2">{pokemon.abilities.map((a) => a.ability.name).join(", ")}</p>

    //         <h2>Stats</h2>
    //         <ul className="flex flex-wrap justify-center text-center items-center gap-10 m-4">
    //             {pokemon.stats.map((s) => (
    //             <li key={s.stat.name}>
    //                 <strong>{s.stat.name}:</strong> {s.base_stat}
    //             </li>
    //             ))}
    //         </ul>

    //         <h2>Moves (first 10)</h2>
    //         <ul className="">
    //             {pokemon.moves.slice(0, 10).map((m) => (
    //             <li key={m.move.name}>{m.move.name}</li>
    //             ))}
    //         </ul>
    //     </div>
    // );
    // }






















import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    async function loadPokemon() {
      try {
        setLoading(true);

        // Fetch main Pokémon data
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = await res.json();
        setPokemon(data);

        // Fetch species
        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        // Fetch evolution chain
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        // Extract evolution list
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

  if (loading) return <h2>Loading Pokémon...</h2>;
  if (error) return <h2>Pokémon not found.</h2>;

  // Identify evolution position
  const currentIndex = evolutionList.indexOf(name);
  const prev = evolutionList[currentIndex - 1];
  const next = evolutionList[currentIndex + 1];

  return (
    <div className="p-4 flex flex-col text-center bg-gray-600 justify-center items-center">

      {/* Home Button */}
      <div className="flex items-start w-full">
        <Link
          to="/"
          className="text-xl font-bold py-1 px-2 rounded-xl hover:bg-red-500 hover:text-white"
        >
          Home
        </Link>
      </div>

      {/* Pokémon Name */}
      <h1 className="uppercase font-bold text-yellow-500 text-5xl">
        {pokemon.name}
      </h1>

      {/* Image + Evolution Buttons */}
      <div className="flex items-center gap-6 mt-4">

        {/* LEFT BUTTON = Previous Evolution */}
        <button
          disabled={!prev}
          onClick={() => navigate(`/pokemon/${prev}`)}
          className="px-4 py-2 bg-gray-800 text-white rounded-xl disabled:opacity-50"
        >
          prev from
        </button>

        {/* Pokémon Image */}
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          width="250"
          alt={pokemon.name}
        />

        {/* RIGHT BUTTON = Next Evolution */}
        <button
          disabled={!next}
          onClick={() => navigate(`/pokemon/${next}`)}
          className="px-4 py-2 bg-gray-800 text-white rounded-xl disabled:opacity-50"
        >
          Next form
        </button>

      </div>

      {/* Types */}
      <div className="flex gap-2 mt-3">
        {pokemon.types.map((t) => (
          <span
            key={t.type.name}
            className={`px-4 py-1 text-xl font-semibold rounded-xl text-white 
            ${typeColors[t.type.name]}`}
          >
            {t.type.name}
          </span>
        ))}
      </div>

      <h2 className="mt-4 text-2xl text-white font-bold">Abilities</h2>
      <p className="border-2 p-2 text-white">
        {pokemon.abilities.map((a) => a.ability.name).join(", ")}
      </p>

      <h2 className="mt-4 text-2xl text-white font-bold">Stats</h2>
      <ul className="flex flex-wrap justify-center text-center items-center gap-10 m-4 text-white">
        {pokemon.stats.map((s) => (
          <li key={s.stat.name}>
            <strong>{s.stat.name}:</strong> {s.base_stat}
          </li>
        ))}
      </ul>

      <h2 className="mt-4 text-2xl text-white font-bold">Moves (first 10)</h2>
      <ul className="text-white">
        {pokemon.moves.slice(0, 10).map((m) => (
          <li key={m.move.name}>{m.move.name}</li>
        ))}
      </ul>
    </div>
  );
}



















