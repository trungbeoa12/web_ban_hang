// ================= BUTTON STATUS =================
const buttonsStatus = document.querySelectorAll("[button-status]");

if (buttonsStatus.length > 0) {
    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {

            const status = button.getAttribute("button-status");

            // luôn tạo URL mới (tránh bị giữ trạng thái cũ)
            const url = new URL(window.location.href);

            if (status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            url.searchParams.delete("page");

            window.location.href = url.href;
        });
    });
}
// ================= END BUTTON STATUS =================


// ================= FORM SEARCH =================
const formSearch = document.querySelector("#form-search");

if (formSearch) {
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();

        const keyword = e.target.elements.keyword.value.trim();

        const url = new URL(window.location.href);

        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }

        url.searchParams.delete("page");

        window.location.href = url.href;
    });
}
// ================= END FORM SEARCH =================


// ================= FORM SORT =================
const formSort = document.querySelector("#form-sort");

if (formSort) {
    formSort.addEventListener("submit", (e) => {
        e.preventDefault();

        const sort = e.target.elements.sort.value.trim();

        const url = new URL(window.location.href);

        if (sort) {
            url.searchParams.set("sort", sort);
        } else {
            url.searchParams.delete("sort");
        }

        url.searchParams.delete("page");

        window.location.href = url.href;
    });
}
// ================= END FORM SORT =================
