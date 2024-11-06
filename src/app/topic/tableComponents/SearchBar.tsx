import { Input } from "@/components/ui/input";

const SearchBar = ({
	searchTerm,
	setSearchTerm,
}: {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
}) => {
	return (
		<Input
			className="w-64"
			placeholder="ค้นหา"
			value={searchTerm}
			onChange={(e) => setSearchTerm(e.target.value)}
		/>
	);
};

export default SearchBar;
