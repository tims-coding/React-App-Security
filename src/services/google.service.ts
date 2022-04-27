export class GoogleService {
	public username: string;

	public addEvent(category: string, action: string, label: string = "N/A", code: number = 0): void {
		(window as any).gtag('event', 'screen_view', {
			'app_name': 'Purchase Order Management UI',
			'screen_name': this.username
		});
		(window as any).gtag('event', action, {
			'event_category': category,
			'event_label': label,
			'value': code
		});
	}

	public addEventError(action: string, label: string): void {
		(window as any).gtag('event', 'screen_view', {
			'app_name': 'Purchase Order Management UI',
			'screen_name': this.username
		});
		(window as any).gtag('event', action, {
			'event_category': "Error",
			'event_label': label,
			'value': 99
		});
	}
}