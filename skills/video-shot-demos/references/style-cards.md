# 风格卡片（40 种 · 选型即查）

**方法论**：给内容找一个"世界观"——这段内容若是一件实物/一个场所，它是什么？整页按它的物理规律做（材质/排版/动效全服从）。卡片即起点，写完可对照样板页号做局部抽查（grep 定位后按行号读 ≤80 行，**勿通读**）。

**反模式（一票否决）**：默认科技暗色（黑底+霓虹+玻璃拟态）；emoji 当图标（换内联扁平 SVG，stroke 2–3 圆头，每页 4–10 枚）；全程居中对称（每页 ≥1 处非对称/超大字/出血）；静态元素（常驻元素也要有微动效）。

**字体公式**：展示拉丁字 + 中文字族 + 数据等宽（`tabular-nums`）。中文打底二选一：Noto Sans SC(400/700/900) / Noto Serif SC；大标题字距 +2~4px，英文小标 letter-spacing 3–8px 当装饰线。

**印刷风用硬偏移阴影** `box-shadow:8px 8px 0 rgba(0,0,0,.15)`；纸感必加材质（细点阵纸纹/锯齿边/咖啡渍）。

## 第一辑 `examples/glm-5.3-range-test/`（实测字体/配色）

| 风格 | 样板 | 字体（拉丁+中文+等宽） | 主色/材质 | 适合 |
|---|---|---|---|---|
| 复古报纸头条 | 0-1 | Playfair Display + Noto Serif SC + JetBrains Mono | 纸米 #efe8d5、墨 #2c2a26、章红 #b53929 | 震撼数字/事件宣告 |
| 圆润玩具开箱 | 0-2 | ZCOOL KuaiLe + Noto Sans SC | 糖果色渐变、大圆角 | 新概念科普 |
| 孟菲斯竞技场 | 0-3 | Archivo Black + Noto Sans SC 900 | 几何撞色点线面 | 对比/竞技/排名 |
| 拳击海报对决 | 0-4 | Bebas Neue + Noto Sans SC | 油墨拓印粗黑描边对角 | A vs B 悬念 |
| 剧院帷幕 | 0-5 | Cormorant Garamond + Noto Serif SC | 绒布红金流苏 | 标题卡/开场 |
| 极简讲义 | 1-1 | Noto Serif SC 为主 | 大留白细线框 | 抽象定义/推导 |
| 户外等高线地图 | 1-2 | ZCOOL KuaiLe | 米色地图纸等高线小旗 | 难度分层/路径 |
| 复古杂志榜单 | 1-3 | Bebas Neue + Noto Serif SC | 刊头米白深蓝 | 排行榜/成绩 |
| 浅色 SaaS 仪表盘 | 2-0 | Manrope + Noto Sans SC | 白卡片柔投影 | 规则/平台介绍 |
| 工程蓝图 | 2-1 | Space Grotesk + Noto Sans SC | 蓝底白线标注引线图框 | 架构/侦察 |
| 便签纸流程 | 2-2 | ZCOOL KuaiLe | 米黄便签胶带手写感 | 步骤流程 |
| 美式漫画 | 2-3 | Bangers + ZCOOL KuaiLe | 粗描边网点 BAM 拟声框 | 冲突/爆点 |
| 便利店 POS | 2-4 | Bebas Neue + Noto Sans SC | 小票锯齿边条码 | 交易/账目 |
| 嘉年华老虎机 ★ | 2-5 | Bungee + Noto Sans SC + Share Tech Mono | 深蓝 #0b1020/电青 #2dd4ee/琥珀 #ffd23f/红 #ff4d6d，灯泡跑马金币 | 概率/并发/时序 |
| 审讯室软木板 | 2-6 | Special Elite + Noto Serif SC | 软木 #2a1f14 图钉红线 | 追查/证据链 |
| 像素平台跳跃 ★ | 2-7 | Bungee（像素辅助） | 8-bit 色方块角色跳台 | 逐级突破/越权 |
| 武功秘籍 | 2-8 | Ma Shan Zheng + Noto Serif SC | 线装书竖排朱砂批注 | 方法论/套路 |
| 考卷批改 | 2-9 | Zhi Mang Xing | 试卷纸红笔勾叉分数 | 翻车/纠错 |
| 成绩证书 | 2-10 | Bebas Neue + Noto Serif SC | 烫金绶带钢印 | 交卷/公布 |
| 机场安检 | 2-11 | Archivo | 蓝指示牌闸机传送带 | 护栏/拦截/合规 |
| 对决档案墙 | 2-12 | Playfair Display | 卷宗牛皮纸打字机字封条 | 双方对比/档案 |
| 杂志跨页 | 3-1 | Playfair Display | 大图跨页首字下沉 | 转折/停顿 |
| 软件货架 | 3-2 | Baloo 2 + Noto Sans SC | 货架层板包装盒 | 产品矩阵 |
| 报纸档案 | 3-3 | Playfair Display | 泛黄剪报日期眉线 | 事件复盘 |
| 发布会签名墙 | 3-4 | Archivo | 深幕布 logo 墙射灯 | 联盟/集结 |
| Risograph 版画 | 3-5 | Zilla Slab | 双色套印错位纸纹 | 金句/理念定格 |
| 市政公报 | 3-6 | Alfa Slab One + Noto Serif SC | 红头文件仿宋公章 | 政策/公共影响 |
| 胶片蒙太奇 | 4-1 | Bebas Neue | 黑白照片划痕显影 | 回顾/呼应开头 |
| 哑光片尾 | 4-2 | Ma Shan Zheng | 深墨蓝居中呼吸光 | 收尾/互动 |

