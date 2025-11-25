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
        }
    }

    // Load all names
    async function loadAllNames() {
        const res = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
        );
        const data = await res.json();
        setAllNames(data.results.map((p) => p.name));
    }

    // Search handler
    function handleSearch() {
        if (!query.trim()) {
        showNotification("Please type a Pokémon name!");
        return;
        }

        setSuggestions([]);
        setQuery("");
        
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
            {/* Toast notification */}
            {notification && (
                <div className="fixed top-5 right-5 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">
                {notification}
                </div>
            )}

            {/* search div */}
            <div className="w-full">
                <input
                type="text"
                placeholder="Search Pokémon..."
                className="border border-gray-300 rounded px-4 py-2 w-[80%]"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    handleSearch();
                    }
                }}
                />
                {/* Suggestions */}
                {suggestions.length > 0 && (
                <div className="bg-white border border-gray-300 rounded mt-1 max-h-40 overflow-auto">
                    {suggestions.map((item, index) => (
                    <div
                        key={index}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                        if (item !== "No match found") {
                            setQuery(item);
                            setSuggestions([]);
                        }
                        }}
                    >
                        {item}
                    </div>
                    ))}
                </div>
                )}
            </div>

            <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
            >
                Search
            </button>

            {/* Pokémon Cards */}
            <div className="border-2 m-4 rounded-2xl">
                {pokemons.map((pokemon) => (
                <Link
                    key={pokemon.id}
                    to={`/pokemon/${pokemon.name}`}
                    className="border rounded p-4 flex flex-col items-center hover:shadow-lg transition"
                >
                    <h2 className="text-xl font-bold mb-2 uppercase">{pokemon.name}</h2>
                    <img
                    src={pokemon.sprites.other["official-artwork"].front_default}
                    width={250}
                    alt={pokemon.name}
                    className="border-2xl border-black"
                    />
                    <p className="mt-2">
                    Type:{" "}
                    {pokemon.types.map((t) => t.type.name).join(", ")}
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
