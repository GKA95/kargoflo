import { AuditLog } from '../models';

export interface AuditLogParams {
  action: string;
  details: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  actorId?: any;
  actorEmail?: string;
  actorRole?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export async function logSecurityEvent(params: AuditLogParams): Promise<void> {
  try {
    await AuditLog.create({
      action: params.action,
      details: params.details,
      severity: params.severity || 'low',
      actorId: params.actorId,
      actorEmail: params.actorEmail,
      actorRole: params.actorRole,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: params.metadata,
    });
  } catch (err: any) {
    // Non-blocking security audit failure notice
    console.warn('[AuditLog] Failed to persist audit entry:', err.message);
  }
}
