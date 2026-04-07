# Comparativo Vue → React: Projeto Atlas

## Introdução

Se você já trabalhou no `atlas-front` (Vue 3 com Composition API), vai perceber que o `atlas-front-react` segue a mesma arquitetura de módulos, a mesma camada HTTP, as mesmas bibliotecas de tabela e validação — só que com a sintaxe e os paradigmas do React. Este documento mostra, seção por seção, como cada conceito que você já conhece no Vue se traduz para o React, usando exemplos reais dos dois projetos.

A regra de ouro: **o React não tem templates, directivas ou reatividade automática.** Tudo é JavaScript (ou TypeScript) puro, e você controla o estado explicitamente com hooks.

---

## 1. Estrutura de Pastas

A organização é praticamente espelhada. Os nomes das pastas são iguais; a diferença está dentro delas.

**Vue (`atlas-front`)**
```
src/
├── core/
│   ├── http/
│   ├── i18n/
│   ├── router/
│   └── store/          # Pinia
├── modules/
├── shared/
│   ├── components/
│   ├── composables/    # Hooks Vue
│   ├── helpers/
│   └── utils/
├── mock/
├── App.vue
└── main.ts
```

**React (`atlas-front-react`)**
```
src/
├── core/
│   ├── http/
│   ├── i18n/
│   ├── router/
│   └── store/          # Zustand
├── modules/
├── shared/
│   ├── components/
│   ├── hooks/          # Custom Hooks (equivalente a composables/)
│   ├── helpers/
│   └── utils/
├── mock/
├── App.tsx
└── main.tsx
```

**O que mudou:**
- `composables/` virou `hooks/` — o conceito é o mesmo, só o nome muda.
- Arquivos `.vue` viraram `.tsx` (TypeScript + JSX).
- `App.vue` / `main.ts` viraram `App.tsx` / `main.tsx`.
- Internamente, `core/store/` usa Zustand em vez de Pinia.

---

## 2. Componentes

### Template vs JSX

No Vue, você separa template, script e estilos em blocos distintos dentro do `.vue`. No React, tudo fica em um único arquivo `.tsx`: a função do componente retorna JSX, que é HTML misturado com expressões JavaScript.

**Vue — `IndicationListing.vue`**
```vue
<script setup lang="ts">
import { useTranslate } from '@/shared/helpers/translate.helper.ts'
import useIndications from '@/modules/indication/composables/useIndication.ts'
import { useIndicationCreate } from '@/modules/indication/composables/useIndicationCreate.ts'

const translate = useTranslate()
const { columns, data, isLoading, pagination, searchQuery, setPage, isConfirmDialogOpen, isDeleting, executeDelete, promptDelete, reload } = useIndications()
const { isFormOpened, isSubmitting, openForm, handleSubmit } = useIndicationCreate(reload)
</script>

<template>
  <div class="space-y-4">
    <ListingTable
      v-model="searchQuery"
      :data="data"
      :columns="columns"
      :is-loading="isLoading"
      :pagination="pagination"
      enable-search
      enable-pagination
      @page-change="setPage"
    >
      <template #toolbar-actions>
        <Button :disabled="isLoading" @click="openForm">
          <PlusCircle class="w-4 h-4 mr-2" />
          {{ translate('common.newRegister') }}
        </Button>
      </template>
    </ListingTable>
  </div>
</template>
```

**React — `IndicationListingPage.tsx`**
```typescript
export default function IndicationListingPage() {
  const { t } = useTranslation()
  const { columns, data, isLoading, pagination, searchQuery, setSearchQuery, setPage, reload,
          isConfirmDialogOpen, setIsConfirmDialogOpen, isDeleting, promptDelete, executeDelete } = useIndications()
  const { isFormOpened, isSubmitting, openForm, closeForm, handleSubmit } = useIndicationCreate(reload)

  return (
    <div className="space-y-4">
      <ListingTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        enableSearch
        enablePagination
        pagination={pagination}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onPageChange={setPage}
        toolbarActions={
          <Button onClick={openForm}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova Indicação
          </Button>
        }
      />
    </div>
  )
}
```

**Diferenças que vão te pegar de surpresa:**
- `class` vira `className` (porque `class` é palavra reservada em JS).
- `:prop="valor"` vira `prop={valor}` — sem distinção entre binding estático e dinâmico.
- `@evento="handler"` vira `onEvento={handler}` — `@click` vira `onClick`, `@page-change` vira `onPageChange`.
- `v-model="searchQuery"` não existe: você passa `searchValue={searchQuery}` e `onSearchChange={setSearchQuery}` separadamente.
- `{{ variavel }}` vira `{variavel}` dentro do JSX.
- Não existe `<template>` separado — o `return (...)` é o template.

