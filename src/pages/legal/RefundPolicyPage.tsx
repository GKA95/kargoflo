import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';
import { defaultPolicies } from '../../services/policyService';

export const RefundPolicyPage: React.FC = () => {
  return <LegalPageLayout policy={defaultPolicies.refund} />;
};
