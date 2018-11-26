import { COLORS, COLUMN_TYPES } from "../values";

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

export const validate = (data, { type, options, required }) => {
  if (!required && (data === '' || data === null)) return true;
  switch(type) {
    case COLUMN_TYPES[0]:
      return data.match(options)
    case COLUMN_TYPES[1]:
      return !isNaN(data) && data <= options[0] && data >= options[1]
    case COLUMN_TYPES[2]:
      return options.indexOf(data) > -1
    case COLUMN_TYPES[3]:
      return data === 'Yes' || data === 'No'
    default:
      return false
  }
}

export const chartify = async req => {
  const labels = [];
  const data = [];
  req.forEach(({ _id, count }) => {
    labels.push(_id);
    data.push(count);
  })

  return {
    labels,
    datasets: [{
      label: "Count", data, backgroundColor: COLORS
    }]
  }
}