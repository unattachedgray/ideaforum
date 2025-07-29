Here's the updated specification that infuses the original vision with the Flarum-inspired design:

```markdown
# Idea Forum (ἰδέα Forum) - Project Specification v3.0
*A Revolutionary Platform for Collaborative Idea Development*

## 🎯 Project Vision

### Original Vision
Idea Forum (ἰδέα Forum) is a revolutionary platform where ideas evolve from raw debates into structured knowledge. Inspired by the ancient Greek concept of ἰδέα (idea/form), it creates a space where people can:
- **Generate and debate new ideas** about any topic (constitution, policies, societal issues)
- **Develop reasoning and logical thinking skills** through structured debate
- **Bridge the gap between ideals and reality** through collaborative refinement
- **Create a certification system** for reasoning skills (future goal)

### Core Innovation
**Unified Data Model with Dual Views**: A single content source that renders as either threaded discussions or curated wiki pages, eliminating the maintenance burden of separate systems.

## 🧠 Philosophical Foundation

### The Greek Concept of ἰδέα
- **Etymology**: From Greek ἰδέα (idéa) - the eternal, unchangeable form of things
- **Platform Philosophy**: Ideas start as raw thoughts (threads) and evolve into refined knowledge (wiki)
- **Process**: Dialectical reasoning transforms debate into consensus

### Reasoning & Logic Development
- **Logical Fallacy Detection**: AI-powered system to identify and explain logical errors
- **Argument Structure Training**: Learn proper argumentation through practice
- **Socratic Method**: Encourage questioning and critical thinking
- **Skill Progression**: Measurable improvement in reasoning abilities

## 🏗️ Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS (Flarum-inspired design)
- **Backend**: Node.js + Express + GraphQL + Apollo Server
- **Database**: PostgreSQL with JSONB for flexible metadata
- **Real-time**: Socket.io + GraphQL Subscriptions
- **AI Integration**: OpenAI API for logic analysis (Phase 2)
- **Authentication**: Passwordless + Google OAuth
- **Deployment**: Docker containers with Docker Compose

### Core Components
1. **Unified Document System**: Single data model with dual rendering
2. **Custom Markup Language**: Semantic tags for view control
3. **Threading Engine**: Nested discussions with consensus tracking
4. **Wiki Synthesis**: Automatic curation of promoted content
5. **Logic Analysis System**: AI-powered reasoning feedback (Phase 2)
6. **Skill Assessment**: Metrics and grading system (Phase 3)

## 📝 Custom Markup Language

### Semantic Tags
```markdown
# Document Title

## Section @wiki-primary
Content that appears prominently in wiki view

### Subsection @thread-only  
Discussion context that stays in thread view

[!consensus: 85%]
Community-agreed conclusion from 156 participants
[!end-consensus]

[!debate-active: budget-implications]
**Open Question**: How should this be funded?
- Option A: Reallocation of resources
- Option B: New revenue streams
[!end-debate]

[!synthesis from: debate-23, debate-45, debate-67]
Refined conclusion drawing from multiple discussions
[!end-synthesis]

[!logic-error: strawman-fallacy]
This argument misrepresents the opposing position
[!suggestion: Address the actual claim about X, not Y]
[!end-logic-error]
```

### View Control Metadata
```javascript
{
  "wiki_visibility": true,
  "wiki_position": 1,
  "consensus_level": 0.85,
  "thread_collapsed": false,
  "promotion_votes": 45,
  "logic_score": 0.92,
  "fallacy_checks": "passed"
}
```

## 🎨 Design System (Flarum-Inspired)

### Visual Design Language
- **Clean Minimalism**: Focus on content with subtle UI elements
- **Card-Based Layout**: Information organized in digestible cards
- **Progressive Disclosure**: Complexity revealed as needed
- **Subtle Interactions**: Smooth transitions and micro-animations

### Color Palette
```css
/* Primary - Wisdom Blue */
--primary-500: #0ea5e9;   /* Main actions */
--primary-600: #0284c7;   /* Hover states */

