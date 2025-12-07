import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import pokeball from "../assets/pokeball.gif";

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [allNames, setAllNames] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [page, setPage] = useState(1);
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(true); // <-- loader state

  const limit = 25;

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

  function showNotification(message) {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  }

  async function loadPokemons(page = 1) {
    try {
      setLoading(true); 
      const offset = (page - 1) * limit;
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await res.json();

      const details = await Promise.all(
        data.results.map((p) => fetch(p.url).then((r) => r.json()))
      );

      setPokemons(details);
    } catch (error) {
      console.error(error);
      showNotification("FIALED TO LOAD POKEMON.");
    } finally {
      setLoading(false); 
    }
  }

  async function loadAllNames() {
    try {
      const res = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
      );
      const data = await res.json();
      setAllNames(data.results.map((p) => p.name));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSearch() {
    if (!query.trim()) {
      showNotification("NAAM TOH DAAL PAHLE MERE BHAI!");
      return;
    }

    const lowerQuery = query.toLowerCase();

    if (!allNames.includes(lowerQuery)) {
      showNotification("POKEMON NOT FOND!");
      return;
    }

    try {
      setLoading(true); 
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${lowerQuery}`);
      const data = await res.json();
      setPokemons([data]);
      setSuggestions([]);
    } catch (error) {
      showNotification("FAILD TO LOAD POKEMON");
      console.error(error);
    } finally {
      setLoading(false); 
    }
  }

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const matches = allNames
      .filter((name) => name.includes(query.toLowerCase()))
      .slice(0, 10);

    setSuggestions(matches.length > 0 ? matches : ["YE KONSA POKEMON HAI"]);
  }, [query, allNames, page]);

  useEffect(() => {
    loadPokemons(page);
    loadAllNames();
  }, [page]);

  return (
    <div className="bg-yellow-500 w-screen min-h-screen flex flex-wrap">

      
      {notification && (
        <div className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
          {notification}
        </div>
      )}

      
      <div className="relative w-full">
        <img
          src="https://i.redd.it/ukbxkyy0yb7a1.gif"
          alt="bg-image"
          className="w-full h-auto max-h-[350px] object-cover "
        />

        
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">

          
          <div className="backdrop-blur-md bg-white/200 p-4 rounded-xl shadow-xl w-[85%] ">

            
            <div className="flex  w-full">
              <input
                type="text"
                placeholder="Search Pokémon..."
                className="flex border w-[90%] border-gray-300 rounded-l px-1 py-2 bg-amber-300 font-bold text-xl outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-2 py-2 text-xl font-bold rounded-r hover:bg-blue-700"
              >
                Search
              </button>
            </div>

            
            {suggestions.length > 0 && (
              <div 
                className="bg-white rounded mt-2 max-h-40 overflow-auto border text-center shadow-lg">
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-200 transition"
                    onClick={() => {
                      if (item !== "No match found") {
                        setQuery(item);
                        setSuggestions([]);
                        handleSearch();
                      }
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div className="flex flex-wrap justify-center gap-10 p-10">
        {loading ? (
          <img
            src={pokeball}
            alt="loading..."
            className="w-full h-screen"
          />    
        ) : (
          pokemons.map((pokemon) => (
            <Link
              key={pokemon.id}
              to={`/pokemon/${pokemon.name}`}
              className="rounded-xl p-4 flex flex-col items-center bg-blue-900 text-white/40 shadow-[0_10px_10px_10px_black] transition duration-500 hover:scale-110 relative"
            >
              <span className="absolute top-2 right-2 text-sm font-bold text-red-500">
                {pokemon.id}
              </span>

              <h2 className="text-xl font-bold text-yellow-500 mb-2 uppercase">
                {pokemon.name}
              </h2>

              <img
                src={pokemon.sprites.other['official-artwork'].front_default}
                width={200}
                alt={pokemon.name}
                className="hover:scale-130 transition-all duration-500"
              />

              <div className="flex gap-2 mt-2">
                {pokemon.types.map((t) => (
                  <span
                    key={t.type.name}
                    className={`px-4 py-1 text-xl font-semibold rounded-full text-white ${typeColors[t.type.name]}`}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="w-full flex justify-center items-center pb-10">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          ⬅️
        </button>
        <span className="px-4 font-bold text-lg">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          ➡️
        </button>
      </div>
    </div>
  );
}
