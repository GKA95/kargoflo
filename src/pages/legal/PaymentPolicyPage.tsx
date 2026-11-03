import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';
import { defaultPolicies } from '../../services/policyService';

export const PaymentPolicyPage: React.FC = () => {
  return <LegalPageLayout policy={defaultPolicies.payment} />;
};
