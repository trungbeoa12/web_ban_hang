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

        window.location.href = url.href;
    });
}
// ================= END FORM SEARCH =================