import type { HospitalPageData } from '@/types/cms'

import AspireStyleTemplate from './AspireStyleTemplate'
import MediloStyleTemplate from './MediloStyleTemplate'
import MinimalHospitalTemplate from './MinimalHospitalTemplate'

type HospitalTemplateComponent = React.ComponentType<HospitalPageData>

const templates: Record<string, HospitalTemplateComponent> = {
  'aspire-style': AspireStyleTemplate as HospitalTemplateComponent,
  'modern-clinical': MediloStyleTemplate as HospitalTemplateComponent,
  minimal: MinimalHospitalTemplate as HospitalTemplateComponent,
}

export function getTemplateComponent(
  templateValue: string | null | undefined,
): HospitalTemplateComponent {
  return templates[templateValue || 'aspire-style'] || templates['aspire-style']
}
