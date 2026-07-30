import "./Searchbar.css";

interface Props {
    search: string;
    setSearch: (value: string) => void;
}

export default function Searchbar({ search , setSearch}: Props){
    return (
        <div className="search-bar-wrapper">
            <i className="fa-solid fa-magnifying-glass search-icon"></i>
            <input 
                className= "search-bar"
                type="text"
                placeholder="Search pods..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    );
}