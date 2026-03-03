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
            formChangeStatus.action=action;

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

  formChangeMulti.addEventListener("submit", (e) => {
    const ids = Array.from(checkItems)
      .filter((x) => x.checked)
      .map((x) => x.value);

    if (inputIds) {
      inputIds.value = ids.join(",");
    }

    if (ids.length === 0) {
      e.preventDefault();
    }
  });
}
// End Change multi status