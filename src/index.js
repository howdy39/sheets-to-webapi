const HttpStatus = require('http-status-codes');
const { SheetsService } = require('./SheetsService');

exports.api = (req, res) => {
  const sheetsService = new SheetsService();

  const id = req.query.id;
  const range = req.query.range;
  const orient = req.query.orient || 'vertical';

  // 入力チェック
  const errors = [];
  const idNotFound = id === undefined || id.length < 1;
  const rangeNotFound = range === undefined || range.length < 1;
  if (idNotFound || rangeNotFound) {
    errors.push(
      'idとrangeは必須です、idとrangeをqueryに入れてください。例）?id=スプレッドシートのid&range=!sheetName!A1:E10'
    );
  }
  if (errors.length > 0) {
    errorResponse(res, HttpStatus.BAD_REQUEST, errors);
    return;
  }

  // シートを読み込み、JSONで返却
  sheetsService
    .readValues(id, range, orient)
    .then(response => {
      successResponse(res, response);
    })
    .catch(errors => {
      errorResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, errors);
    });
};

function successResponse(res, obj) {
  res.set('Content-Type', 'application/json');
  res.status(HttpStatus.OK).send(jsonStringify(obj));
}

function errorResponse(res, code, errors) {
  const obj = {
    errors,
  };
  res.set('Content-Type', 'application/json');
  res.status(code).send(jsonStringify(obj));
}

function jsonStringify(obj) {
  return JSON.stringify(obj, null, '  '.length);
}
