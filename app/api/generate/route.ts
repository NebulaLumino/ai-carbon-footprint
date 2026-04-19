import OpenAI from 'openai';

function getClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
  });
}

export async function POST(request: Request) {
  try {
    const { inputs } = await request.json();

    const prompt = `You are an expert carbon footprint analyst and sustainability advisor. Based on the following inputs, provide a comprehensive carbon footprint analysis and reduction plan.

INPUTS:
${inputs}

Please provide your response in this exact format:

## 🌍 Carbon Footprint Analysis

### Current Footprint Estimate
[Your analysis of the carbon footprint based on inputs]

### Key Emission Sources Identified
[Bullet points of the main sources]

### 🚀 Reduction Recommendations

#### Immediate Actions (0-6 months)
[Specific, actionable recommendations]

#### Medium-Term Actions (6-18 months)
[Recommendations requiring more planning]

#### Long-Term Strategies (18+ months)
[Transformational changes]

### 📊 Projected Impact
[Estimated CO2e reduction from implementing recommendations]

### 🏆 Quick Wins
[3-5 easy wins with estimated savings]

Be specific with numbers, percentages, and concrete actions. Use relevant environmental science data.`;

    const client = getClient();
    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a world-class environmental sustainability expert specializing in carbon footprint analysis and climate action planning.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const result = completion.choices[0]?.message?.content || 'No response generated.';
    return Response.json({ result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}
