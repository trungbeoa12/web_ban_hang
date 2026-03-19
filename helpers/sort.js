module.exports = (query) => {
  const sortOptions = [
    {
      value: "position-asc",
      label: "Vị trí tăng dần",
      sort: { position: 1, createdAt: -1 }
    },
    {
      value: "position-desc",
      label: "Vị trí giảm dần",
      sort: { position: -1, createdAt: -1 }
    },
    {
      value: "title-asc",
      label: "Tên A-Z",
      sort: { title: 1, createdAt: -1 }
    },
    {
      value: "title-desc",
      label: "Tên Z-A",
      sort: { title: -1, createdAt: -1 }
    },
    {
      value: "price-asc",
      label: "Giá tăng dần",
      sort: { price: 1, createdAt: -1 }
    },
    {
      value: "price-desc",
      label: "Giá giảm dần",
      sort: { price: -1, createdAt: -1 }
    },
    {
      value: "newest",
      label: "Mới nhất",
      sort: { createdAt: -1 }
    },
    {
      value: "oldest",
      label: "Cũ nhất",
      sort: { createdAt: 1 }
    }
  ];

  const defaultOption = sortOptions[0];
  const currentValue = (query.sort || "").trim();
  const currentOption =
    sortOptions.find((item) => item.value === currentValue) || defaultOption;

  return {
    currentValue: currentOption.value,
    currentLabel: currentOption.label,
    sort: currentOption.sort,
    options: sortOptions
  };
};
