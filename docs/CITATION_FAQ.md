# 引用与参考文献 FAQ

## 为什么把 `citep` 改成 `cite` 之后，页面里仍然出现类似：

`cultural symbols [dietzCompleteLanguageFlowers2022, JiaJunZhiWuYiXiangYanJiu2011]; sec`

这是因为 **NotionNext 当前使用的是 Notion 内容渲染（`react-notion-x`）**，并不会执行 Pandoc/Quarto 的 citation 处理流程（如 `--citeproc`、crossref、CSL 参考文献生成）。

换句话说：

- 文中的 citation key 会以普通文本形式显示；
- `@sec` 这类 cross-reference 标签也不会自动解析；
- 页面不会自动生成 reference list。

## 为什么没有 reference list（参考文献列表）

同样原因：NotionNext 不会在构建时运行 citeproc，所以不会自动插入“References”。

## 如果你需要正确渲染引用，应该怎么做？

推荐两种方式：

1. **在外部先完成学术排版，再发布**
   - 使用 Pandoc / Quarto 在本地构建（启用 `citeproc` + bibliography）；
   - 生成最终 HTML/Markdown 后再导入或贴回 Notion。

2. **在 Notion 里手动维护参考文献区块**
   - 在正文末尾（附录前）手动建立 `References` 标题与条目；
   - 文内引用也手工写成你希望的格式（例如 `(Dietz, 2022)`）。

## 关于“参考文献应该在附录前”

在当前 NotionNext 渲染链路里，区块顺序就是 Notion 页面本身的顺序。

因此如果要保证“References 在 Appendix 前”，请直接在 Notion 页面中把 `References` 区块放在 `Appendix` 前面。
