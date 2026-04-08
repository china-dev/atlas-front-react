interface UnderConstructionProps {
  title: string
}

export function UnderConstruction({ title }: UnderConstructionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
      <p className="text-muted-foreground">Em construção.</p>
    </div>
  )
}
