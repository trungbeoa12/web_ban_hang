module.exports = (query) => {
    let objectSearch = {
        keyword: "",
        regex: null
    };

    if (query.keyword) {
        const keyword = query.keyword.trim();

        objectSearch.keyword = keyword;

        // escape regex để tránh lỗi ký tự đặc biệt
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        objectSearch.regex = new RegExp(escapedKeyword, "i");
    }

    return objectSearch;
};