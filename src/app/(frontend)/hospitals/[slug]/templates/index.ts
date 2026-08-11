import AspireStyleTemplate from './AspireStyleTemplate'
import MinimalHospitalTemplate from './MinimalHospitalTemplate'

const templates: Record<string, React.ComponentType<any>> = {
  'aspire-style': AspireStyleTemplate,
  minimal: MinimalHospitalTemplate,
}

export function getTemplateComponent(templateValue: string | null | undefined) {
  return templates[templateValue || 'aspire-style'] || templates['aspire-style']
}
