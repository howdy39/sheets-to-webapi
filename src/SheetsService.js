const { google } = require('googleapis');
const sheets = google.sheets('v4');
const path = require('path');

class SheetsService {
  constructor() {
    // クライアントをロードする、Promiseが返却されるのでfulfilledでauthを格納
    this.loadedClient = google.auth
      .getClient({
        keyFile: path.join(__dirname, 'service_account.json'),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      })
      .then(response => {
        this.auth = response;
      });
  }

  async readValues(spreadsheetId, range, orient = 'vertical') {
    await this.loadedClient;

    const apiOptions = {
      auth: this.auth,
      spreadsheetId,
      range,
    };

    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.get(apiOptions, (err, res) => {
        if (err) {
          reject(err.errors.map(e => e.message));
          return;
        }

        let rows = res.data.values;

        // 2次元配列の転置
        if (orient === 'horizontal') {
          rows = transpose(rows);
        }

        // 2次元配列の値をヘッダー行をプロパティにしてJSON用Objectに変換
        const header = rows[0];
        const jsonObj = rows.slice(1, rows.length).map(row => {
          return row.reduce((accumulator, value, index) => {
            accumulator[header[index]] = value;
            return accumulator;
          }, {});
        });

        resolve(jsonObj);
      });
    });
  }
}

function transpose(a) {
  return Object.keys(a[0]).map(c => {
    return a.map(r => r[c]);
  });
}

module.exports.SheetsService = SheetsService;
