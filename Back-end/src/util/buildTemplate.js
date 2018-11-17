import xlsx from 'xlsx';
const META = 'LOV';

const getMetadata = async ({ columns }, sheet) => {
  const metadata = xlsx.utils.sheet_to_json(sheet);
  const meta = Object.keys(metadata[0]);

  meta.forEach(col => {
    if (col.startsWith("__EMPTY")) {
      const index = parseInt(col.slice(8) || "0");
      const value = metadata[0][col].slice(10,-1);
      columns[index].required = (value === 'true');
    }
  });


  metadata.slice(1).forEach(row => {
    const keys = Object.keys(row);
    keys.forEach(col => {
      const index = meta.indexOf(col);
      if (!columns[index].options) {
        columns[index].options = [];
      }
      columns[index].options.push(row[col]);
    })
  });
};

const getColumns = async sheet => {
  const data = xlsx.utils.sheet_to_json(sheet)[1];
  const cols = Object.keys(data);
  const title = cols[0].replace(/\r\n/g, " ");

  return {
    name: title.slice(0, -1),
    columns: cols.map(col => ({
      name: data[col]
    }))
  }
};

export const buildTemplate = async (req, res, next) => {
  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const sheet = workbook.SheetNames[0];
  const data = await getColumns(workbook.Sheets[sheet]);
  await getMetadata(data, workbook.Sheets[META]);
  
  req.file = { filename: req.file.originalname, ...data };
  next();
}