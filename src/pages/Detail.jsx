    import { useParams, Link } from "react-router-dom";
    import { useEffect, useState } from "react";

    export default function Detail() {
    const { name } = useParams(); // URL me jo name aayega
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadPokemon() {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            if (!res.ok) {
            setError(true);
            return;
            }
            const data = await res.json();
            setPokemon(data);
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
        }
        loadPokemon();
    }, [name]);

    if (loading) return <h2>Loading Pokémon...</h2>;
    if (error) return <h2>Pokémon not found </h2>;

    return (
        <div className="p-4 flex flex-col text-center justify-center items-center">
        <Link to="/" className="text-xl font-bold border-2 border-black px-2 rounded-xl hover:bg-amber-500 hover:text-red-600">
            Back
        </Link>

        <h1 className="uppercase font-bold text-yellow-500 text-5xl  ">{pokemon.name}</h1>

        <img
            src={pokemon.sprites.other["official-artwork"].front_default}
            width="250"
            alt={pokemon.name}
        />

        
        <p className="text-green-700">{pokemon.types.map((t) => t.type.name).join(", ")}</p>

        <h2>Abilities</h2>
        <p>{pokemon.abilities.map((a) => a.ability.name).join(", ")}</p>

        <h2>Stats</h2>
        <ul>
            {pokemon.stats.map((s) => (
            <li key={s.stat.name}>
                <strong>{s.stat.name}:</strong> {s.base_stat}
            </li>
            ))}
        </ul>

        <h2>Moves (first 10)</h2>
        <ul>
            {pokemon.moves.slice(0, 10).map((m) => (
            <li key={m.move.name}>{m.move.name}</li>
            ))}
        </ul>
        </div>
    );
    }
