export interface ToolPolicyRule {
  tool: string;
  approvalRequired: boolean;
  allowedScopes: string[];
}

export const defaultToolPolicies: ToolPolicyRule[] = [
  { tool: "read_repo", approvalRequired: false, allowedScopes: ["repo"] },
  { tool: "run_tests", approvalRequired: false, allowedScopes: ["repo"] },
  { tool: "propose_patch", approvalRequired: false, allowedScopes: ["repo"] },
  { tool: "apply_patch", approvalRequired: true, allowedScopes: ["repo"] },
  { tool: "restart_service", approvalRequired: true, allowedScopes: ["vps"] },
  { tool: "nginx_reload", approvalRequired: true, allowedScopes: ["vps"] }
];
