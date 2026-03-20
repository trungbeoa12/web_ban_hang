const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");

if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      const statusChange = statusCurrent === "active" ? "inactive" : "active";

      formChangeStatus.action = `${path}/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.submit();
    });
  });
}

const buttonDelete = document.querySelectorAll("[button-delete]");

if (buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");

  buttonDelete.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

      const id = button.getAttribute("data-id");
      formDeleteItem.action = `${path}/${id}?_method=DELETE`;
      formDeleteItem.submit();
    });
  });
}

const formProductCategory = document.querySelector("#form-product-category");

if (formProductCategory) {
  formProductCategory.addEventListener("submit", (e) => {
    const titleInput = formProductCategory.querySelector("#title");
    const positionInput = formProductCategory.querySelector("#position");
    const statusSelect = formProductCategory.querySelector("select[name='status']");

    const title = titleInput ? titleInput.value.trim() : "";
    const positionValue = positionInput ? positionInput.value.trim() : "";
    const errors = [];

    if (!title || title.length < 3) {
      errors.push("Tên danh mục phải có ít nhất 3 ký tự.");
    }

    if (positionValue) {
      const positionNumber = Number(positionValue);
      if (Number.isNaN(positionNumber) || positionNumber < 0) {
        errors.push("Vị trí phải là số không âm.");
      }
    }

    if (!statusSelect || !statusSelect.value) {
      errors.push("Vui lòng chọn trạng thái.");
    }

    if (errors.length > 0) {
      e.preventDefault();
      alert(errors.join("\n"));
    }
  });
}