### Props

**Vue — `defineProps` com TypeScript genérico**
```vue
<script setup lang="ts">
const props = defineProps<{
  id: string
  schema: typeof createIndicationSchema
  isSubmitting: boolean
}>()
const emit = defineEmits<{
  (e: 'submit', values: CreateIndicationSchemaValues): void
}>()
</script>
```

**React — interface TypeScript + desestruturação**
```typescript
interface Props {
  id: string
  isSubmitting: boolean
  onSubmit: (values: CreateIndicationSchemaValues) => void
}

export function IndicationCreateForm({ id, isSubmitting, onSubmit }: Props) {
  // ...
}
```

### Emit vs Callback

No Vue, o filho emite eventos e o pai escuta com `@evento`. No React, o pai passa uma função como prop e o filho a chama diretamente — não existe sistema de eventos: é só um callback.

| Vue | React |
|-----|-------|
| `emit('submit', values)` no filho | `onSubmit(values)` no filho |
| `@submit="handleSubmit"` no pai | `onSubmit={handleSubmit}` no pai |

---

## 3. Gerenciamento de Estado: Pinia → Zustand

Ambos gerenciam estado global fora dos componentes. A diferença é na sintaxe: Pinia usa `defineStore` com Composition API; Zustand usa `create` com um único objeto de estado + ações.

**Vue — Pinia (`theme.store.ts`)**
```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<string>(getInitialTheme())

  function setTheme(newTheme: 'light' | 'dark'): void {
    theme.value = newTheme
    localStorage.setItem('app-theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  function toggleTheme(): void {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, setTheme, toggleTheme }
})
```

**React — Zustand (`theme.store.ts`)**
```typescript
export const useThemeStore = create<ThemeStore>(set => ({
  theme: initialTheme,
  setTheme: (theme) => {
    localStorage.setItem('app-theme', theme)
    applyTheme(theme)
    set({ theme })
  },
  toggleTheme: () => set(state => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('app-theme', newTheme)
    applyTheme(newTheme)
    return { theme: newTheme }
  })
}))
```

**Como usar nos componentes:**

No Vue você chama `const store = useThemeStore()` e acessa `store.theme` (que é reativo).

No React você faz exatamente a mesma coisa: `const { theme, toggleTheme } = useThemeStore()`. O Zustand se integra como um hook normal do React — parece quase idêntico ao Pinia na hora de consumir.

**Diferença principal:** No Pinia você muta `theme.value = newTheme`; no Zustand você chama `set({ theme: newTheme })` — nunca muta o estado diretamente.

---

## 4. Roteamento: Vue Router → React Router

A configuração de rotas é estruturalmente muito parecida. A diferença está em como o React Router é inicializado e como os layouts aninhados funcionam.

**Vue — `router.ts`**
```typescript
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        ...dashboardRoutes,
        ...indicationRoutes
      ]
    }
  ]
})
router.beforeEach(authGuard)
export default router

// routes.ts do módulo
const indicationRoutes = [
  {
    path: '/indicacao-geografica',
    name: 'indicationListing',
    component: IndicationListing,
    meta: { requiresAuth: true }
  }
]
```

**React — `router/index.tsx`**
```typescript
export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'indicacao-geografica', element: <IndicationListingPage /> },
      { path: 'empresas', element: <CompaniesPage /> }
    ]
  }
])

// App.tsx
<RouterProvider router={router} />
```

**Diferenças:**
- `component: MainLayout` vira `element: <MainLayout />` — você passa JSX, não a classe/função.
- Não existe `router.beforeEach` diretamente; guards de rota são implementados dentro dos componentes de layout ou como wrappers de rota.
- No Vue, o `<router-view>` renderiza os filhos. No React, o `MainLayout` usa `<Outlet />` do `react-router-dom` no lugar onde os filhos devem aparecer.
- `{ index: true }` é o equivalente a definir a rota raiz do grupo (substitui `path: '/'` dentro do grupo).

---

## 5. Formulários e Validação

Ambos os projetos usam **Zod** para o schema de validação. A diferença é na biblioteca de gerenciamento de formulário: `vee-validate` no Vue e `react-hook-form` no React.

### Schema Zod (praticamente igual)

