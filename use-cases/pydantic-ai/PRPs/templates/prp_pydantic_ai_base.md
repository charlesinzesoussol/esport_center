---
name: "React Native AI Agent PRP Template"
description: "Template for generating comprehensive PRPs for React Native AI agent development projects"
---

## Purpose

[Brief description of the React Native AI agent to be built and its main purpose]

## Core Principles

1. **React Native Best Practices**: Deep integration with React Native patterns for agent creation, tools, and structured outputs
2. **Production Ready**: Include security, testing, and monitoring for production deployments
3. **Type Safety First**: Leverage TypeScript's type-safe design and validation throughout
4. **Context Engineering Integration**: Apply proven context engineering workflows to AI agent development
5. **Comprehensive Testing**: Use Jest and React Native Testing Library for thorough agent validation

## ⚠️ Implementation Guidelines: Don't Over-Engineer

**IMPORTANT**: Keep your agent implementation focused and practical. Don't build unnecessary complexity.

### What NOT to do:
- ❌ **Don't create dozens of tools** - Build only the tools your agent actually needs
- ❌ **Don't over-complicate dependencies** - Keep dependency injection simple and focused
- ❌ **Don't add unnecessary abstractions** - Follow main_agent_reference patterns directly
- ❌ **Don't build complex workflows** unless specifically required
- ❌ **Don't add structured output** unless validation is specifically needed (default to string)
- ❌ **Don't build in the examples/ folder**

### What TO do:
- ✅ **Start simple** - Build the minimum viable agent that meets requirements
- ✅ **Add tools incrementally** - Implement only what the agent needs to function
- ✅ **Follow main_agent_reference** - Use proven patterns, don't reinvent
- ✅ **Use string output by default** - Only add result_type when validation is required
- ✅ **Test early and often** - Use TestModel to validate as you build

### Key Question:
**"Does this agent really need this feature to accomplish its core purpose?"**

If the answer is no, don't build it. Keep it simple, focused, and functional.

---

## Goal

[Detailed description of what the agent should accomplish]

## Why

[Explanation of why this agent is needed and what problem it solves]

## What

### Agent Type Classification
- [ ] **Chat Agent**: Conversational interface with React Native UI components
- [ ] **Tool-Enabled Agent**: Agent with native module integration capabilities
- [ ] **Workflow Agent**: Multi-step task processing with React Navigation
- [ ] **Structured Output Agent**: Complex data validation with TypeScript interfaces

### Model Provider Requirements
- [ ] **OpenAI**: `openai:gpt-4o` or `openai:gpt-4o-mini`
- [ ] **Anthropic**: `anthropic:claude-3-5-sonnet-20241022` or `anthropic:claude-3-5-haiku-20241022`
- [ ] **Google**: `gemini-1.5-flash` or `gemini-1.5-pro`
- [ ] **Fallback Strategy**: Multiple provider support with automatic failover

### External Integrations
- [ ] Database connections (AsyncStorage, SQLite, Realm, Firebase)
- [ ] REST API integrations (Axios, Fetch API)
- [ ] Native file system operations (react-native-fs)
- [ ] WebView integration for web content
- [ ] Real-time data with WebSocket or Firebase Realtime Database

### Success Criteria
- [ ] Agent successfully handles specified use cases
- [ ] All native modules work correctly with proper error handling
- [ ] Structured outputs validate according to TypeScript interfaces
- [ ] Comprehensive test coverage with Jest and React Native Testing Library
- [ ] Security measures implemented (API keys, secure storage, certificate pinning)
- [ ] Performance meets requirements (60 FPS, minimal memory usage)

## All Needed Context

### React Native AI Documentation & Research

```yaml
# React Native Documentation
- url: https://reactnative.dev/
  why: Official React Native documentation with getting started guide
  content: Component creation, native modules, platform-specific code

- url: https://reactnative.dev/docs/typescript
  why: TypeScript integration and type safety patterns
  content: Type definitions, interfaces, generics, strict typing

- url: https://reactnative.dev/docs/native-modules-intro
  why: Native module integration patterns and bridge communication
  content: iOS/Android native code, event emitters, callbacks, promises

- url: https://reactnative.dev/docs/testing-overview
  why: Testing strategies specific to React Native apps
  content: Jest, React Native Testing Library, Detox for E2E

- url: https://reactnative.dev/docs/performance
  why: Performance optimization and profiling
  content: FlatList optimization, memory management, bundle size

# Prebuilt examples
- path: examples/
  why: Reference implementations for React Native AI integration
  content: Sample React Native components with AI features, navigation patterns, state management

- path: examples/App.tsx
  why: Shows real-world React Native app structure
  content: Navigation setup, theme providers, global state management - demonstrates app architecture
```

### React Native Architecture Research

