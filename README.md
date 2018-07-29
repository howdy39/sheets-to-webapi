## ローカル実行
```
functions-emulator start
functions-emulator deploy api --trigger-http && curl http://localhost:8010/first-frontend-development/us-central1/api?id=1u7TFoWtbeTS0PKKWKKXQ0RfdIgjbuzuQd53hCqOEuao&range=user!B3:E100
functions-emulator stop
```

### ログ表示
```
functions-emulator logs read --limit=1000
```

## デプロイ
```
gcloud beta functions deploy api --region=asia-northeast1 --runtime nodejs8 --memory=128MB --trigger-http --project=sheetstowebapi
```


## Memo

### functions-emulator
[Cloud Functions Node.js Emulator  |  Cloud Functions Documentation  |  Google Cloud](https://cloud.google.com/functions/docs/emulator)
