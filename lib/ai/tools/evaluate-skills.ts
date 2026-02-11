import { tool } from "ai";
import { z } from "zod";

/**
 * 根据毕业年限和技能数量计算基础分数
 */
function calculateBaseScore(
  yearsOfExperience: number,
  skillCount: number
): number {
  // 预期技能数量：工作经验越久，预期技能越多
  // 1年: 5-8个技能，3年: 8-12个技能，5年+: 12-18个技能
  const expectedSkillCount = Math.min(5 + yearsOfExperience * 2, 18);

  // 技能数量得分（满分 2.5 分）
  const skillCountRatio = Math.min(skillCount / expectedSkillCount, 1.5);
  const skillCountScore = skillCountRatio * 2.5;

  return Math.min(skillCountScore, 2.5);
}

/**
 * 分析技能深度（是否有高级/深入的技能描述）
 */
function analyzeSkillDepth(skills: string[]): {
  score: number;
  hasAdvancedSkills: boolean;
  advancedSkills: string[];
} {
  // 高级技能关键词
  const advancedKeywords = [
    "精通",
    "深入",
    "架构",
    "性能优化",
    "源码",
    "底层",
    "原理",
    "设计模式",
    "微服务",
    "分布式",
    "高并发",
    "大数据",
    "机器学习",
    "AI",
    "算法",
    "安全",
    "DevOps",
    "CI/CD",
    "容器化",
    "K8s",
    "Kubernetes",
  ];

  // 熟练程度关键词
  const proficientKeywords = ["熟悉", "熟练", "掌握"];

  let advancedCount = 0;
  let proficientCount = 0;
  const advancedSkills: string[] = [];

  for (const skill of skills) {
    const hasAdvanced = advancedKeywords.some((kw) => skill.includes(kw));
    const hasProficient = proficientKeywords.some((kw) => skill.includes(kw));

    if (hasAdvanced) {
      advancedCount++;
      advancedSkills.push(skill);
    }
    if (hasProficient) {
      proficientCount++;
    }
  }

  // 深度得分（满分 2.5 分）
  const advancedRatio = skills.length > 0 ? advancedCount / skills.length : 0;
  const proficientRatio =
    skills.length > 0 ? proficientCount / skills.length : 0;

  const depthScore = Math.min(advancedRatio * 3 + proficientRatio * 1.5, 2.5);

  return {
    score: depthScore,
    hasAdvancedSkills: advancedCount > 0,
    advancedSkills,
  };
}

/**
 * 分析技能广度（是否覆盖多个技术领域）
 */
function analyzeSkillBreadth(skills: string[]): {
  score: number;
  coveredDomains: string[];
} {
  // 技术领域分类
  const domains: Record<string, string[]> = {
    前端: [
      "React",
      "Vue",
      "Angular",
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "小程序",
      "Webpack",
      "Vite",
      "Next",
      "Nuxt",
    ],
    后端: [
      "Node",
      "Java",
      "Python",
      "Go",
      "PHP",
      "Spring",
      "Django",
      "Express",
      "Nest",
      "Koa",
    ],
    数据库: [
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Oracle",
      "SQL",
      "数据库",
    ],
    移动端: [
      "iOS",
      "Android",
      "Flutter",
      "React Native",
      "Swift",
      "Kotlin",
      "App",
    ],
    "运维/云": [
      "Linux",
      "Docker",
      "K8s",
      "Kubernetes",
      "AWS",
      "阿里云",
      "腾讯云",
      "CI/CD",
      "Jenkins",
      "Nginx",
    ],
    "工具/其他": ["Git", "测试", "敏捷", "Scrum", "产品", "项目管理"],
  };

  const coveredDomains: string[] = [];
  const skillsLower = skills.map((s) => s.toLowerCase()).join(" ");

  for (const [domain, keywords] of Object.entries(domains)) {
    const hasDomain = keywords.some((kw) =>
      skillsLower.includes(kw.toLowerCase())
    );
    if (hasDomain) {
      coveredDomains.push(domain);
    }
  }

  // 广度得分（满分 2.5 分）
  // 覆盖 1 个领域 0.5 分，最多 2.5 分
  const breadthScore = Math.min(coveredDomains.length * 0.5, 2.5);

  return {
    score: breadthScore,
    coveredDomains,
  };
}

/**
 * 检查技能与工作年限的匹配度
 */
