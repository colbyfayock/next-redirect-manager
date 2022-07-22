import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react';
import { FaTimes, FaCheck, FaSyncAlt, FaTimesCircle } from 'react-icons/fa';
import useFetch from 'use-http';

import useRedirects from '@hooks/useRedirects';
import useSearch from '@hooks/useSearch';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Note from '@components/Note';
import Form from '@components/Form';
import Table from '@components/Table';
import TableTr from '@components/TableTr';
import TableTd from '@components/TableTd';
import Button from '@components/Button';
import CopyText from '@components/CopyText';

import styles from '@styles/Home.module.scss';

export default function Home() {
  const { query } = useRouter();
  const { data: session } = useSession();

  const { redirects } = useRedirects({
    refreshInterval: 1000
  });

  const { post, loading, error } = useFetch('/api/redirects/remove');

  const searchOptions = {
    data: redirects,
    keys: ['source', 'destination'],
    sortBy: 'source'
  }

  const {
    query: searchQuery,
    updateQuery: updateSearchQuery,
    results: redirectResults
  } = useSearch(searchOptions);

  const newRedirect = redirectResults && redirectResults.find(({ source }) => source === query?.source);

  /**
   * handleOnQueryChange
   */

  function handleOnQueryChange(e) {
    updateSearchQuery(e.currentTarget.value);
  }

  return (
    <Layout requireAuth={true}>
      <Head>
        <title>Redirect Manager</title>
        <meta name="description" content="Managing Redirects" />
      </Head>

      {newRedirect && (
        <Container className={styles.homeNewRedirectContainer}>
          <p>
            Successfully added <strong>{ newRedirect.source }</strong> to redirect to <strong>{ newRedirect.destination }</strong>!
          </p>
          <p className={styles.newRedirectNote}>
            <CopyText className={styles.redirectSourceLinkCopy} text={`https://${process.env.NEXT_PUBLIC_APP_HOSTNAME}${newRedirect.source}`} />
            <a href={`https://${process.env.NEXT_PUBLIC_APP_HOSTNAME}${newRedirect.source}`} target="_blank" rel="noreferrer noopener">
              { process.env.NEXT_PUBLIC_APP_HOSTNAME }{ newRedirect.source }
            </a>
          </p>
          <p className={styles.newRedirectNote}>
            * Reminder that it may take a few minutes to start working until the deployment finishes.
          </p>
        </Container>
      )}

      <Container className={styles.homeActionsContainer}>
        <Form className={styles.search}>
          <label>Filter:</label>
          <input type="search" placeholder="Ex: cloudycam" onChange={handleOnQueryChange} />
        </Form>
        <ul className={styles.actions}>
          <li>
            <Link href="/redirects/add" passHref={true}>
              <Button className={styles.actionButton}>
                Add Redirect
              </Button>
            </Link>
          </li>
        </ul>
      </Container>

      <Container className={styles.homeContentContainer}>
          <Note>
            * New or deleted redirects may not be immediate until the most recent deployment as completed!
          </Note>

          <Table
            columns={[
              'From',
              'To',
              'State',
              ' '
            ]}
          >
            {redirectResults && redirectResults.map(redirect => {
              /**
               * handleOnRemoveClick
               */

              async function handleOnRemoveClick(e) {
                e.preventDefault();

                await post({
                  source: redirect.source
                });
              }

              return (
                <TableTr key={`${redirect.source}${redirect.destination}`}>
                  <TableTd>
                    <p>{ redirect.source?.slice(1) }</p>
                    <p className={styles.tableNote}>
                      <CopyText className={styles.redirectSourceLinkCopy} text={`https://${process.env.NEXT_PUBLIC_APP_HOSTNAME}${redirect.source}`} />
                      <a href={`https://${process.env.NEXT_PUBLIC_APP_HOSTNAME}${redirect.source}`} target="_blank" rel="noreferrer noopener">
                        { process.env.NEXT_PUBLIC_APP_HOSTNAME }{ redirect.source }
                      </a>
                    </p>
                  </TableTd>
                  <TableTd>
                    <p>
                      { redirect.destination }
                    </p>
                    <p className={styles.tableNote}>
                      Permanent: { redirect.permanent ? 'Yes' : 'No' }
                      &nbsp;&nbsp;
                      (<a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status#redirection_messages" target="_blank" rel="noreferrer noopener">HTTP { redirect.permanent ? '308' : '307' }</a>)
                    </p>
                  </TableTd>
                  <TableTd align="center">
                    <p>
                      { redirect.state === 'committed' && (
                        <>
                          <span className="sr-only">Committed</span>
                          <FaSyncAlt className={styles.iconCommitted} />
                        </>
                      )}
                      { redirect.state === 'deployed' && (
                        <>
                          <span className="sr-only">Deployed</span>
                          <FaCheck className={styles.iconDeployed} />
                        </>
                      )}
                      { redirect.state === 'deleted' && (
                        <>
                          <span className="sr-only">Deleted</span>
                          <FaTimes className={styles.iconDeleted} />
                        </>
                      )}
                    </p>
                  </TableTd>
                  <TableTd align="center">
                    <Button className={styles.tableActionButton} onClick={handleOnRemoveClick} disabled={loading}>
                      <span className="sr-only">Remove</span>
                      <FaTimesCircle />
                    </Button>
                  </TableTd>
                </TableTr>
              );
            })}
            {!redirectResults && loading && <TableTr className={styles.tableLoading}><TableTd colSpan="3">Loading</TableTd></TableTr> }
          </Table>
      </Container>
    </Layout>
  )
}