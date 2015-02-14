var mongoProdUri = process.env.MONGOLAB_URI || 'localhost:27017/pagelogger_prod';
var clientString = process.env.APPROVEDCLIENTS || "www.marcusoft.net, localhost";
var approvedClients = clientString.split(",");

var config = {
	local: {
		mode: 'local',
		port: 3000,
		mongoUrl: 'localhost:27017/pagelogger_dev',
		clients : approvedClients
	},
	staging: {
		mode: 'staging',
		port: 4000,
		mongoUrl: 'localhost:27017/pagelogger_test',
		clients : approvedClients
	},
	prod: {
		mode: 'prod',
		port: process.env.PORT || 5000,
		mongoUrl: mongoProdUri,
		clients : approvedClients
	}
};

module.exports = function (mode) {
	return config[mode || process.argv[2] || 'local'] || config.local;
};