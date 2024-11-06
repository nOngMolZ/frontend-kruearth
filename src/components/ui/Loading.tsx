import { CgSpinner } from "react-icons/cg";

export default function Loading({ className }: { className?: string }) {
	return (
		<div
			className={`flex flex-col items-center justify-center gap-4 ${className}`}
		>
			<CgSpinner className="text-9xl text-accent animate-spin" />
			<h2>กำลังโหลด...</h2>
		</div>
	);
}
