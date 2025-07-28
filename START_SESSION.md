# Starting a New Session

## Instructions for Claude/Cline

When starting a new coding session on the Idea Forum project, please:

1. **First, read these files in order**:
   - `CURRENT_STATUS.md` - Quick overview of project state
   - `SESSION_NOTES/[most_recent_session].md` - Detailed previous session info
   - `PROJECT_BRIEF.md` - Original project specifications (if needed for context)

2. **Verify the project runs**:
   ```bash
   docker-compose up -d
   docker-compose ps  # Check all services are running
   ```

3. **Check the build status** mentioned in CURRENT_STATUS.md

4. **Start with the "Next Task"** listed in CURRENT_STATUS.md

5. **If you encounter issues**, check the "Known Issues" section in the last session notes

Remember: Don't try to understand the entire codebase. Focus on the specific task mentioned in the handoff documents.
