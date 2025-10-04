import React from "react";
import RightSidebarComponets from "../right-sidebar-components/RightSidebarComponets";

const RightSidebar = () => {
	return (
		<section className='sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 max-xl:hidden'>
			{/* right ssidebar */}
			<div>
				<RightSidebarComponets />
			</div>
		</section>
	);
};

export default RightSidebar;