```yaml
# React Native Architecture Patterns
app_structure:
  configuration:
    - config/index.ts: Environment-based configuration with react-native-config
    - services/api.ts: API client abstraction with axios interceptors
    - Environment variables via react-native-config or react-native-dotenv
    - Never hardcode API endpoints or keys
  
  component_definition:
    - Functional components with TypeScript interfaces
    - Custom hooks for business logic separation
    - Context API or Redux for state management
    - Styled components or StyleSheet for styling
  
  native_integration:
    - Native modules for platform-specific features
    - Event emitters for native-to-JS communication
    - Proper error handling with error boundaries
    - Bridge optimization for performance
  
  testing_strategy:
    - Jest for unit testing
    - React Native Testing Library for component testing
    - Detox or Appium for E2E testing
    - Mock native modules for test isolation
```

### Security and Production Considerations

```yaml
# React Native Security Patterns
security_requirements:
  api_management:
    environment_variables: ["API_BASE_URL", "API_KEY", "OAUTH_CLIENT_ID"]
    secure_storage: "Use react-native-keychain or react-native-sensitive-info"
    certificate_pinning: "Implement SSL pinning for API calls"
  
  input_validation:
    sanitization: "Validate all user inputs with TypeScript and runtime checks"
    injection_prevention: "Sanitize inputs before rendering in WebView"
    rate_limiting: "Implement client-side throttling"
  
  app_security:
    code_obfuscation: "Use Hermes and ProGuard/R8 for production builds"
    jailbreak_detection: "Implement root/jailbreak detection"
    secure_communication: "HTTPS only, no cleartext traffic"
```

### Common React Native Gotchas (research and document)

```yaml
# React Native-specific gotchas to research and address
implementation_gotchas:
  platform_differences:
    issue: "iOS and Android behavior inconsistencies"
    research: "Platform-specific code patterns and conditional rendering"
    solution: "Use Platform.OS and Platform.select for platform-specific logic"
  
  performance_issues:
    issue: "JS thread blocking and frame drops"
    research: "Performance optimization with InteractionManager and requestAnimationFrame"
    solution: "Offload heavy computations to native modules or web workers"
  
  memory_leaks:
    issue: "Event listeners and timers not cleaned up"
    research: "useEffect cleanup patterns and memory management"
    solution: "Always return cleanup functions in useEffect hooks"
  
  navigation_state:
    issue: "State loss during navigation or app backgrounding"
    research: "State persistence with Redux Persist or AsyncStorage"
    solution: "Implement proper state hydration and persistence"
```

## Implementation Blueprint

### Technology Research Phase

**RESEARCH REQUIRED - Complete before implementation:**

✅ **React Native Framework Deep Dive:**
- [ ] Component patterns and hooks best practices
- [ ] Native module creation and bridge communication
- [ ] Navigation patterns (React Navigation vs Native Navigation)
- [ ] State management (Context API, Redux, MobX, Zustand)
- [ ] Testing strategies with Jest and React Native Testing Library

✅ **App Architecture Investigation:**
- [ ] Project structure conventions (screens/, components/, services/, utils/)
- [ ] Component composition and prop drilling solutions
- [ ] TypeScript integration and type safety patterns
- [ ] Platform-specific code organization
- [ ] Error boundaries and crash reporting

✅ **Security and Production Patterns:**
- [ ] Secure storage for sensitive data
- [ ] API security with certificate pinning
- [ ] Code obfuscation and anti-tampering
- [ ] Performance monitoring with Flipper or React DevTools
- [ ] OTA updates with CodePush

### React Native Implementation Plan

```yaml
Implementation Task 1 - App Architecture Setup:
  CREATE React Native project structure:
    - src/config/: Environment configuration with react-native-config
    - src/services/: API clients and external service integrations
    - src/screens/: Screen components with navigation
    - src/components/: Reusable UI components
    - src/hooks/: Custom React hooks for business logic
    - src/utils/: Helper functions and utilities
    - __tests__/: Comprehensive test suite

Implementation Task 2 - Core Agent Development:
  IMPLEMENT agent.py following main_agent_reference patterns:
    - Use get_llm_model() from providers.py for model configuration
    - System prompt as string constant or function
    - Dependency injection with dataclass
    - NO result_type unless structured output specifically needed
    - Error handling and logging

Implementation Task 3 - Tool Integration:
  DEVELOP tools.py:
    - Tool functions with @agent.tool decorators
    - RunContext[DepsType] integration for dependency access
    - Parameter validation with proper type hints
    - Error handling and retry mechanisms
    - Tool documentation and schema generation

Implementation Task 4 - Data Models and Dependencies:
  CREATE models.py and dependencies.py:
    - Pydantic models for structured outputs
    - Dependency classes for external services
    - Input validation models for tools
    - Custom validators and constraints

Implementation Task 5 - Comprehensive Testing:
  IMPLEMENT testing suite:
    - TestModel integration for rapid development
    - FunctionModel tests for custom behavior
    - Agent.override() patterns for isolation
    - Integration tests with real providers
    - Tool validation and error scenario testing

Implementation Task 6 - Security and Configuration:
  SETUP security patterns:
    - Environment variable management for API keys
    - Input sanitization and validation
    - Rate limiting implementation
    - Secure logging and monitoring
    - Production deployment configuration
```