/* Semantic - Logic States */
--consensus-green: #10b981;   /* Agreed content */
--debate-orange: #f59e0b;     /* Active debates */
--logic-error: #ef4444;       /* Fallacy warnings */
--promoted-purple: #8b5cf6;   /* Wiki-promoted content */
```

## 📱 User Interface Specifications

### Document View with Logic Features
```
┌─────────────────────────────────────────────────────────────┐
│ Navigation: Home > Philosophy > Ethics > Trolley Problem    │
├─────────────────────────────────────────────────────────────┤
│ Document Header                                             │
│ The Trolley Problem: A Modern Analysis                     │
│ View: [🧵 Thread] [📄 Wiki] | Logic Score: 8.5/10         │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ @philosopher_jane • 2h ago              [↑ 45] [↓ 3]    │ │
│ │ The utilitarian approach suggests...                    │ │
│ │ ┌─────────────────────────────────────────────────┐     │ │
│ │ │ ⚠️ Logic Analysis: Potential False Dilemma       │     │ │
│ │ │ Consider additional options beyond A or B        │     │ │
│ │ └─────────────────────────────────────────────────┘     │ │
│ │                                                         │ │
│ │   ┌─────────────────────────────────────────────┐       │ │
│ │   │ @ethicist_bob • 1h ago         [↑ 23] [↓ 1] │       │ │
│ │   │ ✓ Strong counterargument using...           │       │ │
│ │   │ [Promote to Wiki] [Logic Score: 9.2]        │       │ │
│ │   └─────────────────────────────────────────────┘       │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🏛️ Consensus Reached (87% agreement)                    │ │
│ │ The community agrees that context matters in ethical... │ │
│ │ [View in Wiki] [See Dissenting Views (13%)]            │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Wiki View (Synthesized Knowledge)
```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Wiki View | Last synthesis: 2 hours ago                 │
├─────────────────────────────────────────────────────────────┤
│ The Trolley Problem: Community Synthesis                   │
│                                                            │
│ ## Core Principles (92% consensus)                         │
│ After extensive debate, the community has identified...    │
│                                                            │
│ ## Utilitarian Perspective (78% support)                   │
│ [Synthesized from 34 contributions]                        │
│ The greatest good for the greatest number suggests...      │
│                                                            │
│ ## Deontological Perspective (65% support)                 │
│ [Synthesized from 28 contributions]                        │
│ The inherent rightness or wrongness of actions...          │
│                                                            │
│ ## Open Questions 🔄                                       │
│ • How do cultural values affect the decision?              │
│ • What role does intent play? [Join Debate]               │
│                                                            │
│ [Export as PDF] [View Thread History] [Suggest Edit]       │
└─────────────────────────────────────────────────────────────┘
```

## 🧪 Logic & Reasoning Features

### Phase 2: AI-Powered Logic Assistant
1. **Logical Fallacy Detection**
   - Real-time analysis of arguments
   - Inline warnings with explanations
   - Educational tooltips with examples
   - Suggestions for stronger arguments

2. **Argument Quality Metrics**
   - Evidence strength scoring
   - Logic coherence rating
   - Counter-argument consideration
   - Source credibility assessment

3. **Learning Mode**
   - Interactive logic tutorials
   - Practice debates with AI feedback
   - Progress tracking and achievements
   - Personalized improvement suggestions

### Phase 3: Skill Assessment System
1. **Measurable Skills Framework**
   ```typescript
   interface ReasoningSkills {
     criticalThinking: number;      // 0-100
     evidenceEvaluation: number;    // 0-100
     argumentConstruction: number;  // 0-100
     logicalCoherence: number;      // 0-100
     synthesisAbility: number;      // 0-100
     domainExpertise: Map<string, number>;
   }
   ```

2. **Skill-Based Matching**
   - Pair debaters of similar skill levels
   - Mentorship opportunities
   - Progressive difficulty challenges

### Phase 4: Certification System
1. **Formal Assessment**
   - Standardized reasoning challenges
   - Portfolio of quality contributions
   - Peer and expert evaluation
   - Time-limited debate scenarios

2. **Certification Levels**
   - **Novice Reasoner**: Basic logic understanding
   - **Skilled Debater**: Consistent quality arguments
   - **Logic Master**: Expert-level reasoning
   - **Domain Expert**: Specialized knowledge certification

