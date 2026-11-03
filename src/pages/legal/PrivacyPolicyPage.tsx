import React from 'react';
import { LegalPageLayout } from './LegalPageLayout';
import { defaultPolicies } from '../../services/policyService';

export const PrivacyPolicyPage: React.FC = () => {
  return <LegalPageLayout policy={defaultPolicies.privacy} />;
};
