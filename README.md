# Chin的個人網站

繁體中文個人頁面，作為「Web 基本原理與技術」課堂作業的 AI 協作實作。帳號：[`Chinnn0`](https://github.com/Chinnn0)。作品卡片皆為本次作業的練習示例，沒有宣稱取得課程認證或具有未經確認的經歷。

## 檔案

- `index.html`：HTML5 語意區塊與內容。
- `assets/style.css`：Grid、Flexbox、media query、鍵盤焦點樣式與減少動態效果設定。
- `assets/app.js`：jQuery 事件與 Ajax 資料讀取。
- `data/projects.json`：三個作業實作示例的資料。
- `vendor/jquery.min.js`：官方 jQuery 3.7.1 完整版，包含 Ajax。
- `vendor/LICENSE-jQuery.txt`：jQuery MIT 授權，保留官方標頭與授權文件。
- `.nojekyll`：以原始靜態檔案發布。

## 本機開啟

在此資料夾執行 `python -m http.server 8765`，再開啟 `http://localhost:8765`。請透過 HTTP 或 HTTPS 存取；直接雙擊 HTML 使用 `file://` 時，瀏覽器可能限制 Ajax 讀取 JSON。

不需 npm 安裝、不需編譯。所有執行必要檔案都在本資料夾內，jQuery 不依賴外部 CDN。

## GitHub Pages 發布

1. 將本資料夾中的檔案上傳至帳號擁有的儲存庫根目錄。
2. 若建立個人首頁儲存庫，名稱應為 `Chinnn0.github.io`。
3. 在儲存庫 Settings → Pages 選擇從分支發布，來源使用實際存放網站的分支與根目錄。
4. 等待 GitHub 完成部署，開啟 Pages 設定中顯示的網址並驗證作品卡片與互動。

以上為發布流程說明，是否已發布請以 GitHub Pages 的實際部署結果為準。

## 功能與驗證方式

1. 開啟首頁：作品區載入三張卡片，狀態列顯示「顯示 3 / 3 件作品 · JSON 資料已載入」。
2. 選擇「資料互動」：只保留一張 JSON / Ajax / jQuery 卡片。
3. 在搜尋框輸入 `Git`：顯示包含 Git 字樣的卡片；搜尋與分類條件會同時生效。
4. 輸入不匹配文字：顯示空結果狀態；按「清除篩選」恢復三張卡片。
5. 按「查看實作說明」：展開該卡片的內容，按鈕文字變成「收合實作說明」，`aria-expanded` 同步改變。
6. 按「重新載入資料」：重新發出 Ajax GET 請求，頁面不重新整理。
7. 若資料檔案讀取失敗：顯示錯誤與「再試一次」。修正資料路徑或網路後可重試。
8. 以窄螢幕開啟：作品改成單欄，導覽與搜尋保持可操作。

JSON 僅接受已知類別、唯一安全 ID 與文字陣列。顯示資料時以 jQuery `.text()` 建立文字節點，不把 JSON 字串當成 HTML 插入。

## AI 協作說明

本網站由 AI 協助規劃結構、撰寫 HTML/CSS/JavaScript 與整理技術說明。使用者需閱讀並理解程式，核對個人資料，依實際學習情況完成心得。網站示例與功能驗證不能等同於 freeCodeCamp 課程認證或證書。

## 第三方來源

- jQuery 完整版：[官方下載檔案](https://code.jquery.com/jquery-3.7.1.min.js)
- jQuery 授權：[官方授權說明](https://jquery.com/license/)
- jQuery 3.7.1 MIT 授權原文：[官方儲存庫](https://github.com/jquery/jquery/blob/3.7.1/LICENSE.txt)

網站版面、CSS 示意圖與 favicon 為此次作業製作。沒有表單、分析追蹤程式或蒐集訪客資料的功能。
