import React from 'react';
import AuthForm from '../components/auth-form';

type SearchParams = Promise<{[key: string]: string | undefined}>
export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const mode = searchParams.mode === 'signup' ? 'signup' : 'login';
  return (
    <AuthForm mode={mode} />
  );
}
