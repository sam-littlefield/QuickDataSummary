export const idFriendly = (str) => {
	return str.split(' ').join('-').toLowerCase();
}

export const deepClone = (obj) => {
	return JSON.parse(JSON.stringify(obj))
}
