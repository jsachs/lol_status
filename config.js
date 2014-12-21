module.exports = {
	db: {
		url : process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/lol_status'
	},
	mail: {
		auth: {
				user: process.env.SENDGRID_USERNAME,
				pass: process.env.SENDGRID_PASSWORD
		}
	}
};
