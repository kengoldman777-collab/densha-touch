# でんしゃタッチ
スマホの画面をタッチすると、近い線路から電車が出発する幼児向けゲーム。

## 遊ぶ
https://kengoldman777-collab.github.io/densha-touch/

まち・たんぼ・うみ・ゆきやまを30秒ごとに循環。電車が近づくと踏切が閉まり、車が待ちます。4種類の電車とおまかせ選択、音ON/OFF、一時停止に対応。

## 開発
- `npm start` → http://localhost:4173
- `npm test` → 経路・ステージ・踏切・車・連打上限の自動検証
- 配信ファイル: docs/（GitHub Pages main /docs）
- 仕様: notes/requirements.md
- 画像: docs/assets/worlds.png, docs/assets/trains.png（内蔵image_genによる生成イラスト。公式素材ではありません）
- 走行中の先頭車と選択ボタンに生成車両画像、背景に生成風景画像を使用。線路・車・後続車両はCanvas描画。

## 検証
Edgeヘッドレスで360/390px縦、844px横、1280pxの画面を確認。タッチ・一時停止・横スクロールなし・JSエラーなし。iPhone/Android実機と音の聞こえ方は未確認。Codex実装・自己検証のみで、独立レビューは未実施。