**Vue**
```typescript
export const createIndicationSchema = z.object({
  indication_name: z.string({ required_error: translateStatic('common.required') })
    .min(3, translateStatic('indicationListing.create.form.errors.name')),
  organization_name: z.string({ required_error: translateStatic('common.required') })
    .min(2, translateStatic('indicationListing.create.form.errors.organization'))
})
export type CreateIndicationSchemaValues = z.infer<typeof createIndicationSchema>
```

**React**
```typescript
export const createIndicationSchema = z.object({
  indication_name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  organization_name: z.string().min(2, 'A organização deve ter no mínimo 2 caracteres.')
})
export type CreateIndicationSchemaValues = z.infer<typeof createIndicationSchema>
```

### Uso no componente

**Vue — `vee-validate` com `toTypedSchema`**
```typescript
const form = useForm({ validationSchema: toTypedSchema(props.schema) })
const onSubmit = form.handleSubmit(values => { emit('submit', values) })
```

```vue
<template>
  <form :id="id" class="space-y-4" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="indication_name">
      <FormItem>
        <FormLabel>{{ translate('indicationListing.create.form.name.label') }}</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" :disabled="isSubmitting" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  </form>
</template>
```

**React — `react-hook-form` com `zodResolver`**
```typescript
const { register, handleSubmit, formState: { errors } } = useForm<CreateIndicationSchemaValues>({
  resolver: zodResolver(createIndicationSchema)
})

return (
  <form id={id} className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
    <div className="space-y-2">
      <Label htmlFor="indication_name">
        {t('indicationListing.create.form.name.label')}
      </Label>
      <Input {...register('indication_name')} disabled={isSubmitting} />
      {errors.indication_name && (
        <p className="text-sm text-destructive">{errors.indication_name.message}</p>
      )}
    </div>
  </form>
)
```

**Diferenças principais:**
- No Vue, `<FormField v-slot="{ componentField }">` injeta os atributos no input via `v-bind="componentField"`. No React, `{...register('campo')}` faz a mesma coisa — espalha `onChange`, `onBlur`, `ref` etc. no input.
- No Vue, `<FormMessage />` exibe o erro automaticamente. No React, você renderiza o erro manualmente: `{errors.campo && <p>{errors.campo.message}</p>}`.
- No Vue, o schema é passado via prop e conectado com `toTypedSchema`. No React, o schema é passado direto via `zodResolver`.

---

## 6. Composables → Custom Hooks

Composables Vue e Custom Hooks React são conceitualmente idênticos: funções que encapsulam lógica reutilizável com estado. A sintaxe é diferente, mas a estrutura espelha quase perfeitamente.

**Vue — `useListing.ts` (Composition API)**
```typescript
export default function useListing<T>(options: UseListingOptions<T>) {
  const data = ref<T[]>([])
  const isLoading = ref<boolean>(false)
  const searchQuery = ref<string>('')
  const pagination = ref<PaginationState>({...})

  const loadData = async (): Promise<void> => {
    isLoading.value = true
    try {
      const response = await options.fetcher(
        JSON.stringify({ search: searchQuery.value, page: pagination.value.currentPage, limit: pagination.value.itemsPerPage })
      )
      data.value = response.data
      pagination.value = response.meta
    } finally {
      isLoading.value = false
    }
  }

  watch(() => pagination.value.currentPage, () => loadData())
  watch(searchQuery, () => { pagination.value.currentPage = 1; loadData() })
  loadData()

  return { data, isLoading, searchQuery, pagination, setPage, reload: loadData }
}
```

**React — `useListing.ts` (Custom Hook)**
```typescript
export function useListing<T>(options: UseListingOptions<T>) {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState<PaginationState>({...})

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await options.fetcher(
        JSON.stringify({ search: searchQuery, page: pagination.currentPage, limit: pagination.itemsPerPage })
      )
      setData(response.data)
      setPagination(response.meta)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, pagination.currentPage])

  useEffect(() => { loadData() }, [loadData])

  return { data, isLoading, searchQuery, setSearchQuery, pagination, setPage, reload: loadData }
}
```

**Tabela de correspondências:**

| Vue (Composition API) | React (Hooks) |
|-----------------------|---------------|
| `ref(valor)` | `useState(valor)` → retorna `[valor, setValor]` |
| `valor.value = x` | `setValor(x)` |
| `watch(source, cb)` | `useEffect(() => { cb() }, [source])` |
| `computed(() => x)` | `useMemo(() => x, [deps])` |
| Chamar `loadData()` no setup | `useEffect(() => { loadData() }, [])` |
| `onMounted(() => ...)` | `useEffect(() => { ... }, [])` |

