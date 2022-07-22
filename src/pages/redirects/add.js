import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react';
import useFetch from 'use-http';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Form from '@components/Form';
import FormRow from '@components/FormRow';
import FormLabel from '@components/FormLabel';
import Button from '@components/Button';
import Note from '@components/Note';

import styles from '@styles/Home.module.scss'

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const { post, response, loading, error } = useFetch('/api/redirects/add');

  /**
   * handleOnSubmit
   */

  async function handleOnSubmit(e) {
    e.preventDefault();

    const fields = Array.from(e.currentTarget.elements);

    const data = {};

    fields
      .filter(({ tagName }) => !['button'].includes(tagName.toLowerCase()))
      .forEach(({ name, value, type, checked }) => {
        if ( ['text'].includes(type) ) {
          data[name] = value;
          return;
        }

        if ( type === 'checkbox' ) {
          data[name] = checked;
          return;
        }
      });

    if ( !data.source.startsWith('/') ) {
      data.source = `/${data.source}`;
    }

    const results = await post(data);

    if ( !results.error ) {
      router.push(`/?source=${data.source}`);
    }
  }

  return (
    <Layout requireAuth={true}>
      <Head>
        <title>Add Redirect - Redirect Manager</title>
        <meta name="description" content="Add a new redirect with Redirect Manager" />
      </Head>

      <Container className={styles.homeContainer}>
        <h1>Add a Redirect</h1>

        {error && (
          <p>{ error.message }</p>
        )}

        <Form onSubmit={handleOnSubmit}>
          <FormRow>
            <FormLabel>From</FormLabel>
            <Note>Ex: &quot;mysweetlink&quot; will create a redirect at { process.env.NEXT_PUBLIC_APP_HOSTNAME }/mysweetlink</Note>
            <input type="text" name="source" />
          </FormRow>
          <FormRow>
            <FormLabel>To</FormLabel>
            <Note>Ex: &quot;https://mysweetwebsite.com&quot; will make the above link redirect to this URL</Note>
            <input type="text" name="destination" />
          </FormRow>
          <FormRow>
            <input type="checkbox" name="permanent" />
            <FormLabel>Permanent Redirect?</FormLabel>
            <Note>* Permanent refers to the <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" target="_blank" rel="noreferrer noopener">HTTP status code</a>. A permanent redirect returns a 308, otherwise the redirect will return a 307.</Note>
          </FormRow>
          <FormRow>
            <Button disabled={loading}>Add Redirect</Button>
            <Note>* Redirect may take a few minutes to add until deployment has finished.</Note>
          </FormRow>
        </Form>

      </Container>
    </Layout>
  )
}