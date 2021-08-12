module.exports = (client, serverDoc, id) => {
	return new Promise((resolve, reject) => {
		client.userModel.findOne({userID: id, guildID: serverDoc.guildID})
		.then(user => {
			if(!user){
				client.userModel.create({
					userID: id,
					guildID: serverDoc.guildID,
					protons: 0,
					electrons: 0,
					items: [],
					rareItems: [],
					powerUps: [],
					lifeExp: 0,
					darkMatter: 0,
					active: [],
					singularity: {
						type: 'Black',
						size: 10,
						ferocity: 0,
						prestige: 0
					}
				}).then(userDoc => {
					serverDoc.ms.push(userDoc._id);
					client.utils.serverQueue(client, serverDoc)
					.then(() => {
						resolve(userDoc)
					})
					.catch(err => {
						reject(err);
					})
				});
				
			} else {
				resolve(user);
			}
		});
	})
}