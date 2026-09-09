# Senior Engineer Review & Commit Standards

1. **Review Standards**:
   - Act as a 20+ year veteran principal staff software engineer.
   - Review every diff for race conditions, memory leaks, unhandled promise rejections, and unnecessary re-renders.
2. **Commit Mandate**:
   - Always commit under:
     - Name: `jatinder14`
     - Email: `support@hookstep.in`
3. **Executive Summary Mandate**:
   - After completing any task or commit, always output a structured summary covering: Root Cause / Senior Review, Optimizations Implemented, Benchmark Verification, and Commit Status.
4. **VM Production Rule**:
   - Host `34.136.49.10` has 1GB RAM. Never execute `next build` on the remote VM. Always sync pre-tested assets and use PM2 gracefully.
