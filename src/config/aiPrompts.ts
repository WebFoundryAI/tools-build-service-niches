export const AI_TEMPLATES = {
  homeIntro: `
You are generating SEO-safe, conversion-focused homepage content for a UK drain services company.

Brand: "{{brandName}}"
Primary Location: "{{primaryLocationName}}"
Service Area: "{{serviceAreaLabel}}"

Write a concise introduction that:
- Explains what the company does.
- Emphasises reliability, speed, and emergency callouts.
- Mentions the primary service area naturally.
- Avoids any fabricated claims.

Tone: Clear, helpful, professional.
Language: UK English.
Output: Plain text only, no markdown formatting.
`,

  servicesOverview: `
Write a short introductory section for a Services page for a UK drain company.

Brand: "{{brandName}}"
Primary Location: "{{primaryLocationName}}"

Explain:
- Overview of services.
- When a homeowner should call for help.
- The benefits of quick intervention.
- Clear, simple guidance.

No fake claims, no invented testimonials.
UK English.
Output: Plain text only, no markdown formatting.
`,

  genericService: `
Write a detailed service page for a UK drain services company.

Service: "{{serviceName}}"
Brand: "{{brandName}}"
Primary Location: "{{primaryLocationName}}"

Explain:
- What the service is.
- When it is needed.
- How it works in typical UK homes.
- A simple call-to-action.

Tone: factual, practical, non-salesy.
Language: UK English.
Length: 400-600 words.
Output: Plain text with paragraph breaks. No markdown, no headers, no bullet points.
`,

  locationPage: `
Write a helpful, hyperlocal page describing drain services in "{{locationName}}", UK.

Brand: "{{brandName}}"
Primary Location: "{{primaryLocationName}}"
Service Area Label: "{{serviceAreaLabel}}"

Content must include:
- Description of the area (roads, neighbourhoods, types of properties).
- How drain problems typically appear in this location.
- When residents should call a professional.
- A simple CTA.

Rules:
- Do not invent fake businesses or competitor names.
- Mention roads/areas only if commonly known.
- Tone: UK English, practical.

Length: 300-500 words.
Output: Plain text with paragraph breaks. No markdown, no headers.
`,

  serviceInLocation: `
Write a full SEO-friendly local service page.

Service: "{{serviceName}}"
Location: "{{locationName}}"
Brand: "{{brandName}}"
Primary Location: "{{primaryLocationName}}"
Phone: "{{phone}}"

Content requirements:
- Explain the service in detail.
- Describe how drain issues typically appear in this specific location.
- Mention local roads/areas only if widely known (no fake POIs).
- Provide practical homeowner guidance.
- End with a clear CTA to call {{phone}}.

Rules:
- UK English.
- No fabricated claims or testimonials.
- Length: 400-600 words.
Output: Plain text with paragraph breaks. No markdown, no headers.
`,

  aboutPage: `
Create an About page for a UK drain services company.

Brand: "{{brandName}}"
Primary Location: "{{primaryLocationName}}"

Explain:
- What the brand stands for.
- Quality, reliability, and values.
- The kind of problems the team specialises in solving.

Tone: clear, human, trustworthy.
Language: UK English.
Length: 250-400 words.
Output: Plain text with paragraph breaks. No markdown.
`,

  faqPage: `
Generate a list of realistic FAQs and answers for a UK drain company.

Brand: "{{brandName}}"
Primary Location: "{{primaryLocationName}}"

Provide exactly 8 FAQs in this exact JSON format:
[
  {"question": "Your question here?", "answer": "Your answer here."},
  ...
]

Rules:
- Clear, accurate answers.
- No fabricated guarantees or technical claims.
- Tone: UK English, friendly and knowledgeable.
Output: Valid JSON array only, no other text.
`,

  blogPost: `
Write an informative blog post for a UK drain services company.

Topic: "{{topic}}"
Brand: "{{brandName}}"
Primary Location: "{{primaryLocationName}}"

Rules:
- Explain the topic in detail.
- Avoid sensational claims.
- Provide actionable UK-relevant advice.
- 500-700 words.

Tone: helpful, knowledgeable, approachable.
Language: UK English.
Output: Plain text with paragraph breaks. No markdown headers.
`
} as const;

export type AITemplateName = keyof typeof AI_TEMPLATES;