**Ponto de atenção:** No Vue, `ref` é reativo automaticamente — qualquer mudança em `data.value` re-renderiza o componente. No React, você precisa chamar `setData(...)` para disparar a re-renderização. Nunca mute o estado diretamente (`data.push(...)` não funciona).

---

## 7. Tabelas: TanStack Table

Ambos os projetos usam TanStack Table. A definição de colunas é idêntica; a diferença está em como células customizadas são renderizadas.

### Definição de colunas (praticamente igual)

**Vue**
```typescript
const columns = computed<ColumnDef<IndicationRow>[]>(() => [
  { accessorKey: 'name', header: translate('indicationListing.table.columns.name') },
  { id: 'actions', header: translate('indicationListing.table.columns.actions') }
])
```

**React**
```typescript
const columns: ColumnDef<IndicationRow>[] = [
  { accessorKey: 'name', header: t('indicationListing.table.columns.name') },
  { id: 'actions', header: t('indicationListing.table.columns.actions') }
]
```

No Vue, `columns` precisa ser `computed` porque `translate` é reativo (muda com o idioma). No React, como `t` do `react-i18next` já é reativo via hook, `columns` pode ser uma constante simples (ou `useMemo` se necessário).

### Células customizadas: Slots vs `renderCell` prop

Esta é a diferença mais importante entre os dois projetos.

**Vue — Slots nomeados no template**
```vue
<ListingTable :columns="columns" :data="data">
  <template #cell-name="{ row }">
    <div class="flex items-center gap-3">
      <img :src="row.img" class="w-10 h-10 rounded-full" />
      <span>{{ row.name }}</span>
    </div>
  </template>
  <template #cell-actions="{ row }">
    <Button @click="promptDelete(row)"><Trash2 /></Button>
  </template>
</ListingTable>
```

**React — Prop `renderCell` (função que retorna JSX)**
```typescript
const renderCell = (columnId: string, row: IndicationRow) => {
  if (columnId === 'name') {
    return (
      <div className="flex items-center gap-3">
        <img src={row.img} alt={row.name} className="w-10 h-10 rounded-full" />
        <span className="font-medium">{row.name}</span>
      </div>
    )
  }
  return null
}

<ListingTable renderCell={renderCell} />
```

No Vue, cada célula customizada vira um `<template #cell-nome>` separado. No React, você passa uma única função `renderCell` que recebe o `columnId` e a linha, e usa `if/else` para decidir o que renderizar. É o mesmo conceito, mas implementado como render prop em vez de slots.

### Inicialização do hook

**Vue**
```typescript
import { useVueTable, getCoreRowModel } from '@tanstack/vue-table'
const table = useVueTable({
  get data() { return props.data },   // getter para reatividade
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true
})
```

**React**
```typescript
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
const table = useReactTable({
  data,          // sem getter — React re-renderiza quando data muda
  columns,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true
})
```

No Vue, `data` e `columns` precisam ser passados como getters (`get data() { return props.data }`) para que o TanStack Table observe as mudanças reativas. No React, isso não é necessário — o hook usa os valores diretamente e a re-renderização do componente atualiza tudo automaticamente.

---

## 8. Internacionalização: vue-i18n → react-i18next

**Vue — configuração (`core/i18n/index.ts`)**
```typescript
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'pt-BR',
  fallbackLocale: 'pt-BR'
})
translations.forEach(translation => {
  Object.keys(translation).forEach(lang => {
    i18n.global.mergeLocaleMessage(lang, translation[lang])
  })
})
```

**React — configuração (`core/i18n/index.ts`)**
```typescript
i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: mergeTranslations('pt-BR') },
    'en-US': { translation: mergeTranslations('en-US') },
    'es-ES': { translation: mergeTranslations('es-ES') }
  },
  lng: localStorage.getItem('app-language') || 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: { escapeValue: false }
})
```

### Uso em componentes

**Vue — dois helpers: reativo e estático**
```typescript
// Em componentes (reativo — atualiza se o idioma mudar)
const translate = useTranslate()
translate('indicationListing.create.form.name.label')

// Em schemas ou guards (estático — fora do contexto Vue)
translateStatic('common.required')
```

**React — um só hook**
```typescript
const { t } = useTranslation()
t('indicationListing.create.form.name.label')
```

