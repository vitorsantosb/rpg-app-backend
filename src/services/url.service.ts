export default function GetApiUrl(): string{
	return `${process.env.WEB_URL}` || `http://localhost:${process.env.PORT}`;
}
