import xlsx from 'xlsx';

const extractRows = async sheet => {
  const src = xlsx.utils.sheet_to_json(sheet, { header: 1, blankrows: false });
  const len = src[2].length;

  return src.slice(3).map(row => {
    const res = new Array(len - row.length);
    res.fill('');
    return row.concat(res);
  });
}

export const buildSubmit = async (req, res, next) => {
  const { file } = req;
  if (!file) { 
    res.status(401).json({ status: 'error', err: 'Missing file' });
    return
  }
  
  if(/.xlsx$/.exec(file.originalname)){
    res.status(415).json({ status: ERROR, err: `Template extension format not supported, please use xlsx format files` });
    return
  }

  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const sheet = workbook.SheetNames[0];

  const data = await extractRows(workbook.Sheets[sheet]);
  req.upload = data;
  next();
}