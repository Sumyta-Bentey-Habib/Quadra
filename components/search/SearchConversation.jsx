import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";

const SearchConversation = ({ onSearch }) => {
	const [searchTerm, setSearchTerm] = useState("");
	const handleSearch = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		onSearch?.(value); // Pass value to parent ConversationList
	};
	return (
		<div className='relative flex-1'>
			<SearchIcon className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
			<Input
				value={searchTerm}
				onChange={handleSearch}
				placeholder='Search conversations...'
				className='pl-8'
			/>
		</div>
	);
};

export default SearchConversation;
