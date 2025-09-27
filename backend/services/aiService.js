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

Ensure valid JSON format. Be specific and actionable.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('PRD Generation Error:', error);
      throw new Error('Failed to generate PRD: ' + error.message);
    }
  }

  async generateImplementationPlan(prdContent) {
    try {
      const prompt = `
You are a senior software architect. Create a detailed implementation plan based on this PRD:

${JSON.stringify(prdContent, null, 2)}

Return a JSON object with this exact structure:
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
  }
}

Ensure valid JSON format. Be specific and technical.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Implementation Plan Generation Error:', error);
      throw new Error('Failed to generate implementation plan: ' + error.message);
    }
  }
}

module.exports = new AIService();