import { useEffect, useState } from "react";
import { getTopScore } from "@/lib/scoreApi";
import { TopScore } from "@/types/score";

export default function Leaderboard({
	subtopicId,
	reload,
}: {
	subtopicId: string;
	reload: boolean;
}) {
	const [leaderboard, setLeaderboard] = useState<TopScore[]>([]);

	useEffect(() => {
		getLeaderboard(subtopicId);
	}, [subtopicId, reload]);

	async function getLeaderboard(id: string) {
		const scoreData = await getTopScore(id);
		setLeaderboard(scoreData ?? []);
	}

	return (
		<div className="flex flex-col gap-6 w-full sm:w-11/12 lg:w-1/3 tw-box h-[calc(100vh-120px)]">
			<h1 className="text-center">คะแนนสูงสุด 10 อันดับ</h1>
			<table className="w-full text-center">
				<thead>
					<tr className="h-12">
						<th className="w-1/5">อันดับ</th>
						<th className="w-3/5">ชื่อ</th>
						<th className="w-1/5">คะแนน</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-primary-hover">
					{leaderboard.map((item, index) => (
						<tr key={index} className="h-10 hover:bg-primary">
							<td>{index + 1}</td>
							<td>{item.name}</td>
							<td>{item.score}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
