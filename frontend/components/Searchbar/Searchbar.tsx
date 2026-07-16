import "./Searchbar.css";

interface Props {
    search: string;
    setSearch: (value: string) => void;
}

export default function Searchbar({ search , setSearch}: Props){
    return (
        <input 
        className= "search-bar"
        type="text"
        placeholder="Seaarch pods...."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
    );
}