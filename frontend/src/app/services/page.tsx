import { redirect } from 'next/navigation';

export default function ServicesRedirect() {
  // Redirect to home or construction as default
  redirect('/services/construction');
}
