import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Post content is required" },
        { status: 400 },
      );
    }

    console.log("API received content:", content);

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.error("DEEPSEEK_API_KEY is not configured");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 },
      );
    }

    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: apiKey,
    });

    const style = "engaging";

    const prompt = `Please reformat the following post to make it more ${style} and appropriate for social media, while keeping the core message intact. Keep it concise and under 280 characters if possible. Do not use Markdown formatting.

    Original post: "${content}"
    
    Reformatted post:`;

    console.log("Calling OpenAI API with prompt:", prompt);

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that formats social media posts to be more engaging while maintaining the original message.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    console.log("OpenAI API response:", completion);

    const enhancedPost = completion.choices[0].message.content;

    if (!enhancedPost) {
      throw new Error("No response from AI");
    }

    let cleanedPost = enhancedPost.replace(/^"+|"+$/g, "").trim();

    console.log("Enhanced post:", cleanedPost);

    // let's make sure MARKDOWN is not used
    cleanedPost = cleanedPost.replace(/^#+/, "").trim();
    return NextResponse.json({ enhancedPost: cleanedPost });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to enhance post",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
