import { Providers } from '@/app/providers';
import { Layout } from '@/app/layout';
import { AppRouter } from '@/app/router';

function App() {
  return (
    <Providers>
      <Layout>
        <AppRouter />
      </Layout>
    </Providers>
  );
}

export default App;