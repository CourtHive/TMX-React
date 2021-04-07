import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Standards based',
    imageUrl: 'img/TODS.png',
    imageLink: 'https://itftennis.atlassian.net/wiki/spaces/TODS/overview',
    description: (
      <>
        CourtHive/TMX is a React based Tournament Management platform based on the ITF&apos;s Tennis Open Data
        Standards.
      </>
    )
  },
  {
    title: 'Proven in production',
    imageUrl: 'img/tmx.png',
    description: (
      <>
        The <a href="https://courthive.github.io/tods-competition-factory/">TODS Competition Factory</a> implements
        business logic for TMX, based on years of experience running thousands of events for national governing bodies.
      </>
    )
  },
  {
    title: 'Open Source',
    imageUrl: 'img/GitHub.png',
    description: <>All components of CourtHive/TMX are open source, free to use and embellish as you see fit.</>
  }
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={`${siteConfig.title}`} description="Open Source Tournament Management<head />">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--outline button--secondary button--lg', styles.getStarted)}
              to={useBaseUrl('docs/')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