No Vue, você precisava de dois helpers diferentes porque fora do contexto de um componente (ex: dentro de um schema Zod) o sistema reativo não funciona. No React, dentro de componentes e custom hooks você usa `useTranslation()` normalmente. Para usar `t` **fora** de um componente (ex: num schema Zod definido fora do ciclo React), você importa a instância `i18n` diretamente e usa `i18n.t('chave')` — semelhante ao `translateStatic` do Vue.

**No template/JSX:**

Vue: `{{ translate('chave') }}`

React: `{t('chave')}`

---

## 9. Chamadas de API

Esta é a parte mais parecida entre os dois projetos. A camada HTTP foi praticamente copiada — mesma estrutura, mesmo Axios, mesmos interceptors.

**Ambos os projetos — configuração Axios (idêntica)**
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('atlas-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

**Ambos os projetos — helper genérico (idêntico)**
```typescript
export async function httpRequest<T>(method, url, data?, config?): Promise<T> {
  const response = await api.request<T>({ method, url, data, ...config })
  return response.data
}
```

Se você já entende a camada HTTP do projeto Vue, não precisa aprender nada novo aqui. As chamadas de API nos composables/hooks também têm a mesma aparência — `await httpRequest('GET', '/indicacoes')` funciona igual nos dois projetos.

---

## Tabela de Equivalências

| Conceito | Vue (`atlas-front`) | React (`atlas-front-react`) | Notas |
|---|---|---|---|
| Arquivo de componente | `.vue` (`<template>`, `<script setup>`) | `.tsx` (função que retorna JSX) | No React não há separação de blocos |
| Reatividade de variável | `ref(valor)` → `variavel.value` | `useState(valor)` → `[val, setVal]` | No React nunca mute diretamente |
| Computed | `computed(() => expr)` | `useMemo(() => expr, [deps])` | React precisa de lista de dependências |
| Watcher | `watch(source, callback)` | `useEffect(() => { cb() }, [source])` | Mesmo propósito |
| Lifecycle mounted | `onMounted(() => ...)` | `useEffect(() => { ... }, [])` | Array vazio = executa uma vez |
| Props | `defineProps<{ nome: Tipo }>()` | Interface TypeScript + desestruturação | React: sem macro de compilador |
| Eventos do filho | `emit('evento', payload)` | Chama `onEvento(payload)` direto | React usa callbacks como props |
| Escutar evento no pai | `@evento="handler"` | `onEvento={handler}` | Convenção `on` + nome em camelCase |
| Binding de prop | `:prop="valor"` | `prop={valor}` | React não distingue estático/dinâmico |
| Binding de classe | `:class="{ ativo: cond }"` | `className={cond ? 'ativo' : ''}` | Ou biblioteca `clsx`/`cn` |
| Diretiva condicional | `v-if="cond"` | `{cond && <Comp />}` | JSX puro |
| Repetição de lista | `v-for="item in lista"` | `{lista.map(item => <Comp key={item.id} />)}` | `key` obrigatório no React |
| v-model | `v-model="valor"` | `value={valor} onChange={e => setValor(e.target.value)}` | React não tem two-way binding nativo |
| Slots | `<template #nome="{ dados }">` | Prop `renderNome={(dados) => <JSX />}` | Render props substituem slots |
| Store global | Pinia — `defineStore` | Zustand — `create` | Consumo é similar nos dois |
| Roteamento | Vue Router — `createRouter` | React Router — `createBrowserRouter` | API muito parecida |
| Filho de rota | `<router-view />` | `<Outlet />` | Mesmo conceito |
| Guard de rota | `router.beforeEach(guard)` | Wrapper de componente ou loader | React Router não tem beforeEach global |
| Formulários | `vee-validate` + `toTypedSchema` | `react-hook-form` + `zodResolver` | Schema Zod é idêntico nos dois |
| Erro de campo | `<FormMessage />` (automático) | `{errors.campo && <p>{errors.campo.message}</p>}` | React é explícito |
| Internacionalização | `vue-i18n` → `useTranslate()` / `translateStatic()` | `react-i18next` → `useTranslation()` | React tem só um hook |
| Chamadas HTTP | Axios + `httpRequest` | Axios + `httpRequest` | Código praticamente idêntico |
| Tabela | TanStack `useVueTable` + getters | TanStack `useReactTable` + valores diretos | Vue precisa de getters para reatividade |
| Células customizadas | Slots `#cell-nome="{ row }"` | Prop `renderCell={(colId, row) => JSX}` | Render prop no lugar de slot |
| Composable / Hook | `useXxx()` em `composables/` | `useXxx()` em `hooks/` | Mesma convenção de nome |
