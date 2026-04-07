export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground mt-2">Bem-vindo ao Atlas Territorial do Turismo.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total de Indicações</h3>
          <p className="text-3xl font-bold text-foreground mt-2">12</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Produtores Ativos</h3>
          <p className="text-3xl font-bold text-foreground mt-2">48</p>
        </div>
      </div>
    </div>
  );
}
