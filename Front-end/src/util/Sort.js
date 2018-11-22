const SORT = (a, b) => (a < b? -1: a > b? 1: 0);

export const sortByAscending = async (data, key) => {
  data.sort((a, b) => {
    const A = a[key] || "";
    const B = b[key] || "";
    return SORT(A, B);
  })
};

export const sortByDescending = async (data, key) => {
  data.sort((a, b) => {
    const A = a[key] || "";
    const B = b[key] || "";
    return SORT(B, A);
  })
};