const sendIndexHtml = (req, res) => {
	res.status(200).sendFile(
		'index.html', { root: './public' }
	);
}

module.exports = { sendIndexHtml }