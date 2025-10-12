import { Button } from "@/components/ui/button";

const NotificationFilters = ({ currentFilter, onFilterChange }) => {
	const filterOptions = [
		{ label: "All", value: "all" },
		{ label: "Unread", value: "unread" },
		{ label: "Likes", value: "like" },
		{ label: "Comments", value: "comment" },
		{ label: "Follows", value: "follow" },
		{ label: "Shares", value: "share" },
	];

	return (
		<div className='max-w-4xl mx-auto px-4'>
			<div className='flex items-center gap-2 overflow-x-auto pb-2'>
				{filterOptions.map((item) => (
					<Button
						key={item.value}
						variant={currentFilter === item.value ? "default" : "outline"}
						size='sm'
						onClick={() => onFilterChange(item.value)}
						className='whitespace-nowrap'
					>
						{item.label}
					</Button>
				))}
			</div>
		</div>
	);
};

export default NotificationFilters;
