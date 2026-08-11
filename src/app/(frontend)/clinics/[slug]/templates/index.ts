import ClassicTealTemplate from './ClassicTealTemplate'
import MinimalTemplate from './MinimalTemplate'

export type ClinicTemplateComponent = React.ComponentType<{
  clinic: any
  doctorSessions: any[]
  articles: any[]
  testimonials: any[]
  faqs: any[]
}>

const templateRegistry: Record<string, ClinicTemplateComponent> = {
  'classic-teal': ClassicTealTemplate,
  minimal: MinimalTemplate,
}

export function getTemplateComponent(templateValue: string = 'classic-teal'): ClinicTemplateComponent {
  return templateRegistry[templateValue] || templateRegistry['classic-teal']
}
