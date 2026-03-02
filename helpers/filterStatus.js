module.exports = (query) => {
    const currentStatus = query.status || "";

    let filterStatus = [
        { name: "Tất cả", status: "", class: "" },
        { name: "Hoạt động", status: "active", class: "" },
        { name: "Dừng hoạt động", status: "inactive", class: "" }
    ];

    const index = filterStatus.findIndex(item => item.status === currentStatus);

    if (index !== -1) {
        filterStatus[index].class = "active";
    }

    return filterStatus;
};