import xlsx from 'xlsx';

const extractRows = async sheet => {
  const src = xlsx.utils.sheet_to_json(sheet);
  const cols = Object.keys(src[1]);
  return src.slice(2).map(row => {
    const keys = Object.keys(row);
    const res = {};
    keys.forEach(key =>
      res[cols.indexOf(key)] = row[key]
    );
    return res;
  });
}

export const buildSubmit = async (req, res, next) => {
  const { file } = req;
  if (!file) { 
    res.status(401).json({ status: 'error', err: 'Missing file' });
    return
  }

  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const sheet = workbook.SheetNames[0];

  const data = await extractRows(workbook.Sheets[sheet]);
  req.upload = data;
  next();
}