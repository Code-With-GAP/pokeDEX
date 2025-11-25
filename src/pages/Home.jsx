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
        setPokemons([data]); // Show only the searched Pokémon
        setSuggestions([]);
        setQuery("");
        } catch (error) {
        showNotification("Failed to load Pokémon");
        console.error(error);
        }
    }

    // Suggestion logic on input change
    useEffect(() => {
        if (!query.trim()) {
        loadPokemons(page);
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
        <>
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
            <div className="w-[60%]">
                <input
                    type="text"
                    placeholder="Search Pokémon..."
                    className="w-[50%]border border-gray-300 rounded px-4 py-2 "
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
                    className="bg-blue-600 text-white m-4 px-4 py-2 rounded hover:bg-blue-700 mb-6">
                    Search
                </button>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
            <div className="bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto w-[80%]">
                {suggestions.map((item, index) => (
                <div
                    key={index}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                    if (item !== "No match found") {
                        setQuery(item);
                        setSuggestions([]);
                        handleSearch(); // fetch when suggestion clicked
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
                
                <span className="absolute top-2 right-2 text-sm font-bold text-gray-500">
                #{pokemon.id}
                </span>

                <h2 
                
                className="text-xl font-bold mb-2 uppercase">{pokemon.name}
                </h2>

                <img
                src={pokemon.sprites.other["official-artwork"].front_default}
                width={200}
                alt={pokemon.name}
                className="border-2xl border-black"
                />
                <p className="mt-2">
                Type: {pokemon.types.map((t) => t.type.name).join(", ")}
                </p>
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
        </>
    );
    }
