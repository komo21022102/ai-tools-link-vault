# Link Vault

一個用來收藏資訊連結的單頁工具網站，可依時間排序與分類管理連結。

## Features

- 新增、編輯、刪除連結
- 依「AI資訊、美食、生活、學習」等分類整理
- 最新優先 / 最舊優先時間排序
- 搜尋標題、網址、分類與備註
- 自動縮圖預覽，並支援手動填入縮圖網址
- 分類新增與管理
- JSON 匯出 / 匯入
- 資料儲存在瀏覽器 localStorage
- 可透過 Google Apps Script 即時同步到 Google Sheets

## Local Preview

直接打開 `index.html`，或用本機伺服器預覽：

```bash
python3 -m http.server 8765
```

然後開啟 `http://localhost:8765/`。

## Google Sheets Sync

目標 Google Sheet：

https://docs.google.com/spreadsheets/d/1robxjndv0LbaLMc2-OPVhkSFmr9tY3yLkfYHoKNJP6g/edit

設定一次之後，網站新增 / 編輯 / 刪除連結就會同步寫進 Google Sheet，不需要每次 push GitHub。

1. 打開 [Google Apps Script](https://script.google.com/)。
2. 建立新專案。
3. 把 `apps-script/Code.gs` 的內容貼到 Apps Script 編輯器。
4. 點選「部署」→「新增部署作業」。
5. 類型選「網頁應用程式」。
6. 「執行身分」選「我」。
7. 「誰可以存取」選「任何人」。
8. 完成授權後，複製 Web App URL。
9. 回到 Link Vault 網站，把 Web App URL 貼到「Google Sheet 同步」欄位並按「儲存」。

表格欄位會自動整理為：

`ID`, `Created At`, `Updated At`, `Title`, `URL`, `Category`, `Note`, `Thumbnail`, `Host`
