import AddCompanyButton from './components/add-company-button';
import MagicButton from './components/magic-button';

export default function Home() {
  return (
    <main>
      <h1 className="text-xl">Home page {new Date().toTimeString()}</h1>
      <AddCompanyButton />
      <MagicButton />
    </main>
  );
}
