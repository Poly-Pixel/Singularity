module.exports = (serverDoc, id) => {
	return new Promise((resolve, reject) => {
		let filteredArr = serverDoc.ms.filter(user => user.userID === id);
		if(filteredArr.length > 1){
			//return 'err';
			reject('err');
		} else if(filteredArr.length === 0){
			console.log('mSetting...');
			const newMS = {
				userID: id,
				protons: 0,
				electrons: 0,
				items: [],
				powerUps: [],
				lifeExp: 0,
				darkMatter: 0,
				singularity: {
					type: 'black',
					size: 10,
					ferocity: 0
				}
			};

			serverDoc.ms.push(newMS);
  
			serverDoc.save().then(() => {
				resolve(newMS);
				console.log('fetched');
			});
			console.log('msSet');
			
		} else {
			resolve(filteredArr[0]);
			console.log('fetched');
		}
	});
}