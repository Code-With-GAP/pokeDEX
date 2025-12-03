    import { useEffect, useState } from "react";
    import { Link } from "react-router-dom";

    export default function Home() {
    const [pokemons, setPokemons] = useState([]);
    const [allNames, setAllNames] = useState([]);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [page, setPage] = useState(1);
    const [notification, setNotification] = useState("");

    const limit = 20;
    
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

    // Show toast notification
    function showNotification(message) {
        setNotification(message);
        setTimeout(() => setNotification(""), 3000);
    }

    // Load 20 Pokémon
    async function loadPokemons(page = 1) {
        try {
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
        showNotification("Failed to load Pokémon.");
        }
    }

    // Load all names
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

    // Search handler
    async function handleSearch() {
        if (!query.trim()) {
        showNotification("Please type a Pokémon name!");
        return;
        }

        const lowerQuery = query.toLowerCase();

        if (!allNames.includes(lowerQuery)) {
        showNotification("Pokémon not found!");
        return;
        }

        try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${lowerQuery}`);
        const data = await res.json();
        setPokemons([data]);
        setSuggestions([]);
        } catch (error) {
        showNotification("Failed to load Pokémon");
        console.error(error);
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

        setSuggestions(matches.length > 0 ? matches : ["No match found"]);
    }, [query, allNames, page]);

    useEffect(() => {
        loadPokemons(page);
        loadAllNames();
    }, [page]);

    return (
        <div className="bg-gray-800">
            <div className="w-full flex justify-center">
                <img    
                    src="https://media.tenor.com/IR2IAAM1DX4AAAAM/h2di-pikachu-crazy.gif"      
                    alt="bg-image"
                    height={28}
                    className="rounded-xl m-1 transition-all duration-300 hover:scale-x-200"
                />
            </div>

            {/* Toast notification */}
            {notification && (
                <div className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
                {notification}
                </div>
            )}


            {/* Search div */}
            <div className="w-full m-4">
                <div className="w-[100%]">
                    <input
                        type="text"
                        placeholder="Search Pokemon..."
                        className="w-[80%] border-2 border-gray-300 rounded px-4 py-1 bg-amber-400 font-bold outline-0 text-2xl "
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                            handleSearch();
                            }
                        }}
                    />
                    <button
                        onClick={handleSearch}
                        className="cursor-pointer w-[auto] bg-blue-600 text-white m-4 px-2 py-1 font-bold text-2xl rounded hover:bg-blue-700 mb-6">
                        Search
                    </button>
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                <div className="bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto w-[80%] scrollbar:none hide-scrollbar">
                    {suggestions.map((item, index) => (
                    <div
                        key={index}
                        className="p-2 cursor-pointer text-center transition-all duration-300 hover:bg-gray-500 hover:scale-150"
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

            

            {/* Pokémon Cards */}




            <div className="flex flex-wrap justify-center gap-18 m-4 mt-18 rounded-2xl">
                {pokemons.map((pokemon) => (
                <Link
                    key={pokemon.id}
                    to={`/pokemon/${pokemon.name}`}
                    className="rounded-xl p-4 flex flex-col items-center bg-black/90 text-white/40 shadow-black shadow-2xl transition-all duration-500 hover:scale-110 relative"
                >
                    
                    <span  
                        className="absolute top-2 right-2 text-sm  font-bold text-red-500">
                        {pokemon.id}
                    </span>

                    <h2 
                    
                    className="text-xl font-bold text-yellow-500 mb-2 uppercase">{pokemon.name}
                    </h2>

                    <img
                    src={pokemon.sprites.other["official-artwork"].front_default}
                    width={200}
                    alt={pokemon.name} 
                    className="border-2xl border-black"
                    />
                    <div className="flex gap-2 mt-2">
                        {pokemon.types.map((t) => (
                            <span
                            key={t.type.name}
                            className={`px-4 py-1 text-xl font-semibold rounded-full text-white 
                                ${typeColors[t.type.name]}
                            `}
                            >
                            {t.type.name}
                            </span>
                        ))}
                    </div>

                </Link>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between mt-6">
                <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
                >
                Previous
                </button>
                <span className="self-center">Page {page}</span>
                <button
                onClick={() => setPage((p) => p + 1)}
                className="bg-gray-300 px-4 py-2 rounded"
                >
                Next
                </button>
            </div>
        </div>
    );
    }
