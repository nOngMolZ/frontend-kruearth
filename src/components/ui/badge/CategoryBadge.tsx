"use client";

import React from "react";

interface CategoryBadgeProps {
	category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => (
	<span
		className={`px-2 py-1 rounded-full text-xs font-semibold ${
			category === "วิชาการ"
				? "bg-green-100 text-green-800"
				: "bg-primary text-secondary-hover"
		}`}
	>
		{category}
	</span>
);

export default CategoryBadge;
