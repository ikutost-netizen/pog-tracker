# POG Tracker

仲間5人のPOGポイント推移を共有するWebアプリ。  
データはすべてリポジトリ内のJSONファイルで管理。閲覧のみ公開・更新はClaude Code経由。

## 毎週の更新手順

1. **スクリーンショットを用意する**  
   集計サイトのスクリーンショットを撮り、ファイルとして保存しておく。

2. **Claude Codeに依頼する**  
   以下のように依頼するだけでOK:

   ```
   このスクリーンショットを見て、5人のポイントを読み取って
   pog-trackerを更新してください。
   日付は YYYY-MM-DD、ラベルは「第N週」です。
   ```

3. **Claude Codeが行うこと**  
   - スクリーンショットを `public/screenshots/YYYY-MM-DD.jpg` に圧縮保存  
   - `data/history.json` に新しいエントリを追加（ポイント＋競馬実況風コメント生成）  
   - 内容を見せてくれるので確認する

4. **確認してpushする**  
   問題なければ:
   ```
   git add .
   git commit -m "第N週更新 YYYY-MM-DD"
   git push
   ```

5. **Vercelが自動でデプロイ**  
   pushすると数分でサイトに反映される。

## データ形式

### data/members.json

```json
[
  { "id": "kato", "name": "加藤優祈", "color": "#FF6B6B", "icon": "/members/kato.jpeg" }
]
```

### data/history.json

```json
[
  {
    "date": "2026-07-05",
    "label": "第8週",
    "screenshot": "/screenshots/2026-07-05.jpg",
    "commentary": "競馬実況風のひとことコメント",
    "points": {
      "kato": 3850,
      "hiraoka": 3420,
      "yori": 2980,
      "aoki": 1150,
      "hirose": 2210
    }
  }
]
```

- エントリは日付昇順で並べる
- `screenshot` は画像なし週は `null`
- `commentary` はClaude Codeが自動生成（手で書いてもOK）

## 画像の圧縮について

スクリーンショットは `public/screenshots/` に保存する前に  
**長辺1200px・JPEG品質75** に圧縮すること（リポジトリ肥大化防止）。  
Claude Codeに依頼すれば自動で処理される。

## ローカル確認

```bash
npm run dev
# → http://localhost:3000
```

## Vercelデプロイ

- Hobby プランの Static Export として動作  
- `next.config.ts` の `output: "export"` で静的HTMLを生成  
- Supabase・環境変数・外部APIは一切不使用
