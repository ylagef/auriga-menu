export interface Section {
  title: string
  id: string
}

export const SECTIONS: Section[] = [
  {
    title: 'Menú del día',
    id: 'menu'
  },
  {
    title: 'Desayunos y meriendas',
    id: 'desayunos-meriendas'
  },
  {
    title: 'Masas y panes',
    id: 'masas-panes'
  },
  {
    title: 'Pintxos',
    id: 'pintxos'
  },
  {
    title: 'Raciones',
    id: 'raciones'
  },
  {
    title: 'Postres',
    id: 'postres'
  },
  {
    title: 'Recomendaciones',
    id: 'recomendaciones'
  },
  {
    title: 'Vinos',
    id: 'vinos'
  },
  {
    title: 'Coctelería',
    id: 'cocteleria'
  }
]
