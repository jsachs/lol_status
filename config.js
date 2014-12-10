module.exports = {
	db: {
		url : process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/lol_status'
	},
	mailer: {
		auth: {
				user: process.env.MANDRILL_USERNAME,
				pass: process.env.MANDRILL_APIKEY
		}
	}
};
