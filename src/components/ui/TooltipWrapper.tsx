import React, { ReactNode, useState, useEffect } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

interface TooltipWrapperProps {
	content: string;
	children: ReactNode;
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
	content,
	children,
}) => {
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		const checkIfDesktop = () => {
			setIsDesktop(window.innerWidth >= 1024); // ขนาด desktop ทั่วไปคือ 1024px
		};

		checkIfDesktop();
		window.addEventListener("resize", checkIfDesktop);

		return () => {
			window.removeEventListener("resize", checkIfDesktop);
		};
	}, []);

	return isDesktop ? (
		<Tippy
			content={content}
			placement="top"
			arrow={true}
			className="custom-tooltip"
		>
			<div style={{ display: "inline-block" }}>{children}</div>
		</Tippy>
	) : (
		<div style={{ display: "inline-block" }}>{children}</div>
	);
};

export default TooltipWrapper;
