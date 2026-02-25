module.exports.index = (req, res) => {
    res.render("client/pages/products/index.pug", {
        pageTitle: "Danh sach san pham"
    });
}