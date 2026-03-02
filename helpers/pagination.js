// helpers/pagination.js

module.exports = (query, totalItems, limitItems = 4) => {
  const pagination = {
    currentPage: 1,
    limitItems: limitItems,
    skip: 0,
    totalPage: 1,
    hasPrev: false,
    hasNext: false
  };

  // ===== Current Page =====
  const page = parseInt(query.page, 10);
  if (!Number.isNaN(page) && page > 0) {
    pagination.currentPage = page;
  }

  // ===== Total Page =====
  pagination.totalPage = Math.max(
    1,
    Math.ceil(totalItems / pagination.limitItems)
  );

  // ===== Fix overflow =====
  if (pagination.currentPage > pagination.totalPage) {
    pagination.currentPage = pagination.totalPage;
  }

  // ===== Skip =====
  pagination.skip =
    (pagination.currentPage - 1) * pagination.limitItems;

  // ===== Prev / Next =====
  pagination.hasPrev = pagination.currentPage > 1;
  pagination.hasNext = pagination.currentPage < pagination.totalPage;

  return pagination;
};