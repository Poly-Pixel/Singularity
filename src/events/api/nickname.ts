import Singularity from "../../interfaces/singularity";
import AsyncApiEvent from "../../interfaces/api/AsyncApiEvent";

export default (
	client: Singularity,
	ev: AsyncApiEvent,
	userID: string,
	guildID: string,
	nickname: string
) => {
	ev.code = new Promise((resolve) => {
		client.guilds.cache
			.get(guildID)
			?.members.fetch(userID)
			.then((member) => {
				if (!member) return resolve(2);
				member.guild.me?.setNickname(nickname, `Web API - User ${userID}`);
				return resolve(0);
			});
	});
};