import { timeFormat } from "@/lib/format";

export default function GameNav({
	time,
	score,
}: {
	time: number;
	score: number;
}) {
	return (
		<div className="fixed inset-0 z-10 h-12">
			<nav className="flex justify-end items-center pr-4 sm:pr-10 gap-4 sm:gap-8 bg-white shadow-md h-14">
				<h3 className="text-green-600">คะแนน:{score}</h3>
				<h3 className="text-red-500">เหลือเวลา {timeFormat(time)} นาที</h3>
			</nav>
		</div>
	);
}
