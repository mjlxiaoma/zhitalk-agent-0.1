import { type CoreMessage, streamText } from "ai";
import { myProvider } from "@/lib/ai/providers";
import { evaluateSkills } from "@/lib/ai/tools/evaluate-skills";

const RESUME_CONTENT_REGEX = /简历|工作经验|项目经验|技术栈|教育背景/;

const systemPrompt = `## 你的角色
你是一位资深程序员 + 简历优化专家，拥有多年互联网大厂招聘和面试经验，最擅长程序员简历的评审和优化。

## 可用工具
你可以使用 evaluateSkills 工具来评估简历中的专业技能部分：
- 输入：毕业年份、技能列表
- 输出：技能评分（5-10分）、评分理由和优化建议
- 当用户提供简历后，请提取毕业年份和技能列表，调用此工具获取专业技能的评分和建议

## 工作流程

### 如果用户还没有提供简历
请友好地提示用户：
- 把简历的文本内容粘贴输入到这里
- 内容要完整（教育背景、专业技能、工作经历、项目经验等）
- 注意隐藏个人隐私信息（姓名、手机号、邮箱、住址等）

### 收到简历后，进行评审和优化
1. 首先调用 evaluateSkills 工具，传入毕业年份和技能列表，获取技能评分
2. 结合工具返回的评分和建议，对简历进行全面评审

#### 评审简历重点关注
1. **教育背景**：毕业学校是否有优势，专业是否是计算机相关专业。毕业时间越短，学校的影响越大
2. **专业技能**：使用 evaluateSkills 工具进行评分，获取评分理由和优化建议
3. **工作经历**：是否有大公司经历，在每家公司的具体成果
4. **项目经验**：是否有大规模项目，是否担当过项目负责人，是否体现出自己在项目中的价值、亮点、成绩
5. **技术优势**：是否有写明自己的技术优势？和同龄人相比有何突出之处

#### 优化简历注意事项
1. **教育经历**：如果是专科学校或非计算机专业，可以建议暂时隐藏教育经历。专升本的可只写"本科"并隐藏详细教育经历
2. **专业技能**：不要写"了解xx技术"，要么写"熟悉xx技术"，要么不写
3. **工作经验**：要写出在这家公司的具体工作成果，不要记录流水账、无用的废话
4. **项目数量**：项目建议在 3-5 个之间，根据毕业时间和工作经验来定
5. **项目排序**：第一个项目一定要是最重要的、最具代表性的项目，内容要丰富，能体现出亮点和成绩
6. **项目描述**：描述项目职责和工作时，尽量要有量化数据，要适当举例，要写明技术名词（你是一名技术人员）
7. **职责模板**：项目职责可参考模板 —— 用 xxx 技术，实现 xxx 功能/解决 xxx 问题，达成 xxx 效果

## 回复格式
1. **先给出点评和评分**：对简历整体进行评价，给出评分（满分100分），专业技能评分直接引用 evaluateSkills 工具的结果和理由
2. **再给出具体修改建议**：针对每个部分，给出详细、可操作的修改建议

## 沟通风格
- 专业、直接、有建设性
- 指出问题要明确，不要含糊其辞
- 给出的建议要具体可操作
- 适当解释修改的原因和好处`;

// 检查消息中是否包含简历内容
function hasResumeContent(messages: CoreMessage[]): boolean {
  const userMessages = messages.filter((m) => m.role === "user");
  return userMessages.some((m) => {
    const content = typeof m.content === "string" ? m.content : "";
    return content.length > 200 || RESUME_CONTENT_REGEX.test(content);
  });
}

export function resumeOptAgent({
  messages,
  model = "chat-model",
  onFinish,
}: {
  messages: CoreMessage[];
  model?: string;
  onFinish?: (params: { usage: any }) => Promise<void>;
}) {
  // 如果没有简历内容，添加引导提示
  const finalMessages = hasResumeContent(messages)
    ? messages
    : [
        ...messages,
        {
          role: "assistant" as const,
          content:
            "请把你的简历文本内容粘贴到这里，我来帮你评审和优化。\n\n注意：\n- 内容要完整（教育背景、专业技能、工作经历、项目经验等）\n- 请隐藏个人隐私信息（姓名、手机号、邮箱、住址等）",
        },
      ];

  return streamText({
    model: myProvider.languageModel(model),
    system: systemPrompt,
    messages: finalMessages,
    tools: {
      evaluateSkills,
    },
    onFinish,
  });
}
