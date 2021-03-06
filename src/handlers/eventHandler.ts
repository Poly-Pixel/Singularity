import fs from "fs";

import apiBreadcrumb from "../util/apiBreadcrumb.js";
import clientBreadcrumb from "../util/clientBreadcrumb.js";

import type Singularity from "../interfaces/singularity.js";
import type APIClient from "../website/server.js";

export default (client: Singularity, api: APIClient) => {
	const load_dir = async (dir: string) => {
		const event_files = fs
			.readdirSync(`./build/events/${dir}`)
			.filter((file) => file.endsWith("js"));

		for (const file of event_files) {
			const event = (await import(`../events/${dir}/${file}`)).default;
			const event_name = file.split(".")[0];
			if (dir === "api") {
				api.on(event_name, event.bind(null, client));
				api.on(event_name, apiBreadcrumb.bind(null, event_name));
			} else if (dir === "client") {
				client.on(event_name, event.bind(null, client));
				client.on(event_name, clientBreadcrumb.bind(null, event_name));
			}
		}
	};

	["client", "api"].forEach((e) => load_dir(e));

	console.log("Event Handlers Ready");
};
