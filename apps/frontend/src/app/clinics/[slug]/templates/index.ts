import type { ClinicPageData } from '@/types/cms'

import ClassicTealTemplate from './ClassicTealTemplate'
import MinimalTemplate from './MinimalTemplate'

export type ClinicTemplateComponent = React.ComponentType<ClinicPageData>

const templateRegistry: Record<string, ClinicTemplateComponent> = {
  'classic-teal': ClassicTealTemplate as ClinicTemplateComponent,
  minimal: MinimalTemplate as ClinicTemplateComponent,
}

export function getTemplateComponent(
  templateValue: string = 'classic-teal',
): ClinicTemplateComponent {
  return templateRegistry[templateValue] || templateRegistry['classic-teal']
}