3. **External Integration**
   - Academic institution partnerships
   - Employer verification system
   - LinkedIn skill badges
   - University credit consideration

## 📊 Data Models

### Enhanced Section Model
```typescript
interface Section {
  id: string;
  document: Document;
  content: string;
  author: User;
  parent?: Section;
  children: Section[];
  position: number;
  
  // Voting & Consensus
  votes: Vote[];
  voteScore: number;
  consensusLevel: number;
  isPromoted: boolean;
  
  // Logic Analysis
  logicScore?: number;
  detectedFallacies?: LogicalFallacy[];
  argumentStrength?: ArgumentMetrics;
  improvementSuggestions?: string[];
  
  // Metadata
  metadata: {
    wiki_visibility: boolean;
    wiki_position?: number;
    synthesis_sources?: string[];
    debate_status?: 'active' | 'resolved' | 'contested';
  };
  
  createdAt: Date;
  updatedAt: Date;
}
```

### User Skills Model
```typescript
interface UserProfile extends User {
  reasoningSkills: ReasoningSkills;
  contributionStats: {
    totalSections: number;
    promotedSections: number;
    consensusReached: number;
    logicScore: number;
  };
  achievements: Achievement[];
  certifications: Certification[];
  learningProgress: LearningProgress;
}
```

## 🚀 Implementation Roadmap

### Phase 1: Core Platform (Current)
- [x] Unified document-section data model
- [x] Basic authentication (Passwordless + OAuth)
- [x] Document CRUD operations
- [ ] Custom markup parser implementation
- [ ] Thread view with nested discussions
- [ ] Wiki view with content filtering
- [ ] Basic voting mechanism
- [ ] Real-time updates

### Phase 2: Logic & Reasoning (Next)
- [ ] AI integration for logic analysis
- [ ] Fallacy detection system
- [ ] Argument quality scoring
- [ ] Interactive feedback system
- [ ] Learning tutorials and guides
- [ ] Basic skill tracking

### Phase 3: Assessment & Matching
- [ ] Skill measurement framework
- [ ] User skill profiles
- [ ] Intelligent debate matching
- [ ] Progress tracking
- [ ] Mentorship system
- [ ] Gamification elements

### Phase 4: Certification System
- [ ] Assessment challenges
- [ ] Portfolio evaluation
- [ ] Certification levels
- [ ] External partnerships
- [ ] Verification system
- [ ] Career integration

## 🎯 Success Metrics

### Platform Adoption
- **User Growth**: 1,000+ active users by Month 6
- **Document Creation**: 100+ quality documents/month
- **Engagement**: 10+ sections average per document
- **Wiki Synthesis**: 40% of content promoted to wiki

### Educational Impact
- **Logic Improvement**: 25% increase in user logic scores
- **Fallacy Reduction**: 50% fewer logical errors over time
- **Skill Progression**: 80% of users show measurable improvement
- **Certification Achievement**: 100+ certified reasoners Year 1

### Content Quality
- **Consensus Rate**: 70% of major debates reach consensus
- **Synthesis Quality**: 4.5+ star rating on wiki content
- **Knowledge Creation**: 50+ high-quality wiki documents
- **Cross-Domain**: Active debates across 10+ categories

## 🔮 Future Vision

### Long-Term Goals
1. **Academic Integration**: University partnerships for logic education
2. **Professional Certification**: Industry-recognized reasoning credentials
3. **Global Debate Platform**: Multi-language support and cultural perspectives
4. **AI Debate Partners**: Advanced AI for practice and learning
5. **Research Tool**: Academic research on collective reasoning

### Potential Applications
- **Education**: Logic and critical thinking curriculum
- **Policy Making**: Structured public debate on policies
- **Corporate Decision Making**: Internal debate platforms
- **Legal Reasoning**: Case analysis and precedent discussions
- **Scientific Peer Review**: Structured scientific debate

---

*"From chaos comes order, from debate comes wisdom" - ἰδέα Forum*

**Last Updated**: 2025-07-29  
**Version**: 3.0  
**Status**: Active Development - Phase 1
```

This updated specification now fully integrates the original vision of a platform for developing ideas through debate, learning logic and reasoning skills, and eventually creating a certification system, while maintaining the clean Flarum-inspired design aesthetic.