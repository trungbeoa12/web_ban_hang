// Change status

const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      // console.log(statusCurrent);
      // console.log(id);
      // console.log(statusChange);

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      // console.log(action);
      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });

}

// End Change status

// Change multi status
const formChangeMulti = document.querySelector("#form-change-multi");
if (formChangeMulti) {
  const inputIds = formChangeMulti.querySelector('input[name="ids"]');
  const checkAll = document.querySelector("#check-all");
  const checkItems = document.querySelectorAll(".check-item");

  const syncCheckAll = () => {
    if (!checkAll) return;
    if (checkItems.length === 0) {
      checkAll.checked = false;
      return;
    }
    const checkedCount = Array.from(checkItems).filter((x) => x.checked).length;
    checkAll.checked = checkedCount === checkItems.length;
  };

  if (checkAll) {
    checkAll.addEventListener("change", () => {
      const isChecked = checkAll.checked;
      checkItems.forEach((item) => {
        item.checked = isChecked;
      });
    });
  }

  checkItems.forEach((item) => {
    item.addEventListener("change", syncCheckAll);
  });

  const selectBulk = formChangeMulti.querySelector("#select-bulk-action");
  const wrapPositionInput = formChangeMulti.querySelector("#wrap-position-input");
  const inputPosition = formChangeMulti.querySelector("#input-position");

  if (selectBulk && wrapPositionInput) {
    selectBulk.addEventListener("change", () => {
      wrapPositionInput.style.display = selectBulk.value === "change-position" ? "block" : "none";
    });
  }

  formChangeMulti.addEventListener("submit", (e) => {
    const ids = Array.from(checkItems)
      .filter((x) => x.checked)
      .map((x) => x.value);

    if (ids.length === 0) {
      e.preventDefault();
      return;
    }

    if (inputIds) {
      inputIds.value = ids.join(",");
    }

    const type = selectBulk ? selectBulk.value : "";
    if (type === "delete") {
      e.preventDefault();
      if (!confirm("Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?")) return;
      formChangeMulti.submit();
    }
    if (type === "change-position") {
      const pos = inputPosition ? inputPosition.value.trim() : "";
      if (pos === "") {
        e.preventDefault();
        alert("Vui lòng nhập vị trí.");
        return;
      }
    }
  });
}
// End Change multi status

// Delete Item

const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");
  buttonDelete.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const isConfirm = confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");

      if (isConfirm) {
        const id = button.getAttribute("data-id");
        formDeleteItem.action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.submit();
      }
    });
  });
}

// End Delete Item

// Restore Item (trang thùng rác)
const buttonsRestore = document.querySelectorAll("[button-restore]");
if (buttonsRestore.length > 0) {
  const formRestoreItem = document.querySelector("#form-restore-item");
  const path = formRestoreItem.getAttribute("data-path");
  buttonsRestore.forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const isConfirm = confirm("Bạn có chắc chắn muốn khôi phục sản phẩm này?");

      if (isConfirm) {
        const id = button.getAttribute("data-id");
        formRestoreItem.action = `${path}/${id}?_method=PATCH`;
        formRestoreItem.submit();
      }
    });
  });
}
// End Restore Item

// Preview ảnh trước khi upload (trang tạo sản phẩm)
const inputThumbnail = document.querySelector("#thumbnail");
const imgPreview = document.querySelector("#preview-thumbnail");
const btnClearThumbnail = document.querySelector("#clear-thumbnail");
const formCreateProduct = document.querySelector("form[action$='/products/create']");

if (inputThumbnail && imgPreview) {
  inputThumbnail.addEventListener("change", () => {
    const [file] = inputThumbnail.files;
    if (file) {
      imgPreview.src = URL.createObjectURL(file);
      imgPreview.style.display = "block";
      if (btnClearThumbnail) btnClearThumbnail.style.display = "inline-block";
    } else {
      imgPreview.src = "";
      imgPreview.style.display = "none";
      if (btnClearThumbnail) btnClearThumbnail.style.display = "none";
    }
  });
}

if (btnClearThumbnail && inputThumbnail && imgPreview) {
  btnClearThumbnail.addEventListener("click", () => {
    inputThumbnail.value = "";
    imgPreview.src = "";
    imgPreview.style.display = "none";
    btnClearThumbnail.style.display = "none";
  });
}

// Validate form tạo sản phẩm (frontend)
if (formCreateProduct) {
  formCreateProduct.addEventListener("submit", (e) => {
    const titleInput = document.querySelector("#title");
    const priceInput = document.querySelector("#price");
    const stockInput = document.querySelector("#stock");
    const statusSelect = formCreateProduct.querySelector("select[name='status']");

    const title = titleInput ? titleInput.value.trim() : "";
    const priceVal = priceInput ? priceInput.value.trim() : "";
    const stockVal = stockInput ? stockInput.value.trim() : "";

    const errors = [];

    if (!title || title.length < 3) {
      errors.push("Tiêu đề phải có ít nhất 3 ký tự.");
    }

    const priceNumber = Number(priceVal);
    if (!priceVal || isNaN(priceNumber) || priceNumber <= 0) {
      errors.push("Giá phải là số lớn hơn 0.");
    }

    if (stockVal) {
      const stockNumber = Number(stockVal);
      if (isNaN(stockNumber) || stockNumber < 0) {
        errors.push("Số lượng phải là số không âm.");
      }
    }

    if (!statusSelect || !statusSelect.value) {
      errors.push("Vui lòng chọn trạng thái.");
    }

    const file = inputThumbnail && inputThumbnail.files ? inputThumbnail.files[0] : null;
    if (file) {
      if (!file.type.startsWith("image/")) {
        errors.push("File ảnh không hợp lệ.");
      }
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        errors.push("Kích thước ảnh tối đa 2MB.");
      }
    }

    if (errors.length > 0) {
      e.preventDefault();
      alert(errors.join("\n"));
    }
  });
}