## Validation Loop

### Level 1: Agent Structure Validation

```bash
# Verify complete agent project structure
find agent_project -name "*.py" | sort
test -f agent_project/agent.py && echo "Agent definition present"
test -f agent_project/tools.py && echo "Tools module present"
test -f agent_project/models.py && echo "Models module present"
test -f agent_project/dependencies.py && echo "Dependencies module present"

# Verify proper PydanticAI imports
grep -q "from pydantic_ai import Agent" agent_project/agent.py
grep -q "@agent.tool" agent_project/tools.py
grep -q "from pydantic import BaseModel" agent_project/models.py

# Expected: All required files with proper PydanticAI patterns
# If missing: Generate missing components with correct patterns
```

### Level 2: Agent Functionality Validation

```bash
# Test agent can be imported and instantiated
python -c "
from agent_project.agent import agent
print('Agent created successfully')
print(f'Model: {agent.model}')
print(f'Tools: {len(agent.tools)}')
"

# Test with TestModel for validation
python -c "
from pydantic_ai.models.test import TestModel
from agent_project.agent import agent
test_model = TestModel()
with agent.override(model=test_model):
    result = agent.run_sync('Test message')
    print(f'Agent response: {result.output}')
"

# Expected: Agent instantiation works, tools registered, TestModel validation passes
# If failing: Debug agent configuration and tool registration
```

### Level 3: Comprehensive Testing Validation

```bash
# Run complete test suite
cd agent_project
python -m pytest tests/ -v

# Test specific agent behavior
python -m pytest tests/test_agent.py::test_agent_response -v
python -m pytest tests/test_tools.py::test_tool_validation -v
python -m pytest tests/test_models.py::test_output_validation -v

# Expected: All tests pass, comprehensive coverage achieved
# If failing: Fix implementation based on test failures
```

### Level 4: Production Readiness Validation

```bash
# Verify security patterns
grep -r "API_KEY" agent_project/ | grep -v ".py:" # Should not expose keys
test -f agent_project/.env.example && echo "Environment template present"

# Check error handling
grep -r "try:" agent_project/ | wc -l  # Should have error handling
grep -r "except" agent_project/ | wc -l  # Should have exception handling

# Verify logging setup
grep -r "logging\|logger" agent_project/ | wc -l  # Should have logging

# Expected: Security measures in place, error handling comprehensive, logging configured
# If issues: Implement missing security and production patterns
```

## Final Validation Checklist

### Agent Implementation Completeness

- [ ] Complete agent project structure: `agent.py`, `tools.py`, `models.py`, `dependencies.py`
- [ ] Agent instantiation with proper model provider configuration
- [ ] Tool registration with @agent.tool decorators and RunContext integration
- [ ] Structured outputs with Pydantic model validation
- [ ] Dependency injection properly configured and tested
- [ ] Comprehensive test suite with TestModel and FunctionModel

### PydanticAI Best Practices

- [ ] Type safety throughout with proper type hints and validation
- [ ] Security patterns implemented (API keys, input validation, rate limiting)
- [ ] Error handling and retry mechanisms for robust operation
- [ ] Async/sync patterns consistent and appropriate
- [ ] Documentation and code comments for maintainability

### Production Readiness

- [ ] Environment configuration with .env files and validation
- [ ] Logging and monitoring setup for observability
- [ ] Performance optimization and resource management
- [ ] Deployment readiness with proper configuration management
- [ ] Maintenance and update strategies documented

---

## Anti-Patterns to Avoid

### PydanticAI Agent Development

- ❌ Don't skip TestModel validation - always test with TestModel during development
- ❌ Don't hardcode API keys - use environment variables for all credentials
- ❌ Don't ignore async patterns - PydanticAI has specific async/sync requirements
- ❌ Don't create complex tool chains - keep tools focused and composable
- ❌ Don't skip error handling - implement comprehensive retry and fallback mechanisms

### Agent Architecture

- ❌ Don't mix agent types - clearly separate chat, tool, workflow, and structured output patterns
- ❌ Don't ignore dependency injection - use proper type-safe dependency management
- ❌ Don't skip output validation - always use Pydantic models for structured responses
- ❌ Don't forget tool documentation - ensure all tools have proper descriptions and schemas

### Security and Production

- ❌ Don't expose sensitive data - validate all outputs and logs for security
- ❌ Don't skip input validation - sanitize and validate all user inputs
- ❌ Don't ignore rate limiting - implement proper throttling for external services
- ❌ Don't deploy without monitoring - include proper observability from the start

**RESEARCH STATUS: [TO BE COMPLETED]** - Complete comprehensive PydanticAI research before implementation begins.