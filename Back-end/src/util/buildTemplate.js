import xlsx from 'xlsx';
const META = 'LOV';

const getMetadata = async ({ columns }, sheet) => {
  const metadata = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  metadata[1].forEach((col, index) => {
    const value = col.slice(10,-1);
    columns[index].required = (value === 'true');
    columns[index].options = "";
    columns[index].type = "text";
  });
  
  metadata.slice(2).forEach(row => {
    row.forEach((col, index) => {

      if (columns[index].type !== "select") {
        columns[index].type = "select";
        columns[index].options = [];
      }
      columns[index].options.push(col);
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
  const { file } = req;
  if (!file) {
    res.status(401).json({ status: 'error', err: 'Missing file' });
    return
  }

  if(!/.xlsx$/.exec(file.originalname)){
    res.status(415).json({ status: 'error', err: 'Template extension format not supported, please use xlsx format files' });
    return
  }

  const workbook = xlsx.read(file.buffer, { type: 'buffer' });
  const sheet = workbook.SheetNames[0];
  const data = await getColumns(workbook.Sheets[sheet]);
  await getMetadata(data, workbook.Sheets[META]);
  
  req.file = { filename: file.originalname, ...data };
  next();
}