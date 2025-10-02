const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generatePRD(ideaText) {
    try {
      const prompt = `
You are a senior product manager. Create a comprehensive Product Requirements Document (PRD) based on this idea:

"${ideaText}"

Return a JSON object with this exact structure:
{
  "title": "Product Title",
  "overview": "Brief product overview",
  "objectives": ["objective1", "objective2", "objective3"],
  "targetAudience": {
    "primary": "Primary user group",
    "secondary": "Secondary user group"
  },
  "features": [
    {
      "name": "Feature Name",
      "description": "Feature description",
      "priority": "High|Medium|Low"
    }
  ],
  "technicalRequirements": ["requirement1", "requirement2"],
  "timeline": {
    "estimatedDuration": "X weeks/months",
    "phases": [
      {"phase": "Phase name", "duration": "X weeks", "deliverables": ["deliverable1"]}
    ]
  },
  "successMetrics": ["metric1", "metric2"],
  "risks": ["risk1", "risk2"]
}

Ensure valid JSON only.
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No valid JSON found in AI response');

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('PRD Generation Error:', error);
      throw new Error('Failed to generate PRD: ' + error.message);
    }
  }

  async generateImplementationPlan(prdContent) {
    try {
      const prompt = `
You are a senior software architect. Based on this PRD:

${JSON.stringify(prdContent, null, 2)}

Return a JSON object with this structure:

{
  "projectSetup": {
    "techStack": {
      "frontend": ["technology1", "technology2"],
      "backend": ["technology1", "technology2"],
      "database": "database_type",
      "deployment": "deployment_platform"
    },
    "projectStructure": ["folder1", "folder2", "folder3"]
  },
  "developmentPhases": [
    {
      "phase": "Phase Name",
      "duration": "X weeks",
      "tasks": [
        {
          "task": "Task name",
          "description": "Task description",
          "estimatedHours": "X hours",
          "dependencies": ["dependency1"]
        }
      ]
    }
  ],
  "apiDesign": [
    {
      "endpoint": "GET /api/example",
      "description": "Endpoint description",
      "parameters": ["param1", "param2"],
      "response": "Response format"
    }
  ],
  "databaseSchema": [
    {
      "table": "table_name",
      "fields": ["field1", "field2"],
      "relationships": ["relationship description"]
    }
  ],
  "testing": {
    "strategy": "Testing approach",
    "types": ["unit", "integration", "e2e"],
    "tools": ["tool1", "tool2"]
  },
  "deployment": {
    "strategy": "Deployment strategy",
    "environments": ["dev", "staging", "prod"],
    "cicd": ["pipeline step1", "pipeline step2"]
  },
  "phases": [
    {
      "id": "phase-1",
      "title": "Step 1 - Planning & Setup",
      "description": "Plan the system architecture and set up repo/CI pipeline.",
      "stages": [
        {
          "id": "phase-1-stage-1",
          "title": "Initialize Project",
          "checkpoints": [
            {
              "id": "phase-1-stage-1-checkpoint-1",
              "title": "Create Git repo & project skeleton",
              "description": "Scaffold frontend/backend folders, configure linter, CI pipeline.",
              "code": "npx create-next-app && npm init -y",
              "testing": "Check repo builds successfully; CI runs green on initial commit."
            }
          ]
        }
      ]
    },
    {
      "id": "phase-2",
      "title": "Step 2 - Core Feature Implementation",
      "description": "Implement main features defined in PRD.",
      "stages": [
        {
          "id": "phase-2-stage-1",
          "title": "Build core APIs",
          "checkpoints": [
            {
              "id": "phase-2-stage-1-checkpoint-1",
              "title": "Implement /api/feature",
              "description": "Develop backend API for core functionality.",
              "code": "app.get('/api/feature', handler)",
              "testing": "Call API with Postman, ensure valid JSON response, add unit tests."
            }
          ]
        }
      ]
    },
    {
      "id": "phase-3",
      "title": "Step 3 - QA & Validation",
      "description": "Thoroughly test system end-to-end.",
      "stages": [
        {
          "id": "phase-3-stage-1",
          "title": "Run integration & e2e tests",
          "checkpoints": [
            {
              "id": "phase-3-stage-1-checkpoint-1",
              "title": "Validate features against PRD",
              "description": "Check each PRD feature works as expected.",
              "code": "npm run test:e2e",
              "testing": "All test cases pass; acceptance criteria validated."
            }
          ]
        }
      ]
    },
    {
      "id": "phase-4",
      "title": "Step 4 - Deployment",
      "description": "Deploy the application and monitor.",
      "stages": [
        {
          "id": "phase-4-stage-1",
          "title": "Deploy MVP",
          "checkpoints": [
            {
              "id": "phase-4-stage-1-checkpoint-1",
              "title": "Push to cloud",
              "description": "Deploy to staging/prod environment.",
              "code": "git push heroku main",
              "testing": "Verify deployment URL works; smoke test UI + APIs."
            }
          ]
        }
      ]
    },
    {
      "id": "phase-5",
      "title": "Completion",
      "description": "After completing all steps, you will have a working MVP that implements the PRD.",
      "stages": []
    }
  ]
}

Rules:
- Write checkpoints as actionable instructions: "Do this. After completion, check X works."
- Ensure JSON is valid, no markdown.
- IDs must be unique kebab-case.
- End with a final phase that clearly states the MVP is completed.
      `;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No valid JSON found in AI response');

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Implementation Plan Generation Error:', error);
      throw new Error('Failed to generate implementation plan: ' + error.message);
    }
  }
}

module.exports = new AIService();
