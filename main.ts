import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import moment from 'moment';

interface ObsidianClockSettings {
	clockFormatting: string;
}

const DEFAULT_SETTINGS: ObsidianClockSettings = {
	clockFormatting: 'HH:mm',
};
export default class ObsidianClock extends Plugin {
	settings: ObsidianClockSettings
	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ObsidianClockSettingTab(this.app, this));
		const clock = this.addStatusBarItem();
		setInterval( () => this.updateTime(clock), 1000 );
	}
    updateTime(clock: HTMLElement) {
		let time = moment();
    	let formattedTime = time.format(this.settings.clockFormatting);
    	clock.setText(formattedTime);
	}
	onunload() {

	}
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
class ObsidianClockSettingTab extends PluginSettingTab {
	plugin: ObsidianClock;

	constructor(app: App, plugin: ObsidianClock) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Formatting')
			.setDesc('Formatting of the Clock (Example: HH:mm)')
			.addText(text => text
				.setPlaceholder('Enter formatting')
				.setValue(this.plugin.settings.clockFormatting)
				.onChange(async (value) => {
					this.plugin.settings.clockFormatting = value;
					await this.plugin.saveSettings();
				}));
	}
}
