module.exports = {
	db: {
		url : process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/lol_status'
	},
	mailer: {
		auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASSWORD
		}
	}
};
