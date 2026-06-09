window.QUESTION_BANK = {
  "meta": {
    "title": "算法设计与分析复习练习",
    "source": "算法设计与分析复习练习-20260508.docx",
    "count": 144
  },
  "questions": [
    {
      "id": "choice-01",
      "type": "choice",
      "section": "选择题",
      "number": 1,
      "title": "选择题 1",
      "prompt": "二分搜索算法是利用（ ）实现的算法。",
      "options": [
        {
          "key": "A",
          "text": "分治策略"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "A",
      "analysis": "二分搜索每次把问题规模减半，属于分治。"
    },
    {
      "id": "choice-02",
      "type": "choice",
      "section": "选择题",
      "number": 2,
      "title": "选择题 2",
      "prompt": "下列不是动态规划算法基本步骤的是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "找出最优解的性质"
        },
        {
          "key": "B",
          "text": "构造最优解"
        },
        {
          "key": "C",
          "text": "算出最优解"
        },
        {
          "key": "D",
          "text": "定义最优解"
        }
      ],
      "answer": "B",
      "analysis": "动态规划步骤是找性质、列递推、算最优值、构造解；其中“定义最优解”不属于 DP 基本步骤，正确答案为 B。"
    },
    {
      "id": "choice-03",
      "type": "choice",
      "section": "选择题",
      "number": 3,
      "title": "选择题 3",
      "prompt": "最大效益优先是（ ）的一搜索方式。",
      "options": [
        {
          "key": "A",
          "text": "分支界限法"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "A",
      "analysis": "最大效益优先是分支限界法选择扩展结点的方式。"
    },
    {
      "id": "choice-04",
      "type": "choice",
      "section": "选择题",
      "number": 4,
      "title": "选择题 4",
      "prompt": "回溯法解旅行售货员问题时的解空间树是（）。",
      "options": [
        {
          "key": "A",
          "text": "子集树"
        },
        {
          "key": "B",
          "text": "排列树"
        },
        {
          "key": "D",
          "text": "广度优先生成树"
        },
        {
          "key": "C",
          "text": "深度优先生成树"
        }
      ],
      "answer": "B",
      "analysis": "旅行售货员问题要排列城市访问顺序，解空间树是排列树。"
    },
    {
      "id": "choice-05",
      "type": "choice",
      "section": "选择题",
      "number": 5,
      "title": "选择题 5",
      "prompt": "下列算法中通常以自底向上的方式求解最优解的是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "备忘录法"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "B",
      "analysis": "动态规划常按子问题规模自底向上填表。"
    },
    {
      "id": "choice-06",
      "type": "choice",
      "section": "选择题",
      "number": 6,
      "title": "选择题 6",
      "prompt": "衡量一个算法好坏的标准是（）。",
      "options": [
        {
          "key": "A",
          "text": "运行速度快"
        },
        {
          "key": "B",
          "text": "占用空间少"
        },
        {
          "key": "C",
          "text": "时间复杂度低"
        },
        {
          "key": "D",
          "text": "代码短"
        }
      ],
      "answer": "C",
      "analysis": "考试中一般用时间复杂度优先衡量算法效率。"
    },
    {
      "id": "choice-07",
      "type": "choice",
      "section": "选择题",
      "number": 7,
      "title": "选择题 7",
      "prompt": "以下不可以使用分治法求解的是（）。",
      "options": [
        {
          "key": "A",
          "text": "棋盘覆盖问题"
        },
        {
          "key": "B",
          "text": "选择问题"
        },
        {
          "key": "C",
          "text": "归并排序"
        },
        {
          "key": "D",
          "text": "0/1背包问题"
        }
      ],
      "answer": "D",
      "analysis": "0/1背包典型用动态规划、回溯或分支限界，不用普通分治。"
    },
    {
      "id": "choice-08",
      "type": "choice",
      "section": "选择题",
      "number": 8,
      "title": "选择题 8",
      "prompt": "实现循环赛日程表利用的算法是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "分治策略"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "A",
      "analysis": "循环赛日程表可把选手分组递归构造，属分治。"
    },
    {
      "id": "choice-09",
      "type": "choice",
      "section": "选择题",
      "number": 9,
      "title": "选择题 9",
      "prompt": "下面不是分支界限法搜索方式的是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "广度优先"
        },
        {
          "key": "B",
          "text": "最小耗费优先"
        },
        {
          "key": "C",
          "text": "最大效益优先"
        },
        {
          "key": "D",
          "text": "深度优先"
        }
      ],
      "answer": "D",
      "analysis": "深度优先是回溯法常用策略，不是分支限界法常见方式。"
    },
    {
      "id": "choice-10",
      "type": "choice",
      "section": "选择题",
      "number": 10,
      "title": "选择题 10",
      "prompt": "下列算法中通常以深度优先方式系统搜索问题解的是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "备忘录法"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "D",
      "analysis": "回溯法按深度优先系统搜索解空间树。"
    },
    {
      "id": "choice-11",
      "type": "choice",
      "section": "选择题",
      "number": 11,
      "title": "选择题 11",
      "prompt": "备忘录方法是那种算法的变形。（ ）",
      "options": [
        {
          "key": "A",
          "text": "分治法"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "B",
      "analysis": "备忘录法是动态规划的自顶向下变形。"
    },
    {
      "id": "choice-12",
      "type": "choice",
      "section": "选择题",
      "number": 12,
      "title": "选择题 12",
      "prompt": "哈弗曼编码的贪心算法所需的计算时间为（ ）。",
      "options": [
        {
          "key": "A",
          "text": "O（n2n）"
        },
        {
          "key": "B",
          "text": "O（nlogn）"
        },
        {
          "key": "C",
          "text": "O（2n）"
        },
        {
          "key": "D",
          "text": "O（n）"
        }
      ],
      "answer": "B",
      "analysis": "哈夫曼编码用优先队列反复合并，时间常为 O(nlogn)。"
    },
    {
      "id": "choice-13",
      "type": "choice",
      "section": "选择题",
      "number": 13,
      "title": "选择题 13",
      "prompt": "分支限界法解最大团问题时，活结点表的组织形式是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "最小堆"
        },
        {
          "key": "B",
          "text": "最大堆"
        },
        {
          "key": "C",
          "text": "栈"
        },
        {
          "key": "D",
          "text": "数组"
        }
      ],
      "answer": "B",
      "analysis": "最大团按最大效益优先时活结点表常用最大堆。"
    },
    {
      "id": "choice-14",
      "type": "choice",
      "section": "选择题",
      "number": 14,
      "title": "选择题 14",
      "prompt": "最长公共子序列算法利用的算法是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "分支界限法"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "B",
      "analysis": "最长公共子序列具有重叠子问题和最优子结构，用动态规划。"
    },
    {
      "id": "choice-15",
      "type": "choice",
      "section": "选择题",
      "number": 15,
      "title": "选择题 15",
      "prompt": "实现棋盘覆盖算法利用的算法是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "分治法"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "A",
      "analysis": "棋盘覆盖把棋盘递归分成四块，是分治。"
    },
    {
      "id": "choice-16",
      "type": "choice",
      "section": "选择题",
      "number": 16,
      "title": "选择题 16",
      "prompt": "下面是贪心算法的基本要素的是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "重叠子问题"
        },
        {
          "key": "B",
          "text": "构造最优解"
        },
        {
          "key": "C",
          "text": "贪心选择性质"
        },
        {
          "key": "D",
          "text": "定义最优解"
        }
      ],
      "answer": "C",
      "analysis": "贪心算法核心要素之一是贪心选择性质。"
    },
    {
      "id": "choice-17",
      "type": "choice",
      "section": "选择题",
      "number": 17,
      "title": "选择题 17",
      "prompt": "回溯法的效率不依赖于下列哪些因素（ ）",
      "options": [
        {
          "key": "A",
          "text": "满足显约束的值的个数"
        },
        {
          "key": "B",
          "text": "计算约束函数的时间"
        },
        {
          "key": "C",
          "text": "计算限界函数的时间"
        },
        {
          "key": "D",
          "text": "确定解空间的时间"
        }
      ],
      "answer": "D",
      "analysis": "效率主要依赖约束/限界函数和满足约束的结点数。"
    },
    {
      "id": "choice-18",
      "type": "choice",
      "section": "选择题",
      "number": 18,
      "title": "选择题 18",
      "prompt": "下面哪种函数是回溯法中为避免无效搜索采取的策略（ ）",
      "options": [
        {
          "key": "A",
          "text": "递归函数"
        },
        {
          "key": "B",
          "text": "剪枝函数"
        },
        {
          "key": "C",
          "text": "随机数函数"
        },
        {
          "key": "D",
          "text": "搜索函数"
        }
      ],
      "answer": "B",
      "analysis": "剪枝函数用来提前排除无效分支。"
    },
    {
      "id": "choice-19",
      "type": "choice",
      "section": "选择题",
      "number": 19,
      "title": "选择题 19",
      "prompt": "从活结点表中选择下一个扩展结点的不同方式将导致不同的分支限界法,以下除()之外都是最常见的方式.",
      "options": [
        {
          "key": "A",
          "text": "队列式分支限界法"
        },
        {
          "key": "B",
          "text": "优先队列式分支限界法"
        },
        {
          "key": "C",
          "text": "栈式分支限界法"
        },
        {
          "key": "D",
          "text": "FIFO分支限界法"
        }
      ],
      "answer": "C",
      "analysis": "栈式本质是深度优先，更属于回溯；常见分支限界有队列式和优先队列式。"
    },
    {
      "id": "choice-20",
      "type": "choice",
      "section": "选择题",
      "number": 20,
      "title": "选择题 20",
      "prompt": "（ ）是贪心算法与动态规划算法的共同点。",
      "options": [
        {
          "key": "A",
          "text": "重叠子问题"
        },
        {
          "key": "B",
          "text": "构造最优解"
        },
        {
          "key": "C",
          "text": "贪心选择性质"
        },
        {
          "key": "D",
          "text": "最优子结构性质"
        }
      ],
      "answer": "D",
      "analysis": "贪心和动态规划都要求最优子结构。"
    },
    {
      "id": "choice-21",
      "type": "choice",
      "section": "选择题",
      "number": 21,
      "title": "选择题 21",
      "prompt": "矩阵连乘问题的算法可由（）设计实现。",
      "options": [
        {
          "key": "A",
          "text": "分支界限算法"
        },
        {
          "key": "B",
          "text": "动态规划算法"
        },
        {
          "key": "C",
          "text": "贪心算法"
        },
        {
          "key": "D",
          "text": "回溯算法"
        }
      ],
      "answer": "B",
      "analysis": "矩阵连乘用动态规划求最少乘法次数。"
    },
    {
      "id": "choice-22",
      "type": "choice",
      "section": "选择题",
      "number": 22,
      "title": "选择题 22",
      "prompt": "分支限界法解旅行售货员问题时，活结点表的组织形式是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "最小堆"
        },
        {
          "key": "B",
          "text": "最大堆"
        },
        {
          "key": "C",
          "text": "栈"
        },
        {
          "key": "D",
          "text": "数组"
        }
      ],
      "answer": "A",
      "analysis": "TSP 是最小化问题，分支限界常用最小堆按下界扩展。"
    },
    {
      "id": "choice-23",
      "type": "choice",
      "section": "选择题",
      "number": 23,
      "title": "选择题 23",
      "prompt": "Strassen矩阵乘法是利用（ ）实现的算法。",
      "options": [
        {
          "key": "A",
          "text": "分治策略"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "A",
      "analysis": "Strassen 矩阵乘法是分治算法。"
    },
    {
      "id": "choice-24",
      "type": "choice",
      "section": "选择题",
      "number": 24,
      "title": "选择题 24",
      "prompt": "使用分治法求解不需要满足的条件是（）。",
      "options": [
        {
          "key": "A",
          "text": "子问题必须是一样的"
        },
        {
          "key": "B",
          "text": "子问题不能够重复"
        },
        {
          "key": "C",
          "text": "子问题的解可以合并"
        },
        {
          "key": "D",
          "text": "原问题和子问题使用相同的方法解"
        }
      ],
      "answer": "A",
      "analysis": "分治只要求子问题同类型且可合并，不要求子问题完全一样。"
    },
    {
      "id": "choice-25",
      "type": "choice",
      "section": "选择题",
      "number": 25,
      "title": "选择题 25",
      "prompt": "下面问题（）不能使用贪心法解决。",
      "options": [
        {
          "key": "A",
          "text": "单源最短路径问题"
        },
        {
          "key": "B",
          "text": "N皇后问题"
        },
        {
          "key": "C",
          "text": "最小花费生成树问题"
        },
        {
          "key": "D",
          "text": "背包问题"
        }
      ],
      "answer": "B",
      "analysis": "N 皇后是约束搜索问题，通常用回溯。"
    },
    {
      "id": "choice-26",
      "type": "choice",
      "section": "选择题",
      "number": 26,
      "title": "选择题 26",
      "prompt": "下列算法中不能解决0/1背包问题的是（）",
      "options": [
        {
          "key": "A",
          "text": "贪心法"
        },
        {
          "key": "B",
          "text": "动态规划"
        },
        {
          "key": "C",
          "text": "回溯法"
        },
        {
          "key": "D",
          "text": "分支限界法"
        }
      ],
      "answer": "A",
      "analysis": "0/1背包不能用简单贪心得到全局最优。"
    },
    {
      "id": "choice-27",
      "type": "choice",
      "section": "选择题",
      "number": 27,
      "title": "选择题 27",
      "prompt": "回溯法搜索状态空间树是按照（）的顺序。",
      "options": [
        {
          "key": "A",
          "text": "中序遍历"
        },
        {
          "key": "B",
          "text": "广度优先遍历"
        },
        {
          "key": "C",
          "text": "深度优先遍历"
        },
        {
          "key": "D",
          "text": "层次优先遍历"
        }
      ],
      "answer": "C",
      "analysis": "回溯按深度优先遍历状态空间树。"
    },
    {
      "id": "choice-28",
      "type": "choice",
      "section": "选择题",
      "number": 28,
      "title": "选择题 28",
      "prompt": "实现合并排序利用的算法是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "分治策略"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "A",
      "analysis": "合并排序先分后合，是分治。"
    },
    {
      "id": "choice-29",
      "type": "choice",
      "section": "选择题",
      "number": 29,
      "title": "选择题 29",
      "prompt": "下列是动态规划算法基本要素的是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "定义最优解"
        },
        {
          "key": "B",
          "text": "构造最优解"
        },
        {
          "key": "C",
          "text": "算出最优解"
        },
        {
          "key": "D",
          "text": "子问题重叠性质"
        }
      ],
      "answer": "D",
      "analysis": "动态规划基本要素是最优子结构和子问题重叠。"
    },
    {
      "id": "choice-30",
      "type": "choice",
      "section": "选择题",
      "number": 30,
      "title": "选择题 30",
      "prompt": "下列算法中通常以自底向下的方式求解最优解的是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "分治法"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "A",
      "analysis": "分治递归通常自顶向下求解。"
    },
    {
      "id": "choice-31",
      "type": "choice",
      "section": "选择题",
      "number": 31,
      "title": "选择题 31",
      "prompt": "采用广度优先策略搜索的算法是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "分支界限法"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "A",
      "analysis": "分支限界法常按广度优先或最小耗费优先扩展。"
    },
    {
      "id": "choice-32",
      "type": "choice",
      "section": "选择题",
      "number": 32,
      "title": "选择题 32",
      "prompt": "合并排序算法是利用（ ）实现的算法。",
      "options": [
        {
          "key": "A",
          "text": "分治策略"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "A",
      "analysis": "合并排序是分治。"
    },
    {
      "id": "choice-33",
      "type": "choice",
      "section": "选择题",
      "number": 33,
      "title": "选择题 33",
      "prompt": "背包问题的贪心算法所需的计算时间为（ ）",
      "options": [
        {
          "key": "A",
          "text": "O（n2n）"
        },
        {
          "key": "B",
          "text": "O（nlogn）"
        },
        {
          "key": "C",
          "text": "O（2n）"
        },
        {
          "key": "D",
          "text": "O（n）"
        }
      ],
      "answer": "B",
      "analysis": "背包贪心通常先按单位价值排序，O(nlogn)。"
    },
    {
      "id": "choice-34",
      "type": "choice",
      "section": "选择题",
      "number": 34,
      "title": "选择题 34",
      "prompt": "实现大整数的乘法是利用的算法（ ）。",
      "options": [
        {
          "key": "A",
          "text": "贪心法"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "分治策略"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "C",
      "analysis": "大整数乘法可用分治降低复杂度。"
    },
    {
      "id": "choice-35",
      "type": "choice",
      "section": "选择题",
      "number": 35,
      "title": "选择题 35",
      "prompt": "0-1背包问题的回溯算法求解最优解所需的计算时间为（ ）",
      "options": [
        {
          "key": "A",
          "text": "O（n2n）"
        },
        {
          "key": "B",
          "text": "O（nlogn）"
        },
        {
          "key": "C",
          "text": "O（2n）"
        },
        {
          "key": "D",
          "text": "O（n）"
        }
      ],
      "answer": "C",
      "analysis": "0/1背包回溯最坏要检查子集，O(2^n)。"
    },
    {
      "id": "choice-36",
      "type": "choice",
      "section": "选择题",
      "number": 36,
      "title": "选择题 36",
      "prompt": "采用最大效益优先搜索方式的算法是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "分支界限法"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "A",
      "analysis": "最大效益优先属于分支限界法。"
    },
    {
      "id": "choice-37",
      "type": "choice",
      "section": "选择题",
      "number": 37,
      "title": "选择题 37",
      "prompt": "贪心算法与动态规划算法的主要区别是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "最优子结构"
        },
        {
          "key": "B",
          "text": "贪心选择性质"
        },
        {
          "key": "C",
          "text": "构造最优解"
        },
        {
          "key": "D",
          "text": "定义最优解"
        }
      ],
      "answer": "B",
      "analysis": "二者主要差别是贪心选择性质。"
    },
    {
      "id": "choice-38",
      "type": "choice",
      "section": "选择题",
      "number": 38,
      "title": "选择题 38",
      "prompt": "实现最大子段和利用的算法是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "分治策略"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "B",
      "analysis": "最大子段和常用动态规划 O(n) 求解。"
    },
    {
      "id": "choice-39",
      "type": "choice",
      "section": "选择题",
      "number": 39,
      "title": "选择题 39",
      "prompt": "优先队列式分支限界法选取扩展结点的原则是（ ）。",
      "options": [
        {
          "key": "A",
          "text": "先进先出"
        },
        {
          "key": "B",
          "text": "后进先出"
        },
        {
          "key": "C",
          "text": "结点的优先级"
        },
        {
          "key": "D",
          "text": "随机"
        }
      ],
      "answer": "C",
      "analysis": "优先队列按结点优先级选扩展结点。"
    },
    {
      "id": "choice-40",
      "type": "choice",
      "section": "选择题",
      "number": 40,
      "title": "选择题 40",
      "prompt": "背包问题的贪心算法所需的计算时间为（ ）。",
      "options": [
        {
          "key": "A",
          "text": "O（n2n）"
        },
        {
          "key": "B",
          "text": "O（nlogn）"
        },
        {
          "key": "C",
          "text": "O（2n）"
        },
        {
          "key": "D",
          "text": "O（n）"
        }
      ],
      "answer": "B",
      "analysis": "同第33题，排序主导，O(nlogn)。"
    },
    {
      "id": "choice-41",
      "type": "choice",
      "section": "选择题",
      "number": 41,
      "title": "选择题 41",
      "prompt": "广度优先是（ ）的一搜索方式。",
      "options": [
        {
          "key": "A",
          "text": "分支界限法"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "A",
      "analysis": "广度优先是分支限界法的一种搜索方式。"
    },
    {
      "id": "choice-42",
      "type": "choice",
      "section": "选择题",
      "number": 42,
      "title": "选择题 42",
      "prompt": "在对问题的解空间树进行搜索的方法中,一个活结点最多有一次机会成为活结点的是( ).",
      "options": [
        {
          "key": "A",
          "text": "回溯法"
        },
        {
          "key": "B",
          "text": "分支限界法"
        },
        {
          "key": "C",
          "text": "回溯法和分支限界法"
        },
        {
          "key": "D",
          "text": "回溯法求解子集树问题"
        }
      ],
      "answer": "B",
      "analysis": "分支限界法中活结点被取出扩展后即成为死结点。"
    },
    {
      "id": "choice-43",
      "type": "choice",
      "section": "选择题",
      "number": 43,
      "title": "选择题 43",
      "prompt": "一个问题可用动态规划算法或贪心算法求解的关键特征是问题的（   ）。",
      "options": [
        {
          "key": "A",
          "text": "重叠子问题"
        },
        {
          "key": "B",
          "text": "最优子结构性质"
        },
        {
          "key": "C",
          "text": "贪心选择性质"
        },
        {
          "key": "D",
          "text": "定义最优解"
        }
      ],
      "answer": "B",
      "analysis": "动态规划和贪心共同关键特征是最优子结构。"
    },
    {
      "id": "choice-44",
      "type": "choice",
      "section": "选择题",
      "number": 44,
      "title": "选择题 44",
      "prompt": "采用贪心算法的最优装载问题的主要计算量在于将集装箱依其重量从小到大排序，故算法的时间复杂度为 (   ) 。",
      "options": [
        {
          "key": "A",
          "text": "O（n2n）"
        },
        {
          "key": "B",
          "text": "O（nlogn）"
        },
        {
          "key": "C",
          "text": "O（2n）"
        },
        {
          "key": "D",
          "text": "O（n）"
        }
      ],
      "answer": "B",
      "analysis": "最优装载先按重量升序排序，O(nlogn)。"
    },
    {
      "id": "choice-45",
      "type": "choice",
      "section": "选择题",
      "number": 45,
      "title": "选择题 45",
      "prompt": "以深度优先方式系统搜索问题解的算法称为 (   ) 。",
      "options": [
        {
          "key": "A",
          "text": "分支界限算法"
        },
        {
          "key": "B",
          "text": "概率算法"
        },
        {
          "key": "C",
          "text": "贪心算法"
        },
        {
          "key": "D",
          "text": "回溯算法"
        }
      ],
      "answer": "D",
      "analysis": "深度优先系统搜索问题解称为回溯法。"
    },
    {
      "id": "choice-46",
      "type": "choice",
      "section": "选择题",
      "number": 46,
      "title": "选择题 46",
      "prompt": "实现最长公共子序列利用的算法是（   ）。",
      "options": [
        {
          "key": "A",
          "text": "分治策略"
        },
        {
          "key": "B",
          "text": "动态规划法"
        },
        {
          "key": "C",
          "text": "贪心法"
        },
        {
          "key": "D",
          "text": "回溯法"
        }
      ],
      "answer": "B",
      "analysis": "最长公共子序列用动态规划。"
    },
    {
      "id": "choice-47",
      "type": "choice",
      "section": "选择题",
      "number": 47,
      "title": "选择题 47",
      "prompt": "算法是由若干条指令组成的有穷序列，而且满足以下性质（   ）\n（1） 输入：有0个或多个输入\n（2） 输出：至少有一个输出\n（3） 确定性：指令清晰，无歧义\n（4） 有限性：指令执行次数有限，而且执行时间有限",
      "options": [
        {
          "key": "A",
          "text": "(1)(2)(3)"
        },
        {
          "key": "B",
          "text": "(1)(2)(4)"
        },
        {
          "key": "C",
          "text": "(1)(3)(4)"
        },
        {
          "key": "D",
          "text": "(1) (2)(3)(4)"
        }
      ],
      "answer": "D",
      "analysis": "题中四条均为算法性质；通常还包括可行性。"
    },
    {
      "id": "choice-48",
      "type": "choice",
      "section": "选择题",
      "number": 48,
      "title": "选择题 48",
      "prompt": "函数32n+10nlogn的渐进表达式是(  ).",
      "options": [
        {
          "key": "A",
          "text": "2n"
        },
        {
          "key": "B",
          "text": "32n"
        },
        {
          "key": "C",
          "text": "nlogn"
        },
        {
          "key": "D",
          "text": "10nlogn"
        }
      ],
      "answer": "B",
      "analysis": "指数项 32^n 增长最快，渐进阶取它。"
    },
    {
      "id": "choice-49",
      "type": "choice",
      "section": "选择题",
      "number": 49,
      "title": "选择题 49",
      "prompt": "大整数乘法算法是(   ).算法",
      "options": [
        {
          "key": "A",
          "text": "分治"
        },
        {
          "key": "B",
          "text": "贪心"
        },
        {
          "key": "C",
          "text": "动态规划"
        },
        {
          "key": "D",
          "text": "穷举"
        }
      ],
      "answer": "A",
      "analysis": "大整数乘法典型算法是分治。"
    },
    {
      "id": "choice-50",
      "type": "choice",
      "section": "选择题",
      "number": 50,
      "title": "选择题 50",
      "prompt": "用动态规划算法解决最大字段和问题，其时间复杂性为(   ).",
      "options": [
        {
          "key": "A",
          "text": "O(logn)"
        },
        {
          "key": "B",
          "text": "O(n)"
        },
        {
          "key": "C",
          "text": "O(n2)"
        },
        {
          "key": "D",
          "text": "O(nlogn)"
        }
      ],
      "answer": "B",
      "analysis": "最大子段和动态规划只需一次扫描，O(n)。"
    },
    {
      "id": "choice-51",
      "type": "choice",
      "section": "选择题",
      "number": 51,
      "title": "选择题 51",
      "prompt": "解决活动安排问题，最好用（  ）算法",
      "options": [
        {
          "key": "A",
          "text": "分治"
        },
        {
          "key": "B",
          "text": "贪心"
        },
        {
          "key": "C",
          "text": "动态规划"
        },
        {
          "key": "D",
          "text": "穷举"
        }
      ],
      "answer": "B",
      "analysis": "活动安排选最早结束活动，是经典贪心。"
    },
    {
      "id": "choice-52",
      "type": "choice",
      "section": "选择题",
      "number": 52,
      "title": "选择题 52",
      "prompt": "设f(N)、g(N)是定义在正数集上的正函数,如果存在正的常数C和自然数N0,使得当N≥N0时有f(N)≤Cg(N),则称函数f(N)当N充分大时有上界g(N),记作 f(N)∈O(g(N)),即f(N)的阶(   )g(N)的阶.",
      "options": [
        {
          "key": "A",
          "text": "不高于"
        },
        {
          "key": "B",
          "text": "不低于"
        },
        {
          "key": "C",
          "text": "等价于"
        },
        {
          "key": "D",
          "text": "逼近"
        }
      ],
      "answer": "A",
      "analysis": "f∈O(g) 表示 f 的阶不高于 g。"
    },
    {
      "id": "choice-53",
      "type": "choice",
      "section": "选择题",
      "number": 53,
      "title": "选择题 53",
      "prompt": "回溯法在解空间树T上的搜索方式是(   ).",
      "options": [
        {
          "key": "A",
          "text": "深度优先"
        },
        {
          "key": "B",
          "text": "广度优先"
        },
        {
          "key": "C",
          "text": "最小耗费优先"
        },
        {
          "key": "D",
          "text": "活结点优先"
        }
      ],
      "answer": "A",
      "analysis": "回溯法在解空间树上作深度优先搜索。"
    },
    {
      "id": "choice-54",
      "type": "choice",
      "section": "选择题",
      "number": 54,
      "title": "选择题 54",
      "prompt": "回溯算法和分支限界法的问题的解空间树不会是(  ).",
      "options": [
        {
          "key": "A",
          "text": "有序树"
        },
        {
          "key": "B",
          "text": "子集树"
        },
        {
          "key": "C",
          "text": "排列树"
        },
        {
          "key": "D",
          "text": "无序树"
        }
      ],
      "answer": "D",
      "analysis": "解空间树通常是子集树、排列树等有序结构，不是无序树。"
    },
    {
      "id": "blank-01",
      "type": "fill",
      "section": "填空题",
      "number": 1,
      "title": "填空题 1",
      "prompt": "算法的复杂性有   复杂性和   复杂性之分。",
      "answer": "时间；空间",
      "analysis": "复杂性主要看运行时间和占用空间。"
    },
    {
      "id": "blank-02",
      "type": "fill",
      "section": "填空题",
      "number": 2,
      "title": "填空题 2",
      "prompt": "程序是   用某种程序设计语言的具体实现。",
      "answer": "算法",
      "analysis": "程序是算法用某种语言的实现。"
    },
    {
      "id": "blank-03",
      "type": "fill",
      "section": "填空题",
      "number": 3,
      "title": "填空题 3",
      "prompt": "算法的“确定性”指的是组成算法的每条   是清晰的，无歧义的。",
      "answer": "指令/步骤",
      "analysis": "每条指令必须清晰无歧义。"
    },
    {
      "id": "blank-04",
      "type": "fill",
      "section": "填空题",
      "number": 4,
      "title": "填空题 4",
      "prompt": "最长公共子序列问题的算法可由   设计实现。",
      "answer": "动态规划法",
      "analysis": "LCS 是动态规划经典问题。"
    },
    {
      "id": "blank-05",
      "type": "fill",
      "section": "填空题",
      "number": 5,
      "title": "填空题 5",
      "prompt": "算法是指解决问题的     或      。",
      "answer": "方法；有限步骤",
      "analysis": "算法是求解问题的方法或有限步骤。"
    },
    {
      "id": "blank-06",
      "type": "fill",
      "section": "填空题",
      "number": 6,
      "title": "填空题 6",
      "prompt": "从分治法的一般设计模式可以看出，用它设计出的程序一般是   。",
      "answer": "递归的",
      "analysis": "分治程序常递归地分解子问题。"
    },
    {
      "id": "blank-07",
      "type": "fill",
      "section": "填空题",
      "number": 7,
      "title": "填空题 7",
      "prompt": "问题的   是该问题可用动态规划算法或贪心算法求解的关键特征。",
      "answer": "最优子结构性质",
      "analysis": "DP 和贪心都依赖该性质。"
    },
    {
      "id": "blank-08",
      "type": "fill",
      "section": "填空题",
      "number": 8,
      "title": "填空题 8",
      "prompt": "以深度优先方式系统搜索问题解的算法称为   。",
      "answer": "回溯法",
      "analysis": "回溯以深度优先搜索为特征。"
    },
    {
      "id": "blank-09",
      "type": "fill",
      "section": "填空题",
      "number": 9,
      "title": "填空题 9",
      "prompt": "图的m着色问题可用回溯法求解，其解空间树中叶子结点个数是  ，解空间树中每个内结点的孩子数是    。",
      "answer": "m^n；m",
      "analysis": "n 个顶点各有 m 种颜色，每层孩子数为 m。"
    },
    {
      "id": "blank-10",
      "type": "fill",
      "section": "填空题",
      "number": 10,
      "title": "填空题 10",
      "prompt": "计算一个算法时间复杂度通常可以计算   、   或计算步。",
      "answer": "基本操作次数；语句频度",
      "analysis": "二者都能估计时间复杂度。"
    },
    {
      "id": "blank-11",
      "type": "fill",
      "section": "填空题",
      "number": 11,
      "title": "填空题 11",
      "prompt": "Prim算法利用   策略求解   问题，其时间复杂度是    。",
      "answer": "贪心；最小生成树；O(n^2)",
      "analysis": "Prim 每次选连接当前树的最小边。"
    },
    {
      "id": "blank-12",
      "type": "fill",
      "section": "填空题",
      "number": 12,
      "title": "填空题 12",
      "prompt": "解决0/1背包问题可以使用动态规划、回溯法和分支限界法，其中不需要排序的是   ，需要排序的是   ，限界分枝法 。",
      "answer": "动态规划；回溯法和分支限界法",
      "analysis": "回溯/分支限界常按单位价值排序以便剪枝。"
    },
    {
      "id": "blank-13",
      "type": "fill",
      "section": "填空题",
      "number": 13,
      "title": "填空题 13",
      "prompt": "使用回溯法进行状态空间树裁剪分支时一般有两个标准：约束条件和目标函数的界，N皇后问题和0/1背包问题正好是两种不同的类型，其中同时使用约束条件和目标函数的界进行裁剪的是   ，只使用约束条件进行裁剪的是   。",
      "answer": "0/1背包；N皇后",
      "analysis": "背包既有容量约束又有价值界，N皇后主要用约束剪枝。"
    },
    {
      "id": "blank-14",
      "type": "fill",
      "section": "填空题",
      "number": 14,
      "title": "填空题 14",
      "prompt": "是贪心算法可行的第一个基本要素，也是贪心算法与动态\n规划算法的主要区别。",
      "answer": "贪心选择性质",
      "analysis": "这是贪心区别于动态规划的关键。"
    },
    {
      "id": "blank-15",
      "type": "fill",
      "section": "填空题",
      "number": 15,
      "title": "填空题 15",
      "prompt": "大整数乘法问题的算法可由   设计实现。",
      "answer": "分治法",
      "analysis": "大整数乘法可递归拆分。"
    },
    {
      "id": "blank-16",
      "type": "fill",
      "section": "填空题",
      "number": 16,
      "title": "填空题 16",
      "prompt": "快速排序算法的性能取决于   。",
      "answer": "划分是否均衡/基准元素选择",
      "analysis": "快速排序性能取决于 partition 的平衡程度。"
    },
    {
      "id": "blank-17",
      "type": "fill",
      "section": "填空题",
      "number": 17,
      "title": "填空题 17",
      "prompt": "贪心算法的基本要素是   性质和   性质 。",
      "answer": "贪心选择性质；最优子结构性质",
      "analysis": "二者缺一不可。"
    },
    {
      "id": "blank-18",
      "type": "fill",
      "section": "填空题",
      "number": 18,
      "title": "填空题 18",
      "prompt": "动态规划算法的基本思想是将待求解问题分解成若干   ，先求解   ，然后从这些   的解得到原问题的解。",
      "answer": "子问题；子问题；子问题",
      "analysis": "先求小问题，再组成原问题。"
    },
    {
      "id": "blank-19",
      "type": "fill",
      "section": "填空题",
      "number": 19,
      "title": "填空题 19",
      "prompt": "算法是由若干条指令组成的有穷序列，且要满足输入、   、确定性和   四条性质。",
      "answer": "输出；有限性",
      "analysis": "算法性质还包括输入和确定性。"
    },
    {
      "id": "blank-20",
      "type": "fill",
      "section": "填空题",
      "number": 20,
      "title": "填空题 20",
      "prompt": "大整数乘积算法是用   来设计的。",
      "answer": "分治法",
      "analysis": "大整数乘积常用分治设计。"
    },
    {
      "id": "blank-21",
      "type": "fill",
      "section": "填空题",
      "number": 21,
      "title": "填空题 21",
      "prompt": "以广度优先或以最小耗费方式搜索问题解的算法称为   。",
      "answer": "分支限界法",
      "analysis": "可用广度优先或最小耗费优先。"
    },
    {
      "id": "blank-22",
      "type": "fill",
      "section": "填空题",
      "number": 22,
      "title": "填空题 22",
      "prompt": "是贪心算法可行的第一个基本要素，也是贪心算法与动态\n规划算法的主要区别。",
      "answer": "贪心选择性质",
      "analysis": "同第14题。"
    },
    {
      "id": "blank-23",
      "type": "fill",
      "section": "填空题",
      "number": 23,
      "title": "填空题 23",
      "prompt": "快速排序算法是基于   的一种排序算法。",
      "answer": "分治法",
      "analysis": "快速排序按基准划分后递归排序。"
    },
    {
      "id": "blank-24",
      "type": "fill",
      "section": "填空题",
      "number": 24,
      "title": "填空题 24",
      "prompt": "动态规划算法的两个基本要素是.   性质和  性质 。",
      "answer": "最优子结构；重叠子问题",
      "analysis": "动态规划的两个基本要素。"
    },
    {
      "id": "blank-25",
      "type": "fill",
      "section": "填空题",
      "number": 25,
      "title": "填空题 25",
      "prompt": "快速排序算法的性能取决于   。",
      "answer": "划分是否均衡/基准元素选择",
      "analysis": "同第16题。"
    },
    {
      "id": "blank-26",
      "type": "fill",
      "section": "填空题",
      "number": 26,
      "title": "填空题 26",
      "prompt": "限界分枝法主要有   限界分枝法和  分支限界分枝法。",
      "answer": "队列式；优先队列式",
      "analysis": "这是分支限界法两种常见组织方式。"
    },
    {
      "id": "blank-27",
      "type": "fill",
      "section": "填空题",
      "number": 27,
      "title": "填空题 27",
      "prompt": "任何可用计算机求解的问题所需的时间都与其   有关。",
      "answer": "规模",
      "analysis": "输入规模 n 决定所需时间的增长。"
    },
    {
      "id": "blank-28",
      "type": "fill",
      "section": "填空题",
      "number": 28,
      "title": "填空题 28",
      "prompt": "回溯法搜索解空间树时，常用的两种剪枝函数为   和   。",
      "answer": "约束函数；限界函数",
      "analysis": "约束剪不可行解，限界剪不可能更优的解。"
    },
    {
      "id": "code-01",
      "type": "code",
      "section": "算法填空",
      "number": 1,
      "title": "1. 背包问题的贪心算法",
      "prompt": "1.背包问题的贪心算法\nvoid Knapsack(int n,float M,float v[],float w[],float x[]){\nsort(n,v,w);\nint i;\nfor (i=1;i<=n;i++) x[i]=0;\nfloat c=M;\nfor (i=1;i<=n;i++) {\nif (w[i]>c) break;\nx[i]=1;\n;\n}\n;\n}",
      "answer": "空1：c -= w[i];\n空2：if (i <= n) x[i] = c / w[i];\n简析：先按单位价值排序，能整件装就装，最后一件只能装剩余比例。这是分数背包，不是0/1背包。",
      "analysis": "按参考代码补空，重点记住变量含义和递推/递归位置。"
    },
    {
      "id": "code-02",
      "type": "code",
      "section": "算法填空",
      "number": 2,
      "title": "2. 最大子段和动态规划",
      "prompt": "2.最大子段和: 动态规划算法\nint MaxSum(int n, int a[]){\nint sum=0, b=0； //sum存储当前最大的b[j], b存储b[j]\nfor(int j=1； j<=n； j++) {\nif (b>0) b+= a[j] ；\n//一旦某个区段和为负，则从下一个位置累和\nif(b>sum)\n}\nreturn sum；\n}",
      "answer": "核心写法：if (b > 0) b += a[j]; else b = a[j]; if (b > sum) sum = b;\n简析：b 表示以 a[j] 结尾的最大子段和；若前面和为负，就从当前位置重新开始。",
      "analysis": "按参考代码补空，重点记住变量含义和递推/递归位置。"
    },
    {
      "id": "code-03",
      "type": "code",
      "section": "算法填空",
      "number": 3,
      "title": "3. 快速排序",
      "prompt": "3.快速排序\ntemplate<class Type>\nvoid QuickSort (Type a[], int p, int r){\nif (p<r) {\nint q=Partition(a,p,r);\n//对左半段排序\n//对右半段排序\n}\n}",
      "answer": "QuickSort(a, p, q-1);\nQuickSort(a, q+1, r);\n简析：Partition 后基准在 q，左边和右边分别递归排序。",
      "analysis": "按参考代码补空，重点记住变量含义和递推/递归位置。"
    },
    {
      "id": "code-04",
      "type": "code",
      "section": "算法填空",
      "number": 4,
      "title": "4. 排列问题",
      "prompt": "4.排列问题\nTemplate <class Type>\nvoid perm(Type list[], int k, int m ){ //产生[list[k:m]的所有排列\n{ //只剩下一个元素\nfor (int i=0;i<=m;i++) cout<<list[i];\ncout<<endl;\n}\nelse //还有多个元素待排列，递归产生排列\nfor (          ){\nswap(list[k]，list[i]);\nswap(list[k],list[i]);\n}\n}",
      "answer": "if (k == m) 输出一个排列；else for (int i=k; i<=m; i++) { swap(list[k], list[i]); perm(list, k+1, m); swap(list[k], list[i]); }\n简析：第 k 位依次放每个候选元素，递归后交换回来。",
      "analysis": "按参考代码补空，重点记住变量含义和递推/递归位置。"
    },
    {
      "id": "code-05",
      "type": "code",
      "section": "算法填空",
      "number": 5,
      "title": "5. 二分搜索",
      "prompt": "5.给定已按升序排好序的n个元素a[0:n-1]，现要在这n个元素中找出一特定元素x。\n据此容易设计出二分搜索算法：\ntemplate<class Type>\nint BinarySearch(Type a[], const Type& x, int l, int r){\nwhile ( l<r  ){\nint m =  (l+r)/2        ;\nif (x == a[m]) return m;\nif (  x<a[m]  ) r = m-1;\nelse l = m+1;\n}\nreturn -1;\n}",
      "answer": "建议把 while(l<r) 改为 while(l<=r)，否则可能漏查最后一个元素。\nm=(l+r)/2；若 x<a[m]，r=m-1；否则 l=m+1。\n简析：每次丢掉一半区间，时间复杂度 O(logn)。",
      "analysis": "按参考代码补空，重点记住变量含义和递推/递归位置。"
    },
    {
      "id": "code-06",
      "type": "code",
      "section": "算法填空",
      "number": 6,
      "title": "6. 合并排序",
      "prompt": "6、合并排序描述如下：\ntemplate<class Type>\nvoid Mergesort(Type a[ ], int left, int right){\nif (        ){\nint i=(          )/2;\nMergesort(a, left, i );\nMergesort(           );\nMerge(a,b, left,i,right);//合并到数组b\nCopy(a,b, left,right ); //复制到数组a\n}\n}",
      "answer": "if (left < right)\nint i = (left + right) / 2;\nMergesort(a, i+1, right);\n简析：分成左右两半递归排序，再 Merge 合并，复杂度 O(nlogn)。",
      "analysis": "按参考代码补空，重点记住变量含义和递推/递归位置。"
    },
    {
      "id": "code-07",
      "type": "code",
      "section": "算法填空",
      "number": 7,
      "title": "7. 计算 x^m",
      "prompt": "7、以下是计算xm的值的过程\nint power ( x, m ){//计算xm的值并返回。\ny=(     ); i=m;\nwhile(i-->0)\ny=y*x;\n(          )\n}",
      "answer": "y = 1; i = m;\nreturn y;\n简析：循环 m 次乘 x，时间复杂度 O(m)。若用快速幂可降为 O(logm)。",
      "analysis": "按参考代码补空，重点记住变量含义和递推/递归位置。"
    },
    {
      "id": "qa-01",
      "type": "short",
      "section": "问答题",
      "number": 1,
      "title": "算法定义",
      "prompt": "算法定义",
      "answer": "算法是求解某类问题的有穷规则或有限步骤序列；对合法输入，能在有限时间内得到输出。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-02",
      "type": "short",
      "section": "问答题",
      "number": 2,
      "title": "算法的5个特性",
      "prompt": "算法的5个特性",
      "answer": "输入：0个或多个输入；输出：至少1个输出；确定性：步骤清楚无歧义；有限性：有限步后结束；可行性：每一步都能实际执行。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-03",
      "type": "short",
      "section": "问答题",
      "number": 3,
      "title": "最大公约数算法",
      "prompt": "最大公约数算法",
      "answer": "欧几里得算法：输入 a,b；当 b≠0 时令 r=a mod b, a=b, b=r；循环结束后 a 即 gcd。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-04",
      "type": "short",
      "section": "问答题",
      "number": 4,
      "title": "好算法特性",
      "prompt": "好算法特性",
      "answer": "正确性、可读性、健壮性、时间效率高、空间占用少。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-05",
      "type": "short",
      "section": "问答题",
      "number": 5,
      "title": "计算机求解问题的一般过程",
      "prompt": "计算机求解问题的一般过程",
      "answer": "理解问题，建立模型，设计算法，证明正确性，分析复杂性，编程实现，测试调试。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-06",
      "type": "short",
      "section": "问答题",
      "number": 6,
      "title": "算法复杂性",
      "prompt": "算法复杂性",
      "answer": "算法复杂性是算法消耗资源的量；时间复杂性记运行时间 T(n)，空间复杂性记额外空间 S(n)。最好是同规模输入中最小时间，最坏是最大时间，平均是按输入概率加权的平均时间。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-07",
      "type": "short",
      "section": "问答题",
      "number": 7,
      "title": "复杂性分析目的",
      "prompt": "复杂性分析目的",
      "answer": "估计算法随规模增长的效率，比较算法优劣，判断算法是否可行。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-08",
      "type": "short",
      "section": "问答题",
      "number": 8,
      "title": "冒泡排序复杂性",
      "prompt": "冒泡排序复杂性",
      "answer": "比较次数通常为 O(n^2)。若有提前结束标志，最好 O(n)、移动 O(1) 或 O(n)；最坏逆序时比较和移动均 O(n^2)；平均 O(n^2)。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-09",
      "type": "short",
      "section": "问答题",
      "number": 9,
      "title": "复杂性符号",
      "prompt": "复杂性符号",
      "answer": "O(f) 表示上界，Ω(f) 表示下界，Θ(f) 表示同阶，即同时属于 O(f) 和 Ω(f)。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-10",
      "type": "short",
      "section": "问答题",
      "number": 10,
      "title": "非递归与递归复杂性分析",
      "prompt": "非递归与递归复杂性分析",
      "answer": "非递归看循环层数和基本语句执行次数；递归先列递推式 T(n)，再用展开法、递归树或主定理求解。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-11",
      "type": "short",
      "section": "问答题",
      "number": 11,
      "title": "常用算法设计技术",
      "prompt": "常用算法设计技术",
      "answer": "递推、蛮力、分治、动态规划、贪心、回溯、分支限界。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-12",
      "type": "short",
      "section": "问答题",
      "number": 12,
      "title": "递推法与蛮力法",
      "prompt": "递推法与蛮力法",
      "answer": "递推法由初值和递推关系逐步推出结果；蛮力法枚举所有可能解并逐个检验。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-13",
      "type": "short",
      "section": "问答题",
      "number": 13,
      "title": "递推算法三项工作",
      "prompt": "递推算法三项工作",
      "answer": "确定状态含义，给出初始条件，建立递推关系和计算顺序。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-14",
      "type": "short",
      "section": "问答题",
      "number": 14,
      "title": "凸 n 边形三角剖分",
      "prompt": "凸 n 边形三角剖分",
      "answer": "三角剖分数满足 h(2)=1，h(n)=Σ h(i)h(n-i+1)，本质是 Catalan 型递推；考试写清初值、循环求表即可。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-15",
      "type": "short",
      "section": "问答题",
      "number": 15,
      "title": "计算 a^n mod m",
      "prompt": "计算 a^n mod m",
      "answer": "递推/蛮力：res=1，循环 n 次 res=res*a mod m，时间 O(n)。可写快速幂：每次平方并按二进制位相乘，时间 O(logn)。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-16",
      "type": "short",
      "section": "问答题",
      "number": 16,
      "title": "百元买百鸡",
      "prompt": "百元买百鸡",
      "answer": "枚举公鸡 x、母鸡 y，小鸡 z=100-x-y，满足 5x+3y+z/3=100 且 z%3=0。双重循环时间 O(100^2)，常数规模。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-17",
      "type": "short",
      "section": "问答题",
      "number": 17,
      "title": "蛮力串匹配",
      "prompt": "蛮力串匹配",
      "answer": "对 S 的每个起点 i，逐字符比较 T；若全匹配则成功。最坏时间 O((n-m+1)m)，约 O(nm)。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-18",
      "type": "short",
      "section": "问答题",
      "number": 18,
      "title": "最近点对蛮力法",
      "prompt": "最近点对蛮力法",
      "answer": "给定平面 n 个点，求欧氏距离最近的一对；蛮力检查所有点对，时间 O(n^2)，空间 O(1)。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-19",
      "type": "short",
      "section": "问答题",
      "number": 19,
      "title": "分治法思想",
      "prompt": "分治法思想",
      "answer": "把原问题分成若干规模较小、相互独立且同类型的子问题，递归求解后合并得到原问题解。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-20",
      "type": "short",
      "section": "问答题",
      "number": 20,
      "title": "分治适用特征",
      "prompt": "分治适用特征",
      "answer": "小规模易解；可分成同类子问题；子问题相互独立；子问题解能合并成原问题解。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-21",
      "type": "short",
      "section": "问答题",
      "number": 21,
      "title": "分治基本步骤",
      "prompt": "分治基本步骤",
      "answer": "Divide 分解，Conquer 递归求解，Combine 合并。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-22",
      "type": "short",
      "section": "问答题",
      "number": 22,
      "title": "归并排序",
      "prompt": "归并排序",
      "answer": "把数组分成两半分别排序，再线性合并；递推式 T(n)=2T(n/2)+O(n)，解为 O(nlogn)。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-23",
      "type": "short",
      "section": "问答题",
      "number": 23,
      "title": "快速排序",
      "prompt": "快速排序",
      "answer": "选基准，把小于基准的放左边、大于的放右边，再递归两边；最好 O(nlogn)，最坏 O(n^2)。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-24",
      "type": "short",
      "section": "问答题",
      "number": 24,
      "title": "动态规划思想",
      "prompt": "动态规划思想",
      "answer": "把问题分成重叠子问题，保存子问题最优值，自底向上或备忘录求解，避免重复计算。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-25",
      "type": "short",
      "section": "问答题",
      "number": 25,
      "title": "动态规划步骤",
      "prompt": "动态规划步骤",
      "answer": "刻画最优解结构；定义状态；写递推方程和边界；按顺序计算最优值；必要时构造最优解。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-26",
      "type": "short",
      "section": "问答题",
      "number": 26,
      "title": "分治与动态规划异同",
      "prompt": "分治与动态规划异同",
      "answer": "相同：都分解成子问题。不同：分治子问题通常独立，动态规划子问题重叠并保存结果；分治多递归，动态规划多填表。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-27",
      "type": "short",
      "section": "问答题",
      "number": 27,
      "title": "贪心算法",
      "prompt": "贪心算法",
      "answer": "每一步都作当前看来最优的选择，并希望由局部最优得到全局最优。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-28",
      "type": "short",
      "section": "问答题",
      "number": 28,
      "title": "动态规划与贪心异同",
      "prompt": "动态规划与贪心异同",
      "answer": "相同：都需最优子结构。不同：贪心还需贪心选择性质，不回头；动态规划会比较多个子问题选择。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-29",
      "type": "short",
      "section": "问答题",
      "number": 29,
      "title": "深度优先搜索",
      "prompt": "深度优先搜索",
      "answer": "沿一条分支尽量深入，走不通再回退搜索其他分支，常用栈或递归实现。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-30",
      "type": "short",
      "section": "问答题",
      "number": 30,
      "title": "回溯两类解空间树",
      "prompt": "回溯两类解空间树",
      "answer": "子集树：每个元素选或不选；排列树：对元素排列顺序进行搜索。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-31",
      "type": "short",
      "section": "问答题",
      "number": 31,
      "title": "回溯法思想",
      "prompt": "回溯法思想",
      "answer": "在解空间树中深度优先搜索；每到结点先判断约束和限界，不可能得到解或更优解就剪枝。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-32",
      "type": "short",
      "section": "问答题",
      "number": 32,
      "title": "子集树框架",
      "prompt": "子集树框架",
      "answer": "Backtrack(t)：若 t>n 输出/更新；否则枚举 x[t] 的取值，满足约束和限界则递归 Backtrack(t+1)。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-33",
      "type": "short",
      "section": "问答题",
      "number": 33,
      "title": "排列树框架",
      "prompt": "排列树框架",
      "answer": "Backtrack(t)：若 t>n 输出/更新；否则 for i=t..n 交换第 t 位与第 i 位，满足条件则递归，再交换回来。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-34",
      "type": "short",
      "section": "问答题",
      "number": 34,
      "title": "广度优先搜索",
      "prompt": "广度优先搜索",
      "answer": "从根开始按层扩展结点，先生成的结点先扩展，常用队列实现。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-35",
      "type": "short",
      "section": "问答题",
      "number": 35,
      "title": "A*算法",
      "prompt": "A*算法",
      "answer": "用 f(n)=g(n)+h(n) 作为优先级；g(n) 是从初始状态到 n 的实际代价，h(n) 是 n 到目标的估计代价；优先扩展 f 小的结点。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-36",
      "type": "short",
      "section": "问答题",
      "number": 36,
      "title": "分支限界法思想",
      "prompt": "分支限界法思想",
      "answer": "按广度优先或优先队列方式扩展活结点，用限界函数判断某分支是否可能得到更优解，不能则剪去。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-37",
      "type": "short",
      "section": "问答题",
      "number": 37,
      "title": "分支限界法与回溯法相同点",
      "prompt": "分支限界法与回溯法相同点",
      "answer": "都搜索解空间树，都用约束/限界剪枝，都可求组合优化问题。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-38",
      "type": "short",
      "section": "问答题",
      "number": 38,
      "title": "分支限界法设计步骤",
      "prompt": "分支限界法设计步骤",
      "answer": "确定解空间树；设计约束函数和限界函数；选择活结点表组织方式；不断取扩展结点、生成孩子、剪枝并更新最优解。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "qa-39",
      "type": "short",
      "section": "问答题",
      "number": 39,
      "title": "分支限界法搜索策略",
      "prompt": "分支限界法搜索策略",
      "answer": "队列式按 FIFO 广度优先；优先队列式按最小耗费或最大效益优先。",
      "analysis": "抓住关键词，考试按“定义/步骤/复杂度/区别”分点写。"
    },
    {
      "id": "design-01",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 1,
      "title": "最长公共子序列 LCS",
      "prompt": "用动态规划策略求解最长公共子序列问题：\n（1）给出计算最优值的递归方程。\n（2）给定两个序列X={B,C,D,A}，Y={A,B,C,B}，请采用动态规划策略求出其最长公共子序列，要求给出过程。",
      "answer": "递推方程：c[i][0]=c[0][j]=0；若 xi=yj，则 c[i][j]=c[i-1][j-1]+1；否则 c[i][j]=max(c[i-1][j],c[i][j-1])。\nX={B,C,D,A}, Y={A,B,C,B} 的一个最长公共子序列是 {B,C}，长度为 2。写过程时画 4×4 表，按行填 c 值并从右下角回溯。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": null
    },
    {
      "id": "design-02",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 2,
      "title": "函数阶比较",
      "prompt": "对下列各组函数f (n) 和g (n)，确定f (n) = O (g (n)) 或f (n) =Ω(g (n))或f(n) =θ(g(n))，并简要说明理由。\n(1) f(n)=2n； g(n)=n!       f (n) = O (g (n))  2^n<<n!\n(2) f(n)=sqrt(n)=n1/2； g(n)=log n2     f (n) =Ω(g (n)),  f (n) = O (g (n))不成立\nf(n)/g(n)-->无穷大\n(3) f(n)=100； g(n)=log100；f(n) =θ(g(n))\n(4) f(n)=n3； g(n)= 3n       f (n) = O (g (n))\n(5) f(n)=3n； g(n)=2n   3n>2n, 不可能找到常数C，是n充分大是成立3n<C2n\n所以，f (n) =Ω(g (n))",
      "answer": "(1) 2^n = O(n!)，因为阶乘增长快于指数 2^n。\n(2) sqrt(n)=Ω(log n^2)，且不是 O(log n^2)，因为 n^(1/2)/log n -> 无穷。\n(3) 100 与 log100 都是常数，故 Θ。\n(4) n^3 = O(3^n)，指数增长快于多项式。\n(5) 3^n = Ω(2^n)，且不是 O(2^n)。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": null
    },
    {
      "id": "design-03",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 3,
      "title": "Kruskal 最小生成树",
      "prompt": "对下图所示的连通网络G，用克鲁斯卡尔(Kruskal)算法求G的最小生成树T,请写出在算法执行过程中，依次加入T的边集TE中的边。说明该算法的贪心策略和算法的基本思想，并简要分析算法的时间复杂度。",
      "answer": "按边权从小到大选且不成环： (3,4,6)、(2,3,7)、跳过(2,4,9)、(1,5,11)、(4,6,15)、(4,5,17)。\n得到 TE={(3,4),(2,3),(1,5),(4,6),(4,5)}，总权值 56。\n贪心策略：每次选当前不成环的最小边。排序主导，常见复杂度 O(eloge)。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": "assets/image1.png"
    },
    {
      "id": "design-04",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 4,
      "title": "递归归并排序复杂性",
      "prompt": "请用分治策略设计递归的归并排序算法，并分析其时间复杂性（要求：分别给出divide、conquer、combine这三个阶段所花的时间，并在此基础上列出递归方程，最后用套用公式法求出其解的渐进阶）。",
      "answer": "divide：求中点 O(1)；conquer：递归两个 n/2 子问题；combine：合并 O(n)。\n递推式 T(n)=2T(n/2)+O(n)，由主定理得 T(n)=O(nlogn)。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": null
    },
    {
      "id": "design-05",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 5,
      "title": "8人循环赛日程表",
      "prompt": "设有n=2k个运动员要进行循环赛,现设计一个满足以下要求的比赛日程表:\n每个选手必须与其他n-1名选手比赛各一次;每个选手一天至多只能赛一次; 循环赛要在最短时间内完成.\n(1)循环赛最少需要进行( n-1 )天.\n(2)当n=23=8时,请画出循环赛日程表:\n1 2 3 4 5 6 7",
      "answer": "最少 n-1=7 天。原文图片中的 8×8 表可直接作为答案：第 i 行表示第 i 位运动员每天的对手，主对角线为自己不赛。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": "assets/image2.jpeg"
    },
    {
      "id": "design-06",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 6,
      "title": "哈夫曼编码",
      "prompt": "考虑用哈夫曼算法来找字符a,b,c,d,e,f 的最优编码。这些字符出现在文件中 的频数之比为 20:10:6:4:44:16。要求：\n（1）简述使用哈夫曼算法构造最优编码的基本步骤；\n（2）构造对应的哈夫曼树，并据此给出a,b,c,d,e,f 的一种最优编码。\n（3）再字符a,b,c,d,e,f,g,h,i 出现的频数 3 5 6 7 7 14 20 43 56，画出对应的哈夫曼树，并据此给出a,b,c,d,e,f,g,h,i 的一种最优编码。",
      "answer": "步骤：把每个字符作为权为频数的叶子；每次取两个最小权结点合并；重复到只剩一棵树；左0右1得到编码。\na,b,c,d,e,f 频数 20,10,6,4,44,16 的一种编码：e:0，b:100，d:1010，c:1011，f:110，a:111。等价左右互换也正确。\na..i 频数 3,5,6,7,7,14,20,43,56 的一种编码：c:0000，d:0001，f:001，e:0100，a:01010，b:01011，g:011，h:10，i:11。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": null
    },
    {
      "id": "design-07",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 7,
      "title": "最大最小元素问题",
      "prompt": "最大最小元素问题。考虑在序列A[1..n]中找最大最小元素的问题。",
      "answer": "蛮力法：分别扫描求 max 和 min，约 2n 次比较，O(n)。\n分治法：一分为二分别求最大最小，再合并比较两次，T(n)=2T(n/2)+O(1)，O(n)。\n更优成对比较：每两元素先比较，再分别与 max/min 比较，约 3n/2 次比较。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": null
    },
    {
      "id": "design-08",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 8,
      "title": "0-1背包动态规划",
      "prompt": "考虑使用动态规划方法求解下列问题：\n0-1背包数据如下表，求：能够放入背包的最有价值的物品集合。\n如设： V(i, j) 为前 i 个物品中能够装入承重量 j 的背包中的最大总价值。请将如下递推式填写完整：\nV(0, j) = 0           （0个物品），\nV(i, 0) = 0（承重量0）\nV(i, j) = V(i-1, j)    如果第 i 个物品不能装入，j < wi （超重）,\nV(i, j) =max{              ,                 ) 如 j > wi （不超重）\ni在最优子集中      i不在最优子集中\n自底向上：按行或列填写下表。",
      "answer": "递推式：若 j<wi，V(i,j)=V(i-1,j)；若 j>=wi，V(i,j)=max{V(i-1,j), V(i-1,j-wi)+vi}。\n题图只给出待填 DP 表，未给具体 wi、vi；考试若给数据，就从 i=1、j=1 开始按上式逐格填表，最后 V(n,C) 为最优值，再逆推选中物品。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": "assets/image3.jpeg"
    },
    {
      "id": "design-09",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 9,
      "title": "4皇后与 n 皇后约束",
      "prompt": "请画出用回溯法解4皇后问题的解空间树和搜索空间树：\n写出n皇后问题的约束条件，并画出4皇后问题的搜索树。",
      "answer": "n 皇后约束：任意两皇后不同行、不同列、不同主/副对角线。若第 i 行放在 x[i] 列，则要求 x[i]≠x[j] 且 |i-j|≠|x[i]-x[j]|。\n4皇后两个解可写为 (2,4,1,3) 和 (3,1,4,2)。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": null
    },
    {
      "id": "design-10",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 10,
      "title": "分支限界法解0-1背包示例",
      "prompt": "考虑用限界分枝法解0-1背包问题\n给定n种物品和一背包。物品i的重量是wi，其价值为vi，背包的容量为C。问应如何选择装入背包的物品，使得装入背包中物品的总价值最大?\n示例：n=3, C=30, w={16, 15, 15}, v={45, 25, 25}\n求：1、问题的解空间树，2、约束条件  3、如何剪枝？",
      "answer": "解空间树：第 i 层决定第 i 个物品取1或取0，是子集树。\n约束条件：当前重量 cw<=C。\n剪枝：若超重则剪；若当前价值 cp+剩余价值上界 <= bestp，也剪。\n例 n=3,C=30,w={16,15,15},v={45,25,25}：最优选物品1和2或1和3，重量31超重，所以不能；选2和3重量30价值50；选1价值45，故最优为物品2、3，价值50。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": "assets/image3.jpeg"
    },
    {
      "id": "design-11",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 11,
      "title": "回溯法解0-1背包示例",
      "prompt": "请画出用回溯法解n=3的0-1背包问题的解空间树和当三个物品的重量为{20, 15, 10}，价值为{20, 30, 25}，背包容量为25时搜索空间树。",
      "answer": "解空间树为三层子集树，每层取 xi=1 或 0。\nw={20,15,10}, v={20,30,25}, C=25：可行较优解为选物品2和3，重量25，价值55，是最优解。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": "assets/image3.jpeg"
    },
    {
      "id": "design-12",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 12,
      "title": "最大子段和分治算法",
      "prompt": "最大子段和问题：给定一个有n（n≥1）个整数的序列a[1..n]，要求出其中最大连续子序列的和。规定一个序列最大连续子序列和至少是0（长度为0的子序列），如果小于0，其结果为0。\n设计该问题的分治算法，并分析算法复杂性。",
      "answer": "把区间分成左右两半，最大子段和要么在左半，要么在右半，要么跨越中点。分别递归求左右最大，再线性求跨中点最大，取三者最大。\n递推式 T(n)=2T(n/2)+O(n)，复杂度 O(nlogn)。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": null
    },
    {
      "id": "design-13",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 13,
      "title": "编辑距离动态规划",
      "prompt": "写出编辑距离问题的动态规划方程，要求作必要的分析。用删除、插入、替换",
      "answer": "设 d[i][j] 为 A[1..i] 到 B[1..j] 的最小编辑次数。边界 d[i][0]=i，d[0][j]=j。\n若 A[i]=B[j]，d[i][j]=d[i-1][j-1]；否则 d[i][j]=1+min{d[i-1][j] 删除, d[i][j-1] 插入, d[i-1][j-1] 替换}。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": null
    },
    {
      "id": "design-14",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 14,
      "title": "数塔问题",
      "prompt": "对数塔问题的算法进行简要分析，写出程序。",
      "answer": "从倒数第二层向上递推：dp[i][j]=a[i][j]+max(dp[i+1][j],dp[i+1][j+1])；最后 dp[1][1] 为最大路径和。时间 O(n^2)，空间可用一维数组优化。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": null
    },
    {
      "id": "design-15",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 15,
      "title": "子集树或排列树判断",
      "prompt": "分别写出最大最小问题蛮力法、递归算法、分治法。\n画出以下问题的子集树或排列树\n（1）3个物品的0-1背包问题；有两艘船总载重量c的3个集装箱（仅有重量）的装载问题。\n（2）4城市的旅行商问题\n（3）对下图用3种颜色做顶点着色，使得相邻顶点不同色\n（4）4个人4个任务的任务安排问题；4男4女运动员最佳搭配问题（每对男女运动员搭配有一个成绩评估值pij）\n（5）4皇后问题\n（6）批处理作业调度问题",
      "answer": "0-1背包、装载问题：子集树。\n4城市旅行商、4人4任务、男女最佳搭配、批处理作业调度：排列树。\n图 m 着色、n 皇后：通常按每个顶点/每行选择颜色或列，也可看作状态树；考试常把图着色写成 m 叉树，n 皇后写成排列树加约束。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": null
    },
    {
      "id": "design-16",
      "type": "design",
      "section": "算法设计与分析题",
      "number": 16,
      "title": "程序段时间复杂性",
      "prompt": "分析下面程序段的时间复杂性\n（1）int i=1;\nfor(i=1; i<n;i++){\ncout<<i<<' ';\ni=i*2;\n}\n（2）for(int i=1;i<=n;i++){\nint j=1;\nwhile(j<=n){\nj=j*2;\n}\n}\n（3）for(int i=1;i<=n;i++){\nfor(int j=i;j<=n;j++){\nfor(int k=j;k<=n;k++){\ncout<<i+j+k<<' ';\n}\ncout<<endl;\n}\n（4）int n =20;\ncin>>n;\nint*a =new int[n],j;\nfor(int i=1;i<=n;i++){\nj=i;\nj++;\n}\n（5）\nint sum(int m,int n){\nint sum1 = 0 ;\nint sum2 = 0 ;\nfor(int i=0;i<=m;i++){\nsum1+=i;\n}\nfor(int j=1;j<=n;j++){\nsum2+=j;\n}\nreturn sum1+sum2;\n}",
      "answer": "(1) i 每轮先乘2再被 for 的 i++ 加1，仍按指数增长，O(logn)。\n(2) 外层 n 次，内层 j 翻倍到 n，O(nlogn)。\n(3) 三重递增循环，总次数为三次组合量级，O(n^3)。\n(4) 单循环 n 次，O(n)。\n(5) 两个独立循环，O(m+n)。",
      "analysis": "先写算法思想，再写递推式/步骤，最后补复杂度。",
      "image": null
    }
  ]
};
