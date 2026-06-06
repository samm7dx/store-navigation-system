exports.verifyAdmin = (req, res) => {
    const { code } = req.body;
    const expectedCode = process.env.ADMIN_CODE || 'BCS401';
    if (code === expectedCode) {
        return res.json({ success: true, message: 'Authenticated successfully' });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid Subject Code' });
    }
};
