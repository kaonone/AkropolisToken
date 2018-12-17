module.exports = async function (token, account, value) {
	let balance = await token.balanceOf(account);
	try {
		assert(balance.eq(value));
	}
	catch(e) {
		throw new Error("Balance was " + balance + ", expected " + value);
	}
}