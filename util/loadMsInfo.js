module.exports = {
	name: 'loadMsInfo',
	execute(serverDoc, id, client){
		let userMS;
		let filteredArr = serverDoc.ms.filter(user => user.userID === id);
		if(filteredArr.length > 1){
			return undefined;
		} else if(filteredArr.length === 0){
			console.log('setting...');
			const newMS = {
				userID: id,
				atoms: 0,
				items: [],
				powerUps: [],
				singularity: {
					type: 'black',
					size: 10,
					ferocity: 0
				}
			};

			serverDoc.ms.push(newMS);
  
			serverDoc.save(client.utils.get('saveCallback'));
			userMS = newMS;
		} else {
			userMS = filteredArr[0];
		}
		

		return userMS;
	}
}