function checkExperienceMatch(
  yearsOfExperience: number,
  skills: string[],
  depthAnalysis: ReturnType<typeof analyzeSkillDepth>
): {
  score: number;
  isMatched: boolean;
  feedback: string;
} {
  const skillCount = skills.length;
  const hasAdvanced = depthAnalysis.hasAdvancedSkills;

  let isMatched = true;
  let feedback = "";
  let score = 2.5; // 满分 2.5 分

  if (yearsOfExperience <= 1) {
    // 应届/1年经验：技能 5-10 个，不要求高级技能
    if (skillCount < 3) {
      isMatched = false;
      feedback = "技能数量偏少，建议补充基础技能";
      score = 1.5;
    } else if (skillCount > 15) {
      isMatched = false;
      feedback = "技能数量过多，建议精简，突出核心技能";
      score = 2.0;
    }
  } else if (yearsOfExperience <= 3) {
    // 1-3年经验：技能 8-15 个，应有部分熟练技能
    if (skillCount < 5) {
      isMatched = false;
      feedback = "技能数量与工作年限不匹配，建议补充";
      score = 1.5;
    } else if (!hasAdvanced && skillCount < 10) {
      feedback = "建议突出 1-2 个深入掌握的技能";
      score = 2.0;
    }
  } else if (yearsOfExperience <= 5) {
    // 3-5年经验：应有明确的技术深度
    if (!hasAdvanced) {
      isMatched = false;
      feedback = "工作 3 年以上应体现技术深度，建议补充精通/深入的技能描述";
      score = 1.5;
    }
  } else if (!hasAdvanced) {
    // 5年以上：应有技术专长和广度
    isMatched = false;
    feedback = "资深工程师应有明确的技术专长，建议突出核心竞争力";
    score = 1.0;
  } else if (depthAnalysis.advancedSkills.length < 2) {
    feedback = "建议增加更多深度技能，体现技术积累";
    score = 2.0;
  }

  return { score, isMatched, feedback };
}

/**
 * 生成综合建议
 */
type SuggestionInputs = {
  yearsOfExperience: number;
  skills: string[];
  depthAnalysis: ReturnType<typeof analyzeSkillDepth>;
  breadthAnalysis: ReturnType<typeof analyzeSkillBreadth>;
  matchAnalysis: ReturnType<typeof checkExperienceMatch>;
};

function generateSuggestion({
  yearsOfExperience,
  skills,
  depthAnalysis,
  breadthAnalysis,
  matchAnalysis,
}: SuggestionInputs): string {
  const suggestions: string[] = [];

  // 匹配度建议
  if (matchAnalysis.feedback) {
    suggestions.push(matchAnalysis.feedback);
  }

  // 深度建议
  if (!depthAnalysis.hasAdvancedSkills && yearsOfExperience >= 2) {
    suggestions.push("建议使用熟悉、熟练、精通等词描述技能掌握程度");
  }

  // 广度建议
  if (breadthAnalysis.coveredDomains.length < 2) {
    suggestions.push(
      "技能领域覆盖较窄，可考虑补充相关领域技能（如数据库、运维等）"
    );
  }

  // 数量建议
  if (skills.length < 5) {
    suggestions.push("技能数量偏少，建议补充到 8-12 个核心技能");
  } else if (skills.length > 20) {
    suggestions.push("技能数量过多，建议精简到 12-15 个，突出核心竞争力");
  }

  // 格式建议
  const hasUnderstand = skills.some((s) => s.includes("了解"));
  if (hasUnderstand) {
    suggestions.push("不建议写了解xx技术，要么写熟悉，要么不写");
  }

  if (suggestions.length === 0) {
    return "技能部分整体良好，与工作经验匹配";
  }

  return suggestions.join("；");
}

/**
 * 技能评分 Tool
 * 用于评估简历中的专业技能部分
 */
export const evaluateSkills = tool({
  description: "评估简历中的专业技能部分，根据毕业时间和技能列表进行评分和建议",
  inputSchema: z.object({
    graduationYear: z.number().describe("毕业年份，如 2020"),
    skills: z
      .array(z.string())
      .describe(
        "技能列表，如 ['熟悉 React', '熟练使用 TypeScript', '了解 Node.js']"
      ),
  }),
  execute: ({ graduationYear, skills }) => {
    // 计算工作年限
    const currentYear = new Date().getFullYear();
    const yearsOfExperience = Math.max(0, currentYear - graduationYear);

    // 各维度分析
    const baseScore = calculateBaseScore(yearsOfExperience, skills.length);
    const depthAnalysis = analyzeSkillDepth(skills);
    const breadthAnalysis = analyzeSkillBreadth(skills);
    const matchAnalysis = checkExperienceMatch(
      yearsOfExperience,
      skills,
      depthAnalysis
    );

    // 计算总分（5-10分）
    // 基础分 5 分 + 各维度加分（最多 5 分）
    const rawScore =
      5 +
      baseScore +
      depthAnalysis.score +
      breadthAnalysis.score +
      matchAnalysis.score;
    const score = Math.min(Math.max(Math.round(rawScore * 10) / 10, 5), 10);

    // 生成建议
    const suggestion = generateSuggestion({
      yearsOfExperience,
      skills,
      depthAnalysis,
      breadthAnalysis,
      matchAnalysis,
    });

    return {
      score,
      suggestion,
      details: {
        yearsOfExperience,
        skillCount: skills.length,
        coveredDomains: breadthAnalysis.coveredDomains,
        hasAdvancedSkills: depthAnalysis.hasAdvancedSkills,
      },
    };
  },
});
