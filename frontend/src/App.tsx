import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'
import { ChartDemo } from './pages/ChartDemo'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChartDemo />
    </QueryClientProvider>
  )
}

export default App
