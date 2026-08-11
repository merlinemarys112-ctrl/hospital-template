import AspireStyleTemplate from './AspireStyleTemplate'
import MediloStyleTemplate from './MediloStyleTemplate'
import MinimalHospitalTemplate from './MinimalHospitalTemplate'

const templates: Record<string, React.ComponentType<any>> = {
  'aspire-style': AspireStyleTemplate,
  'modern-clinical': MediloStyleTemplate,
  minimal: MinimalHospitalTemplate,
}

export function getTemplateComponent(templateValue: string | null | undefined) {
  return templates[templateValue || 'aspire-style'] || templates['aspire-style']
}