★ 镜头推进教科书：2-5（#world 整体推近+黑边慢放 RACE CAM+毫秒计数）、2-7（camTo 跟拍跳塔+破顶猛抬）。

## 第二辑 `examples/doubao-paper-detective/`（字体为匹配建议）

| 风格 | 样板 | 建议字体 | 主色/材质 | 适合 |
|---|---|---|---|---|
| 深夜书桌扁平插画 | 0-1 | Noto Sans SC + Nunito | 暖夜灯渐变扁平元素 | 任务降临/铺垫 |
| 复古报纸印刷(黑墨双联) | 0-2 | Playfair + Noto Serif SC | 黑墨对撞纸底 | 信息轰炸/畏难 |
| 手账拼贴日历 | 0-3 | ZCOOL KuaiLe | 和纸胶带拼贴格子 | 流程预告/规划 |
| 黑色电影档案 | 0-4 | Special Elite + Courier Prime | 百叶窗光档案纸 #2b241c | 标题卡/侦探定调 |
| 课堂笔记本手账 | 1-1 | Patrick Hand + Ma Shan Zheng | 横线纸胶带批注 | 方法论讲解 |
| 黄铜天平学术对比 | 1-1b | Cormorant + Noto Serif SC | 黄铜金属渐变天平 | 对比/称量 |
| 审讯室证据聚光 | 2-4 | Special Elite | 聚光灯证物台（vs 一辑软木板） | 质疑/悬念 |
| 集换式卡牌卡册 | 4-5 | Bungee + ZCOOL KuaiLe | TCG 卡槽闪卡翻页 | 收藏积累 |
| 工坊公告板 | 4-6 | Ma Shan Zheng | 软木板图纸挂牌 | 工具锻造/沉淀 |
| 地铁线路图 | 5-1 | Archivo + Noto Sans SC | 线网图站点换乘 | 线索汇合/盘点 |
| 毕业寄语明信片 | 5-2 | Ma Shan Zheng | 邮票邮戳纸质 | 收尾/情感落点 |

**备选池**：车票/登机牌、菜单、药品说明、游戏卡牌、法庭速写、天气预报、黑胶封、地铁站牌、乐高/宜家说明书、快递单、点钞机、典当行、赌场筹码……写前先查本表避免与整辑撞车。
