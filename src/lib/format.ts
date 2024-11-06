export function timeFormat(ms: number): string {
	const minutes: number = Math.floor(ms / 60000);
	const seconds: number = Math.floor((ms % 60000) / 1000);
	return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export function thDateTime(createOn: string): string {
	const isoDate = new Date(createOn);
	const thDate = isoDate.toLocaleString("th-TH", { timeZone: "+07" });
	return thDate;
}

export function numberWithCommas(number: number): string {
	if (number == null) {
		return "";
	}
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
